import { z } from "zod"

const envSchema = z.object({
  // Supabase PWA4
  NEXT_PUBLIC_SUPABASE_PWA4_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: z.string().min(1),
  SUPABASE_PWA4_SERVICE_ROLE_KEY: z.string().min(1),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_PWA4_URL: process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL || "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY || "eyJplaceholder",
  SUPABASE_PWA4_SERVICE_ROLE_KEY: process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY || "placeholder",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://airbear.me",
  NODE_ENV: process.env.NODE_ENV || "development",
})
