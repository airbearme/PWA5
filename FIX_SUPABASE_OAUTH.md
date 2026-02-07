# 🔧 Fix Supabase OAuth Redirecting to Demo URL

## Problem
When clicking "Sign in with Google", it redirects to a demo Supabase URL instead of your actual project.

## Root Cause
The Supabase environment variables are either:
1. ❌ Not set in Vercel
2. ❌ Pointing to a demo/test project
3. ❌ Using incorrect variable names

## Solution

### Step 1: Check Current Configuration

Run this diagnostic script:
```bash
pnpm run check:supabase
```

This will show you:
- Which environment variables are set/missing
- If URLs look like demo/test URLs
- What needs to be fixed

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **actual project** (not a demo/test project)
3. Go to **Project Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 3: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`airbear-pwa` or similar)
3. Go to **Settings** → **Environment Variables**
4. Add these **exact** variable names:

```
NEXT_PUBLIC_SUPABASE_PWA4_URL
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
SUPABASE_PWA4_SERVICE_ROLE_KEY
```

**Important:**
- Variable names must match **exactly** (case-sensitive)
- Use the values from **your actual Supabase project**
- Set for **Production**, **Preview**, and **Development** environments

### Step 4: Verify Variable Names Match Code

The code expects these **exact** names:
- `NEXT_PUBLIC_SUPABASE_PWA4_URL` (not `NEXT_PUBLIC_SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY` (not `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_PWA4_SERVICE_ROLE_KEY` (not `SUPABASE_SERVICE_ROLE_KEY`)

### Step 5: Redeploy

After adding variables, redeploy:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment

**Option B: Via Git**
```bash
git commit --allow-empty -m "Redeploy with Supabase config"
git push origin main
```

### Step 6: Test OAuth

1. Visit: `https://airbear.me/auth/signup`
2. Click "Sign up with Google"
3. Should redirect to **your Supabase project**, not a demo URL
4. After authentication, should redirect to `/dashboard`

## Common Issues

### Issue: Still redirecting to demo URL
**Fix:** 
- Double-check environment variable names match exactly
- Verify you're using credentials from your **actual** project, not a demo
- Make sure variables are set for **Production** environment in Vercel
- Redeploy after adding variables

### Issue: "Missing Supabase environment variables" error
**Fix:**
- Variables aren't set in Vercel
- Variable names don't match exactly
- Variables aren't set for the correct environment (Production)

### Issue: OAuth works locally but not in production
**Fix:**
- Environment variables are set locally (`.env.local`) but not in Vercel
- Add variables to Vercel Dashboard → Environment Variables → Production

## Quick Checklist

- [ ] Ran `pnpm run check:supabase` diagnostic
- [ ] Got credentials from **actual** Supabase project (not demo)
- [ ] Added `NEXT_PUBLIC_SUPABASE_PWA4_URL` to Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY` to Vercel
- [ ] Added `SUPABASE_PWA4_SERVICE_ROLE_KEY` to Vercel
- [ ] Set variables for **Production** environment
- [ ] Redeployed application
- [ ] Tested OAuth sign-in

## Still Not Working?

1. **Check browser console** for errors
2. **Check Vercel logs** for environment variable issues
3. **Verify Supabase project** is active (not paused)
4. **Check Supabase redirect URLs** are configured:
   - `https://airbear.me/auth/callback`
   - `http://localhost:3000/auth/callback`

---

**After fixing, OAuth should redirect to your Supabase project, not a demo URL!** ✅




