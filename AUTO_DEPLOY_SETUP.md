# 🚀 Automatic Deployment Setup - Complete Guide

## Overview

This setup creates a **fully automated CI/CD pipeline** that:
- ✅ **Safely stores** all secrets in GitHub
- ✅ **Automatically syncs** secrets to Vercel
- ✅ **Tests** everything before deploying
- ✅ **Validates** UI/UX and special effects
- ✅ **Deploys** to production automatically
- ✅ **Verifies** deployment is successful

## 🎯 What Gets Automated

### On Every Push to `main`:

1. **Validate** - Checks all environment variables
2. **Test** - Runs unit tests, type checking, linting
3. **Validate UI/UX** - Checks animations and special effects
4. **Build** - Builds the Next.js application
5. **Deploy** - Deploys to Vercel production
6. **Verify** - Checks production site is live
7. **Sync Secrets** - Ensures Vercel has all environment variables

### Manual Workflows:

- **Sync Secrets** - Manually sync secrets to Vercel
- **Emergency Deploy** - Skip tests and deploy immediately
- **Validate UI/UX** - Check UI/UX components are intact

## 📋 Step 1: Add GitHub Secrets

Go to: **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets (10 total):

#### Vercel (3):
1. `VERCEL_TOKEN` - From https://vercel.com/account/tokens
2. `VERCEL_ORG_ID` - From Vercel Dashboard → Settings → General
3. `VERCEL_PROJECT_ID` - From Vercel Dashboard → Project → Settings → General

#### Supabase (3):
4. `NEXT_PUBLIC_SUPABASE_PWA4_URL` - From Supabase Dashboard → Project Settings → API
5. `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY` - From Supabase Dashboard → Project Settings → API
6. `SUPABASE_PWA4_SERVICE_ROLE_KEY` - From Supabase Dashboard → Project Settings → API

#### Stripe (3):
7. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard → Developers → API keys
8. `STRIPE_SECRET_KEY` - From Stripe Dashboard → Developers → API keys
9. `STRIPE_WEBHOOK_SECRET` - From Stripe Dashboard → Developers → Webhooks

#### Site (1):
10. `NEXT_PUBLIC_SITE_URL` - Optional (defaults to `https://airbear.me`)

**See `SETUP_GITHUB_SECRETS.md` for detailed instructions.**

## 📋 Step 2: Initial Secret Sync

After adding all secrets:

1. Go to **Actions** tab in GitHub
2. Select **"Sync Secrets & Environment Variables"** workflow
3. Click **"Run workflow"**
4. Select **"Sync secrets to Vercel: true"**
5. Click **"Run workflow"**

This syncs all secrets to Vercel automatically.

## 📋 Step 3: Test the Workflow

Push a test commit:

```bash
git add .
git commit -m "Test auto-deploy workflow"
git push origin main
```

Watch the workflow run in **Actions** tab. It should:
- ✅ Validate environment variables
- ✅ Run tests
- ✅ Build application
- ✅ Deploy to Vercel
- ✅ Verify deployment

## 🔄 How It Works

### Workflow Files:

1. **`.github/workflows/auto-deploy.yml`**
   - Main deployment workflow
   - Runs on every push to `main`
   - Tests → Builds → Deploys → Verifies

2. **`.github/workflows/sync-secrets.yml`**
   - Secret synchronization workflow
   - Can run manually or daily
   - Syncs GitHub secrets to Vercel

3. **`.github/workflows/validate-ui-ux.yml`**
   - UI/UX validation workflow
   - Checks animations, effects, components
   - Ensures UI stays intact

4. **`.github/workflows/ci-cd.yml`**
   - Existing CI/CD pipeline
   - Updated to use npm instead of pnpm
   - Validates builds and tests

## 🛡️ Security Features

- ✅ **Secrets stored securely** in GitHub Secrets
- ✅ **Never exposed** in logs or code
- ✅ **Automatic syncing** to Vercel
- ✅ **Validation** before deployment
- ✅ **Verification** after deployment

## 📊 Workflow Status

You can check workflow status:
- **GitHub Actions** tab → See all workflow runs
- **Green checkmark** = Success
- **Red X** = Failed (check logs)

## 🚨 Emergency Deploy

If you need to deploy immediately without tests:

1. Go to **Actions** → **Auto Deploy to Production**
2. Click **"Run workflow"**
3. Check **"Skip tests (emergency deploy)"**
4. Click **"Run workflow"**

## 🔍 Monitoring

### Check Deployment Status:
- **GitHub Actions** → See workflow runs
- **Vercel Dashboard** → See deployments
- **Production Site** → https://airbear.me

### Check Secrets Status:
- **GitHub** → Settings → Secrets → See all secrets
- **Vercel** → Project → Settings → Environment Variables → See synced variables

## ✅ Verification Checklist

After setup, verify:

- [ ] All 10 secrets added to GitHub
- [ ] Secrets synced to Vercel (run sync workflow)
- [ ] Test commit pushed and workflow ran successfully
- [ ] Production site updated: https://airbear.me
- [ ] UI/UX effects working (animations, map, etc.)
- [ ] OAuth working (Google/Apple sign-in)
- [ ] Health endpoint working: https://airbear.me/api/health

## 🎉 Result

After setup:
- ✅ **Every push to `main`** = Automatic test → build → deploy
- ✅ **Secrets automatically synced** to Vercel
- ✅ **UI/UX validated** before deployment
- ✅ **Production always up-to-date**
- ✅ **No manual deployment steps needed**

---

**Setup complete! Your app will now automatically deploy on every push!** 🚀



