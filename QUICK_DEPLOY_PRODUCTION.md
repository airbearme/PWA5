# 🚀 Quick Deploy to Production - airbear.me

## Dark Mode: ✅ PERMANENTLY ENABLED

Dark mode is already configured in `app/layout.tsx`:
- `defaultTheme="dark"` ✅
- `enableSystem={false}` ✅

## Fastest Deployment Methods

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Push (Automatic)

```bash
# Commit and push
git add .
git commit -m "Deploy to production - Dark mode enabled"
git push origin main

# GitHub Actions will auto-deploy to Vercel
```

### Option 3: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deploy" → "Redeploy"
4. Or connect GitHub repo for auto-deploy

## Verify Deployment

After deployment:

1. **Visit**: https://airbear.me
2. **Check dark mode**: Page should be dark by default
3. **Test features**:
   - Homepage loads
   - Map works
   - Auth works
   - Payments work

## Environment Variables

Make sure these are set in Vercel Dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://airbear.me`

---

**Ready to deploy!** Run `vercel --prod` or push to GitHub. 🚀

