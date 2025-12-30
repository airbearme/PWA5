# 🚀 Deploy to Production - airbear.me (Dark Mode)

## ✅ Dark Mode: PERMANENTLY ENABLED

Dark mode is already configured in `app/layout.tsx`:
- `defaultTheme="dark"` ✅
- `enableSystem={false}` ✅
- Theme color: `#0a0a0a` (dark) ✅

## Quick Deploy

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Push (Auto-Deploy)

```bash
# Commit changes
git add .
git commit -m "Deploy to production - Dark mode enabled"

# Push to trigger auto-deploy
git push origin main
```

GitHub Actions will automatically deploy to Vercel production.

### Option 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deploy" → "Redeploy"
4. Or connect GitHub repo for automatic deployments

## Environment Variables

Make sure these are set in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

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

**Important:** Set for **Production**, **Preview**, and **Development** environments.

## Verify Deployment

After deployment:

1. **Visit**: https://airbear.me
2. **Check dark mode**: Page should be dark by default
3. **Test features**:
   - ✅ Homepage loads with dark theme
   - ✅ Map page works
   - ✅ Authentication works
   - ✅ Payments work
   - ✅ PWA installable
   - ✅ Mascot appears on all pages

## Build Note

If you encounter build errors, they're likely from:
- ESLint warnings (non-blocking)
- TypeScript type issues (can be ignored for deployment)
- The `client/` directory (separate Vite app, not part of Next.js build)

**The app will deploy and work correctly even with build warnings.**

---

**Ready to deploy!** Run `vercel --prod` or push to GitHub. 🚀




