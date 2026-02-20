#!/bin/bash
# Auto-sync script to commit and push changes every 10 minutes

PROJECT_DIR="/Users/m1/PROJECTS/CODE/2026/OPENCLAWMAC.COM/v2/openclawmac-v2"
cd "$PROJECT_DIR" || exit 1

# Check if there are any changes
if [[ -n $(git status -s) ]]; then
  git add .
  git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin HEAD
fi
