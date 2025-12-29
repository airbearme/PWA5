#!/bin/bash

# AirBear PWA Production Deployment Script
# Usage: ./scripts/deploy.sh [production|preview]

set -e

ENVIRONMENT=${1:-production}
REPO_URL="https://github.com/airbearme/pwa4.git"

echo "🚀 Starting AirBear PWA deployment to $ENVIRONMENT..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ git is required${NC}"; exit 1; }

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔍 Running type checks...${NC}"
npm run type-check

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🧪 Running health checks...${NC}"
# Add test commands here when implemented
# npm run test

echo -e "${YELLOW}📤 Committing changes...${NC}"
git add .
git commit -m "Deploy to $ENVIRONMENT - $(date +%Y-%m-%d_%H:%M:%S)" || echo "No changes to commit"

echo -e "${YELLOW}🌐 Pushing to GitHub...${NC}"
git push origin main

if [ "$ENVIRONMENT" = "production" ]; then
  echo -e "${GREEN}✅ Deployment to production initiated!${NC}"
  echo -e "${GREEN}🔗 Your site will be live at: https://airbear.me${NC}"
  echo -e "${YELLOW}⏳ Vercel is building and deploying...${NC}"
  echo -e "${YELLOW}📊 Check status: https://vercel.com/dashboard${NC}"
else
  echo -e "${GREEN}✅ Deployment to preview initiated!${NC}"
  echo -e "${YELLOW}🔗 Preview URL will be available in Vercel dashboard${NC}"
fi

echo -e "${GREEN}✨ Deployment script completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Monitor deployment in Vercel dashboard"
echo "2. Test health endpoint: curl https://airbear.me/api/health"
echo "3. Verify all features working"
echo "4. Check error logs if issues occur"
