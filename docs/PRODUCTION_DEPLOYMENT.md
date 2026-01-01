# Production Deployment Guide - airbear.me

## Overview

This guide covers deploying AirBear PWA to production at https://airbear.me using Vercel (hosting) and IONOS (DNS/domain).

## Architecture

```
User → IONOS DNS (airbear.me) → Vercel (Next.js App) → Supabase (Database/Auth) → Stripe (Payments)
```

## Prerequisites

- ✅ Vercel account (free tier)
- ✅ Supabase project (free tier)
- ✅ Stripe account (live mode)
- ✅ IONOS domain: airbear.me
- ✅ GitHub repository: airbearme/pwapro

## Phase 1: Vercel Setup

### 1.1 Connect Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub: `airbearme/pwapro`
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### 1.2 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://fofmrqgcidfenbevayrg.supabase.co
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Stripe:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Site:**
```
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

**Important:** 
- Set all variables for **Production**, **Preview**, and **Development** environments
- Use **live** Stripe keys (pk_live_, sk_live_)

### 1.3 Deploy

1. Push code to GitHub `main` branch
2. Vercel will auto-deploy
3. Get deployment URL (e.g., `airbear-pwa.vercel.app`)

## Phase 2: IONOS DNS Configuration

### 2.1 Configure DNS Records

1. Log into IONOS domain management
2. Go to DNS settings for `airbear.me`
3. Add/Update records:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: @ (or leave blank for root)
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: A Record (If CNAME not supported for root)**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP - check current IP)
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 2.2 Verify in Vercel

1. Go to Vercel Project → Settings → Domains
2. Add `airbear.me` and `www.airbear.me`
3. Vercel will provide DNS verification records if needed
4. Wait for DNS propagation (5-60 minutes)

## Phase 3: Stripe Webhook Configuration

### 3.1 Create Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://airbear.me/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 3.2 Test Webhook

1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
2. Test in Stripe Dashboard → Webhooks → Send test webhook

## Phase 4: Supabase Configuration

### 4.1 OAuth Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

Add these redirect URLs:
```
https://airbear.me/auth/callback
https://www.airbear.me/auth/callback
```

### 4.2 Enable Realtime

1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for `airbears` table
3. This enables real-time location updates

### 4.3 RLS Policies

Verify Row Level Security is enabled:
- `users` table: Users can only read/update their own data
- `orders` table: Users can only read their own orders
- `rides` table: Users can only read their own rides
- `airbears` table: Public read, admin write

## Phase 5: GitHub Actions CI/CD

### 5.1 GitHub Secrets

Go to: https://github.com/airbearme/pwapro/settings/secrets/actions

Add:
- `VERCEL_TOKEN` - From Vercel → Settings → Tokens
- `VERCEL_ORG_ID` - From Vercel project settings
- `VERCEL_PROJECT_ID` - From Vercel project settings
- All environment variables (same as Vercel)

### 5.2 Workflow

The `.github/workflows/ci-cd.yml` will:
1. Run on every push to `main`
2. Validate (type-check, lint, build)
3. Deploy to Vercel if validation passes

## Phase 6: Verification Checklist

### Pre-Launch

- [ ] All environment variables set in Vercel
- [ ] DNS records configured in IONOS
- [ ] Domain verified in Vercel
- [ ] Stripe webhook endpoint configured
- [ ] Supabase redirect URLs updated
- [ ] Realtime enabled for `airbears` table
- [ ] GitHub Actions secrets configured
- [ ] Build succeeds without warnings
- [ ] Type check passes
- [ ] Lint passes

### Post-Launch

- [ ] https://airbear.me loads correctly
- [ ] OAuth (Google/Apple) works
- [ ] Map displays with real-time updates
- [ ] Stripe payments work (test mode first)
- [ ] Webhooks receive events
- [ ] PWA installable
- [ ] Push notifications work
- [ ] All animations/effects preserved

## Phase 7: Monitoring

### Vercel Analytics

- Enable in Vercel Dashboard → Analytics
- Monitor Core Web Vitals
- Track deployment performance

### Error Tracking

- Check Vercel Function Logs
- Monitor Stripe webhook delivery
- Check Supabase logs for errors

## Troubleshooting

### DNS Not Resolving

1. Check DNS propagation: https://dnschecker.org
2. Verify records in IONOS
3. Wait up to 24 hours for full propagation

### Webhook Failures

1. Check Stripe Dashboard → Webhooks → Logs
2. Verify `STRIPE_WEBHOOK_SECRET` matches
3. Check Vercel Function Logs
4. Test with Stripe CLI locally

### OAuth Not Working

1. Verify redirect URLs in Supabase
2. Check OAuth provider settings (Google/Apple)
3. Verify `NEXT_PUBLIC_SITE_URL` is correct
4. Check browser console for errors

### Build Failures

1. Check GitHub Actions logs
2. Run `npm run verify` locally
3. Verify all environment variables
4. Check for TypeScript errors

## Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] HTTPS enforced (Vercel default)
- [ ] Security headers configured (in `next.config.mjs`)
- [ ] RLS policies enabled in Supabase
- [ ] Webhook signature verification working
- [ ] No console.log in production code
- [ ] Error messages don't leak secrets

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

**All targets must be met WITH animations enabled.**

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- IONOS Support: https://www.ionos.com/help

---

**Last Updated:** 2025-01-26
**Status:** Production Ready ✅






