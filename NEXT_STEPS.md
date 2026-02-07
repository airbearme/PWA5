# 🚀 Next Steps - AirBear PWA Deployment

## ✅ Completed
- [x] Fixed ErrorBoundary component wrapping
- [x] Fixed signup page dark mode gradient
- [x] Fixed health endpoint status mismatch
- [x] Created OAuth callback route (`/auth/callback`)
- [x] Dark mode permanently enabled

## ⚠️ Current Issue: Supabase OAuth Redirecting to Demo URL

**Problem:** Google OAuth redirects to demo Supabase URL instead of your project.

**Quick Fix:** See `FIX_SUPABASE_OAUTH.md` for detailed instructions.

**TL;DR:**
1. Run: `pnpm run check:supabase` to diagnose
2. Add correct Supabase environment variables to Vercel:
   - `NEXT_PUBLIC_SUPABASE_PWA4_URL`
   - `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY`
   - `SUPABASE_PWA4_SERVICE_ROLE_KEY`
3. Get values from: Supabase Dashboard → Project Settings → API
4. Redeploy after adding variables

## 📋 Action Items

### 1. Configure Supabase Redirect URLs ⚠️ REQUIRED

**Go to:** [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Authentication → URL Configuration

**Site URL:**
```
https://airbear.me
```

**Redirect URLs (add all three):**
```
http://localhost:3000/auth/callback
https://airbear.me/auth/callback
https://www.airbear.me/auth/callback
```

**Why:** OAuth providers (Google/Apple) need to know where to redirect users after authentication.

---

### 2. Verify Vercel Environment Variables ⚠️ REQUIRED

**Go to:** [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://airbear.me`

**Note:** Make sure they're set for **Production** environment.

---

### 3. Deploy to Production 🚀

**Option A: GitHub Push (Automatic)**
```bash
git add .
git commit -m "Configure OAuth callbacks and deploy to production"
git push origin main
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

**Option C: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deploy" → "Redeploy"

---

### 4. Test OAuth Flow ✅

After deployment:

1. **Visit:** https://airbear.me/auth/signup
2. **Click:** "Sign up with Google" or "Sign up with Apple"
3. **Expected:** Should redirect to `/auth/callback` then to `/dashboard`
4. **If fails:** Check browser console and Supabase logs

---

### 5. Verify Production Features ✅

Test these on https://airbear.me:

- [ ] Homepage loads with dark mode
- [ ] Map page works
- [ ] Google OAuth sign-in works
- [ ] Apple OAuth sign-in works
- [ ] Email/password sign-up works
- [ ] Payment flow works (Stripe)
- [ ] Health endpoint: https://airbear.me/api/health

---

## 🔍 Troubleshooting

### OAuth redirects to wrong page?
- ✅ Check Supabase redirect URLs are configured correctly
- ✅ Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel
- ✅ Check browser console for errors

### Health endpoint shows unhealthy?
- ✅ Verify Supabase environment variables in Vercel
- ✅ Check Supabase project is active
- ✅ Verify database connectivity

### Dark mode not working?
- ✅ Already configured in `app/layout.tsx` (`defaultTheme="dark"`)
- ✅ Should work automatically after deployment

---

## 📞 Quick Reference

- **Production URL:** https://airbear.me
- **Health Check:** https://airbear.me/api/health
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com

---

**Status:** Ready to deploy! 🎉

**Next:** Configure Supabase redirect URLs → Deploy → Test OAuth

