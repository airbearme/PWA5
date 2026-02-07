# Production Deployment Guide

Complete guide for deploying AirBear to production at airbear.me

## Prerequisites

- GitHub account
- Vercel account
- Supabase account (PWA4 project)
- Stripe account
- Domain configured: airbear.me

## Step 1: Repository Setup

1. **Create/Update GitHub Repository**
   \`\`\`bash
   git remote add origin https://github.com/airbearme/pwa4.git
   git branch -M main
   git push -u origin main
   \`\`\`

2. **Add GitHub Secrets** (Settings > Secrets and variables > Actions)
   - `VERCEL_TOKEN`: From Vercel account settings
   - `VERCEL_ORG_ID`: From Vercel project settings
   - `VERCEL_PROJECT_ID`: From Vercel project settings

## Step 2: Vercel Configuration

1. **Connect Repository**
   - Go to vercel.com
   - Import Git Repository
   - Select airbearme/pwa4
   - Configure project settings

2. **Add Environment Variables**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_PWA4_URL
   NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
   SUPABASE_PWA4_SERVICE_ROLE_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   NEXT_PUBLIC_SITE_URL=https://airbear.me
   NODE_ENV=production
   \`\`\`

3. **Configure Domain**
   - Go to Project Settings > Domains
   - Add airbear.me
   - Add www.airbear.me (redirect to airbear.me)
   - Update DNS records as instructed

## Step 3: Supabase Setup

1. **Run Database Migration**
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Run `scripts/01-setup-database.sql`
   - Verify all tables created successfully

2. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable Email provider
   - Enable Google OAuth:
     - Add Client ID and Secret
     - Redirect URL: `https://[PROJECT].supabase.co/auth/v1/callback`
   - Enable Apple OAuth:
     - Add Service ID and configuration
     - Configure domains and redirect URLs

3. **Set Up Realtime**
   - Go to Database > Replication
   - Enable realtime for tables:
     - `airbear_locations`
     - `products`
     - `orders`

4. **Configure RLS Policies**
   - Verify Row Level Security is enabled
   - Test policies with sample data
   - Ensure users can only access their own data

## Step 4: Stripe Configuration

1. **Get API Keys**
   - Go to Stripe Dashboard
   - Developers > API keys
   - Copy publishable and secret keys

2. **Enable Payment Methods**
   - Go to Settings > Payment methods
   - Enable Apple Pay
   - Enable Google Pay
   - Add business details

3. **Configure Webhooks**
   - Go to Developers > Webhooks
   - Add endpoint: `https://airbear.me/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook signing secret
   - Add to Vercel environment variables

4. **Create Products**
   - Go to Products in Stripe Dashboard
   - Create products matching your database
   - Note product and price IDs

## Step 5: GitHub Actions Setup

1. **Workflow Already Configured**
   - File: `.github/workflows/deploy.yml`
   - Automatically runs on push to main

2. **Test Deployment**
   \`\`\`bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   \`\`\`

3. **Monitor Deployment**
   - Go to GitHub > Actions tab
   - Watch workflow execution
   - Check Vercel deployment logs

## Step 6: DNS Configuration

1. **Point Domain to Vercel**
   - A Record: @ → 76.76.19.19
   - CNAME Record: www → cname.vercel-dns.com

2. **Wait for Propagation**
   - Can take up to 48 hours
   - Check with: `dig airbear.me`

## Step 7: SSL/TLS Setup

- Vercel automatically provisions SSL certificates
- Certificates auto-renew via Let's Encrypt
- HTTPS enforced with HSTS headers

## Step 8: Testing

1. **Smoke Tests**
   - Visit https://airbear.me
   - Test user registration with email
   - Test Google OAuth sign-in
   - Test Apple OAuth sign-in (on iOS device)
   - View real-time map
   - Browse products
   - Complete test purchase

2. **Performance Tests**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Test on mobile devices
   - Verify PWA installability

3. **Security Tests**
   - Verify HTTPS enforcement
   - Check security headers
   - Test RLS policies
   - Verify webhook signatures

## Step 9: Monitoring

1. **Vercel Analytics**
   - Automatically enabled
   - View in Vercel Dashboard

2. **Supabase Monitoring**
   - Database queries
   - Auth events
   - Realtime connections

3. **Stripe Dashboard**
   - Payment events
   - Webhook deliveries
   - Failed payments

## Step 10: Post-Deployment

1. **Create Backups**
   - Supabase: Automatic daily backups
   - Export environment variables

2. **Documentation**
   - Update API documentation
   - Document custom configurations
   - Create runbooks for common issues

3. **Team Access**
   - Add team members to Vercel
   - Configure Supabase team access
   - Set up Stripe team access

## Rollback Procedure

If issues occur:

1. **Revert in Vercel**
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Revert in GitHub**
   \`\`\`bash
   git revert HEAD
   git push origin main
   \`\`\`

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify environment variables
- Test build locally: `pnpm run build`

### Database Connection Issues
- Verify Supabase environment variables
- Check network policies
- Test connection in Supabase SQL Editor

### OAuth Not Working
- Verify redirect URLs match exactly
- Check OAuth credentials
- Ensure providers are enabled in Supabase

### Stripe Webhook Failures
- Verify webhook secret is correct
- Check endpoint URL is accessible
- Review webhook logs in Stripe

### Map Not Loading
- Check browser console for errors
- Verify Leaflet CSS is loaded
- Test location permissions

## Success Checklist

- [ ] Site accessible at airbear.me
- [ ] HTTPS working with valid certificate
- [ ] GitHub Actions deploying automatically
- [ ] User registration working
- [ ] Google OAuth working
- [ ] Apple OAuth working
- [ ] Real-time map showing locations
- [ ] Products loading from database
- [ ] Stripe checkout working
- [ ] Apple Pay functional
- [ ] Google Pay functional
- [ ] Webhooks receiving events
- [ ] Orders saving to database
- [ ] PWA installable on mobile
- [ ] All security headers present
- [ ] RLS policies enforced
- [ ] Performance metrics acceptable

## Maintenance

- Monitor error rates daily
- Review Stripe transactions weekly
- Update dependencies monthly
- Backup database monthly
- Review security policies quarterly
- Audit access controls quarterly

## Support Contacts

- **Vercel Support**: vercel.com/help
- **Supabase Support**: supabase.com/support
- **Stripe Support**: stripe.com/support
