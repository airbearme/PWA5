#!/bin/bash

# 🚀 Simple Production Deployment
# Dark mode is already permanently enabled in app/layout.tsx

echo "🚀 Deploying AirBear PWA to production (airbear.me)"
echo "🌙 Dark mode: PERMANENTLY ENABLED ✅"
echo ""

# Verify dark mode
if grep -q 'defaultTheme="dark"' app/layout.tsx; then
    echo "✅ Dark mode confirmed: PERMANENTLY ENABLED"
else
    echo "❌ Dark mode not configured!"
    exit 1
fi

# Check if Vercel CLI is available
if command -v vercel >/dev/null 2>&1; then
    echo ""
    echo "🚀 Deploying via Vercel CLI..."
    vercel --prod
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your site: https://airbear.me"
else
    echo ""
    echo "📤 Vercel CLI not found. Options:"
    echo ""
    echo "Option 1: Install Vercel CLI and deploy"
    echo "  npm i -g vercel"
    echo "  vercel login"
    echo "  vercel --prod"
    echo ""
    echo "Option 2: Push to GitHub (auto-deploys)"
    echo "  git add ."
    echo "  git commit -m 'Deploy to production - Dark mode enabled'"
    echo "  git push origin main"
    echo ""
    echo "Option 3: Deploy via Vercel Dashboard"
    echo "  1. Go to https://vercel.com/dashboard"
    echo "  2. Select your project"
    echo "  3. Click 'Deploy' → 'Redeploy'"
    echo ""
fi





