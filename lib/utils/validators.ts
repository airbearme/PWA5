export function validateEnvVars() {
  const required = {
    NEXT_PUBLIC_SUPABASE_PWA4_URL: process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL,
    NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY,
    SUPABASE_PWA4_SERVICE_ROLE_KEY: process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => typeof value !== "string" || value.length === 0)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

export function validateUserProfile(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false

  const profile = data as Record<string, unknown>

  return (
    typeof profile.id === "string" &&
    typeof profile.email === "string" &&
    (profile.full_name === null || typeof profile.full_name === "string") &&
    (profile.avatar_url === null || typeof profile.avatar_url === "string")
  )
}

export function validateLocation(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false

  const location = data as Record<string, unknown>

  return (
    typeof location.latitude === "number" &&
    typeof location.longitude === "number" &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180 &&
    (location.heading === undefined || (typeof location.heading === "number" && location.heading >= 0 && location.heading <= 360)) &&
    (location.battery_level === undefined || (typeof location.battery_level === "number" && location.battery_level >= 0 && location.battery_level <= 100))
  )
}

export function validateProduct(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false

  const product = data as Record<string, unknown>

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    product.price >= 0 &&
    typeof product.inventory === "number" &&
    product.inventory >= 0 &&
    typeof product.available === "boolean"
  )
}
