#!/bin/bash
# Quick repo creation - tries multiple methods

REPO_OWNER="airbearme"
REPO_NAME="pwapro"

echo "🚀 Creating GitHub repository..."

# Method 1: GitHub CLI
if command -v gh &> /dev/null; then
    echo "Trying GitHub CLI..."
    if gh repo create ${REPO_OWNER}/${REPO_NAME} --public --description "AirBear PWA - Solar-Powered Rideshare & Mobile Bodega" --source=. --remote=origin --push 2>&1; then
        echo "✅ Created and pushed via GitHub CLI!"
        exit 0
    fi
fi

# Method 2: Manual instructions
echo ""
echo "📝 Manual creation required:"
echo "1. Go to: https://github.com/new"
echo "2. Owner: ${REPO_OWNER}"
echo "3. Name: ${REPO_NAME}"
echo "4. Public, no README/.gitignore/license"
echo "5. Click 'Create repository'"
echo ""
echo "Then run: git push -u origin main"
