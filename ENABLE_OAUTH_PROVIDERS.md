# 🔐 Enable OAuth Providers in Supabase

## Error Message
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means Google/Apple OAuth providers are not enabled in your Supabase project.

## Solution: Enable OAuth Providers

### Step 1: Enable Google OAuth

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication → Providers**
   - Left sidebar → Authentication → Providers

3. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it **ON**
   - Click "Save"

4. **Configure Google OAuth Credentials**

   **Option A: Use Supabase's Default (Easiest)**
   - Supabase provides default Google OAuth credentials
   - Just enable the provider and it should work
   - You may need to add redirect URLs

   **Option B: Use Your Own Google OAuth (Recommended for Production)**
   
   **Get Google OAuth Credentials:**
   1. Go to [Google Cloud Console](https://console.cloud.google.com)
   2. Create a new project or select existing
   3. Go to **APIs & Services** → **Credentials**
   4. Click **Create Credentials** → **OAuth client ID**
   5. Choose **Web application**
   6. Add **Authorized redirect URIs**:
      ```
      https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
      ```
      (Replace `YOUR_PROJECT_REF` with your Supabase project reference)
   7. Copy **Client ID** and **Client Secret**

   **Add to Supabase:**
   1. In Supabase Dashboard → Authentication → Providers → Google
   2. Paste **Client ID** and **Client Secret**
   3. Click **Save**

### Step 2: Enable Apple OAuth (Optional)

1. **Go to Authentication → Providers**
2. **Enable Apple Provider**
   - Toggle **ON**
   - Configure Apple Sign In credentials
   - Requires Apple Developer account setup

### Step 3: Configure Redirect URLs

**In Supabase Dashboard → Authentication → URL Configuration:**

**Site URL:**
```
https://airbear.me
```

**Redirect URLs (add all three):**
```
http://localhost:3000/auth/callback
https://airbear.me/auth/callback
https://www.airbear.me/auth/callback
```

### Step 4: Test OAuth

1. Visit: `https://airbear.me/auth/signup`
2. Click "Sign up with Google"
3. Should redirect to Google sign-in page
4. After authentication, should redirect back to `/dashboard`

## Quick Checklist

- [ ] Google provider enabled in Supabase
- [ ] Google OAuth credentials configured (or using Supabase default)
- [ ] Redirect URLs configured in Supabase
- [ ] Site URL set to `https://airbear.me`
- [ ] Tested Google sign-in flow

## Troubleshooting

### Still getting "provider is not enabled" error?
- ✅ Make sure provider is **toggled ON** in Supabase Dashboard
- ✅ Click **Save** after enabling
- ✅ Wait a few seconds for changes to propagate
- ✅ Try clearing browser cache and retry

### OAuth redirects but then fails?
- ✅ Check redirect URLs are configured correctly
- ✅ Verify Site URL is set to `https://airbear.me`
- ✅ Check browser console for errors
- ✅ Check Supabase logs: Dashboard → Logs → Auth Logs

### Using Supabase's default Google OAuth?
- ✅ This works for testing but has limitations
- ✅ For production, use your own Google OAuth credentials
- ✅ Default credentials may have rate limits

---

**After enabling providers, OAuth should work!** ✅




