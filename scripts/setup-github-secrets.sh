#!/bin/bash

# 🔐 GitHub Secrets Setup Helper Script
# This script helps you set up all required GitHub secrets

echo "🔐 GitHub Secrets Setup Helper"
echo "================================"
echo ""
echo "This script will guide you through setting up GitHub secrets."
echo "You'll need to add these manually in GitHub UI."
echo ""
echo "📋 Required Secrets:"
echo ""
echo "Vercel:"
echo "  1. VERCEL_TOKEN"
echo "  2. VERCEL_ORG_ID"
echo "  3. VERCEL_PROJECT_ID"
echo ""
echo "Supabase:"
echo "  4. NEXT_PUBLIC_SUPABASE_PWA4_URL"
echo "  5. NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
echo "  6. SUPABASE_PWA4_SERVICE_ROLE_KEY"
echo ""
echo "Stripe:"
echo "  7. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "  8. STRIPE_SECRET_KEY"
echo "  9. STRIPE_WEBHOOK_SECRET"
echo ""
echo "Site:"
echo "  10. NEXT_PUBLIC_SITE_URL (optional, defaults to https://airbear.me)"
echo ""
echo "📝 Steps:"
echo ""
echo "1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Add each secret one by one"
echo "4. After adding all secrets, run:"
echo "   - Go to Actions tab"
echo "   - Select 'Sync Secrets & Environment Variables'"
echo "   - Click 'Run workflow'"
echo ""
echo "📚 See SETUP_GITHUB_SECRETS.md for detailed instructions"
echo ""

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI detected!"
    echo ""
    read -p "Do you want to check if secrets are already set? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Checking GitHub secrets..."
        gh secret list 2>/dev/null || echo "⚠️  Could not list secrets. Make sure you're authenticated: gh auth login"
    fi
else
    echo "💡 Tip: Install GitHub CLI for easier secret management:"
    echo "   brew install gh  # macOS"
    echo "   apt install gh   # Linux"
    echo "   Then: gh auth login"
fi

echo ""
echo "✅ Setup complete! Add secrets in GitHub UI and run the sync workflow."



