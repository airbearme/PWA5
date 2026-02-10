import Stripe from "stripe"
import { z } from "zod"

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string()
    .min(1, "STRIPE_SECRET_KEY is required")
    .regex(/^sk_(test_|live_)/, "Invalid Stripe secret key format"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
})

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || (process.env.NODE_ENV === "production" && !process.env.STRIPE_SECRET_KEY);

const env = isBuildTime
  ? stripeEnvSchema.partial().parse({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
    }) as z.infer<typeof stripeEnvSchema>
  : stripeEnvSchema.parse({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
})