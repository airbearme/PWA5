#!/bin/bash

# Final Pre-Deployment Check for AirBear PWA
# Runs all tests and verifications before pushing to production

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   🐻 AirBear PWA Final Check          ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

ERRORS=0

# Check 1: TypeScript
echo -n "1. TypeScript type checking... "
if pnpm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Lint
echo -n "2. ESLint checking... "
if pnpm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ WARNINGS${NC}"
fi

# Check 3: Build
echo -n "3. Production build... "
if pnpm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Environment Variables
echo -n "4. Environment variables... "
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_PWA4_URL"
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

MISSING_VARS=0
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        MISSING_VARS=$((MISSING_VARS + 1))
    fi
done

if [ $MISSING_VARS -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ $MISSING_VARS missing${NC}"
fi

# Check 5: Git Status
echo -n "5. Git repository clean... "
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ Uncommitted changes${NC}"
fi

# Check 6: Package.json valid
echo -n "6. Package.json valid... "
if node -e "require('./package.json')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 7: Dependencies installed
echo -n "7. Dependencies installed... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check 8: Critical files exist
echo -n "8. Critical files exist... "
CRITICAL_FILES=(
    "app/layout.tsx"
    "app/page.tsx"
    "app/map/page.tsx"
    "app/auth/login/page.tsx"
    "app/products/page.tsx"
    "components/map-view.tsx"
    "lib/supabase/client.ts"
    "lib/supabase/server.ts"
    ".github/workflows/deploy.yml"
)

MISSING_FILES=0
for FILE in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$FILE" ]; then
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ $MISSING_FILES missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "─────────────────────────────────────────"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Ready to deploy to production!"
    echo ""
    echo "Next steps:"
    echo "  1. pnpm run sync:github     # Push to GitHub"
    echo "  2. Monitor GitHub Actions  # Watch deployment"
    echo "  3. pnpm run test:production # Verify live site"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $ERRORS critical error(s) found${NC}"
    echo ""
    echo "Please fix errors before deploying."
    echo ""
    exit 1
fi
