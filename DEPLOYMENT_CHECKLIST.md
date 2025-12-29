# Production Deployment Checklist

Complete this checklist before deploying to airbear.me.

## Pre-Deployment

### Environment Setup
- [ ] Supabase PWA4 project created and configured
- [ ] All environment variables added to Vercel
- [ ] Custom domain airbear.me configured in Vercel
- [ ] SSL certificate active for airbear.me
- [ ] DNS records pointing to Vercel

### Supabase Configuration
- [ ] Database schema deployed via SQL scripts
- [ ] RLS policies enabled and tested
- [ ] Realtime enabled for required tables
- [ ] Storage buckets created for product images
- [ ] OAuth providers configured (Google, Apple)
- [ ] Service role key secured (not in Git)

### Stripe Configuration
- [ ] Stripe account in production mode
- [ ] Products and prices created
- [ ] Webhook endpoint configured: https://airbear.me/api/stripe/webhook
- [ ] Webhook secret added to environment variables
- [ ] Apple Pay domain verified
- [ ] Google Pay enabled
- [ ] Test payments completed successfully

### OAuth Setup
- [ ] Google OAuth credentials created
- [ ] Google authorized redirect URIs added
- [ ] Apple Sign In configured
- [ ] Apple redirect URIs registered
- [ ] Both providers tested in Supabase Auth

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] All dependencies updated to latest stable
- [ ] Build succeeds locally: `npm run build`
- [ ] No security vulnerabilities: `npm audit`

## Deployment Steps

### 1. GitHub Repository
```bash
# Create new repo (if using pwa5)
gh repo create airbearme/pwa5 --public

# Or push to existing pwa4
git remote add origin https://github.com/airbearme/pwa4.git
git add .
git commit -m "Production-ready deployment"
git push -u origin main
```

### 2. Vercel Project Setup
- [ ] Import GitHub repository in Vercel
- [ ] Select Next.js framework preset
- [ ] Configure build settings (auto-detected)
- [ ] Add all environment variables
- [ ] Enable automatic deployments from main branch

### 3. Domain Configuration
```bash
# Add custom domain
vercel domains add airbear.me

# Configure DNS (at domain registrar)
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

### 4. Database Initialization
- [ ] Run SQL migration: `scripts/01-setup-database.sql`
- [ ] Verify tables created
- [ ] Test RLS policies
- [ ] Seed initial data (if needed)

### 5. Integration Testing
- [ ] Health check endpoint: https://airbear.me/api/health
- [ ] User registration flow
- [ ] OAuth login (Google)
- [ ] OAuth login (Apple)
- [ ] Map displays correctly
- [ ] Real-time updates working
- [ ] Product catalog loads
- [ ] Checkout flow completes
- [ ] Webhook receives events

## Post-Deployment

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring setup

### Security Verification
- [ ] SSL/TLS certificate valid
- [ ] Security headers configured
- [ ] CORS policies correct
- [ ] API routes protected
- [ ] RLS policies enforced

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Map loads within 2s
- [ ] Images optimized

### User Acceptance Testing
- [ ] Sign up as new user
- [ ] Complete full purchase flow
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test on desktop browsers
- [ ] Verify mobile responsiveness

### Documentation
- [ ] README updated with production URLs
- [ ] API documentation complete
- [ ] Deployment guide accessible
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

## Rollback Plan

If issues occur:

1. **Immediate rollback**
   ```bash
   vercel rollback
   ```

2. **Check logs**
   ```bash
   vercel logs
   ```

3. **Revert Git commit**
   ```bash
   git revert HEAD
   git push origin main
   ```

## CI/CD Verification

- [ ] GitHub Actions workflow triggers on push
- [ ] Build completes successfully
- [ ] Tests pass (when implemented)
- [ ] Automatic deployment to production
- [ ] Deployment notifications working

## Support Contacts

- Vercel Support: https://vercel.com/help
- Supabase Support: https://supabase.com/support
- Stripe Support: https://support.stripe.com

## Success Criteria

- [ ] Site accessible at https://airbear.me
- [ ] Zero critical errors in production
- [ ] All core features functional
- [ ] Performance metrics met
- [ ] Security audit passed
- [ ] User feedback positive

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Notes:** _______________
