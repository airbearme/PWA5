# 🚀 Automated Deployment - Quick Start

## One Command Deployment

```bash
# Set tokens (one-time setup)
export GITHUB_TOKEN=your_github_token
export VERCEL_TOKEN=your_vercel_token

# Deploy everything
bash scripts/one-click-deploy.sh
```

That's it! 🎉

## What Gets Automated

✅ **GitHub Repository** - Created automatically  
✅ **Code Push** - Pushed automatically  
✅ **Vercel Project** - Created and linked automatically  
✅ **Environment Variables** - Added to Vercel automatically  
✅ **Stripe Webhook** - Created automatically (if STRIPE_SECRET_KEY set)  
✅ **Deployment** - Deploys to production automatically  

## Get Your Tokens (5 minutes)

### GitHub Token
1. https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Scopes: `repo`, `workflow`, `admin:org`
4. Copy token

### Vercel Token
1. https://vercel.com/account/tokens
2. "Create Token"
3. Copy token

## Run Deployment

```bash
# Load tokens
export GITHUB_TOKEN=ghp_your_token_here
export VERCEL_TOKEN=your_vercel_token_here

# Optional: For Stripe webhook automation
export STRIPE_SECRET_KEY=sk_live_...  # Already in .env.local

# Deploy!
bash scripts/one-click-deploy.sh
```

## After Automation

Only 2 manual steps remain (can't be fully automated):

1. **DNS in IONOS** (2 min)
   - Add CNAME: `@` → `cname.vercel-dns.com`

2. **Supabase Redirect URL** (1 min)
   - Dashboard → Auth → Add `https://airbear.me/auth/callback`

## What Happens

```
Run script
    ↓
Creates GitHub repo
    ↓
Pushes code
    ↓
Creates Vercel project
    ↓
Adds all env vars
    ↓
Creates Stripe webhook
    ↓
Deploys to production
    ↓
✅ Live in ~5 minutes!
```

## Troubleshooting

**Token not working?**
- Check token has correct scopes
- Verify token hasn't expired
- Test: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user`

**Vercel link fails?**
- Make sure you're logged in: `vercel login`
- Check token is valid

**Webhook creation fails?**
- Verify domain is accessible
- Check Stripe API key is correct

## Full Documentation

- `AUTOMATED_DEPLOYMENT.md` - Complete automation guide
- `scripts/one-click-deploy.sh` - Main automation script
- `PUSH_AND_DEPLOY.md` - Manual fallback guide

---

**Ready to deploy?** Just run the one command above! 🚀





