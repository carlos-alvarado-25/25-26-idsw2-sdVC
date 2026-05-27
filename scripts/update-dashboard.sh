#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(git rev-parse --show-toplevel)"
BRANCH="AUDIT"
ORIGINAL=$(git -C "$REPO_DIR" branch --show-current)

if [ "$ORIGINAL" != "$BRANCH" ]; then
    git -C "$REPO_DIR" checkout "$BRANCH" -q
fi

bash "$REPO_DIR/scripts/monitor.sh"

if [ -s "$REPO_DIR/TIMELINES/.regen" ]; then
    while IFS= read -r regen_user; do
        [ -z "$regen_user" ] && continue
        echo ":: Regenerando timeline: $regen_user"
        bash "$REPO_DIR/scripts/timeline.sh" "$regen_user"
    done < "$REPO_DIR/TIMELINES/.regen"
fi

git -C "$REPO_DIR" add DASHBOARD.md
find "$REPO_DIR/TIMELINES" -name "*.md" -exec git -C "$REPO_DIR" add {} + 2>/dev/null || true
git -C "$REPO_DIR" commit -m "audit: actualizacion $(date '+%Y-%m-%d %H:%M')" -q
git -C "$REPO_DIR" push -q

if [ "$ORIGINAL" != "$BRANCH" ]; then
    git -C "$REPO_DIR" checkout "$ORIGINAL" -q 2>/dev/null || true
fi

echo "Dashboard actualizado y pusheado."
