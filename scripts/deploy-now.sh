#!/bin/bash

# Quick deployment script - Deploys everything automatically
# Assumes tokens are in environment or .env.local

set -e

echo "🚀 Deploying AirBear PWA to Production"
echo "======================================="
echo ""

# Load .env.local if exists
if [ -f ".env.local" ]; then
    echo "📋 Loading environment variables..."
    set -a
    source .env.local
    set +a
fi

# Validate environment
echo "✅ Validating environment..."
npm run validate:env || {
    echo "⚠️  Environment validation had warnings (continuing...)"
}

# Type check
echo "✅ Type checking..."
npm run type-check || {
    echo "❌ Type check failed"
    exit 1
}

# Build
echo "✅ Building..."
npm run build || {
    echo "❌ Build failed"
    exit 1
}

# Try to push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
if git push -u origin main 2>&1; then
    echo "✅ Code pushed to GitHub"
else
    echo "⚠️  GitHub push failed or repo doesn't exist"
    echo "   Run: bash scripts/setup-github-api.sh first"
fi

# Try Vercel deployment if token available
if [ -n "$VERCEL_TOKEN" ]; then
    echo ""
    echo "☁️  Deploying to Vercel..."
    if command -v vercel &> /dev/null; then
        vercel --prod --token="$VERCEL_TOKEN" || {
            echo "⚠️  Vercel deployment failed"
        }
    else
        echo "⚠️  Vercel CLI not installed. Installing..."
        npm install -g vercel@latest
        vercel --prod --token="$VERCEL_TOKEN" || {
            echo "⚠️  Vercel deployment failed"
        }
    fi
else
    echo ""
    echo "⚠️  VERCEL_TOKEN not set. Skipping Vercel deployment"
    echo "   Set VERCEL_TOKEN and run: vercel --prod"
fi

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify deployment in Vercel dashboard"
echo "   2. Configure DNS in IONOS (if not done)"
echo "   3. Test the live site"
echo ""

