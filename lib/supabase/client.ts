import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL || "https://placeholder.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY || "eyJplaceholder"

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase configuration error:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    })
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_PWA4_URL and NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
    )
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
  }

  // Validate key format (should start with eyJ)
  if (!supabaseAnonKey.startsWith("eyJ")) {
    console.warn("⚠️ Supabase anon key format may be incorrect")
  }

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
