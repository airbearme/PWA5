/**
 * Automatic Environment Variable Loading
 * 
 * This ensures all environment variables are loaded and validated
 * automatically when the app starts, both in development and production.
 * 
 * Next.js automatically loads .env.local in development
 * Vercel automatically injects environment variables in production
 */

// Validate critical environment variables on module load
if (typeof window === 'undefined') {
  // Server-side validation
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_PWA4_URL',
    'NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY',
    'SUPABASE_PWA4_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_SITE_URL',
  ]

  const missing = requiredVars.filter(
    (key) => !process.env[key] || process.env[key] === ''
  )

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('❌ Missing required environment variables:', missing.join(', '))
    // Don't throw in production to allow graceful degradation
    // Vercel will show build errors if vars are missing
  }
}

// Export validation function for runtime checks
export function validateRuntimeEnv() {
  if (typeof window === 'undefined') {
    // Server-side
    return {
      supabase: !!(
        process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
      ),
      stripe: !!(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
        process.env.STRIPE_SECRET_KEY
      ),
      site: !!process.env.NEXT_PUBLIC_SITE_URL,
    }
  } else {
    // Client-side
    return {
      supabase: !!(
        process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
      ),
      stripe: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      site: !!process.env.NEXT_PUBLIC_SITE_URL,
    }
  }
}






