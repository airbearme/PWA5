#!/bin/bash

# Production Deployment Script for AirBear PWA
# This script validates and prepares for production deployment

set -e

echo "🚀 AirBear PWA - Production Deployment Preparation"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Validate Environment Variables
echo "📋 Step 1: Validating environment variables..."
if pnpm run validate:env; then
    echo -e "${GREEN}✅ Environment variables validated${NC}"
else
    echo -e "${RED}❌ Environment variable validation failed${NC}"
    exit 1
fi
echo ""

# Step 2: Type Check
echo "📋 Step 2: Running TypeScript type check..."
if pnpm run type-check; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${RED}❌ Type check failed${NC}"
    exit 1
fi
echo ""

# Step 3: Lint
echo "📋 Step 3: Running ESLint..."
if pnpm run lint; then
    echo -e "${GREEN}✅ Lint passed${NC}"
else
    echo -e "${YELLOW}⚠️  Lint has warnings (non-blocking)${NC}"
fi
echo ""

# Step 4: Build
echo "📋 Step 4: Building production bundle..."
if pnpm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Check for production readiness
echo "📋 Step 5: Production readiness checks..."

# Check for console.log in production code (should be minimal)
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.ts" --include="*.tsx" app lib components 2>/dev/null | grep -v "node_modules" | wc -l || echo "0")
if [ "$CONSOLE_LOGS" -gt "5" ]; then
    echo -e "${YELLOW}⚠️  Found $CONSOLE_LOGS console.log statements (consider removing for production)${NC}"
else
    echo -e "${GREEN}✅ Console.log usage is minimal${NC}"
fi

# Check for TODO/FIXME in production code
TODOS=$(grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx" app lib components 2>/dev/null | wc -l || echo "0")
if [ "$TODOS" -gt "0" ]; then
    echo -e "${YELLOW}⚠️  Found $TODOS TODO/FIXME comments${NC}"
fi

echo ""
echo -e "${GREEN}✨ Production deployment preparation complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Push to GitHub: git push origin main"
echo "   2. Vercel will auto-deploy via GitHub Actions"
echo "   3. Configure DNS in IONOS (see docs/PRODUCTION_DEPLOYMENT.md)"
echo "   4. Set up Stripe webhook endpoint"
echo "   5. Verify Supabase redirect URLs"
echo ""
echo "📚 Documentation:"
echo "   - Production Deployment: docs/PRODUCTION_DEPLOYMENT.md"
echo "   - UI/UX Preservation: docs/UI_UX_PRESERVATION.md"
echo ""






