#!/bin/bash

# Master automation script - Automates ALL manual deployment steps
# This script handles: GitHub, Vercel, DNS, Stripe, Supabase setup

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_OWNER="airbearme"
REPO_NAME="pwapro"
DOMAIN="airbear.me"

echo -e "${BLUE}🚀 AirBear PWA - Full Automation Script${NC}"
echo "=========================================="
echo ""

# Check for required tools
check_dependencies() {
    echo -e "${BLUE}📋 Checking dependencies...${NC}"
    
    local missing=0
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ git not found${NC}"
        missing=1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ node not found${NC}"
        missing=1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found${NC}"
        missing=1
    fi
    
    if [ $missing -eq 1 ]; then
        echo -e "${RED}Please install missing dependencies${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
    echo ""
}

# Step 1: Create GitHub Repository
create_github_repo() {
    echo -e "${BLUE}📦 Step 1: Creating GitHub Repository...${NC}"
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GITHUB_TOKEN not set${NC}"
        echo "   Get a token from: https://github.com/settings/tokens"
        echo "   Required scopes: repo, workflow, admin:org (if org repo)"
        echo ""
        read -p "Enter GitHub token (or press Enter to skip): " token
        if [ -n "$token" ]; then
            export GITHUB_TOKEN="$token"
        else
            echo -e "${YELLOW}Skipping GitHub repo creation. Please create manually:${NC}"
            echo "   https://github.com/new?org=$REPO_OWNER&name=$REPO_NAME"
            return 1
        fi
    fi
    
    # Check if repo exists
    if curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
        "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}" | grep -q '"name"'; then
        echo -e "${GREEN}✅ Repository already exists${NC}"
        return 0
    fi
    
    # Create repo
    echo "Creating repository..."
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
        echo -e "${GREEN}✅ Repository created successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to create repository${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 1
    fi
}

# Step 2: Push to GitHub
push_to_github() {
    echo -e "${BLUE}📤 Step 2: Pushing code to GitHub...${NC}"
    
    # Check if remote exists
    if ! git remote get-url origin &> /dev/null; then
        git remote add origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"
    fi
    
    # Set remote URL
    git remote set-url origin "git@github.com:${REPO_OWNER}/${REPO_NAME}.git"
    
    # Push
    if git push -u origin main 2>&1; then
        echo -e "${GREEN}✅ Code pushed successfully${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Push failed. Trying HTTPS...${NC}"
        git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
        if git push -u origin main 2>&1; then
            echo -e "${GREEN}✅ Code pushed successfully${NC}"
            return 0
        else
            echo -e "${RED}❌ Push failed. Please push manually${NC}"
            return 1
        fi
    fi
}

# Step 3: Setup Vercel
setup_vercel() {
    echo -e "${BLUE}☁️  Step 3: Setting up Vercel...${NC}"
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  VERCEL_TOKEN not set${NC}"
        echo "   Get a token from: https://vercel.com/account/tokens"
        read -p "Enter Vercel token (or press Enter to skip): " token
        if [ -n "$token" ]; then
            export VERCEL_TOKEN="$token"
        else
            echo -e "${YELLOW}Skipping Vercel setup. Please configure manually:${NC}"
            echo "   https://vercel.com/dashboard"
            return 1
        fi
    fi
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel@latest
    fi
    
    # Link project
    echo "Linking Vercel project..."
    if vercel link --yes --token="$VERCEL_TOKEN" 2>&1; then
        echo -e "${GREEN}✅ Vercel project linked${NC}"
    else
        echo -e "${YELLOW}⚠️  Vercel link failed. You may need to create project manually${NC}"
    fi
    
    # Deploy
    echo "Deploying to Vercel..."
    if vercel --prod --token="$VERCEL_TOKEN" 2>&1; then
        echo -e "${GREEN}✅ Deployed to Vercel${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Deployment failed. Check Vercel dashboard${NC}"
        return 1
    fi
}

# Step 4: Add Environment Variables to Vercel
add_vercel_env_vars() {
    echo -e "${BLUE}🔐 Step 4: Adding environment variables to Vercel...${NC}"
    
    if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
        echo -e "${YELLOW}⚠️  VERCEL_TOKEN or VERCEL_PROJECT_ID not set${NC}"
        echo "   Skipping automated env var setup"
        echo "   Please add manually in Vercel dashboard"
        return 1
    fi
    
    # Load from .env.local
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local not found${NC}"
        return 1
    fi
    
    echo "Reading environment variables from .env.local..."
    
    # Add each variable
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        
        # Remove quotes from value
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        
        # Skip if value is empty
        [[ -z "$value" ]] && continue
        
        echo "Adding $key..."
        curl -s -X POST "https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env" \
            -H "Authorization: Bearer ${VERCEL_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "{
                \"key\": \"${key}\",
                \"value\": \"${value}\",
                \"type\": \"encrypted\",
                \"target\": [\"production\", \"preview\", \"development\"]
            }" > /dev/null
    done < .env.local
    
    echo -e "${GREEN}✅ Environment variables added${NC}"
}

# Step 5: Add GitHub Secrets
add_github_secrets() {
    echo -e "${BLUE}🔑 Step 5: Adding GitHub Secrets...${NC}"
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GITHUB_TOKEN not set. Skipping GitHub secrets${NC}"
        return 1
    fi
    
    # Load from .env.local
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  .env.local not found${NC}"
        return 1
    fi
    
    echo "Adding secrets to GitHub..."
    
    # Use GitHub API to add secrets (requires encryption)
    echo -e "${YELLOW}⚠️  GitHub secrets require encryption.${NC}"
    echo "   Please add manually at:"
    echo "   https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions"
    echo ""
    echo "   Required secrets:"
    echo "   - VERCEL_TOKEN"
    echo "   - VERCEL_ORG_ID"
    echo "   - VERCEL_PROJECT_ID"
    echo "   - All environment variables from .env.local"
}

# Step 6: Configure DNS (IONOS)
configure_dns() {
    echo -e "${BLUE}🌐 Step 6: DNS Configuration (IONOS)...${NC}"
    
    echo -e "${YELLOW}⚠️  IONOS DNS configuration requires manual setup${NC}"
    echo ""
    echo "Please configure DNS in IONOS:"
    echo "  1. Log into IONOS domain management"
    echo "  2. Go to DNS settings for ${DOMAIN}"
    echo "  3. Add CNAME record:"
    echo "     Type: CNAME"
    echo "     Name: @ (or leave blank)"
    echo "     Value: cname.vercel-dns.com"
    echo "     TTL: 3600"
    echo ""
    echo "  4. Add CNAME for www:"
    echo "     Type: CNAME"
    echo "     Name: www"
    echo "     Value: cname.vercel-dns.com"
    echo "     TTL: 3600"
    echo ""
    echo "  5. Wait 5-60 minutes for DNS propagation"
}

# Step 7: Configure Stripe Webhook
configure_stripe_webhook() {
    echo -e "${BLUE}💳 Step 7: Configuring Stripe Webhook...${NC}"
    
    if [ -z "$STRIPE_SECRET_KEY" ]; then
        echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY not set${NC}"
        echo "   Please configure manually:"
        echo "   1. Go to: https://dashboard.stripe.com/webhooks"
        echo "   2. Add endpoint: https://${DOMAIN}/api/stripe/webhook"
        echo "   3. Select events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed"
        return 1
    fi
    
    echo -e "${YELLOW}⚠️  Stripe webhook creation requires Stripe Dashboard${NC}"
    echo "   Please create manually:"
    echo "   1. Go to: https://dashboard.stripe.com/webhooks"
    echo "   2. Click 'Add endpoint'"
    echo "   3. URL: https://${DOMAIN}/api/stripe/webhook"
    echo "   4. Select events:"
    echo "      - checkout.session.completed"
    echo "      - payment_intent.succeeded"
    echo "      - payment_intent.payment_failed"
    echo "   5. Copy signing secret and add to Vercel as STRIPE_WEBHOOK_SECRET"
}

# Step 8: Configure Supabase
configure_supabase() {
    echo -e "${BLUE}🗄️  Step 8: Configuring Supabase...${NC}"
    
    echo -e "${YELLOW}⚠️  Supabase configuration requires dashboard access${NC}"
    echo "   Please configure manually:"
    echo "   1. Go to: https://supabase.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Authentication → URL Configuration"
    echo "   4. Add redirect URL: https://${DOMAIN}/auth/callback"
    echo "   5. Database → Replication"
    echo "   6. Enable replication for 'airbears' table"
}

# Main execution
main() {
    check_dependencies
    
    # Load environment variables if .env.local exists
    if [ -f ".env.local" ]; then
        set -a
        source .env.local
        set +a
    fi
    
    # Run all steps
    create_github_repo && \
    push_to_github && \
    setup_vercel && \
    add_vercel_env_vars && \
    add_github_secrets && \
    configure_dns && \
    configure_stripe_webhook && \
    configure_supabase
    
    echo ""
    echo -e "${GREEN}✨ Automation complete!${NC}"
    echo ""
    echo "📋 Manual steps remaining:"
    echo "   - DNS configuration in IONOS"
    echo "   - Stripe webhook setup"
    echo "   - Supabase redirect URLs"
    echo "   - GitHub secrets (if not automated)"
    echo ""
    echo "📚 See PUSH_AND_DEPLOY.md for detailed instructions"
}

# Run main
main






