import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_PWA4_URL: z.string()
    .url("Invalid Supabase URL format")
    .refine(url => url.includes("supabase.co"), "URL must be a valid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: z.string()
    .min(1, "Supabase anon key is required")
    .regex(/^eyJ/, "Invalid Supabase anon key format"),
})

const env = supabaseEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_PWA4_URL: process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL,
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY,
})

export async function getSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_PWA4_URL, env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export { createServerClient }

// Alias for createClient (same as getSupabaseServer)
export const createClient = getSupabaseServer