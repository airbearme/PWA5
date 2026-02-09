import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env"

export function getSupabaseAdmin() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseServiceRoleKey = env.SUPABASE_PWA4_SERVICE_ROLE_KEY

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
