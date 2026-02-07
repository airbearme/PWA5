# 🚀 Quick Deploy to airbear.me

## Prerequisites Checklist

- [ ] Vercel account connected
- [ ] GitHub repository ready (github.com/airbearme/pwa4)
- [ ] Environment variables set (see below)
- [ ] Supabase PWA4 project created
- [ ] Stripe account configured

## 1. Deploy to Vercel (5 minutes)

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import git repository: `github.com/airbearme/pwa4`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm run build`
   - **Install Command**: `pnpm install`

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 2. Add Custom Domain (2 minutes)

In Vercel Dashboard:
1. Go to **Settings → Domains**
2. Add domain: `airbear.me`
3. Add domain: `www.airbear.me`

Update DNS records:
```
A Record:    @ → 76.76.21.21
CNAME:      www → cname.vercel-dns.com
```

## 3. Set Environment Variables (3 minutes)

In Vercel Dashboard → Settings → Environment Variables:

### Supabase (PWA4 Instance)
```bash
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=your-anon-key
SUPABASE_PWA4_SERVICE_ROLE_KEY=your-service-role-key
```

### Stripe
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (get after setting up webhook)
```

### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

**Important**: Set all environment variables for **Production** environment.

## 4. Initialize Database (5 minutes)

### Via Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `scripts/01-setup-database.sql`
3. Run the SQL script
4. Verify tables created: profiles, airbear_locations, products, orders, order_items

### Or via Supabase CLI:

```bash
npx supabase db push
```

## 5. Configure OAuth (5 minutes)

### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://airbear.me/auth/callback`
4. Add to Supabase: Authentication → Providers → Google

### Apple Sign-In:

1. Go to [Apple Developer](https://developer.apple.com)
2. Create Services ID
3. Add redirect URI: `https://airbear.me/auth/callback`
4. Add to Supabase: Authentication → Providers → Apple

## 6. Setup Stripe Webhook (3 minutes)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://airbear.me/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## 7. Setup GitHub Auto-Deploy (2 minutes)

The GitHub Actions workflow is already configured!

Add these secrets to GitHub:
1. Go to GitHub → Settings → Secrets and variables → Actions
2. Add secrets:
   - `VERCEL_TOKEN` (from Vercel account settings)
   - `VERCEL_ORG_ID` (from Vercel project settings)
   - `VERCEL_PROJECT_ID` (from Vercel project settings)

Now every push to `main` auto-deploys!

## 8. Verify Deployment (2 minutes)

```bash
# Run verification script
chmod +x scripts/verify-production.sh
./scripts/verify-production.sh https://airbear.me
```

Or manually check:
- [ ] Visit https://airbear.me
- [ ] Check health: https://airbear.me/api/health
- [ ] View map: https://airbear.me/map
- [ ] Test login: https://airbear.me/auth/login

## 🎉 You're Live!

Your AirBear PWA is now running at **https://airbear.me**

### What's Working:
- ✅ Real-time driver tracking on map
- ✅ One-click OAuth (Google + Apple)
- ✅ Secure Stripe payments (Apple Pay + Google Pay)
- ✅ Mobile bodega product catalog
- ✅ PWA with offline support
- ✅ Automatic deployments from GitHub

### Monitor Your App:
- **Vercel Analytics**: vercel.com/dashboard
- **Supabase Logs**: supabase.com/dashboard
- **Stripe Dashboard**: dashboard.stripe.com
- **Health Check**: https://airbear.me/api/health

### Need Help?
- Check logs in Vercel Dashboard
- Review Supabase Auth logs
- Test Stripe webhooks in test mode first
- Run `./scripts/verify-production.sh` for diagnostics

---

**Total deployment time: ~25 minutes** ⚡
