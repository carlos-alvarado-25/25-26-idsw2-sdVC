#!/usr/bin/env bash
set -euo pipefail

REPO="mmasias/25-26-idsw2-sdVC"

if [ -z "${1:-}" ]; then
    echo "Uso: $0 <usuario>" >&2
    exit 1
fi

USER="$1"
REPO_URL="https://github.com/$USER/25-26-idsw2-sdVC"
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

log() { echo ":: $*" >&2; }

log "Procesando $USER..."

# --- Commits ---
COMMITS_JSON=$(gh api "repos/$USER/25-26-idsw2-sdVC/commits?per_page=100" 2>/dev/null || echo "[]")
TOTAL_C=$(echo "$COMMITS_JSON" | jq 'length' 2>/dev/null || echo "1")
OWN_COMMITS=$((TOTAL_C - 1))

if [ "$OWN_COMMITS" -le 0 ]; then
    echo "# Sin actividad para $USER"
    exit 0
fi

INICIAL_MSG_MARKER="sesión de vibecoding idsw2"
INICIAL_DATE=$(echo "$COMMITS_JSON" | jq -r 'last | .commit.author.date | split("T")[0]' 2>/dev/null || echo "2026-05-19")
INICIAL_EPOCH=$(date -d "$INICIAL_DATE" +%s 2>/dev/null || echo "0")
INICIAL_SHA=$(echo "$COMMITS_JSON" | jq -r 'last | .sha' 2>/dev/null || echo "")

# Commits propios clasificados, guardados como JSON
echo "$COMMITS_JSON" | jq --arg marker "$INICIAL_MSG_MARKER" '
    .[:-1] | sort_by(.commit.author.date) | reverse |
    map({
        date: (.commit.author.date | split("T")[0]),
        time: ([(.commit.author.date | split("T")[1] | split(":")[0] | tonumber + 2) % 24, (.commit.author.date | split("T")[1] | split(":")[1])] | map(if . < 10 then "0\(.)" else "\(.)" end) | join(":")),
        msg: (.commit.message | split("\n")[0]),
        sha: .sha,
        type: (if (.commit.message | split("\n")[0] | test("^(feat|add)"; "i")) then "feat"
               elif (.commit.message | split("\n")[0] | test("^(fix|correcci|correct)"; "i")) then "fix"
               else "other" end)
    })
' > "$TMPDIR/commits.json"

# Fechas unicas con commits
jq -r '[.[].date] | unique | .[]' "$TMPDIR/commits.json" | sort > "$TMPDIR/dates_commits.txt"

# --- Conversation log ---
CONVLOG_CONTENT=$(gh api "repos/$USER/25-26-idsw2-sdVC/contents/conversation-log.md" \
    --jq '.content' 2>/dev/null | base64 -d 2>/dev/null || echo "")

> "$TMPDIR/log_entries.txt"
> "$TMPDIR/log_no_date.txt"
if [ -n "$CONVLOG_CONTENT" ]; then
    while IFS= read -r line; do
        DAY=""
        TITLE=""
        # Patron: [DD/MM/YYYY] en cualquier posicion de la linea
        if echo "$line" | grep -qP '\[\d{1,2}/\d{1,2}/\d{4}\]'; then
            RAW=$(echo "$line" | grep -oP '\[\d{1,2}/\d{1,2}/\d{4}\]' | head -1 | tr -d '[]')
            DAY=$(echo "$RAW" | awk -F'/' '{printf "%04d-%02d-%02d", $3, $2, $1}' 2>/dev/null)
            TITLE=$(echo "$line" | sed 's/^#\+\s*//' | sed 's/^Sesión\s*\d*\s*:\s*//' | sed 's/\[[^]]*\]\s*\[[^]]*\]\s*//' | sed 's/\[[^]]*\]\s*//')
        # Patron: [DD/MM/YYYY HH:MM] con espacio (sin segundo corchete de hora)
        elif echo "$line" | grep -qP '\[\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\]'; then
            RAW=$(echo "$line" | grep -oP '(?<=\[)\d{1,2}/\d{1,2}/\d{4}' | head -1)
            DAY=$(echo "$RAW" | awk -F'/' '{printf "%04d-%02d-%02d", $3, $2, $1}' 2>/dev/null)
            TITLE=$(echo "$line" | sed 's/^#\+\s*//' | sed 's/^Sesión\s*\d*\s*:\s*//' | sed 's/\[[^]]*\]\s*//')
        # Patron: [YYYY-MM-DD] en cualquier posicion
        elif echo "$line" | grep -qP '\[\d{4}-\d{2}-\d{2}\]'; then
            DAY=$(echo "$line" | grep -oP '\d{4}-\d{2}-\d{2}' | head -1)
            TITLE=$(echo "$line" | sed 's/^#\+\s*//' | sed 's/^Sesión\s*\d*\s*:\s*//' | sed 's/\[[^]]*\]\s*//')
        # Patron: [DD de mes de YYYY] (fecha en texto)
        elif echo "$line" | grep -qP '\[\d{1,2}\s+de\s+\w+\s+de\s+\d{4}\]'; then
            RAW=$(echo "$line" | grep -oP '\[\K\d{1,2}\s+de\s+\w+\s+de\s+\d{4}' | head -1)
            DAY=$(python3 -c "
import sys, re, locale
months = {'enero':1,'febrero':2,'marzo':3,'abril':4,'mayo':5,'junio':6,
          'julio':7,'agosto':8,'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12}
m = re.match(r'(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})', '$RAW')
if m: print(f'{m.group(3)}-{months.get(m.group(2),0):02d}-{int(m.group(1)):02d}')
" 2>/dev/null || echo "")
            TITLE=$(echo "$line" | sed 's/^#\+\s*//' | sed 's/^Sesión\s*\d*\s*:\s*//' | sed 's/\[[^]]*\]\s*//')
        # Patron: solo hora [HH:MM] o [H:MM] sin fecha — se cuenta pero no se asigna a dia
        elif echo "$line" | grep -qP '^\s*#{1,3}\s+\[\d{1,2}:\d{2}\]'; then
            TITLE=$(echo "$line" | sed 's/^#\+\s*//' | sed 's/\[[^]]*\]\s*//')
            [ -n "$TITLE" ] && echo "$TITLE" >> "$TMPDIR/log_no_date.txt"
        fi
        if [ -n "$DAY" ] && [ -n "$TITLE" ]; then
            echo "${DAY}|${TITLE}" >> "$TMPDIR/log_entries.txt"
        fi
    done <<< "$CONVLOG_CONTENT"
fi

# Fechas unicas con log
    cut -d'|' -f1 < "$TMPDIR/log_entries.txt" | sort -u > "$TMPDIR/dates_log.txt"

# Fechas combinadas
cat "$TMPDIR/dates_commits.txt" "$TMPDIR/dates_log.txt" | sort -u > "$TMPDIR/all_dates.txt"

# --- Artefactos ---
url_encode_path() {
    python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe='/'))" "$1" 2>/dev/null || echo "$1"
}

_get_artifact_day_single() {
    local path="$1"
    local encoded_path
    encoded_path=$(url_encode_path "$path")
    local first_date
    first_date=$(gh api "repos/$USER/25-26-idsw2-sdVC/commits?path=$encoded_path&per_page=100" 2>/dev/null | \
        jq -r --arg sha "$INICIAL_SHA" \
        '[.[] | select(.sha != $sha)] | if length > 0 then last | .commit.author.date | split("T")[0] else "null" end' \
        2>/dev/null || echo "null")
    if [ -z "$first_date" ] || [ "$first_date" = "null" ]; then
        echo ""
    else
        echo "$first_date"
    fi
}

get_artifact_day() {
    for path in "$@"; do
        local result
        result=$(_get_artifact_day_single "$path")
        [ -n "$result" ] && echo "$result" && return
    done
    echo ""
}

log "Calculando artefactos..."
SRC_DAY=$(get_artifact_day "src" "backend" "frontend")
UML_DAY=$(get_artifact_day "modelosUML")
R01_DAY=$(get_artifact_day "RUP/01-analisis" "documents/analisis")
R02_DAY=$(get_artifact_day "RUP/02-diseño" "documents/diseño")
R03_DAY=$(get_artifact_day "RUP/03-desarrollo")

# --- Metricas globales ---
TODAY_FMT=$(date '+%Y-%m-%d')
TOTAL_FEATS=$(jq '[.[] | select(.type == "feat")] | length' "$TMPDIR/commits.json")
TOTAL_FIXES=$(jq '[.[] | select(.type == "fix")] | length' "$TMPDIR/commits.json")
TOTAL_OTHER=$(jq '[.[] | select(.type == "other")] | length' "$TMPDIR/commits.json")
TOTAL_LOG=$(( $(wc -l < "$TMPDIR/log_entries.txt") + $(wc -l < "$TMPDIR/log_no_date.txt") ))
UNIQUE_DAYS=$(jq '[.[].date] | unique | length' "$TMPDIR/commits.json")

# --- Correlacion (precalculo antes de render) ---
CORRELATED=0; LOG_ONLY=0; COMMIT_ONLY=0
while IFS= read -r date; do
    [ -z "$date" ] && continue
    HAS_LOG=0; HAS_COMMIT=0
    grep -q "^${date}|" "$TMPDIR/log_entries.txt" 2>/dev/null && HAS_LOG=1
    DAY_C=$(jq --arg d "$date" '[.[] | select(.date == $d)] | length' "$TMPDIR/commits.json")
    [ "$DAY_C" -gt 0 ] && HAS_COMMIT=1
    if [ "$HAS_LOG" -eq 1 ] && [ "$HAS_COMMIT" -eq 1 ]; then CORRELATED=$((CORRELATED + 1))
    elif [ "$HAS_LOG" -eq 1 ]; then LOG_ONLY=$((LOG_ONLY + 1))
    elif [ "$HAS_COMMIT" -eq 1 ]; then COMMIT_ONLY=$((COMMIT_ONLY + 1)); fi
done < "$TMPDIR/all_dates.txt"

# --- Trazabilidad por CU (precalculo) ---
log "Calculando trazabilidad por CU..."

detect_cu_path() {
    for p in "$@"; do
        local encoded result ndirs
        encoded=$(url_encode_path "$p")
        result=$(gh api "repos/$USER/25-26-idsw2-sdVC/contents/$encoded" 2>/dev/null) || continue
        ndirs=$(echo "$result" | jq '[.[] | select(.type == "dir")] | length' 2>/dev/null || echo "0")
        [ "${ndirs:-0}" -gt 0 ] && echo "$p" && return
    done
    echo ""
}

CU_ANALISIS_PATH=$(detect_cu_path "RUP/01-analisis" "documents/analisis")
CU_DISENO_PATH=$(detect_cu_path "RUP/02-diseño" "documents/diseño")
CU_DESARROLLO_PATH=$(detect_cu_path "RUP/03-desarrollo" "documents/desarrollo")

declare -A CU_CELL CU_FIRST_DAY
CU_LIST=()
CU_TABLE_DAYS=()

if [ -n "$CU_ANALISIS_PATH" ]; then
    encoded=$(url_encode_path "$CU_ANALISIS_PATH")
    mapfile -t CU_LIST < <(gh api "repos/$USER/25-26-idsw2-sdVC/contents/$encoded" 2>/dev/null | \
        jq -r '[.[] | select(.type == "dir") | .name] | .[]' 2>/dev/null || true)

    if [ "${#CU_LIST[@]}" -gt 0 ]; then
        declare -A _DAYS_WITH_CU

        for cu in "${CU_LIST[@]}"; do
            CU_FIRST_DAY["$cu"]=9999
            for phase_pair in "A:$CU_ANALISIS_PATH" "D:$CU_DISENO_PATH" "d:$CU_DESARROLLO_PATH"; do
                phase="${phase_pair%%:*}"
                ppath="${phase_pair##*:}"
                [ -z "$ppath" ] && continue
                encoded_cu=$(url_encode_path "$ppath/$cu")
                first_date=$(gh api "repos/$USER/25-26-idsw2-sdVC/commits?path=$encoded_cu&per_page=100" 2>/dev/null | \
                    jq -r --arg sha "$INICIAL_SHA" \
                    '[.[] | select(.sha != $sha)] | if length > 0 then last | .commit.author.date | split("T")[0] else "null" end' \
                    2>/dev/null || echo "null")
                if [ -n "$first_date" ] && [ "$first_date" != "null" ]; then
                    epoch=$(date -d "$first_date" +%s 2>/dev/null) || continue
                    daynum=$(( (epoch - INICIAL_EPOCH) / 86400 + 1 ))
                    CU_CELL["$cu|$daynum"]+="$phase"
                    _DAYS_WITH_CU["$daynum"]=1
                    [ "$daynum" -lt "${CU_FIRST_DAY[$cu]:-9999}" ] && CU_FIRST_DAY["$cu"]=$daynum
                fi
            done
        done

        mapfile -t CU_TABLE_DAYS < <(printf '%s\n' "${!_DAYS_WITH_CU[@]}" | sort -n)
    fi
fi

# --- Render ---
mkdir -p TIMELINES
OUTPUT="TIMELINES/${USER}.md"

{
    echo "# Timeline - $USER"
    echo ""
    echo "> Repo: [$USER/25-26-idsw2-sdVC]($REPO_URL)"
    echo "> Commits: $OWN_COMMITS | Días activos: $UNIQUE_DAYS | Sesiones log: $TOTAL_LOG"
    echo ""

    # --- Patron observado ---
    echo "## Patrón observado"
    echo ""
    echo "| Métrica | Valor |"
    echo "|---|---|"
    echo "| Commits propios | $OWN_COMMITS ($TOTAL_FEATS feat / $TOTAL_FIXES fix / $TOTAL_OTHER other) |"
    if [ "$TOTAL_FEATS" -gt 0 ] && [ "$TOTAL_FIXES" -gt 0 ]; then
        RATIO=$(echo "scale=2; $TOTAL_FIXES / $TOTAL_FEATS" | bc 2>/dev/null | sed 's/^\./0./' || echo "?")
        echo "| Ratio fix/feat | $RATIO |"
    fi
    echo "| Días activos | $UNIQUE_DAYS |"
    echo "| Sesiones documentadas | $TOTAL_LOG |"
    if [ "$TOTAL_LOG" -gt 0 ]; then
        NO_DATE_LOG=$(wc -l < "$TMPDIR/log_no_date.txt")
        DATED_LOG=$(wc -l < "$TMPDIR/log_entries.txt")
        [ "$DATED_LOG" -gt 0 ] && echo "| Días log+commits | $CORRELATED |"
        [ "$DATED_LOG" -gt 0 ] && echo "| Días solo log | $LOG_ONLY |"
        [ "$DATED_LOG" -gt 0 ] && echo "| Días solo commits | $COMMIT_ONLY |"
        [ "$NO_DATE_LOG" -gt 0 ] && echo "| Sesiones sin fecha en log | $NO_DATE_LOG |"
    fi
    if [ -n "$UML_DAY" ] || [ -n "$R01_DAY" ] || [ -n "$R02_DAY" ] || [ -n "$R03_DAY" ] || [ -n "$SRC_DAY" ]; then
        echo ""
        echo '```mermaid'
        echo "gantt"
        echo "    title Progresion de artefactos"
        echo "    dateFormat YYYY-MM-DD"
        echo "    axisFormat %d/%m"
        echo "    section Artefactos"
        echo "        Inicio       :milestone, $INICIAL_DATE, 0d"
        [ -n "$UML_DAY" ]  && echo "        UML          :done, $UML_DAY, $TODAY_FMT"
        [ -n "$R01_DAY" ]  && echo "        Analisis     :done, $R01_DAY, $TODAY_FMT"
        [ -n "$R02_DAY" ]  && echo "        Diseno       :done, $R02_DAY, $TODAY_FMT"
        [ -n "$R03_DAY" ]  && echo "        Desarrollo   :done, $R03_DAY, $TODAY_FMT"
        [ -n "$SRC_DAY" ]  && echo "        Codigo       :done, $SRC_DAY, $TODAY_FMT"
        echo '```'
    fi
    echo ""

    # --- Trazabilidad por CU ---
    if [ "${#CU_TABLE_DAYS[@]}" -gt 0 ]; then
        echo "## Trazabilidad por caso de uso"
        echo ""
        HEADER="| Caso de uso |"
        SEP="|---|"
        for d in "${CU_TABLE_DAYS[@]}"; do
            HEADER+=" D$d |"
            SEP+=":---:|"
        done
        echo "$HEADER"
        echo "$SEP"
        while IFS=' ' read -r _ cu; do
            ROW="| \`$cu\` |"
            for d in "${CU_TABLE_DAYS[@]}"; do
                cell="${CU_CELL[$cu|$d]:-}"
                ROW+=" ${cell:- } |"
            done
            echo "$ROW"
        done < <(
            for cu in "${CU_LIST[@]}"; do
                [ "${CU_FIRST_DAY[$cu]:-9999}" -lt 9999 ] && echo "${CU_FIRST_DAY[$cu]} $cu"
            done | sort -n
        )
        echo ""
    fi

    echo "---"
    echo ""

    while IFS= read -r date; do
        [ -z "$date" ] && continue

        DATE_EPOCH=$(date -d "$date" +%s 2>/dev/null || echo "0")
        OFFSET=$(( (DATE_EPOCH - INICIAL_EPOCH) / 86400 + 1 ))

        echo "## Día $OFFSET · $date"
        echo ""

        # Artefactos nuevos este dia
        ARTIFACTS=""
        [ "$SRC_DAY" = "$date" ] && ARTIFACTS="${ARTIFACTS}🔌 "
        [ "$UML_DAY" = "$date" ] && ARTIFACTS="${ARTIFACTS}📐 "
        [ "$R01_DAY" = "$date" ] && ARTIFACTS="${ARTIFACTS}🔍 "
        [ "$R02_DAY" = "$date" ] && ARTIFACTS="${ARTIFACTS}🧩 "
        [ "$R03_DAY" = "$date" ] && ARTIFACTS="${ARTIFACTS}⚙️ "

        # Commits del dia
        DAY_COUNT=$(jq --arg d "$date" '[.[] | select(.date == $d)] | length' "$TMPDIR/commits.json")
        DAY_FEATS=$(jq --arg d "$date" '[.[] | select(.date == $d and .type == "feat")] | length' "$TMPDIR/commits.json")
        DAY_FIXES=$(jq --arg d "$date" '[.[] | select(.date == $d and .type == "fix")] | length' "$TMPDIR/commits.json")

        if [ "$DAY_COUNT" -gt 0 ]; then
            echo "### Commits ($DAY_COUNT: $DAY_FEATS feat / $DAY_FIXES fix)"
            echo ""
            echo "| Hora | Mensaje |"
            echo "|---|---|"
            jq -r --arg d "$date" --arg url "$REPO_URL" \
                '.[] | select(.date == $d) | "| \(.time) | [\(.msg)](\($url)/commit/\(.sha)) |"' \
                "$TMPDIR/commits.json"
            echo ""
        fi

        # Log entries del dia
        DAY_LOG=$(grep "^${date}|" "$TMPDIR/log_entries.txt" 2>/dev/null || true)
        if [ -n "$DAY_LOG" ]; then
            LOG_COUNT=$(echo "$DAY_LOG" | wc -l)
            echo "### 💬 Conversation-log ($LOG_COUNT sesión$([ "$LOG_COUNT" -gt 1 ] && echo "es"))"
            echo ""
            echo "$DAY_LOG" | cut -d'|' -f2- | while IFS= read -r title; do
                [ -z "$title" ] && continue
                echo "- $title"
            done
            echo ""
        fi

        # Artefactos nuevos
        if [ -n "$ARTIFACTS" ]; then
            echo "**Artefactos nuevos:** ${ARTIFACTS}"
            echo ""
        fi

        # Correlacion
        HAS_LOG=0; HAS_COMMIT=0
        [ -n "$DAY_LOG" ] && HAS_LOG=1
        [ "$DAY_COUNT" -gt 0 ] && HAS_COMMIT=1

        if [ "$HAS_LOG" -eq 1 ] && [ "$HAS_COMMIT" -eq 1 ]; then
            echo "> 💬 + commits = proceso documentado"
        elif [ "$HAS_COMMIT" -eq 1 ]; then
            echo "> ⚠️ Commits sin entrada en log"
        elif [ "$HAS_LOG" -eq 1 ]; then
            echo "> ⚠️ Log sin commits"
        fi
        echo ""
        echo "---"
        echo ""
    done < "$TMPDIR/all_dates.txt"

} > "$OUTPUT"

log "Timeline generado: $OUTPUT"
