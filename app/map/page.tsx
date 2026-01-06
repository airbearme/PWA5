"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { subscribeToAirbearLocations } from "@/lib/supabase/realtime";
import { useAirbearNotifications } from "@/lib/hooks/use-airbear-notifications";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Battery, MapPin, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/map-view-beautiful";
import type { Spot } from "@/components/map-view";
import type { AirbearLocation } from "@/lib/supabase/realtime";

export default function MapPage() {
  const { loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [airbears, setAirbears] = useState<AirbearLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = getSupabaseClient();

        // Load spots
        const { data: spotsData, error: spotsError } = await supabase
          .from("spots")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (spotsError) {
          console.error("Error loading spots:", spotsError);
          throw spotsError;
        }

        setSpots(spotsData || []);

        // Load airbears
        const { data: airbearsData, error: airbearsError } = await supabase
          .from("airbears")
          .select("*");

        if (airbearsError) {
          throw airbearsError;
        }

        setAirbears(airbearsData || []);
      } catch (err) {
        console.error("Error loading map data:", err);
        toast({
          title: "Error loading map",
          description: "Unable to load map data. Please try refreshing.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Subscribe to real-time airbear location updates
  useEffect(() => {
    const unsubscribe = subscribeToAirbearLocations((updatedAirbear) => {
      setAirbears((prev) => {
        const existingIndex = prev.findIndex((a) => a.id === updatedAirbear.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedAirbear;
          return updated;
        }
        return [...prev, updatedAirbear];
      });
    });

    return unsubscribe;
  }, []);

  const availableAirbears = useMemo(() => {
    return airbears.filter((a) => a.is_available && !a.is_charging);
  }, [airbears]);

  // Enable push notifications for airbear availability
  useAirbearNotifications(airbears);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Loading AirBear map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Real-Time AirBear Tracking
          </h1>
          <p className="text-lg text-muted-foreground">
            Track solar-powered rides across Binghamton in real-time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Navigation
                  className="w-6 h-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Available AirBears
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {availableAirbears.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin
                  className="w-6 h-6 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Spots</p>
                <p className="text-2xl font-bold text-orange-600">
                  {spots.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Battery
                  className="w-6 h-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Battery</p>
                <p className="text-2xl font-bold text-blue-600">
                  {airbears.length > 0
                    ? Math.round(
                        airbears.reduce((sum, a) => sum + a.battery_level, 0) /
                          airbears.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="p-6">
          <MapComponent 
            spots={spots} 
            airbears={airbears}
            onSpotSelect={(spot) => {
              router.push(`/book?pickup=${spot.id}`);
            }}
          />
        </Card>
        
        {/* Quick Book Button */}
        <div className="mt-6 text-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <Link href="/book">Book a Ride</Link>
          </Button>
        </div>

        {/* Legend */}
        <Card className="mt-6 p-4">
          <h3 className="font-semibold mb-3">Map Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Available AirBear</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Charging Station</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              <span>In Use</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
