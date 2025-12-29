# Environment Variables Configuration

Complete reference for all environment variables used in production.

## Required Variables

### Supabase Configuration

```bash
# Public Supabase URL (PWA4 instance)
NEXT_PUBLIC_SUPABASE_PWA4_URL=https://your-project.supabase.co

# Public Anonymous Key (safe to expose to client)
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (KEEP SECRET - server-side only)
SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find:**
- Supabase Dashboard > Project Settings > API

### Stripe Configuration

```bash
# Public Stripe Key (safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Secret Stripe Key (KEEP SECRET - server-side only)
STRIPE_SECRET_KEY=sk_live_...

# Webhook Secret (KEEP SECRET - for signature verification)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to find:**
- Publishable/Secret Keys: Stripe Dashboard > Developers > API keys
- Webhook Secret: Stripe Dashboard > Developers > Webhooks > Endpoint

### Site Configuration

```bash
# Production site URL
NEXT_PUBLIC_SITE_URL=https://airbear.me

# Node environment
NODE_ENV=production
```

## Optional Variables

### OAuth Configuration

```bash
# Google OAuth (configured in Supabase)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Apple OAuth (configured in Supabase)
NEXT_PUBLIC_APPLE_CLIENT_ID=com.airbear.signin
```

**Note:** OAuth is primarily configured in Supabase Dashboard, these are reference values.

### Development Variables

```bash
# Override for development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Enable debug logging
NEXT_PUBLIC_DEBUG=false
```

## Security Best Practices

### Secret Management

1. **NEVER commit secrets to Git**
   - Use `.env.local` for development
   - Add to `.gitignore`

2. **Use Vercel's Environment Variables UI**
   - Project Settings > Environment Variables
   - Separate environments: Production, Preview, Development

3. **Rotate secrets regularly**
   - Change Stripe keys quarterly
   - Rotate Supabase service role key annually

### Access Control

- **Public Variables** (`NEXT_PUBLIC_*`): Safe for client-side code
- **Secret Variables**: Only accessible on server-side (API routes, Server Components)

### Validation

All environment variables are validated at build time:

```typescript
// lib/env.ts
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_PWA4_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: z.string().min(1),
  SUPABASE_PWA4_SERVICE_ROLE_KEY: z.string().min(1),
  // ... other validations
})
```

## Setting Up in Vercel

### Via Dashboard

1. Go to Project Settings > Environment Variables
2. Add each variable
3. Select applicable environments
4. Click "Save"

### Via CLI

```bash
vercel env add VARIABLE_NAME production
# Paste value when prompted
```

### Via API

```bash
curl -X POST https://api.vercel.com/v10/projects/PROJECT_ID/env \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"VARIABLE_NAME","value":"value","target":["production"]}'
```

## Troubleshooting

### Build Fails with Missing Variables

```
Error: Missing required environment variable: NEXT_PUBLIC_SUPABASE_PWA4_URL
```

**Solution:** Add the missing variable in Vercel dashboard

### Variables Not Updating

**Solution:** Redeploy after adding/updating variables

```bash
vercel --prod --force
```

### Client-Side Variables Undefined

**Solution:** Ensure variable starts with `NEXT_PUBLIC_` prefix

### Server-Side Variables Exposed

**Solution:** Remove `NEXT_PUBLIC_` prefix from secrets

## Verification Checklist

- [ ] All required variables set in Vercel
- [ ] No secrets in Git repository
- [ ] Public variables have `NEXT_PUBLIC_` prefix
- [ ] Secret variables don't have `NEXT_PUBLIC_` prefix
- [ ] Supabase connection works
- [ ] Stripe API calls succeed
- [ ] OAuth redirects to correct URLs
- [ ] Build succeeds with all variables
