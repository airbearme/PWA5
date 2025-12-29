"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/components/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Leaf,
  MapPin,
  ShoppingBag,
  Zap,
  Award,
  Target,
  Calendar,
  TrendingUp,
  Activity,
  Battery,
  Users,
  Navigation,
  Sparkles,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState("overview");
  const supabase = getSupabaseClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: rides, isLoading: ridesLoading } = useQuery({
    queryKey: ["rides", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("rides")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Booting HUD..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full">
          <Zap className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Authentication Required
        </h2>
        <p className="text-muted-foreground font-medium">
          Please sign in to access your tactical dashboard.
        </p>
        <Link href="/auth">
          <Button className="eco-gradient text-white font-black px-8 h-12 rounded-xl hover-lift">
            LOGIN TO GRID
          </Button>
        </Link>
      </div>
    );
  }

  const role = profile?.role || "user";
  const username = profile?.username || user.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* HUD Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/30 rounded-full animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header HUD */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <AirbearWheel size="lg" glowing animated />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                SYSTEM{" "}
                <span className="airbear-holographic bg-clip-text text-transparent text-outline-strong px-2">
                  ONLINE
                </span>
              </h1>
              <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
                Welcome back, Agent {username}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Card className="glass-morphism border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Solar Pool
                </p>
                <p className="text-xl font-black text-primary">
                  {profile?.eco_points || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Role-Based Components */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="glass-morphism border-primary/20 p-2 rounded-3xl">
              <div className="flex flex-col gap-1">
                {[
                  {
                    id: "overview",
                    label: "Tactical Overview",
                    icon: Activity,
                  },
                  { id: "rides", label: "Ride History", icon: MapPin },
                  { id: "eco", label: "Impact Stats", icon: Leaf },
                  { id: "settings", label: "HUD Config", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-6 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                      activeTab === item.id
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>

            {role === "driver" && (
              <Card className="eco-gradient p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-black uppercase tracking-widest text-xs mb-2">
                    Driver Status
                  </h3>
                  <p className="text-2xl font-black mb-4">ACTIVE DUTY</p>
                  <Link href="/driver">
                    <Button className="w-full bg-white text-emerald-900 font-black rounded-xl hover:bg-emerald-50">
                      OPEN COMMAND
                    </Button>
                  </Link>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                  <AirbearWheel size="xl" animated />
                </div>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="glass-morphism border-primary/10 p-6 rounded-3xl hover-lift">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-primary/10 rounded-2xl">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none">
                            +12%
                          </Badge>
                        </div>
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Total Missions
                        </h4>
                        <p className="text-4xl font-black tracking-tighter">
                          {profile?.total_rides || 0}
                        </p>
                      </Card>

                      <Card className="glass-morphism border-primary/10 p-6 rounded-3xl hover-lift">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Leaf className="w-6 h-6 text-emerald-500" />
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none">
                            LVL 4
                          </Badge>
                        </div>
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          CO₂ Offset
                        </h4>
                        <p className="text-4xl font-black tracking-tighter">
                          {profile?.co2_saved || "0"}{" "}
                          <span className="text-lg">KG</span>
                        </p>
                      </Card>

                      <Card className="glass-morphism border-primary/10 p-6 rounded-3xl hover-lift">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-amber-500/10 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                          </div>
                          <Badge className="bg-amber-500/10 text-amber-500 border-none">
                            TOP 5%
                          </Badge>
                        </div>
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Grid Rank
                        </h4>
                        <p className="text-4xl font-black tracking-tighter">
                          #47
                        </p>
                      </Card>
                    </div>

                    {/* Level Progress */}
                    <Card className="glass-morphism border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Award className="w-32 h-32" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">
                              Vanguard Evolution
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm">
                              Earn 350 more Solar Points to unlock{" "}
                              <span className="text-primary font-bold">
                                Quantum Bear
                              </span>{" "}
                              status.
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black uppercase text-muted-foreground">
                              Progress
                            </p>
                            <p className="text-3xl font-black text-primary">
                              73%
                            </p>
                          </div>
                        </div>
                        <Progress value={73} className="h-4 bg-primary/10" />
                      </div>
                    </Card>

                    {/* Primary Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Link href="/map" className="group">
                        <Card className="glass-morphism border-primary/20 p-8 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                              <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                              Book Deployment
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm">
                              Locate and deploy a solar unit to your current
                              grid coordinates.
                            </p>
                            <div className="mt-8 flex items-center text-primary font-black uppercase text-xs tracking-widest">
                              INITIATE SCAN{" "}
                              <ArrowUpRight className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </Card>
                      </Link>

                      <Link href="/products" className="group">
                        <Card className="glass-morphism border-amber-500/20 p-8 rounded-3xl bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                              Mobile Bodega
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm">
                              Restock essentials from local providers during
                              your solar transit.
                            </p>
                            <div className="mt-8 flex items-center text-amber-500 font-black uppercase text-xs tracking-widest">
                              BROWSE STOCK{" "}
                              <ArrowUpRight className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === "rides" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Deployment History
                    </h3>
                    {ridesLoading ? (
                      <LoadingSpinner />
                    ) : rides && rides.length > 0 ? (
                      <div className="grid gap-4">
                        {rides.map((ride: any, i: number) => (
                          <Card
                            key={ride.id}
                            className="glass-morphism border-primary/10 p-6 rounded-2xl flex items-center justify-between hover:bg-primary/5 transition-colors"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-black uppercase text-sm">
                                  Mission {ride.id.slice(0, 8)}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">
                                  {new Date(
                                    ride.created_at
                                  ).toLocaleDateString()}{" "}
                                  • {ride.from_spot_id || "Alpha Grid"} →{" "}
                                  {ride.to_spot_id || "Omega Grid"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                ride.status === "completed"
                                  ? "bg-emerald-500/90"
                                  : "bg-primary"
                              }
                            >
                              {ride.status.toUpperCase()}
                            </Badge>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-primary/20">
                        <div className="text-6xl mb-6">🛸</div>
                        <h4 className="text-xl font-black uppercase mb-2">
                          No Deployments Found
                        </h4>
                        <p className="text-muted-foreground font-medium mb-8">
                          Ready to start your first solar-powered mission?
                        </p>
                        <Link href="/map">
                          <Button className="eco-gradient text-white font-black px-8 h-12 rounded-xl">
                            START MISSION
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "eco" && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Ecological Impact HUD
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="glass-morphism border-primary/20 p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black uppercase text-sm">
                              Grid Energy Delta
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Solar energy contributed to the grid
                            </p>
                          </div>
                        </div>
                        <p className="text-6xl font-black text-emerald-500 mb-2">
                          124.8 <span className="text-xl">KWH</span>
                        </p>
                        <Progress
                          value={85}
                          className="h-2 bg-emerald-500/10"
                        />
                        <p className="mt-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
                          85% Post-Carbon Efficiency
                        </p>
                      </Card>

                      <Card className="glass-morphism border-primary/20 p-8 rounded-3xl">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black uppercase text-sm">
                              Community Influence
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Agents influenced by your activity
                            </p>
                          </div>
                        </div>
                        <p className="text-6xl font-black text-primary mb-2">
                          12 <span className="text-xl">AGENTS</span>
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full bg-primary/20 animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                          ))}
                        </div>
                        <p className="mt-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
                          Viral Sustainability Impact
                        </p>
                      </Card>
                    </div>

                    <Card className="eco-gradient p-8 rounded-3xl text-white relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                        <div className="text-center md:text-left">
                          <h3 className="text-3xl font-black uppercase mb-2">
                            Weekly Challenge
                          </h3>
                          <p className="text-white/80 font-bold max-w-md">
                            Complete 5 solar rides during sunrise/sunset hours
                            to earn a Limited Edition{" "}
                            <span className="text-amber-400">Solar Flare</span>{" "}
                            badge.
                          </p>
                        </div>
                        <div className="flex items-center gap-6 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20">
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                              Progress
                            </p>
                            <Progress
                              value={40}
                              className="w-32 h-3 bg-white/20"
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black">2/5</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Sparkles className="w-48 h-48" />
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="max-w-2xl space-y-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      HUD Configuration
                    </h3>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-primary/10">
                        <div>
                          <p className="font-bold uppercase text-sm mb-1">
                            Holographic UI Effects
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            Toggle advanced visual shaders and particles.
                          </p>
                        </div>
                        <Button className="bg-primary text-white font-black px-6 rounded-xl">
                          ACTIVE
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-primary/10">
                        <div>
                          <p className="font-bold uppercase text-sm mb-1">
                            Real-time Telemetry
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            Automatic updates of fleet coordinates.
                          </p>
                        </div>
                        <Button className="bg-primary text-white font-black px-6 rounded-xl">
                          ACTIVE
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-primary/10 opacity-50">
                        <div>
                          <p className="font-bold uppercase text-sm mb-1">
                            Ghost Mode Navigation
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            Conceal tactical movement from other agents.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="font-black px-6 rounded-xl"
                          disabled
                        >
                          LOCKED
                        </Button>
                      </div>
                    </div>

                    <Card className="glass-morphism border-destructive/20 p-8 rounded-3xl">
                      <h4 className="text-sm font-black uppercase text-destructive mb-4 tracking-widest">
                        Protocol Termination
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
                        Deactivating your profile will cease all solar
                        accumulation and remove you from the active agent grid.
                        This action is reversible but will result in loss of
                        current mission progress.
                      </p>
                      <Button
                        variant="destructive"
                        className="font-black uppercase text-xs tracking-widest px-8 h-12 rounded-xl"
                      >
                        DEACTIVATE PROFILE
                      </Button>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
