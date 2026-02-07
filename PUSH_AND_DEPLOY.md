# 🚀 Push and Deploy - Step by Step

## Step 1: Create GitHub Repository (2 minutes)

1. **Go to:** https://github.com/new

2. **Fill in:**
   - Owner: `airbearme`
   - Repository name: `pwapro`
   - Description: `AirBear PWA - Solar-Powered Rideshare & Mobile Bodega`
   - Visibility: **Public**
   - ⚠️ **DO NOT** check:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

3. **Click:** "Create repository"

## Step 2: Push Code (1 minute)

Once the repository is created, run:

```bash
cd /home/coden809/Projects/pwa5
git push -u origin main
```

Or use the script:
```bash
bash scripts/push-and-deploy.sh
```

## Step 3: Deploy to Vercel (5 minutes)

### 3.1 Import Project

1. Go to: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select: `airbearme/pwapro`
5. Click **"Import"**

### 3.2 Configure Build

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave default)
- **Build Command:** `pnpm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm ci` (auto-detected)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add these (copy from your `.env.local`):

```
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://fofmrqgcidfenbevayrg.supabase.co
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzQ3MjgsImV4cCI6MjA3OTIxMDcyOH0.Z6m5z1KQGp-cDjBbcdJjUaXIA25C3VD8IlcLge1fWyM
SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (your Stripe publishable key)
STRIPE_SECRET_KEY=sk_live_... (your Stripe secret key)
STRIPE_WEBHOOK_SECRET=whsec_... (your Stripe webhook secret)
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

**Important:** 
- Set each variable for **Production**, **Preview**, and **Development**
- Click **"Save"** after adding each variable

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `airbear-pwa.vercel.app`

## Step 4: Configure Domain (5 minutes)

### 4.1 Add Domain in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter: `airbear.me`
5. Click **"Add"**
6. Also add: `www.airbear.me`

### 4.2 Configure DNS in IONOS

1. Log into IONOS domain management
2. Go to DNS settings for `airbear.me`
3. Add/Update these records:

**For root domain (airbear.me):**
```
Type: CNAME
Name: @ (or leave blank)
Value: cname.vercel-dns.com
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Note:** If IONOS doesn't support CNAME for root domain, use A record:
```
Type: A
Name: @
Value: 76.76.21.21 (check Vercel for current IP)
TTL: 3600
```

4. Wait 5-60 minutes for DNS propagation

## Step 5: Configure Stripe Webhook (3 minutes)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://airbear.me/api/stripe/webhook`
4. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Go back to Vercel → Environment Variables
8. Update `STRIPE_WEBHOOK_SECRET` with the new value
9. Redeploy (or it will auto-redeploy on next push)

## Step 6: Configure Supabase (2 minutes)

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add these redirect URLs:
   - `https://airbear.me/auth/callback`
   - `https://www.airbear.me/auth/callback`
5. Click **"Save"**
6. Go to **Database** → **Replication**
7. Enable replication for `airbears` table (for real-time updates)

## Step 7: Verify Deployment

Check these:

- ✅ https://airbear.me loads
- ✅ OAuth login works (Google/Apple)
- ✅ Map displays with real-time AirBears
- ✅ Payments work (test with Stripe test mode first)
- ✅ PWA is installable

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Run `pnpm run build` locally to test

### Domain Not Working
- Check DNS propagation: https://dnschecker.org
- Verify DNS records in IONOS
- Check domain in Vercel settings

### Webhook Not Working
- Check Stripe webhook logs
- Verify `STRIPE_WEBHOOK_SECRET` matches
- Check Vercel function logs

### OAuth Not Working
- Verify redirect URLs in Supabase
- Check `NEXT_PUBLIC_SITE_URL` is `https://airbear.me`
- Check browser console for errors

## Quick Commands

```bash
# Push to GitHub
git push -u origin main

# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod
```

---

**Total Time:** ~20 minutes
**Status:** Ready to deploy! 🚀

