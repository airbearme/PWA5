"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/components/auth-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useDriverLocation } from "@/lib/hooks/use-driver-location";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Navigation,
  Battery,
  MapPin,
  Activity,
  Clock,
  Zap,
  ShieldCheck,
  Settings,
  AlertCircle,
  Truck,
  CheckCircle2,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";

export default function DriverPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("*, assigned_airbear_id")
        .eq("id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const airbearId = profile?.assigned_airbear_id;
  const {
    isTracking,
    location,
    error: trackingError,
  } = useDriverLocation(airbearId);

  const { data: pendingRides = [], isLoading: ridesLoading } = useQuery({
    queryKey: ["rides", "pending"],
    queryFn: async () => {
      const { data } = await supabase
        .from("rides")
        .select("*, users!rides_user_id_fkey(username, avatar_url)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      return data || [];
    },
    refetchInterval: 5000,
    enabled: !!user?.id,
  });

  const handleAcceptRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from("rides")
        .update({ status: "booked" })
        .eq("id", rideId);

      if (error) throw error;

      toast({
        title: "Mission Accepted",
        description: "Rider notified. Head to pickup location.",
      });

      queryClient.invalidateQueries({ queryKey: ["rides", "pending"] });
    } catch (err: any) {
      toast({
        title: "Deployment Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Syncing Driver HUD..." />
      </div>
    );
  }

  if (!user || profile?.role !== "driver") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="bg-destructive/10 p-6 rounded-full">
          <ShieldCheck className="w-12 h-12 text-destructive animate-pulse" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Access Denied
        </h2>
        <p className="text-muted-foreground font-medium">
          This command center is reserved for AirBear Operators.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="font-black px-8 h-12 rounded-xl">
            RETURN TO BASE
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* HUD Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <Truck className="w-16 h-16 text-primary relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Command <span className="text-primary">Center</span>
              </h1>
              <div className="flex items-center mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Operator: {profile?.username || user.email?.split("@")[0]}{" "}
                <span className="mx-3 text-primary">•</span> Unit:{" "}
                {airbearId?.slice(0, 8) || "No Unit Assigned"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge
              variant="outline"
              className={`h-12 px-6 rounded-2xl border-primary/20 bg-primary/5 flex items-center gap-3 ${
                isTracking ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isTracking ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              ></div>
              <span className="font-black uppercase tracking-widest text-[10px]">
                Signal: {isTracking ? "Active" : "Standby"}
              </span>
            </Badge>
            <Link href="/map">
              <Button className="h-12 px-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 border border-primary/20 shadow-xl">
                <MapPin className="w-4 h-4 mr-2" /> Live Tactical Map
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Telemetry Panel */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-morphism border-primary/10 p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Battery className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                      Battery
                    </p>
                    <p className="text-xl font-black">87%</p>
                  </div>
                </div>
              </Card>
              <Card className="glass-morphism border-primary/10 p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                      Speed
                    </p>
                    <p className="text-xl font-black">
                      {location ? (location.speed * 3.6).toFixed(1) : "0.0"}{" "}
                      <span className="text-xs">KPH</span>
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="glass-morphism border-primary/10 p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                      Heading
                    </p>
                    <p className="text-xl font-black">
                      {location ? location.heading.toFixed(0) : "0"}°
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="glass-morphism border-primary/10 p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                      System
                    </p>
                    <p className="text-xl font-black text-emerald-500">
                      NOMINAL
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dynamic Map/Location HUD */}
            <Card className="glass-morphism border-primary/20 p-8 rounded-3xl relative overflow-hidden h-[400px] flex items-center justify-center">
              {!airbearId ? (
                <div className="text-center space-y-4">
                  <div className="bg-amber-500/10 p-6 rounded-full inline-block">
                    <AlertCircle className="w-12 h-12 text-amber-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Deployment Locked
                  </h3>
                  <p className="text-muted-foreground font-medium max-w-sm">
                    You have not been assigned an AirBear unit. Contact base
                    command for unit allocation.
                  </p>
                  <Button className="bg-primary text-white font-black px-8 h-12 rounded-xl mt-4">
                    REQUEST ASSIGNMENT
                  </Button>
                </div>
              ) : isTracking && location ? (
                <div className="w-full h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                      Real-time Broadcast Active
                    </h3>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      ACCURACY: ±{location.accuracy.toFixed(1)}M
                    </Badge>
                  </div>

                  <div className="flex-1 border border-primary/10 rounded-2xl bg-black/40 p-8 flex items-center justify-center relative">
                    {/* Radar Animation Placeholder */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>
                    <div className="text-center space-y-6 relative z-10">
                      <div className="flex justify-center gap-8">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">
                            LATITUDE
                          </p>
                          <p className="text-3xl font-black font-mono">
                            {location.latitude.toFixed(6)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">
                            LONGITUDE
                          </p>
                          <p className="text-3xl font-black font-mono">
                            {location.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-primary/10">
                        <p className="text-sm font-bold text-emerald-500 opacity-80 uppercase tracking-widest animate-pulse">
                          Broadcasting Telemetry to Fleet Network...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <LoadingSpinner size="lg" text="Awaiting GPS Lock..." />
                  <p className="text-muted-foreground font-medium">
                    Positioning sensors initializing...
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Ride Queue Panel */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="glass-morphism border-primary/20 p-2 rounded-3xl overflow-hidden h-full flex flex-col">
              <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Mission Queue
                  </h3>
                  <Badge className="bg-emerald-500 font-black">
                    {pendingRides.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Accept nearby missions to maximize your eco-influence and
                  earnings.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {pendingRides.length > 0 ? (
                    pendingRides.map((ride: any, i: number) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="glass-morphism border-primary/20 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border-l-4 border-l-primary group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/20 p-2 rounded-lg">
                                <Truck className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-black text-xs uppercase">
                                  Mission Pulse
                                </p>
                                <p className="text-[10px] text-muted-foreground font-bold">
                                  ETA: 4-6 MIN
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-primary/20 text-primary font-black uppercase text-[10px]"
                            >
                              ${ride.fare || "12.00"}
                            </Badge>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">
                                From: {ride.pickup_spot_id || "Current Sector"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">
                                To: {ride.dropoff_spot_id || "Target Sector"}
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleAcceptRide(ride.id)}
                            className="w-full h-10 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-transform"
                          >
                            ACCEPT MISSION
                          </Button>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <Clock className="w-12 h-12 text-muted-foreground/30 mb-4 animate-spin-slow" />
                      <p className="font-black uppercase text-xs text-muted-foreground/50 tracking-widest">
                        Scanning for signals...
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-4 bg-primary/5 border-t border-primary/10 rounded-b-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">
                      Network Live
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-primary">
                    SYNCING...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
