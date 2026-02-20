#!/bin/bash

# Script to add all required environment variables to Vercel production
# Run this from your project root directory

echo "🐻 Adding AirBear PWA environment variables to Vercel..."
echo "========================================================"

# Array of environment variables to add (Sentinel: Masked hardcoded secrets)
declare -a env_vars=(
    "NEXT_PUBLIC_SUPABASE_PWA4_URL=https://your-project.supabase.co"
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY=eyJ... (your anon key)"
    "SUPABASE_PWA4_SERVICE_ROLE_KEY=eyJ... (your service role key)"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (your publishable key)"
    "STRIPE_SECRET_KEY=sk_live_... (your Stripe secret key)"
    "STRIPE_WEBHOOK_SECRET=whsec_... (your webhook secret)"
    "SUPABASE_URL=https://your-project.supabase.co"
    "SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)"
    "VITE_SUPABASE_URL=https://your-project.supabase.co"
    "VITE_SUPABASE_ANON_KEY=eyJ... (your anon key)"
    "NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app"
)

# Add each environment variable
for env_var in "${env_vars[@]}"; do
    # Split into key and value
    key=$(echo "$env_var" | cut -d'=' -f1)
    value=$(echo "$env_var" | cut -d'=' -f2-)

    echo "Adding: $key"

    # Use Vercel CLI to add the environment variable
    if vercel env add "$key" production <<< "$value" 2>/dev/null; then
        echo "✅ Added: $key"
    else
        echo "❌ Failed to add: $key"
        echo "You may need to run: vercel login"
        exit 1
    fi
done

echo ""
echo "🎉 All environment variables added successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to production: vercel --prod"
echo "2. Test the live site: curl https://airbear.me/api/health"
echo ""
echo "Expected health check response:"
echo '{'
echo '  "status": "healthy",'
echo '  "checks": {'
echo '    "environment": {"status": "healthy"},'
echo '    "supabase": {"status": "healthy"},'
echo '    "stripe": {"status": "healthy"}'
echo '  }'
echo '}'