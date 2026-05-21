#!/usr/bin/env bash
set -euo pipefail

REPO="mmasias/25-26-idsw2-sdVC"
DASHBOARD="DASHBOARD.md"
SCAFFOLD_MSG_MARKER="sesión de vibecoding idsw2"
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

# Max gap en días entre sesiones consecutivas, incluyendo brecha hasta hoy
compute_max_gap() {
    local commits_json="$1"
    local dates
    mapfile -t dates < <(echo "$commits_json" | jq -r '[.[].commit.author.date | split("T")[0]] | unique | sort[]' 2>/dev/null)

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

    # Brecha desde el último día activo hasta hoy
    local gap_to_today=$(( (TODAY_EPOCH - prev_epoch) / 86400 ))
    [ "$gap_to_today" -gt "$max_gap" ] && max_gap=$gap_to_today

    echo "$max_gap"
}

# Offset en días desde el scaffold hasta la primera aparición del artefacto.
# Para ficheros presentes en el scaffold (ej: conversation-log.md), excluye el commit inicial.
get_artifact_day_offset() {
    local user="$1" path="$2" scaffold_epoch="$3" scaffold_sha="$4"
    local encoded_path
    encoded_path=$(url_encode_path "$path")

    local first_date
    first_date=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?path=$encoded_path&per_page=100" 2>/dev/null | \
        jq -r --arg sha "$scaffold_sha" \
        '[.[] | select(.sha != $sha)] | if length > 0 then last | .commit.author.date | split("T")[0] else "null" end' \
        2>/dev/null || echo "null")

    if [ -z "$first_date" ] || [ "$first_date" = "null" ]; then
        echo "-"
        return
    fi

    local t_artifact
    t_artifact=$(date -d "$first_date" +%s 2>/dev/null) || { echo "?"; return; }
    local offset=$(( (t_artifact - scaffold_epoch) / 86400 ))
    echo "+${offset}d"
}

icon() {
    case "$1" in
        relleno | reescrito) echo "X" ;;
        vacio | original) echo "-" ;;
        *) echo "?" ;;
    esac
}

log "Obteniendo lista de forks..."
FORKS=$(gh api "repos/$REPO/forks" --jq '.[].owner.login' 2>/dev/null)

if [ -z "$FORKS" ]; then
    log "No se encontraron forks."
    exit 1
fi

N_FORKS=$(echo "$FORKS" | wc -l)
log "Encontrados $N_FORKS forks."

TABLE_ROWS=""
DETAIL_SECTIONS=""
ACTIVOS=0

for user in $FORKS; do
    log "Procesando $user..."

    REPO_URL="https://github.com/$user/25-26-idsw2-sdVC"
    QUE_HACE_URL="$REPO_URL/blob/main/QUE_HACE.md"
    CONVLOG_URL="$REPO_URL/blob/main/conversation-log.md"

    # Una sola llamada a la API para todos los commits
    COMMITS_JSON=$(gh api "repos/$user/25-26-idsw2-sdVC/commits?per_page=100" 2>/dev/null || echo "[]")

    TOTAL_C=$(echo "$COMMITS_JSON" | jq 'length' 2>/dev/null || echo "1")
    COMMITS=$((TOTAL_C - 1))
    LAST_DATE=$(echo "$COMMITS_JSON" | jq -r '.[0].commit.author.date | split("T")[0] | split("-") | .[2]+"-"+.[1]' 2>/dev/null || echo "N/A")
    LAST_MSG=$(echo "$COMMITS_JSON" | jq -r '.[0].commit.message | split("\n")[0]' 2>/dev/null || echo "N/A")
    LAST_SHA=$(echo "$COMMITS_JSON" | jq -r '.[0].sha' 2>/dev/null || echo "")

    SCAFFOLD_SHA=$(echo "$COMMITS_JSON" | jq -r 'last | .sha' 2>/dev/null || echo "")
    SCAFFOLD_DATE=$(echo "$COMMITS_JSON" | jq -r 'last | .commit.author.date | split("T")[0]' 2>/dev/null || echo "2026-05-19")
    SCAFFOLD_EPOCH=$(date -d "$SCAFFOLD_DATE" +%s 2>/dev/null || echo "0")

    # Días únicos con commits propios (excluye el commit del scaffold)
    UNIQUE_DAYS=$(echo "$COMMITS_JSON" | jq '[.[:-1][].commit.author.date | split("T")[0]] | unique | length' 2>/dev/null || echo "0")

    MAX_GAP=$(compute_max_gap "$COMMITS_JSON")
    if [ "$MAX_GAP" -gt 3 ]; then
        GAP_DISPLAY="**${MAX_GAP}d!**"
    elif [ "$MAX_GAP" -gt 0 ]; then
        GAP_DISPLAY="${MAX_GAP}d"
    else
        GAP_DISPLAY="-"
    fi

    QUE_HACE_STATUS=$(check_file_has_content "$user" "QUE_HACE.md" "En una frase" 2>/dev/null || echo "?")
    CONVLOG_STATUS=$(check_file_has_content "$user" "conversation-log.md" "lo que le dijo al AI para arrancar" 2>/dev/null || echo "?")
    README=$(check_readme_rewritten "$user" 2>/dev/null || echo "?")
    IR=$(icon "$README")

    if [ "$QUE_HACE_STATUS" = "relleno" ]; then
        QH_COL="[QH]($QUE_HACE_URL)"
    else
        QH_COL="-"
    fi

    if [ "$CONVLOG_STATUS" = "relleno" ]; then
        CL_COL="[CL]($CONVLOG_URL)"
    else
        CL_COL="-"
    fi

    # Progresión de artefactos: offset en días desde la fecha del scaffold
    SRC_OFFSET=$(get_artifact_day_offset "$user" "src" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")
    UML_OFFSET=$(get_artifact_day_offset "$user" "modelosUML" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")
    CL_T_OFFSET=$(get_artifact_day_offset "$user" "conversation-log.md" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")
    R01_OFFSET=$(get_artifact_day_offset "$user" "RUP/01-analisis" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")
    R02_OFFSET=$(get_artifact_day_offset "$user" "RUP/02-diseño" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")
    R03_OFFSET=$(get_artifact_day_offset "$user" "RUP/03-desarrollo" "$SCAFFOLD_EPOCH" "$SCAFFOLD_SHA")

    ALUMNO_LINK="<sub>[$user]($REPO_URL)</sub>"
    LAST_MSG_LINK="<sub>[$LAST_MSG]($REPO_URL/commit/$LAST_SHA)</sub>"

    ROW="| $ALUMNO_LINK | $LAST_MSG_LINK | $COMMITS | $UNIQUE_DAYS | $GAP_DISPLAY | $LAST_DATE | $QH_COL | $CL_COL | $IR | $SRC_OFFSET | $UML_OFFSET | $CL_T_OFFSET | $R01_OFFSET | $R02_OFFSET | $R03_OFFSET |"
    TABLE_ROWS="${TABLE_ROWS}${ROW}"$'\n'

    if [ "$COMMITS" -gt 0 ]; then
        ACTIVOS=$((ACTIVOS + 1))

        SECTION="### [$user]($REPO_URL) ($COMMITS commits · $UNIQUE_DAYS días activos · gap máx: ${MAX_GAP}d)"$'\n'
        SECTION+=""$'\n'
        SECTION+="| Fecha | Mensaje |"$'\n'
        SECTION+="|---|---|"$'\n'
        COMMITS_TABLE=$(echo "$COMMITS_JSON" | jq -r \
            --arg marker "$SCAFFOLD_MSG_MARKER" \
            --arg repo_url "$REPO_URL" \
            '.[] | select(.commit.message | test($marker) | not) |
             "| \(.commit.author.date | split("T")[0] | split("-") | .[2]+"-"+.[1]) | [\(.commit.message | split("\n")[0])](" + $repo_url + "/commit/" + .sha + ") |"' \
            2>/dev/null || true)
        SECTION+="${COMMITS_TABLE}"$'\n'
        SECTION+=""$'\n'

        DETAIL_SECTIONS="${DETAIL_SECTIONS}${SECTION}"
    fi
done

{
    echo "# Dashboard de seguimiento - 25-26-idsw2-sdVC"
    echo ""
    echo "> Generado: $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo ">"
    echo "> Leyenda: +Nd = artefacto apareció N días tras el scaffold | **Nd!** = brecha de actividad > 3 días"
    echo ""
    echo "| Alumno | Último commit | Commits | Días | Gap | Ult. act. | QH | CL | README | Src | UML | CL-t | RUP01 | RUP02 | RUP03 |"
    echo "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"
    printf '%s' "$TABLE_ROWS"
    echo ""
    echo "## Resumen"
    echo ""
    echo "- Forks totales: $N_FORKS"
    echo "- Alumnos con actividad (>0 commits propios): $ACTIVOS"
    echo "- Alumnos sin actividad: $((N_FORKS - ACTIVOS))"
    echo ""
    echo "## Detalle por alumno"
    echo ""
    printf '%s' "$DETAIL_SECTIONS"
} > "$DASHBOARD"

log "Dashboard generado: $DASHBOARD"
