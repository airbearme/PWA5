# 🔐 Vercel Environment Variables Setup

## ✅ Recommended Settings

### Auto-expose System Environment Variables
**Recommendation: UNCHECK (Disable)**

**Why?**
- Better security control
- Prevents accidental exposure of system variables
- You explicitly control what's exposed
- Reduces attack surface

## 📋 Environment Variables to Add

Add these **explicitly** in Vercel (don't rely on auto-expose):

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_PWA4_URL
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
SUPABASE_PWA4_SERVICE_ROLE_KEY
```

### Stripe (Required)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### Site Configuration (Required)
```
NEXT_PUBLIC_SITE_URL=https://airbear.me
NODE_ENV=production
```

## 🔒 Security Best Practices

1. **Uncheck "Auto-expose System Environment Variables"**
   - More secure
   - Explicit control
   - Prevents accidental leaks

2. **Set variables for all environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

3. **Use different values for:**
   - Production: Live keys
   - Preview: Test keys (if needed)
   - Development: Local keys

4. **Never commit secrets:**
   - ✅ Already done (secrets removed from git)
   - ✅ Use Vercel dashboard only

## 📝 Step-by-Step Setup

1. Go to: https://vercel.com/dashboard
2. Select: `airbear-pwa` project
3. Settings → Environment Variables
4. **Uncheck:** "Auto-expose System Environment Variables"
5. Add each variable manually:
   - Click "Add New"
   - Enter variable name
   - Enter value
   - Select environments (Production, Preview, Development)
   - Click "Save"
6. After adding all variables, redeploy

## ✅ Verification

After adding variables, verify:
- Health endpoint: `https://airbear.me/api/health`
- Should show Supabase and Stripe as "healthy"
- Authentication should work
- Payments should work

---

**TL;DR: Uncheck auto-expose for better security. Add variables explicitly.**





