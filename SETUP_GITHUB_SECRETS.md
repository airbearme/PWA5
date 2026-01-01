# 🔐 Setup GitHub Secrets for Auto-Deploy

This guide will help you set up all the required secrets in GitHub so that your application automatically deploys, tests, and syncs everything together.

## 📋 Required GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Vercel Secrets (Required)

1. **`VERCEL_TOKEN`**
   - Get from: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: `GitHub Actions Deploy`
   - Scope: Full Account
   - Copy the token

2. **`VERCEL_ORG_ID`**
   - Get from: https://vercel.com/account
   - Or run: `vercel whoami` → Check your account
   - Or: Vercel Dashboard → Settings → General → Team ID

3. **`VERCEL_PROJECT_ID`**
   - Get from: Vercel Dashboard → Your Project → Settings → General
   - Look for "Project ID"

### Supabase Secrets (Required)

4. **`NEXT_PUBLIC_SUPABASE_PWA4_URL`**
   - Get from: Supabase Dashboard → Project Settings → API
   - Copy "Project URL" (e.g., `https://xxxxx.supabase.co`)

5. **`NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY`**
   - Get from: Supabase Dashboard → Project Settings → API
   - Copy "anon public" key (starts with `eyJ...`)

6. **`SUPABASE_PWA4_SERVICE_ROLE_KEY`**
   - Get from: Supabase Dashboard → Project Settings → API
   - Copy "service_role" key (starts with `eyJ...`)
   - ⚠️ **Keep this secret!** Never expose publicly.

### Stripe Secrets (Required)

7. **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**
   - Get from: Stripe Dashboard → Developers → API keys
   - Copy "Publishable key" (starts with `pk_...`)

8. **`STRIPE_SECRET_KEY`**
   - Get from: Stripe Dashboard → Developers → API keys
   - Copy "Secret key" (starts with `sk_...`)
   - ⚠️ **Keep this secret!**

9. **`STRIPE_WEBHOOK_SECRET`**
   - Get from: Stripe Dashboard → Developers → Webhooks
   - Select your webhook endpoint
   - Copy "Signing secret" (starts with `whsec_...`)

### Site Configuration (Optional)

10. **`NEXT_PUBLIC_SITE_URL`**
    - Default: `https://airbear.me`
    - Only add if different from default

## 🚀 Quick Setup Script

After adding all secrets, you can manually trigger the sync workflow:

1. Go to: **Actions** tab in GitHub
2. Select: **"Sync Secrets & Environment Variables"** workflow
3. Click: **"Run workflow"**
4. Select: **"Sync secrets to Vercel: true"**
5. Click: **"Run workflow"**

This will sync all secrets to Vercel automatically.

## ✅ Verification

After setup, verify everything works:

1. **Push a commit to main branch:**
   ```bash
   git add .
   git commit -m "Test auto-deploy workflow"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to **Actions** tab
   - Watch the workflow run
   - Should see: ✅ Validate → ✅ Test → ✅ Build → ✅ Deploy → ✅ Verify

3. **Check Vercel:**
   - Go to Vercel Dashboard
   - Should see new deployment
   - Check environment variables are set

4. **Check Production:**
   - Visit: https://airbear.me
   - Should see latest changes
   - UI/UX effects should work
   - Map should load

## 🔄 How It Works

### Automatic Workflow (on every push to main):

1. **Validate** - Checks all environment variables are set
2. **Test** - Runs unit tests, type checking, linting
3. **Build** - Builds the Next.js application
4. **Deploy** - Deploys to Vercel production
5. **Verify** - Checks production site is live and healthy
6. **Sync Secrets** - Ensures Vercel has all environment variables

### Manual Workflows:

- **Sync Secrets**: Manually sync secrets to Vercel (Actions → Sync Secrets)
- **Emergency Deploy**: Skip tests and deploy immediately (Actions → Auto Deploy → Run workflow → Skip tests: true)

## 🛡️ Security Best Practices

1. ✅ **Never commit secrets** to git (already in `.gitignore`)
2. ✅ **Use GitHub Secrets** for all sensitive values
3. ✅ **Rotate secrets** periodically (especially Stripe keys)
4. ✅ **Limit access** to repository secrets
5. ✅ **Monitor** GitHub Actions logs for any exposure

## 📝 Troubleshooting

### Workflow fails at "Validate Environment Variables"
- ✅ Check all required secrets are added to GitHub
- ✅ Verify secret names match exactly (case-sensitive)
- ✅ Check secret values are correct (no extra spaces)

### Workflow fails at "Deploy to Vercel"
- ✅ Verify `VERCEL_TOKEN` is valid
- ✅ Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
- ✅ Ensure Vercel project exists and is linked

### Secrets not syncing to Vercel
- ✅ Run "Sync Secrets" workflow manually
- ✅ Check Vercel token has correct permissions
- ✅ Verify Vercel project ID is correct

### Production site not updating
- ✅ Check deployment succeeded in GitHub Actions
- ✅ Verify Vercel deployment completed
- ✅ Check Vercel environment variables are set
- ✅ Wait a few minutes for DNS propagation

---

**After setup, every push to `main` will automatically test, build, and deploy!** 🎉




