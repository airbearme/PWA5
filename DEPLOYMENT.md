# Deployment Guide

## Quick Deploy to Production

### Prerequisites
- GitHub repository: `github.com/airbearme/pwapro`
- Vercel account connected to GitHub
- All environment variables set in Vercel

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Validate code (type-check, lint, build)
   - Deploy to Vercel production

### Manual Deployment

If you need to deploy manually:

```bash
npm run deploy:vercel
```

## Environment Variables Setup

### In Vercel Dashboard:
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_PWA4_URL`
   - `NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY`
   - `SUPABASE_PWA4_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (set to `https://airbear.me`)

### In GitHub Secrets (for CI/CD):
1. Go to Repository Settings > Secrets and variables > Actions
2. Add:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - All environment variables (same as Vercel)

## CI/CD Workflow

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) will:
1. Run on every push to `main` branch
2. Validate code (type-check, lint, build)
3. Deploy to Vercel production if validation passes

## Troubleshooting

### Build Fails
- Check GitHub Actions logs
- Verify all environment variables are set
- Run `npm run validate:env` locally

### Deployment Fails
- Verify Vercel secrets in GitHub
- Check Vercel project settings
- Ensure domain is configured in Vercel


