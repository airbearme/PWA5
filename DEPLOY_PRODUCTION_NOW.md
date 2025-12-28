# 🚀 Deploy to Production - airbear.me (Dark Mode)

## Quick Deploy

```bash
npm run deploy:now
```

OR

```bash
bash scripts/deploy-production-now.sh
```

## What This Does

1. ✅ **Verifies dark mode is permanently enabled**
2. ✅ **Checks prerequisites** (Node.js, npm, git)
3. ✅ **Installs dependencies**
4. ✅ **Runs type check**
5. ✅ **Builds for production**
6. ✅ **Deploys to Vercel production** (or pushes to GitHub for auto-deploy)

## Dark Mode Configuration

Dark mode is **permanently enabled** in `app/layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"      // ✅ Dark mode by default
  enableSystem={false}      // ✅ System theme detection disabled
  disableTransitionOnChange
>
```

This ensures:
- ✅ All users see dark mode by default
- ✅ No system theme detection
- ✅ Consistent dark theme experience

## Prerequisites

### 1. Environment Variables in Vercel

Make sure these are set in Vercel Dashboard → Project Settings → Environment Variables:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Stripe:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Site:**
- `NEXT_PUBLIC_SITE_URL=https://airbear.me`
- `NODE_ENV=production`

### 2. Vercel Project Connected

- Repository connected to Vercel
- Domain `airbear.me` configured
- Production deployment settings configured

### 3. GitHub Repository (for auto-deploy)

If using GitHub Actions:
- Repository: `airbearme/pwapro` (or your repo)
- Secrets configured:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## Deployment Methods

### Method 1: Direct Vercel CLI (Fastest)

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login
vercel login

# Deploy
npm run deploy:now
```

### Method 2: GitHub Actions (Automatic)

```bash
# Push to GitHub
git add .
git commit -m "Deploy to production - Dark mode enabled"
git push origin main

# GitHub Actions will automatically deploy
```

### Method 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deploy" → "Redeploy"
4. Or push to GitHub and it auto-deploys

## Verification

After deployment, verify:

1. **Site is live**: https://airbear.me
2. **Dark mode active**: Page should be dark by default
3. **All features work**:
   - Homepage loads
   - Map page works
   - Authentication works
   - Payments work
   - PWA installable

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Run `npm run build` locally to test

### Dark Mode Not Working
- Verify `app/layout.tsx` has `defaultTheme="dark"` and `enableSystem={false}`
- Clear browser cache
- Check browser DevTools → Application → Local Storage

### Deployment Not Triggering
- Check GitHub Actions workflow is enabled
- Verify Vercel project is connected to GitHub
- Check Vercel dashboard for deployment status

## Post-Deployment Checklist

- [ ] Site loads at https://airbear.me
- [ ] Dark mode is active by default
- [ ] Homepage displays correctly
- [ ] Map page works
- [ ] Authentication (Google/Apple) works
- [ ] Payment flow works
- [ ] PWA installable
- [ ] Real-time updates work
- [ ] All special effects display
- [ ] Mascot appears on all pages

---

**Status**: ✅ Ready to deploy
**Dark Mode**: ✅ Permanently enabled
**Target**: https://airbear.me

**Run `npm run deploy:now` to deploy!** 🚀
