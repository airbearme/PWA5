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

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;

export const env = isBuildTime
  ? envSchema.partial().parse({
      NODE_ENV: process.env.NODE_ENV || "production",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://airbear.me",
      NEXT_PUBLIC_SUPABASE_PWA4_URL: process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL || "https://dummy.supabase.co",
      NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY || "dummy",
      SUPABASE_PWA4_SERVICE_ROLE_KEY: process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY || "dummy",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy",
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
    }) as z.infer<typeof envSchema>
  : envSchema.parse({
      NEXT_PUBLIC_SUPABASE_PWA4_URL: process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL,
      NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY,
      SUPABASE_PWA4_SERVICE_ROLE_KEY: process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
