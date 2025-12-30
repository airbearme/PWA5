# 🔐 Google OAuth Setup - Get Client ID & Client Secret

## You Need BOTH:
- ✅ **Client ID** (public identifier)
- ✅ **Client Secret** (private key - keep secret!)

## Step-by-Step: Get Google OAuth Credentials

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Enter project name: `AirBear OAuth` (or any name)
4. Click **Create**

### Step 2: Enable Google+ API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - **User Type**: External (unless you have Google Workspace)
   - **App name**: AirBear
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **Save and Continue**
   - **Scopes**: Click **Save and Continue** (default is fine)
   - **Test users**: Add your email, click **Save and Continue**
   - **Summary**: Click **Back to Dashboard**

4. **Create OAuth Client ID**:
   - **Application type**: Select **Web application**
   - **Name**: `AirBear Web Client`
   - **Authorized JavaScript origins**: (leave empty for now)
   - **Authorized redirect URIs**: Add this:
     ```
     https://fofmrqgcidfenbevayrg.supabase.co/auth/v1/callback
     ```
     (Replace `fofmrqgcidfenbevayrg` with YOUR Supabase project reference)
   - Click **Create**

5. **Copy Credentials**:
   - A popup will show:
     - **Your Client ID**: `xxxxx.apps.googleusercontent.com` ← Copy this!
     - **Your Client Secret**: `GOCSPX-xxxxx` ← Copy this!
   - **Important**: Copy both immediately (you won't see the secret again!)

### Step 4: Add to Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and toggle it **ON**
5. Paste credentials:
   - **Client ID (for OAuth)**: Paste your Client ID
   - **Client Secret (for OAuth)**: Paste your Client Secret
6. Click **Save**

### Step 5: Configure Redirect URLs in Supabase

1. Still in Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://airbear.me`
3. **Redirect URLs** (add all three):
   ```
   http://localhost:3000/auth/callback
   https://airbear.me/auth/callback
   https://www.airbear.me/auth/callback
   ```
4. Click **Save**

## Quick Reference

### Where to Find Your Supabase Project Reference:

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Project Settings** → **API**
4. Your **Project URL** looks like: `https://fofmrqgcidfenbevayrg.supabase.co`
5. The part before `.supabase.co` is your project reference: `fofmrqgcidfenbevayrg`

### Authorized Redirect URI Format:

```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Replace `YOUR_PROJECT_REF` with your actual project reference.

## Troubleshooting

### "Invalid client" error?
- ✅ Check Client ID is correct (no extra spaces)
- ✅ Check Client Secret is correct (no extra spaces)
- ✅ Make sure you copied the full values

### "Redirect URI mismatch" error?
- ✅ Check redirect URI in Google Console matches exactly:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- ✅ Check redirect URLs in Supabase match:
  - `https://airbear.me/auth/callback`

### Can't find Client Secret?
- ✅ If you lost it, you need to create a new OAuth client in Google Console
- ✅ Google only shows the secret once when you create it

## Security Notes

- 🔒 **Client Secret** is sensitive - never commit to git
- 🔒 **Client Secret** is stored securely in Supabase
- ✅ **Client ID** can be public (it's in your frontend code)
- ✅ Only add redirect URIs you control

---

**After adding both Client ID and Client Secret to Supabase, Google OAuth should work!** ✅



