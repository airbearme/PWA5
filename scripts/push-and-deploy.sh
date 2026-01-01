#!/bin/bash

# Push to GitHub and prepare for Vercel deployment

set -e

REPO_URL="https://github.com/airbearme/pwapro.git"
REPO_SSH="git@github.com:airbearme/pwapro.git"

echo "🚀 Pushing AirBear PWA to GitHub and preparing for deployment"
echo "============================================================"
echo ""

# Check if repo exists
if git ls-remote "$REPO_SSH" &> /dev/null; then
    echo "✅ Repository exists at GitHub"
    echo "📤 Pushing code..."
    git push -u origin main
    echo -e "\n✅ Code pushed successfully!"
else
    echo "⚠️  Repository doesn't exist yet on GitHub"
    echo ""
    echo "📝 Please create it first:"
    echo "   1. Go to: https://github.com/new"
    echo "   2. Owner: airbearme"
    echo "   3. Repository name: pwapro"
    echo "   4. Description: AirBear PWA - Solar-Powered Rideshare & Mobile Bodega"
    echo "   5. Make it Public"
    echo "   6. DO NOT initialize with README, .gitignore, or license"
    echo "   7. Click 'Create repository'"
    echo ""
    echo "Then run this script again, or manually:"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

echo ""
echo "✅ GitHub push complete!"
echo ""
echo "📋 Next Steps for Vercel Deployment:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Import repository: airbearme/pwapro"
echo "4. Configure:"
echo "   - Framework Preset: Next.js"
echo "   - Root Directory: ./"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo ""
echo "5. Add Environment Variables (from your .env.local):"
echo "   - NEXT_PUBLIC_SUPABASE_PWA4_URL"
echo "   - NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
echo "   - SUPABASE_PWA4_SERVICE_ROLE_KEY"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - NEXT_PUBLIC_SITE_URL=https://airbear.me"
echo "   - NODE_ENV=production"
echo ""
echo "6. Click 'Deploy'"
echo ""
echo "7. After deployment, add domain:"
echo "   - Settings → Domains → Add 'airbear.me'"
echo ""
echo "8. Configure IONOS DNS:"
echo "   - Add CNAME: @ → cname.vercel-dns.com"
echo ""
echo "📚 See DEPLOY_NOW.md for complete instructions"
echo ""






