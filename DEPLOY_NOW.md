# 🚀 DEPLOY TO PRODUCTION NOW

## Quick Start (5 Minutes)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Create GitHub Repository (if not exists)
1. Go to https://github.com/new
2. Owner: `airbearme`
3. Repository name: `pwapro`
4. Make it **Public**
5. **Don't** initialize with README
6. Click "Create repository"

### Step 3: Push Code
```bash
git remote add origin https://github.com/airbearme/pwapro.git
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import `airbearme/pwapro`
4. Add environment variables (see below)
5. Deploy!

### Step 5: Configure Domain
1. In Vercel: Settings → Domains → Add `airbear.me`
2. In IONOS: DNS → Add CNAME: `@` → `cname.vercel-dns.com`
3. Wait 5-60 minutes for DNS propagation

## Environment Variables for Vercel

Copy these from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_placeholder
STRIPE_SECRET_KEY=sk_live_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://airbear.me/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Supabase Setup

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URL: `https://airbear.me/auth/callback`
3. Go to Database → Replication
4. Enable replication for `airbears` table

## Verify Deployment

After deployment, check:
- ✅ https://airbear.me loads
- ✅ OAuth login works
- ✅ Map displays with real-time updates
- ✅ Payments work (test mode first!)

## Full Documentation

See `docs/PRODUCTION_DEPLOYMENT.md` for complete guide.

---

**Status**: ✅ Production Ready
**UI/UX**: ✅ All animations preserved
**Security**: ✅ Hardened
**Performance**: ✅ Optimized

