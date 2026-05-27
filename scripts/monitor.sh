#!/usr/bin/env bash
set -euo pipefail

REPO="mmasias/25-26-idsw2-sdVC"
DASHBOARD="DASHBOARD.md"
INICIAL_MSG_MARKER="sesión de vibecoding idsw2"
TODAY_EPOCH=$(date +%s)

log() { echo ":: $*" >&2; }

url_encode_path() {
    python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe='/'))" "$1" 2>/dev/null || echo "$1"
}

check_file_has_content() {
    local user="$1" filepath="$2" marker="$3"
    local content
    content=$(gh api "repos/$user/25-26-idsw2-sdVC/contents/$filepath" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null) || return 1
    if echo "$content" | grep -qF "$marker"; then
        echo "vacio"
    else
        echo "relleno"
    fi
}

check_readme_rewritten() {
    local user="$1"
    local content
    content=$(gh api "repos/$user/25-26-idsw2-sdVC/contents/README.md" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null) || return 1
    if echo "$content" | grep -qF "Sesiones de VibeCoding"; then
        echo "original"
    else
        echo "reescrito"
    fi
}

compute_max_gap() {
    local commits_json="$1" total_commits="$2"
    local dates

    if [ "$total_commits" -le 1 ]; then
        local first_date
        first_date=$(echo "$commits_json" | jq -r 'last | .commit.author.date | split("T")[0]' 2>/dev/null)
        if [ -n "$first_date" ] && [ "$first_date" != "null" ]; then
            local first_epoch
            first_epoch=$(date -d "$first_date" +%s 2>/dev/null) || { echo "0"; return; }
            echo $(( (TODAY_EPOCH - first_epoch) / 86400 ))
        else
            echo "0"
        fi
        return
    fi

    mapfile -t dates < <(echo "$commits_json" | jq -r '.[:-1] | [.[].commit.author.date | split("T")[0]] | unique | sort[]' 2>/dev/null)

    if [ "${#dates[@]}" -eq 0 ]; then
        echo "0"
        return
    fi

    local max_gap=0
    local prev_epoch
    prev_epoch=$(date -d "${dates[0]}" +%s 2>/dev/null) || { echo "0"; return; }

    for ((i = 1; i < ${#dates[@]}; i++)); do
        local epoch gap
        epoch=$(date -d "${dates[$i]}" +%s 2>/dev/null) || continue
        gap=$(( (epoch - prev_epoch) / 86400 ))
        [ "$gap" -gt "$max_gap" ] && max_gap=$gap
        prev_epoch=$epoch
    done

    local gap_to_today=$(( (TODAY_EPOCH - prev_epoch) / 86400 ))
    [ "$gap_to_today" -gt "$max_gap" ] && max_gap=$gap_to_today

    echo "$max_gap"
}

get_artifact_day_offset() {
    local user="$1" path="$2" inicial_epoch="$3" inicial_sha="$4"
    local encoded_path
    encoded_path=$(url_encode_path "$path")

    local first_date
    first_date=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?path=$encoded_path&per_page=100" 2>/dev/null | \
        jq -r --arg sha "$inicial_sha" \
        '[.[] | select(.sha != $sha)] | if length > 0 then last | .commit.author.date | split("T")[0] else "null" end' \
        2>/dev/null || echo "null")

    if [ -z "$first_date" ] || [ "$first_date" = "null" ]; then
        echo "-"
        return
    fi

    local t_artifact
    t_artifact=$(date -d "$first_date" +%s 2>/dev/null) || { echo "?"; return; }
    local offset=$(( (t_artifact - inicial_epoch) / 86400 ))
    echo "+${offset}d"
}

# --- Parsear dashboard existente como cache ---
declare -A CACHE_SHA CACHE_ROW CACHE_DETAIL
if [ -f "$DASHBOARD" ]; then
FORMAT_TOKEN="monitor-format: v$(md5sum "$0" | cut -c1-8)"
FORMAT_CACHED=$(grep -oP '(?<=<!-- )monitor-format: v[a-f0-9]+(?= -->)' "$DASHBOARD" 2>/dev/null || echo "")

if [ "$FORMAT_CACHED" != "$FORMAT_TOKEN" ]; then
    log "Formato de dashboard cambiado. Cache descartado."
else
    log "Cargando cache desde $DASHBOARD..."
    while IFS= read -r line; do
        USER_MATCH=$(echo "$line" | grep -oP '\[([^\]]+)\]\(https://github\.com/[^\)]+/25-26-idsw2-sdVC\)' | head -1 | grep -oP '(?<=\[)[^\]]+(?=\])' || true)
        SHA_MATCH=$(echo "$line" | grep -oP '<sub>[a-f0-9]{7}</sub>\s*\|$' | grep -oP '[a-f0-9]{7}' || true)
        if [ -n "$USER_MATCH" ] && [ -n "$SHA_MATCH" ]; then
            CACHE_SHA["$USER_MATCH"]="$SHA_MATCH"
            CACHE_ROW["$USER_MATCH"]="$line"
        fi
    done < "$DASHBOARD"
    CACHE_COUNT=0
    for _k in "${!CACHE_SHA[@]}"; do CACHE_COUNT=$((CACHE_COUNT+1)); done 2>/dev/null || true
    log "Cache: $CACHE_COUNT alumnos cacheados."
fi
fi

# --- PRs abiertas ---
log "Obteniendo PRs abiertas..."
OPEN_PR_USERS=$(gh api "repos/$REPO/pulls?state=open" --paginate --jq '.[].head.repo.owner.login' 2>/dev/null | sort -u || echo "")
PR_COUNT=$(echo "$OPEN_PR_USERS" | grep -c . 2>/dev/null || echo "0")
log "PRs abiertas: $PR_COUNT."

# --- Inicializar .regen ---
mkdir -p TIMELINES
> TIMELINES/.regen

# --- Obtener forks ---
log "Obteniendo lista de forks..."
FORKS=$(gh api "repos/$REPO/forks" --paginate --jq '.[].owner.login' 2>/dev/null)

if [ -z "$FORKS" ]; then
    log "No se encontraron forks."
    exit 1
fi

N_FORKS=$(echo "$FORKS" | wc -l)
log "Encontrados $N_FORKS forks."

    TABLE_ROWS=""
    ACTIVOS=0
    RECENT_DATA=""
    SKIPPED=0
    PROCESSED=0

for user in $FORKS; do
    REPO_URL="https://github.com/$user/25-26-idsw2-sdVC"
    QUE_HACE_URL="$REPO_URL/blob/main/QUE_HACE.md"
    CONVLOG_URL="$REPO_URL/blob/main/conversation-log.md"

    # PR abierta: congelar fila desde cache sin llamadas API
    if echo "$OPEN_PR_USERS" | grep -qx "$user"; then
        log "$user: PR abierta — congelado"
        CACHED_ROW="${CACHE_ROW[$user]:-}"
        if [ -n "$CACHED_ROW" ]; then
            TABLE_ROWS="${TABLE_ROWS}${CACHED_ROW}"$'\n'
            if echo "$CACHED_ROW" | grep -qP '>\d+ commits?<'; then
                ACTIVOS=$((ACTIVOS + 1))
            fi
        fi
        continue
    fi

    # Consulta ligera: solo el ultimo commit
    LATEST_SHA=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?per_page=1" --jq '.[0].sha' 2>/dev/null || echo "")
    LATEST_SHORT=$(echo "$LATEST_SHA" | cut -c1-7)
    LATEST_DATE_RAW=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?per_page=1" --jq '.[0].commit.author.date' 2>/dev/null || echo "")
    LATEST_DATE_EPOCH_CACHE=$(date -d "$LATEST_DATE_RAW" +%s 2>/dev/null || echo "0")

    # Cache hit: reutilizar fila y detalle
    if [ -n "$LATEST_SHORT" ] && [ "${CACHE_SHA[$user]:-}" = "$LATEST_SHORT" ]; then
        log "$user: sin cambios (cache hit)"
        CACHED_ROW="${CACHE_ROW[$user]:-}"
        if [ -n "$CACHED_ROW" ]; then
            TABLE_ROWS="${TABLE_ROWS}${CACHED_ROW}"$'\n'
            if echo "$CACHED_ROW" | grep -qP '>\d+ commits?<'; then
                ACTIVOS=$((ACTIVOS + 1))
            fi
            RECENT_DATA+="${LATEST_DATE_EPOCH_CACHE}|${user}|${REPO_URL}"$'\n'
        fi
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    log "Procesando $user (nuevo o cambiado)..."
    PROCESSED=$((PROCESSED + 1))

    COMMITS_JSON=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?per_page=100" 2>/dev/null || echo "[]")

    TOTAL_C=$(echo "$COMMITS_JSON" | jq 'length' 2>/dev/null || echo "1")
    COMMITS=$((TOTAL_C - 1))
    LAST_DATE=$(echo "$COMMITS_JSON" | jq -r '.[0].commit.author.date | split("T")[0] | split("-") | .[2]+"-"+.[1]' 2>/dev/null || echo "N/A")
    LAST_TIME=$(echo "$COMMITS_JSON" | jq -r '[.[0].commit.author.date | split("T")[1] | split(":")[0:2][] | tonumber] | ((.[0] + 2) % 24) as $h | (if $h < 10 then "0\($h)" else "\($h)" end) as $hs | (if .[1] < 10 then "0\(.[1])" else "\(.[1])" end) as $ms | "\($hs):\($ms)"' 2>/dev/null || echo "")
    LAST_MSG=$(echo "$COMMITS_JSON" | jq -r '.[0].commit.message | split("\n")[0]' 2>/dev/null || echo "N/A")
    LAST_SHA=$(echo "$COMMITS_JSON" | jq -r '.[0].sha' 2>/dev/null || echo "")
    LAST_SHORT=$(echo "$LAST_SHA" | cut -c1-7)

    INICIAL_SHA=$(echo "$COMMITS_JSON" | jq -r 'last | .sha' 2>/dev/null || echo "")
    INICIAL_DATE=$(echo "$COMMITS_JSON" | jq -r 'last | .commit.author.date | split("T")[0]' 2>/dev/null || echo "2026-05-19")
    INICIAL_EPOCH=$(date -d "$INICIAL_DATE" +%s 2>/dev/null || echo "0")

    UNIQUE_DAYS=$(echo "$COMMITS_JSON" | jq '[.[:-1][].commit.author.date | split("T")[0]] | unique | length' 2>/dev/null || echo "0")

    MAX_GAP=$(compute_max_gap "$COMMITS_JSON" "$COMMITS")
    if [ "$MAX_GAP" -ge 3 ]; then
        GAP_DISPLAY=":red_circle:"
    elif [ "$MAX_GAP" -ge 2 ]; then
        GAP_DISPLAY=":yellow_circle:"
    else
        GAP_DISPLAY=":green_circle:"
    fi

    QUE_HACE_STATUS=$(check_file_has_content "$user" "QUE_HACE.md" "En una frase" 2>/dev/null || echo "?")
    CONVLOG_STATUS=$(check_file_has_content "$user" "conversation-log.md" "lo que le dijo al AI para arrancar" 2>/dev/null || echo "?")
    README=$(check_readme_rewritten "$user" 2>/dev/null || echo "?")

    SRC_OFFSET=$(get_artifact_day_offset "$user" "src" "$INICIAL_EPOCH" "$INICIAL_SHA")
    UML_OFFSET=$(get_artifact_day_offset "$user" "modelosUML" "$INICIAL_EPOCH" "$INICIAL_SHA")
    CL_T_OFFSET=$(get_artifact_day_offset "$user" "conversation-log.md" "$INICIAL_EPOCH" "$INICIAL_SHA")
    R01_OFFSET=$(get_artifact_day_offset "$user" "RUP/01-analisis" "$INICIAL_EPOCH" "$INICIAL_SHA")
    R02_OFFSET=$(get_artifact_day_offset "$user" "RUP/02-diseño" "$INICIAL_EPOCH" "$INICIAL_SHA")
    R03_OFFSET=$(get_artifact_day_offset "$user" "RUP/03-desarrollo" "$INICIAL_EPOCH" "$INICIAL_SHA")

    if [ "$QUE_HACE_STATUS" = "relleno" ]; then
        QH_COL="[💡]($QUE_HACE_URL)"
    else
        QH_COL="-"
    fi

    if [ "$CONVLOG_STATUS" = "relleno" ]; then
        CL_COL="[💬]($CONVLOG_URL)<br><sub>$CL_T_OFFSET</sub>"
    else
        CL_COL="-"
    fi

    if [ "$README" = "reescrito" ]; then
        README_COL="[📄]($REPO_URL/blob/main/README.md)"
    else
        README_COL="-"
    fi

    make_artifact_col() {
        local emoji="$1" path="$2" offset="$3"
        if [ "$offset" = "-" ]; then
            echo "-"
        else
            echo "[$emoji]($REPO_URL/blob/main/$path)<br><sub>$offset</sub>"
        fi
    }

    SRC_COL=$(make_artifact_col "🔌" "src" "$SRC_OFFSET")
    UML_COL=$(make_artifact_col "📐" "modelosUML" "$UML_OFFSET")
    R01_COL=$(make_artifact_col "🔍" "RUP/01-analisis" "$R01_OFFSET")
    R02_COL=$(make_artifact_col "🧩" "RUP/02-diseño" "$R02_OFFSET")
    R03_COL=$(make_artifact_col "⚙️" "RUP/03-desarrollo" "$R03_OFFSET")

    if [ "$COMMITS" -eq 1 ]; then
        COMMITS_LABEL="1 commit"
    else
        COMMITS_LABEL="$COMMITS commits"
    fi
    ALUMNO_LINK="<sub>[$user]($REPO_URL)<br>$COMMITS_LABEL</sub>"

    if [ "$COMMITS" -gt 0 ]; then
        LAST_MSG_LINK="<sub>[$LAST_MSG]($REPO_URL/commit/$LAST_SHA)<br>$LAST_DATE $LAST_TIME</sub>"
    else
        LAST_MSG_LINK="<sub>$LAST_MSG<br>$LAST_DATE</sub>"
    fi

    SHA_COL="<sub>$LAST_SHORT</sub>"

    if [ "$COMMITS" -gt 0 ]; then
        DAYS_COL="[$UNIQUE_DAYS](TIMELINES/$user.md)"
    else
        DAYS_COL="$UNIQUE_DAYS"
    fi

    ROW="| $ALUMNO_LINK | $LAST_MSG_LINK | $DAYS_COL | $GAP_DISPLAY | $QH_COL | $CL_COL | $README_COL | $UML_COL | $R01_COL | $R02_COL | $R03_COL | $SRC_COL | $SHA_COL |"
    TABLE_ROWS="${TABLE_ROWS}${ROW}"$'\n'

    if [ "$COMMITS" -gt 0 ]; then
        ACTIVOS=$((ACTIVOS + 1))

        LAST_DATE_EPOCH=$(date -d "$LAST_DATE" +%s 2>/dev/null || echo "0")
        RECENT_DATA+="${LAST_DATE_EPOCH}|${user}|${REPO_URL}"$'\n'
        echo "$user" >> "TIMELINES/.regen"
    fi
done

RECENT_LINE=""
if [ -n "$RECENT_DATA" ]; then
    RECENT_SORTED=$(echo "$RECENT_DATA" | sort -t'|' -k1 -rn | head -5)
    RECENT_LINKS=""
    while IFS='|' read -r _ user repo_url; do
        [ -z "$user" ] && continue
        if [ -n "$RECENT_LINKS" ]; then
            RECENT_LINKS="$RECENT_LINKS, "
        fi
        RECENT_LINKS="${RECENT_LINKS}[$user]($repo_url)"
    done <<< "$RECENT_SORTED"
    RECENT_LINE="$RECENT_LINKS"
fi

{
    INICIO_ACTIVIDAD="2026-05-20"
    DIAS_TOTALES=$(( ($(date +%s) - $(date -d "$INICIO_ACTIVIDAD" +%s)) / 86400 ))
    echo "<!-- $FORMAT_TOKEN -->"
    echo "# Dashboard de seguimiento - 25-26-idsw2-sdVC"
    echo ""
    echo "> Inicio de actividad: $INICIO_ACTIVIDAD | Dashboard generado: $(date '+%Y-%m-%d %H:%M:%S %Z') | $DIAS_TOTALES días totales"
    echo ""
    echo "## Leyenda"
    echo ""
    echo "<div align=\"center\">"
    echo ""
    echo "| Columna | Significado | Columna | Significado |"
    echo "|---|---|---|---|"
    echo "| Días | <sub>Días únicos con actividad propia</sub> | Gap | <sub>:green_circle: hoy/ayer :yellow_circle: 2-3d :red_circle: >3d</sub> |"
    echo "| 💡 | <sub>QUE\\_HACE.md relleno</sub> | 💬 | <sub>conversation-log.md relleno</sub> |"
    echo "| 📄 | <sub>README.md reescrito</sub> | 📐 | <sub>Día en que apareció \`modelosUML/\`</sub> |"
    echo "| 🔍 | <sub>Día en que apareció \`RUP/01-analisis/\`</sub> | 🧩 | <sub>Día en que apareció \`RUP/02-diseño/\`</sub> |"
    echo "| ⚙️ | <sub>Día en que apareció \`RUP/03-desarrollo/\`</sub> | 🔌 | <sub>Día en que apareció \`src/\`</sub> |"
    echo ""
    echo "</div>"
    echo ""
    echo "## Tabla"
    echo ""
    if [ -n "$RECENT_LINE" ]; then
        echo "<sub>Ultimas actualizaciones: $RECENT_LINE</sub>"
        echo ""
    fi
    echo "| Alumno | Último commit | Días | Gap | 💡 | 💬 | 📄 | 📐 | 🔍 | 🧩 | ⚙️ | 🔌 | SHA |"
    echo "|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|"
    printf '%s' "$TABLE_ROWS"
    echo ""
    echo "## Resumen"
    echo ""
    echo "- Forks totales: $N_FORKS"
    echo "- Alumnos con actividad (>0 commits propios): $ACTIVOS"
    echo "- Alumnos sin actividad: $((N_FORKS - ACTIVOS))"
} > "$DASHBOARD"

log "Dashboard generado: $DASHBOARD ($SKIPPED cacheados / $PROCESSED procesados)"
