#!/bin/bash

# Automated GitHub repository creation and secrets setup
# Requires: GITHUB_TOKEN environment variable

set -e

REPO_OWNER="airbearme"
REPO_NAME="pwapro"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable required"
    echo "   Get token from: https://github.com/settings/tokens"
    echo "   Required scopes: repo, workflow, admin:org"
    exit 1
fi

echo "🚀 Creating GitHub repository: ${REPO_OWNER}/${REPO_NAME}"

# Check if repo exists
if curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}" | grep -q '"name"'; then
    echo "✅ Repository already exists"
else
    # Create repository
    response=$(curl -s -X POST \
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
        }")
    
    if echo "$response" | grep -q '"name"'; then
        echo "✅ Repository created successfully"
    else
        echo "❌ Failed to create repository"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        exit 1
    fi
fi

echo ""
echo "📝 Next: Push code with: git push -u origin main"






