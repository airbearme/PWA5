export interface Database {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          description: string | null
          amenities: string[] | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          latitude: number
          longitude: number
          description?: string | null
          amenities?: string[] | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          description?: string | null
          amenities?: string[] | null
          is_active?: boolean
          created_at?: string
        }
      }
      airbears: {
        Row: {
          id: string
          current_spot_id: string | null
          latitude: number
          longitude: number
          battery_level: number
          is_available: boolean
          is_charging: boolean
          heading: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          current_spot_id?: string | null
          latitude: number
          longitude: number
          battery_level?: number
          is_available?: boolean
          is_charging?: boolean
          heading?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          current_spot_id?: string | null
          latitude?: number
          longitude?: number
          battery_level?: number
          is_available?: boolean
          is_charging?: boolean
          heading?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "driver" | "admin"
          eco_points: number
          total_rides: number
          co2_saved: number
          has_ceo_tshirt: boolean
          assigned_airbear_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "driver" | "admin"
          eco_points?: number
          total_rides?: number
          co2_saved?: number
          has_ceo_tshirt?: boolean
          assigned_airbear_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "driver" | "admin"
          eco_points?: number
          total_rides?: number
          co2_saved?: number
          has_ceo_tshirt?: boolean
          assigned_airbear_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          user_id: string
          pickup_spot_id: string
          dropoff_spot_id: string
          airbear_id: string
          status: "pending" | "booked" | "in_progress" | "completed" | "cancelled"
          fare: number
          distance_km: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          pickup_spot_id: string
          dropoff_spot_id: string
          airbear_id: string
          status?: "pending" | "booked" | "in_progress" | "completed" | "cancelled"
          fare: number
          distance_km: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          pickup_spot_id?: string
          dropoff_spot_id?: string
          airbear_id?: string
          status?: "pending" | "booked" | "in_progress" | "completed" | "cancelled"
          fare?: number
          distance_km?: number
          created_at?: string
          completed_at?: string | null
        }
      }
      bodega_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          is_eco_friendly: boolean
          is_available: boolean
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category: string
          is_eco_friendly?: boolean
          is_available?: boolean
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string
          is_eco_friendly?: boolean
          is_available?: boolean
          stock?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          ride_id: string | null
          airbear_id: string
          items: unknown
          total_amount: number
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ride_id?: string | null
          airbear_id: string
          items: unknown
          total_amount: number
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ride_id?: string | null
          airbear_id?: string
          items?: unknown
          total_amount?: number
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          ride_id: string | null
          user_id: string
          order_id: string | null
          amount: number
          currency: string
          payment_method: "stripe" | "apple_pay" | "google_pay" | "cash"
          stripe_payment_intent_id: string | null
          status: "pending" | "completed" | "failed" | "refunded"
          metadata: unknown | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id?: string | null
          user_id: string
          order_id?: string | null
          amount: number
          currency?: string
          payment_method: "stripe" | "apple_pay" | "google_pay" | "cash"
          stripe_payment_intent_id?: string | null
          status?: "pending" | "completed" | "failed" | "refunded"
          metadata?: unknown | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string | null
          user_id?: string
          order_id?: string | null
          amount?: number
          currency?: string
          payment_method?: "stripe" | "apple_pay" | "google_pay" | "cash"
          stripe_payment_intent_id?: string | null
          status?: "pending" | "completed" | "failed" | "refunded"
          metadata?: unknown | null
          created_at?: string
        }
      }
    }
  }
}
