#!/bin/bash

set -e

echo "🐻 AirBear PWA Deployment to airbear.me"
echo "========================================"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Verify environment variables
echo "🔍 Verifying environment variables..."
required_vars=(
    "NEXT_PUBLIC_SUPABASE_PWA4_URL"
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
    "SUPABASE_PWA4_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
)

for var in "${required_vars[@]}"; do
    if ! vercel env ls | grep -q "$var"; then
        echo "⚠️  Warning: $var not found in Vercel environment"
    else
        echo "✅ $var configured"
    fi
done

# Run type check
echo "📝 Running type check..."
pnpm run type-check

# Build the application
echo "🔨 Building application..."
pnpm run build

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod --yes

# Verify deployment
echo "🏥 Running health check..."
sleep 5
response=$(curl -s https://airbear.me/api/health)

if echo "$response" | grep -q '"status":"healthy"'; then
    echo "✅ Deployment successful! Health check passed."
    echo "🌐 Live at: https://airbear.me"
    echo "🗺️  Map: https://airbear.me/map"
else
    echo "❌ Health check failed. Please investigate."
    echo "Response: $response"
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo "📊 Monitor at: https://vercel.com/dashboard"
