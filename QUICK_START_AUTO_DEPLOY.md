# ⚡ Quick Start - Auto Deploy Setup

## 🎯 Goal
Set up automatic deployment so every push to `main` automatically tests, builds, and deploys to production.

## ⚡ 5-Minute Setup

### Step 1: Add GitHub Secrets (5 min)

Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

Add these 10 secrets:

**Vercel:**
- `VERCEL_TOKEN` → https://vercel.com/account/tokens
- `VERCEL_ORG_ID` → Vercel Dashboard → Settings → General
- `VERCEL_PROJECT_ID` → Vercel Dashboard → Project → Settings → General

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_PWA4_URL` → Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY` → Supabase Dashboard → Project Settings → API
- `SUPABASE_PWA4_SERVICE_ROLE_KEY` → Supabase Dashboard → Project Settings → API

**Stripe:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Stripe Dashboard → Developers → API keys
- `STRIPE_SECRET_KEY` → Stripe Dashboard → Developers → API keys
- `STRIPE_WEBHOOK_SECRET` → Stripe Dashboard → Developers → Webhooks

**Site:**
- `NEXT_PUBLIC_SITE_URL` → `https://airbear.me` (or leave default)

### Step 2: Sync Secrets to Vercel (1 min)

1. Go to **Actions** tab
2. Select **"Sync Secrets & Environment Variables"**
3. Click **"Run workflow"**
4. Click **"Run workflow"** button

### Step 3: Test (1 min)

```bash
git add .
git commit -m "Setup auto-deploy workflow"
git push origin main
```

Watch it deploy automatically! 🎉

## ✅ What Happens Now

**Every time you push to `main`:**
1. ✅ Validates environment variables
2. ✅ Runs tests
3. ✅ Validates UI/UX effects
4. ✅ Builds application
5. ✅ Deploys to Vercel
6. ✅ Verifies deployment
7. ✅ Syncs secrets to Vercel

**Result:** Production site automatically updates! 🚀

## 📚 Full Documentation

- **Complete Setup**: `SETUP_GITHUB_SECRETS.md`
- **Auto Deploy Guide**: `AUTO_DEPLOY_SETUP.md`
- **Workflow Details**: `.github/workflows/auto-deploy.yml`

## 🆘 Troubleshooting

**Workflow fails?**
- Check all secrets are added
- Verify secret names match exactly
- Check Actions tab for error details

**Secrets not syncing?**
- Run "Sync Secrets" workflow manually
- Check Vercel token permissions

**Deployment not working?**
- Verify Vercel project ID is correct
- Check Vercel token is valid

---

**That's it! Your app now auto-deploys on every push!** ✨




