import { getSupabaseClient } from "./client"

export interface AirbearLocation {
  id: string
  latitude: number
  longitude: number
  battery_level: number
  is_available: boolean
  is_charging: boolean
  heading: number
  current_spot_id: string | null
  updated_at: string
}

export function subscribeToAirbearLocations(callback: (payload: AirbearLocation) => void) {
  const supabase = getSupabaseClient()

  const channel = supabase
    .channel("airbear-locations")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "airbears",
      },
      (payload) => {
        console.log("[v0] Airbear location update:", payload)
        if (payload.new) {
          callback(payload.new as AirbearLocation)
        }
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export async function updateAirbearLocation(airbearId: string, latitude: number, longitude: number, heading?: number) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("airbears")
    .update({
      latitude,
      longitude,
      heading: heading ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", airbearId)
    .select()

  if (error) {
    console.error("[v0] Error updating airbear location:", error)
    throw error
  }

  return data
}
