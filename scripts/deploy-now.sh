#!/bin/bash

# Ultimate One-Click Deploy Script
# Creates repo, pushes code, provides Vercel instructions

set -e

REPO_OWNER="airbearme"
REPO_NAME="pwapro"
GITHUB_URL="https://github.com/new?org=${REPO_OWNER}&name=${REPO_NAME}&description=AirBear+PWA+-+Solar-Powered+Rideshare+%26+Mobile+Bodega"

echo "🚀 AirBear PWA - One-Click Deployment"
echo "======================================"
echo ""

# Step 1: Open GitHub repo creation page
echo "📦 Step 1: Creating GitHub Repository"
echo ""
echo "Opening GitHub in your browser..."
echo "URL: ${GITHUB_URL}"
echo ""

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open "${GITHUB_URL}" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "${GITHUB_URL}" 2>/dev/null &
elif command -v start &> /dev/null; then
    start "${GITHUB_URL}" 2>/dev/null &
else
    echo "Please open this URL in your browser:"
    echo "${GITHUB_URL}"
fi

echo ""
echo "📋 Instructions:"
echo "1. Make sure it's set to PUBLIC"
echo "2. DO NOT check: README, .gitignore, or license"
echo "3. Click 'Create repository'"
echo ""
read -p "Press Enter AFTER you've created the repository..."

# Step 2: Push code
echo ""
echo "📤 Step 2: Pushing code to GitHub..."

# Set remote
git remote remove origin 2>/dev/null || true
git remote add origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git" 2>/dev/null || \
git remote set-url origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"

# Try SSH first
if git push -u origin main 2>&1; then
    echo "✅ Code pushed successfully!"
else
    echo "⚠️  SSH failed, trying HTTPS..."
    git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
    if git push -u origin main 2>&1; then
        echo "✅ Code pushed successfully via HTTPS!"
    else
        echo "❌ Push failed. You may need to authenticate."
        echo "Try: gh auth login (if GitHub CLI installed)"
        exit 1
    fi
fi

echo ""
echo "✅ Repository created and code pushed!"
echo ""
echo "🔗 Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}"
echo ""
echo "📋 Next: Deploy to Vercel"
echo "=========================="
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Import: ${REPO_OWNER}/${REPO_NAME}"
echo "4. Add these environment variables:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_PWA4_URL"
echo "   NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
echo "   SUPABASE_PWA4_SERVICE_ROLE_KEY"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   STRIPE_SECRET_KEY"
echo "   STRIPE_WEBHOOK_SECRET"
echo "   NEXT_PUBLIC_SITE_URL=https://airbear.me"
echo ""
echo "5. Click 'Deploy'"
echo ""
echo "✨ Your beautiful UI will be live at airbear.me!"
echo ""
