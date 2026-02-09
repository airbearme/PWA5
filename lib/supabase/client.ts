import { createBrowserClient } from "@supabase/ssr"
import { env } from "@/lib/env"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY

  try {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })

    return supabaseClient
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}
