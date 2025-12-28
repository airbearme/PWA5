#!/bin/bash
# FINAL DEPLOYMENT SCRIPT - Run this after creating GitHub repo

set -e

REPO_OWNER="airbearme"
REPO_NAME="pwapro"

echo "🚀 Final Deployment - AirBear PWA"
echo "=================================="
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git remote set-url origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git" 2>/dev/null || \
git remote add origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"

if git push -u origin main 2>&1; then
    echo "✅ Code pushed!"
else
    echo "Trying HTTPS..."
    git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
    git push -u origin main
fi

echo ""
echo "✅ DEPLOYED TO GITHUB!"
echo ""
echo "🔗 https://github.com/${REPO_OWNER}/${REPO_NAME}"
echo ""
echo "📋 Next: Deploy to Vercel"
echo "1. https://vercel.com/dashboard → Add Project"
echo "2. Import: ${REPO_OWNER}/${REPO_NAME}"
echo "3. Add env vars and deploy!"
echo ""


