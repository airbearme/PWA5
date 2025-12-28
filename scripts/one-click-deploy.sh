#!/bin/bash

# One-Click Deployment Script
# Automates: GitHub, Vercel, Environment Variables, Webhooks

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 AirBear PWA - One-Click Deployment${NC}"
echo "======================================"
echo ""

# Check for required environment variables
check_env() {
    local missing=0
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GITHUB_TOKEN not set${NC}"
        missing=1
    fi
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  VERCEL_TOKEN not set${NC}"
        missing=1
    fi
    
    if [ $missing -eq 1 ]; then
        echo ""
        echo "Required environment variables:"
        echo "  GITHUB_TOKEN - Get from: https://github.com/settings/tokens"
        echo "  VERCEL_TOKEN - Get from: https://vercel.com/account/tokens"
        echo ""
        echo "Optional (for full automation):"
        echo "  STRIPE_SECRET_KEY - For webhook automation"
        echo "  VERCEL_PROJECT_ID - Auto-detected if not set"
        echo "  VERCEL_ORG_ID - Auto-detected if not set"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Load .env.local if exists
if [ -f ".env.local" ]; then
    echo -e "${BLUE}📋 Loading environment variables from .env.local...${NC}"
    set -a
    source .env.local
    set +a
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
    echo ""
fi

check_env

# Step 1: Create GitHub repo
echo -e "${BLUE}📦 Step 1: GitHub Repository...${NC}"
if [ -n "$GITHUB_TOKEN" ]; then
    bash scripts/setup-github-api.sh
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping (GITHUB_TOKEN not set)${NC}"
    echo ""
fi

# Step 2: Push code
echo -e "${BLUE}📤 Step 2: Pushing code...${NC}"
if git push -u origin main 2>&1; then
    echo -e "${GREEN}✅ Code pushed${NC}"
else
    echo -e "${YELLOW}⚠️  Push failed or already up to date${NC}"
fi
echo ""

# Step 3: Setup Vercel
echo -e "${BLUE}☁️  Step 3: Vercel Setup...${NC}"
if [ -n "$VERCEL_TOKEN" ]; then
    bash scripts/setup-vercel-api.sh
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping (VERCEL_TOKEN not set)${NC}"
    echo ""
fi

# Step 4: Setup Stripe webhook
echo -e "${BLUE}💳 Step 4: Stripe Webhook...${NC}"
if [ -n "$STRIPE_SECRET_KEY" ]; then
    bash scripts/setup-stripe-webhook.sh
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping (STRIPE_SECRET_KEY not set)${NC}"
    echo "   Configure manually: https://dashboard.stripe.com/webhooks"
    echo ""
fi

# Step 5: Setup Supabase
echo -e "${BLUE}🗄️  Step 5: Supabase Configuration...${NC}"
if [ -n "$SUPABASE_PWA4_SERVICE_ROLE_KEY" ] && [ -n "$NEXT_PUBLIC_SUPABASE_PWA4_URL" ]; then
    bash scripts/setup-supabase-api.sh
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping (Supabase env vars not set)${NC}"
    echo "   Configure manually in Supabase dashboard"
    echo ""
fi

# Summary
echo -e "${GREEN}✨ Deployment automation complete!${NC}"
echo ""
echo "📋 Remaining manual steps:"
echo "   - DNS configuration in IONOS (CNAME to cname.vercel-dns.com)"
echo "   - Verify Vercel deployment"
echo "   - Test OAuth flows"
echo "   - Test payments"
echo ""
echo "🔗 Quick links:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - GitHub: https://github.com/airbearme/pwapro"
echo "   - Stripe: https://dashboard.stripe.com/webhooks"
echo "   - Supabase: https://supabase.com/dashboard"
echo ""


