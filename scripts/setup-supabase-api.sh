#!/bin/bash

# Automated Supabase configuration
# Requires: SUPABASE_PWA4_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_PWA4_URL

set -e

DOMAIN="airbear.me"
REDIRECT_URL="https://${DOMAIN}/auth/callback"

if [ -z "$SUPABASE_PWA4_SERVICE_ROLE_KEY" ] || [ -z "$NEXT_PUBLIC_SUPABASE_PWA4_URL" ]; then
    echo "❌ Supabase environment variables required"
    echo "   SUPABASE_PWA4_SERVICE_ROLE_KEY"
    echo "   NEXT_PUBLIC_SUPABASE_PWA4_URL"
    exit 1
fi

echo "🗄️  Configuring Supabase..."

# Extract project reference from URL
PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_PWA4_URL" | sed -n 's/.*\/\/\([^.]*\)\.supabase\.co.*/\1/p')

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Could not extract project reference from URL"
    exit 1
fi

echo "Project: $PROJECT_REF"

# Note: Supabase Management API requires different authentication
# For now, we'll provide instructions
echo ""
echo "⚠️  Supabase configuration requires dashboard access"
echo ""
echo "Please configure manually:"
echo "   1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}"
echo "   2. Authentication → URL Configuration"
echo "   3. Add redirect URL: ${REDIRECT_URL}"
echo "   4. Database → Replication"
echo "   5. Enable replication for 'airbears' table"
echo ""
echo "Or use Supabase CLI:"
echo "   supabase link --project-ref ${PROJECT_REF}"
echo "   # Then update redirect URLs via dashboard"


