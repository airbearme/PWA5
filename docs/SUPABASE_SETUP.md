# Supabase Setup Guide for AirBear PWA

## Prerequisites
- Supabase project created at https://supabase.com
- Project URL and keys from your Supabase dashboard

## Step 1: Configure Environment Variables

Add these to your environment (Vercel or local `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_PWA4_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=your_supabase_anon_key
SUPABASE_PWA4_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 2: Run Database Schema

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/01-setup-database.sql`
4. Click "Run" to execute

This will create:
- All necessary tables (spots, airbears, users, rides, payments, bodega_items, orders)
- Row Level Security (RLS) policies
- Realtime subscriptions setup
- Initial seed data (16 Binghamton locations, 1 airbear, sample bodega items)

## Step 3: Enable Realtime

1. Go to Database → Replication in your Supabase dashboard
2. Enable realtime for the `airbears` table
3. This allows live location tracking of vehicles

## Step 4: Configure Authentication

### Google OAuth Setup

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Add client ID and secret to Supabase

4. Set authorized redirect URLs in Supabase:
   - `https://airbear.me/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Apple OAuth Setup

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Apple provider
3. Follow Apple Sign In setup:
   - Go to https://developer.apple.com
   - Create Services ID
   - Configure Sign in with Apple
   - Add return URLs
   - Add credentials to Supabase

## Step 5: Test Database Connection

Run this query in SQL Editor to verify everything is working:

```sql
-- Check spots
SELECT COUNT(*) as spot_count FROM public.spots;

-- Check airbears
SELECT * FROM public.airbears;

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

You should see:
- 16 spots
- 1 airbear
- Multiple RLS policies enabled

## Step 6: Security Checklist

- [x] RLS enabled on all tables
- [x] Public read access only for spots, airbears, bodega_items
- [x] User-specific access for profiles, rides, orders, payments
- [x] Driver-specific access for updating assigned airbear
- [x] Service role key kept secret (never in client code)

## Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is not paused
- Verify API keys are from the correct project

### RLS Errors
- Ensure user is authenticated before accessing protected tables
- Check RLS policies match your access patterns
- Use service role key for admin operations (server-side only)

### Realtime Not Working
- Verify realtime is enabled for airbears table
- Check browser console for subscription errors
- Ensure RLS policies allow reading the table

## Production Checklist

- [ ] Database schema deployed
- [ ] Realtime enabled for airbears
- [ ] OAuth providers configured (Google + Apple)
- [ ] Environment variables set in Vercel
- [ ] RLS policies tested
- [ ] Seed data populated
- [ ] Service role key secured (server-side only)
```
