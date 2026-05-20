#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/manuel/misRepos/_PROYECTOS/25-26-idsw2-sdVC"
BRANCH="AUDIT"
CURRENT=$(git -C "$REPO_DIR" branch --show-current)

if [ "$CURRENT" != "$BRANCH" ]; then
    git -C "$REPO_DIR" checkout "$BRANCH"
fi

bash "$REPO_DIR/scripts/monitor.sh"

git -C "$REPO_DIR" add DASHBOARD.md
git -C "$REPO_DIR" commit -m "audit: actualizacion $(date +%Y-%m-%d)"
git -C "$REPO_DIR" push

git -C "$REPO_DIR" checkout main 2>/dev/null || true

echo "Dashboard actualizado y pusheado."
