# 🤖 Fully Automated Deployment

## One-Click Deployment

All manual steps are now automated! Run a single command to deploy everything.

## Quick Start

### Option 1: Full Automation (Recommended)

```bash
# Set required tokens
export GITHUB_TOKEN=your_github_token
export VERCEL_TOKEN=your_vercel_token

# Optional (for webhook automation)
export STRIPE_SECRET_KEY=your_stripe_secret_key

# Run one-click deployment
bash scripts/one-click-deploy.sh
```

### Option 2: Step-by-Step Automation

```bash
# 1. Create GitHub repo
export GITHUB_TOKEN=your_token
bash scripts/setup-github-api.sh

# 2. Push code
git push -u origin main

# 3. Setup Vercel
export VERCEL_TOKEN=your_token
bash scripts/setup-vercel-api.sh

# 4. Setup Stripe webhook (optional)
export STRIPE_SECRET_KEY=your_key
bash scripts/setup-stripe-webhook.sh

# 5. Setup Supabase (instructions)
bash scripts/setup-supabase-api.sh
```

## Required Tokens

### GitHub Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Scopes needed:
   - ✅ `repo` (full control)
   - ✅ `workflow` (update GitHub Actions)
   - ✅ `admin:org` (if creating org repo)
4. Copy token → `export GITHUB_TOKEN=ghp_...`

### Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "AirBear PWA Deployment"
4. Copy token → `export VERCEL_TOKEN=...`

### Stripe Secret Key (Optional)
- Already in your `.env.local` as `STRIPE_SECRET_KEY`
- Used for automated webhook creation

## What Gets Automated

### ✅ Fully Automated

1. **GitHub Repository Creation**
   - Creates `airbearme/pwapro` automatically
   - Sets description, visibility, settings

2. **Code Push**
   - Pushes all commits to `main` branch
   - Sets up remote automatically

3. **Vercel Project Setup**
   - Links/creates Vercel project
   - Gets project ID automatically
   - Deploys to production

4. **Environment Variables**
   - Reads from `.env.local`
   - Adds all variables to Vercel automatically
   - Sets for production, preview, development

5. **Stripe Webhook** (if STRIPE_SECRET_KEY set)
   - Creates webhook endpoint automatically
   - Configures events
   - Returns signing secret

### ⚠️ Partially Automated (Instructions Provided)

6. **DNS Configuration**
   - Script provides exact instructions
   - IONOS API not publicly available
   - Takes 2 minutes to configure manually

7. **Supabase Redirect URLs**
   - Script provides exact instructions
   - Requires dashboard access
   - Takes 1 minute to configure manually

8. **GitHub Secrets**
   - Instructions provided
   - Requires encryption (GitHub API limitation)
   - Can be automated with GitHub CLI if installed

## Complete Automation Script

The `scripts/one-click-deploy.sh` script handles everything:

```bash
#!/bin/bash
export GITHUB_TOKEN=your_token
export VERCEL_TOKEN=your_token
bash scripts/one-click-deploy.sh
```

**What it does:**
1. ✅ Creates GitHub repository
2. ✅ Pushes code
3. ✅ Sets up Vercel project
4. ✅ Adds environment variables
5. ✅ Creates Stripe webhook
6. ✅ Provides Supabase instructions
7. ✅ Provides DNS instructions

## After Automation

Once automated setup completes:

1. **Configure DNS** (2 min)
   - IONOS → DNS → Add CNAME: `@` → `cname.vercel-dns.com`

2. **Verify Deployment**
   - Check Vercel dashboard
   - Visit deployment URL
   - Test OAuth, map, payments

3. **Add Domain in Vercel**
   - Settings → Domains → Add `airbear.me`

## Troubleshooting

### GitHub Token Issues
```bash
# Test token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### Vercel Token Issues
```bash
# Test token
vercel whoami --token=$VERCEL_TOKEN
```

### Webhook Creation Fails
- Check Stripe secret key is correct
- Verify domain is accessible
- Check Stripe API rate limits

## Manual Fallback

If automation fails, see `PUSH_AND_DEPLOY.md` for manual steps.

## Next Steps After Automation

1. **Wait for DNS propagation** (5-60 min)
2. **Test the deployment**
3. **Monitor via Vercel Analytics**
4. **Set up monitoring/alerts**

---

**Status:** 🚀 **Fully Automated** (except DNS and Supabase redirect URLs which require dashboard access)






