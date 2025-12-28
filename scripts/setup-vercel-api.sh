#!/bin/bash

# Automated Vercel project setup and environment variables
# Requires: VERCEL_TOKEN environment variable

set -e

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN environment variable required"
    echo "   Get token from: https://vercel.com/account/tokens"
    exit 1
fi

echo "☁️  Setting up Vercel project..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Link project (creates if doesn't exist)
echo "Linking Vercel project..."
vercel link --yes --token="$VERCEL_TOKEN"

# Get project ID
PROJECT_ID=$(vercel inspect --token="$VERCEL_TOKEN" | grep -o '"id":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  Could not get project ID. Please set VERCEL_PROJECT_ID manually"
    exit 1
fi

echo "✅ Project ID: $PROJECT_ID"
echo ""
echo "📝 Add this to your environment:"
echo "   export VERCEL_PROJECT_ID=$PROJECT_ID"

# Add environment variables from .env.local
if [ -f ".env.local" ]; then
    echo ""
    echo "🔐 Adding environment variables..."
    
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        
        # Remove quotes
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        [[ -z "$value" ]] && continue
        
        echo "Adding $key..."
        curl -s -X POST "https://api.vercel.com/v10/projects/${PROJECT_ID}/env" \
            -H "Authorization: Bearer ${VERCEL_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "{
                \"key\": \"${key}\",
                \"value\": \"${value}\",
                \"type\": \"encrypted\",
                \"target\": [\"production\", \"preview\", \"development\"]
            }" > /dev/null && echo "  ✅ Added" || echo "  ⚠️  Failed"
    done < .env.local
    
    echo ""
    echo "✅ Environment variables added"
fi

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod --token="$VERCEL_TOKEN"

echo ""
echo "✅ Vercel setup complete!"


