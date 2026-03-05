#!/bin/bash

# AirBear PWA - Complete Deployment Script
# One command to deploy everything to production

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

clear
echo -e "${BLUE}${BOLD}"
cat << "EOF"
   ___  _      ___                 
  / _ \(_)____/ _ )___ ___ ________
 / __ / / __/ _  / -_) _ `/ __/__|
/_/ /_/_/_/ /____/\__/\_,_/_/ /___/
                                    
  PWA Deployment to airbear.me
EOF
echo -e "${NC}"

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1/5: Checking prerequisites...${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pnpm $(pnpm --version)${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ git $(git --version | cut -d' ' -f3)${NC}"

echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2/5: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Step 3: Run verification
echo -e "${YELLOW}Step 3/5: Running verification tests...${NC}"
chmod +x scripts/final-check.sh
if ./scripts/final-check.sh; then
    echo -e "${GREEN}✓ All verification tests passed${NC}"
else
    echo -e "${RED}✗ Verification failed. Please fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Step 4: Sync to GitHub
echo -e "${YELLOW}Step 4/5: Syncing to GitHub...${NC}"
chmod +x scripts/sync-github.sh
pnpm run sync:github

echo -e "${GREEN}✓ Code pushed to GitHub${NC}"
echo ""

# Step 5: Monitor deployment
echo -e "${YELLOW}Step 5/5: Monitoring deployment...${NC}"
echo ""
echo -e "${BLUE}GitHub Actions is now deploying your app!${NC}"
echo ""
echo "Monitor deployment at:"
echo -e "${BOLD}https://github.com/airbearme/pwa4/actions${NC}"
echo ""
echo "Your app will be live at:"
echo -e "${BOLD}${GREEN}https://airbear.me${NC}"
echo ""
echo -e "${YELLOW}Waiting for deployment to complete (this may take 2-3 minutes)...${NC}"

# Wait a bit for GitHub Actions to start
sleep 10

# Check if site is accessible (basic check)
echo -e "${BLUE}Testing if site is accessible...${NC}"
sleep 30  # Give it time to deploy

if curl -sSf https://airbear.me > /dev/null 2>&1; then
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║   🎉 DEPLOYMENT SUCCESSFUL! 🎉        ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo "Your app is live at: https://airbear.me"
    echo ""
    echo "Next steps:"
    echo "  1. Test real-time map: https://airbear.me/map"
    echo "  2. Test authentication: https://airbear.me/auth/login"
    echo "  3. Test payments: https://airbear.me/products"
    echo ""
    echo "Run comprehensive tests:"
    echo "  pnpm run test:production https://airbear.me"
    echo ""
else
    echo -e "${YELLOW}"
    echo "⚠️  Deployment in progress..."
    echo ""
    echo "Your site will be available shortly at:"
    echo "https://airbear.me"
    echo ""
    echo "Check deployment status:"
    echo "https://github.com/airbearme/pwa4/actions"
    echo -e "${NC}"
fi

echo ""
echo -e "${GREEN}Deployment process complete!${NC}"
echo ""
