import { z } from "zod";

const pub = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_KILL_SWITCH: z.string().optional(),
  NEXT_PUBLIC_CANARY: z.string().optional(),
});

const srv = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  ERROR_INGEST_TOKEN: z.string().min(16),
  STRIPE_WEBHOOK_SECRET: z.string().min(10),
  STRIPE_SECRET_KEY: z.string().min(10),
});

export const env = { ...pub.parse(process.env), ...srv.parse(process.env) };
