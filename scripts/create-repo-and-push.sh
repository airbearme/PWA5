#!/bin/bash

# One-Click Script: Create GitHub Repo and Push Code
# This script creates the GitHub repository and pushes all code

set -e

REPO_OWNER="airbearme"
REPO_NAME="pwapro"
REPO_DESC="AirBear PWA - Solar-Powered Rideshare & Mobile Bodega"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Creating GitHub Repository and Pushing Code${NC}"
echo "=============================================="
echo ""

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  GITHUB_TOKEN not set${NC}"
    echo ""
    echo "To create the repo automatically, you need a GitHub token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Scopes needed: repo, workflow, admin:org"
    echo "4. Copy the token"
    echo ""
    read -p "Enter GitHub token (or press Enter to skip auto-creation): " token
    if [ -n "$token" ]; then
        export GITHUB_TOKEN="$token"
    else
        echo ""
        echo -e "${YELLOW}Manual creation required:${NC}"
        echo "1. Go to: https://github.com/new"
        echo "2. Owner: ${REPO_OWNER}"
        echo "3. Name: ${REPO_NAME}"
        echo "4. Description: ${REPO_DESC}"
        echo "5. Public visibility"
        echo "6. DO NOT check README, .gitignore, or license"
        echo "7. Click 'Create repository'"
        echo ""
        read -p "Press Enter after creating the repository..."
    fi
fi

# Create repository if token is available
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${BLUE}📦 Creating GitHub repository...${NC}"
    
    # Check if repo already exists
    if curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}" | grep -q '"name"'; then
        echo -e "${GREEN}✅ Repository already exists${NC}"
    else
        # Create repository
        response=$(curl -s -X POST \
            -H "Authorization: token ${GITHUB_TOKEN}" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/orgs/${REPO_OWNER}/repos" \
            -d "{
                \"name\": \"${REPO_NAME}\",
                \"description\": \"${REPO_DESC}\",
                \"private\": false,
                \"has_issues\": true,
                \"has_projects\": true,
                \"has_wiki\": false,
                \"auto_init\": false
            }")
        
        if echo "$response" | grep -q '"name"'; then
            echo -e "${GREEN}✅ Repository created successfully!${NC}"
        else
            echo -e "${RED}❌ Failed to create repository${NC}"
            echo "$response" | jq '.' 2>/dev/null || echo "$response"
            echo ""
            echo "Trying manual creation..."
            echo "1. Go to: https://github.com/new"
            echo "2. Owner: ${REPO_OWNER}, Name: ${REPO_NAME}"
            read -p "Press Enter after creating the repository..."
        fi
    fi
fi

# Push code
echo ""
echo -e "${BLUE}📤 Pushing code to GitHub...${NC}"

# Ensure remote is set
if ! git remote get-url origin &> /dev/null; then
    git remote add origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"
fi

# Set remote URL
git remote set-url origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"

# Try SSH first, fallback to HTTPS
if git push -u origin main 2>&1; then
    echo -e "${GREEN}✅ Code pushed successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  SSH push failed, trying HTTPS...${NC}"
    git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
    if git push -u origin main 2>&1; then
        echo -e "${GREEN}✅ Code pushed successfully via HTTPS!${NC}"
    else
        echo -e "${RED}❌ Push failed${NC}"
        echo "You may need to:"
        echo "1. Set up SSH keys, or"
        echo "2. Use GitHub CLI: gh auth login"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✨ Repository created and code pushed!${NC}"
echo ""
echo "🔗 Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}"
echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Import: ${REPO_OWNER}/${REPO_NAME}"
echo "4. Add environment variables"
echo "5. Deploy!"
echo ""
echo "Or run: bash scripts/one-click-deploy.sh (if VERCEL_TOKEN is set)"
echo ""

