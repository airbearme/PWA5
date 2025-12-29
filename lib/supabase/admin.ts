import { createClient } from "@supabase/supabase-js"

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables. Please set NEXT_PUBLIC_SUPABASE_PWA4_URL and SUPABASE_PWA4_SERVICE_ROLE_KEY",
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
