#!/bin/bash

# Script to create GitHub repository using GitHub API
# Requires GITHUB_TOKEN environment variable

set -e

REPO_NAME="pwapro"
REPO_OWNER="airbearme"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable is required"
    echo "   Get a token from: https://github.com/settings/tokens"
    echo "   Then run: export GITHUB_TOKEN=your_token"
    exit 1
fi

echo "🚀 Creating GitHub repository: ${REPO_OWNER}/${REPO_NAME}"

# Check if repo already exists
if curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}" | grep -q '"name"'; then
    echo "✅ Repository already exists at https://github.com/${REPO_OWNER}/${REPO_NAME}"
else
    echo "➕ Creating new repository..."
    curl -X POST \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/orgs/${REPO_OWNER}/repos" \
        -d "{
            \"name\": \"${REPO_NAME}\",
            \"description\": \"AirBear PWA - Solar-Powered Rideshare & Mobile Bodega\",
            \"private\": false,
            \"has_issues\": true,
            \"has_projects\": true,
            \"has_wiki\": false,
            \"auto_init\": false
        }" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
    else
        echo "❌ Failed to create repository. Please create it manually at:"
        echo "   https://github.com/new?org=${REPO_OWNER}&name=${REPO_NAME}"
        exit 1
    fi
fi

echo ""
echo "📝 Next steps:"
echo "   1. Push code: git push -u origin main"
echo "   2. Add secrets in GitHub: Settings > Secrets and variables > Actions"


