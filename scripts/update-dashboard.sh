#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(git rev-parse --show-toplevel)"
BRANCH="AUDIT"
ORIGINAL=$(git -C "$REPO_DIR" branch --show-current)

if [ "$ORIGINAL" != "$BRANCH" ]; then
    git -C "$REPO_DIR" checkout "$BRANCH" -q
fi

bash "$REPO_DIR/scripts/monitor.sh"

# --- Format guard para timeline.sh ---
TIMELINE_TOKEN=$(md5sum "$REPO_DIR/scripts/timeline.sh" | cut -c1-8)
TIMELINE_FORMAT_FILE="$REPO_DIR/TIMELINES/.timeline-format"
TIMELINE_FORMAT_CACHED=$(cat "$TIMELINE_FORMAT_FILE" 2>/dev/null || echo "")
if [ "$TIMELINE_FORMAT_CACHED" != "$TIMELINE_TOKEN" ]; then
    echo ":: timeline.sh cambió (v$TIMELINE_TOKEN). Forzando regeneración de todos los timelines."
    for f in "$REPO_DIR"/TIMELINES/*.md; do
        [ -f "$f" ] || continue
        basename "$f" .md >> "$REPO_DIR/TIMELINES/.regen"
    done
    sort -u "$REPO_DIR/TIMELINES/.regen" -o "$REPO_DIR/TIMELINES/.regen"
    echo "$TIMELINE_TOKEN" > "$TIMELINE_FORMAT_FILE"
fi

if [ -s "$REPO_DIR/TIMELINES/.regen" ]; then
    while IFS= read -r regen_user; do
        [ -z "$regen_user" ] && continue
        echo ":: Regenerando timeline: $regen_user"
        bash "$REPO_DIR/scripts/timeline.sh" "$regen_user"
    done < "$REPO_DIR/TIMELINES/.regen"
fi

git -C "$REPO_DIR" add DASHBOARD.md
find "$REPO_DIR/TIMELINES" -name "*.md" -exec git -C "$REPO_DIR" add {} + 2>/dev/null || true
[ -f "$REPO_DIR/TIMELINES/.timeline-format" ] && git -C "$REPO_DIR" add "$REPO_DIR/TIMELINES/.timeline-format"
git -C "$REPO_DIR" commit -m "audit: actualizacion $(date '+%Y-%m-%d %H:%M')" -q
git -C "$REPO_DIR" push -q

if [ "$ORIGINAL" != "$BRANCH" ]; then
    git -C "$REPO_DIR" checkout "$ORIGINAL" -q 2>/dev/null || true
fi

echo "Dashboard actualizado y pusheado."
