"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  subscribeToAirbearLocations,
  type AirbearLocation,
} from "@/lib/supabase/realtime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Battery, MapPin, Navigation, Clock, Zap, Leaf } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import AirbearWheel from "@/components/airbear-wheel";
import AirbearAvatar from "@/components/airbear-avatar";

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted/20 animate-pulse rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
      <div className="text-center">
        <AirbearWheel size="xl" animated glowing className="mx-auto mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest">
          Scanning Binghamton...
        </p>
      </div>
    </div>
  ),
});

interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  amenities: string[] | null;
  is_active: boolean;
}

export default function MapPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [airbears, setAirbears] = useState<AirbearLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

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

        if (spotsError) throw spotsError;

        setSpots(
          (spotsData || []).map((s) => ({
            ...s,
            latitude: Number(s.latitude),
            longitude: Number(s.longitude),
          }))
        );

        // Load airbears
        const { data: airbearsData, error: airbearsError } = await supabase
          .from("airbears")
          .select("*");

        if (airbearsError) throw airbearsError;

        setAirbears(airbearsData || []);
      } catch (error) {
        console.error("[v0] Error loading map data:", error);
        toast({
          title: "Map Sync Failure",
          description: "Unable to connect to the AirBear tracking network.",
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

  const avgBattery = useMemo(() => {
    if (airbears.length === 0) return 0;
    return Math.round(
      airbears.reduce((sum, a) => sum + a.battery_level, 0) / airbears.length
    );
  }, [airbears]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AirbearWheel size="xl" animated glowing className="mx-auto mb-6" />
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">
            Initializing AirBear HUD
          </h2>
          <div className="mt-4 w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header HUD */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-primary/20 animate-pulse">
            <Zap className="w-3 h-3 mr-2" /> Live Tracking Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Real-Time{" "}
            <span className="airbear-holographic bg-clip-text text-transparent text-outline-strong px-2">
              AirBear Hub
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest text-xs">
            {spots.length} ACTIVE SPOTS • {availableAirbears.length} AVAILABLE
            RIDE-SHARES
          </p>
        </motion.div>

        {/* Tactical Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-morphism border-primary/10 p-6 hover-lift overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Navigation size={120} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Navigation className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Ready to Ride
                  </p>
                  <p className="text-4xl font-black text-emerald-500">
                    {availableAirbears.length}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-morphism border-primary/10 p-6 hover-lift overflow-hidden relative group border-amber-500/20">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MapPin size={120} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Active Spots
                  </p>
                  <p className="text-4xl font-black text-amber-500">
                    {spots.length}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-morphism border-primary/10 p-6 hover-lift overflow-hidden relative group border-blue-500/20">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Battery size={120} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Battery className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Network Energy
                  </p>
                  <p className="text-4xl font-black text-blue-500">
                    {avgBattery}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Map Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-3 glass-morphism border-primary/20 p-2 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-auto lg:h-[700px]">
              <MapComponent spots={spots} airbears={airbears} />

              {/* Map Overlay Controls */}
              <div className="absolute top-6 left-6 z-[1000] space-y-2">
                <div className="bg-background/80 backdrop-blur-md border border-primary/20 p-3 rounded-2xl shadow-xl">
                  <div className="text-[10px] font-black uppercase text-muted-foreground mb-2">
                    Map Legend
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold">READY TO GO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-[10px] font-bold">CHARGING</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                      <span className="text-[10px] font-bold">BUSY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Book / Spots Side Panel */}
          <div className="space-y-6">
            <Card className="glass-morphism border-primary/20 p-6 rounded-3xl">
              <h3 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                <Navigation className="w-4 h-4 mr-2" /> Top Locations
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {spots.map((spot, i) => (
                  <motion.div
                    key={spot.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <button
                      onClick={() => setSelectedSpot(spot)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all hover-lift ${
                        selectedSpot?.id === spot.id
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                          : "bg-muted/30 border-primary/5 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm block truncate">
                          {spot.name}
                        </span>
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] h-5">
                          {
                            airbears.filter(
                              (a) =>
                                a.current_spot_id === spot.id && a.is_available
                            ).length
                          }{" "}
                          Ready
                        </Badge>
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground font-bold">
                        <MapPin className="w-3 h-3 mr-1" /> View on Map
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="eco-gradient p-6 rounded-3xl text-white shadow-xl shadow-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-black uppercase tracking-tight leading-none">
                  The Eco
                  <br />
                  Standard
                </h3>
              </div>
              <p className="text-xs font-medium opacity-90 leading-relaxed mb-6">
                Every ride you book saves an average of 1.2kg of CO2. Thank you
                for riding solar!
              </p>
              <Button className="w-full bg-white text-primary font-black rounded-xl hover:bg-white/90">
                BOOK NOW
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
