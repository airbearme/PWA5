#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "[FATAL] merge failed"; exit 1' ERR

###############################################################################
# AIRBEAR — FULL BRANCH CONSOLIDATION OCS
###############################################################################

STEP=0
TOTAL=8
step(){ STEP=$((STEP+1)); printf "\n[%02d/%02d] %s\n" "$STEP" "$TOTAL" "$1"; }

###############################################################################
step "Sanity checks"
###############################################################################
git rev-parse --is-inside-work-tree >/dev/null
git status --porcelain >/dev/null

###############################################################################
step "Fetch all remotes"
###############################################################################
git fetch --all --prune

###############################################################################
step "Ensure main branch exists"
###############################################################################
if ! git show-ref --verify --quiet refs/heads/main; then
  echo "main branch missing — creating from current HEAD"
  git branch main
fi

###############################################################################
step "Checkout main"
###############################################################################
git checkout main
git pull --ff-only origin main || true

###############################################################################
step "Commit all uncommitted work (if any)"
###############################################################################
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "chore: consolidate working tree before full merge"
else
  echo "✓ working tree clean"
fi

###############################################################################
step "Merge all local branches into main"
###############################################################################
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v '^main$'); do
  echo "→ merging local branch: $b"
  git merge --no-ff "$b" -m "merge: integrate $b into main"
done

###############################################################################
step "Merge all remote branches into main"
###############################################################################
for rb in $(git branch -r | grep -vE '->|/main$'); do
  b="${rb#origin/}"
  if git show-ref --verify --quiet "refs/heads/$b"; then
    echo "→ skipping remote $rb (already local)"
  else
    echo "→ merging remote branch: $rb"
    git merge --no-ff "$rb" -m "merge: integrate $rb into main"
  fi
done

###############################################################################
step "Final verification"
###############################################################################
git status
git log --oneline --decorate -5

###############################################################################
step "Push consolidated main"
###############################################################################
git push origin main

###############################################################################
echo
echo "=================================================="
echo "[✓] ALL BRANCHES MERGED INTO main"
echo "[✓] main is authoritative"
echo "[✓] Remote synchronized"
echo "=================================================="