"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ShoppingBag,
  Leaf,
  Zap,
  Crown,
  Play,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";
import EcoImpact from "@/components/eco-impact";
import { HolographicCard } from "@/components/ui/holographic-card";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Enhanced Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Plasma Vortex Background */}
        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] airbear-plasma rounded-full opacity-30"></div>

        {/* Solar Rays Effect */}
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] airbear-solar-rays rounded-full opacity-40"></div>

        {/* God Rays */}
        <div className="absolute -bottom-[20%] left-[30%] w-[50%] h-[50%] airbear-god-rays rounded-full opacity-50"></div>

        {/* Eco Breeze Waves */}
        <div className="absolute top-[40%] left-[10%] w-[30%] h-[20%] airbear-eco-breeze rounded-full opacity-60"></div>

        {/* Enhanced Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-primary/30' :
              i % 4 === 1 ? 'bg-amber-500/25' :
              i % 4 === 2 ? 'bg-emerald-500/25' :
              'bg-purple-500/20'
            }`}
            style={{
              width: Math.random() * 20 + 8 + "px",
              height: Math.random() * 20 + 8 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 8,
            }}
          />
        ))}

        {/* Particle Systems */}
        <div className="absolute top-[20%] left-[20%] w-[15%] h-[15%] particle-system opacity-70"></div>
        <div className="absolute bottom-[30%] right-[25%] w-[12%] h-[12%] particle-system opacity-50"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-12">
            {/* Mascot Launch Animation */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-amber-500 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                data-testid="img-mascot"
                className="relative rounded-full w-44 h-44 object-cover border-4 border-white/20 shadow-2xl animate-neon-glow"
              />
              <motion.div
                className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Typography Hero */}
            <div className="space-y-6 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="px-6 py-2 rounded-full border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.4em] mb-6">
                  Sector 6 • Binghamton Grid Active
                </Badge>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-9xl font-black tracking-tighter leading-none font-orbitron"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="airbear-holographic bg-clip-text text-transparent italic px-4">
                  AIRBEAR
                </span>
                <br />
                <span className="text-foreground text-outline-strong">
                  BODEGA SYNC
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Deploy into the future with{" "}
                <span className="text-primary font-bold">Quantum-Ready</span>{" "}
                solar transport. Zero emissions. On-demand bodega.
              </motion.p>
            </div>

            {/* Tactical CTAs */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 w-full max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/map" className="flex-1">
                <Button
                  data-testid="button-book-airbear"
                  className="w-full h-16 rounded-2xl eco-gradient text-white text-lg font-black uppercase tracking-widest hover-lift shadow-xl shadow-primary/20"
                >
                  <MapPin className="mr-3 h-5 w-5" />
                  Initiate Deployment
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 h-16 rounded-2xl glass-morphism border-primary/20 font-black uppercase tracking-widest text-xs hover:bg-primary/10"
              >
                <Cpu className="mr-3 h-5 w-5 text-primary" />
                View Tech Spec
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tactical Stats Grid */}
      <section className="py-20 bg-white/5 dark:bg-black/5 border-y border-white/10 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Active Nodes",
                val: "16",
                icon: MapPin,
                tid: "stat-rides",
              },
              {
                label: "CO2 Offset",
                val: "582kg",
                icon: Leaf,
                tid: "stat-co2",
              },
              { label: "Grid Purity", val: "100%", icon: Zap, tid: "" },
              {
                label: "Market Access",
                val: "LIVE",
                icon: ShoppingBag,
                tid: "",
              },
            ].map((stat, i) => (
              <HolographicCard key={i} interactive className="text-center p-8">
                <div data-testid={stat.tid}>
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-4 opacity-50" />
                  <p className="text-4xl font-black tracking-tighter mb-1 font-orbitron">
                    {stat.val}
                  </p>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                    {stat.label}
                  </p>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
        {/* Decorative Scanline */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </section>

      {/* Feature Showcase */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HolographicCard variant="hud" className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                Bio-Dynamic Power
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                Utilizing the latest C4V solar integration to power high-torque
                hub motors. Clean transit, zero compromises.
              </p>
            </HolographicCard>

            <HolographicCard variant="hud" className="space-y-6">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <ShoppingBag className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                Mobile Marketplace
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                Hyper-local supply chain integration. Browse curated essentials
                while the grid navigates you home.
              </p>
            </HolographicCard>

            <HolographicCard variant="hud" className="space-y-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                Neural Routing
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                Predictive deployment ensures an AirBear unit is always within 5
                blocks of your tactical coordinates.
              </p>
            </HolographicCard>
          </div>
        </div>
      </section>

      <EcoImpact />

      {/* CEO Special Section */}
      <section className="py-32 container mx-auto px-4">
        <HolographicCard
          className="p-0 border-none bg-transparent"
          interactive={false}
        >
          <div className="eco-gradient p-12 md:p-20 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.15)_0%,transparent_50%)]"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8 text-center lg:text-left">
                <Badge className="bg-white/20 text-white font-bold px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                  Limited Alpha Series
                </Badge>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                  CEO-Signed <br /> AirBear T-Shirt
                </h2>
                <p className="text-white/80 font-bold text-xl max-w-lg">
                  Acquire the official AirBear CEO Operator Shell. Signed,
                  sealed, and synced with 24-hour unlimited grid status.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    data-testid="button-ceo-tshirt"
                    className="h-16 px-10 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 text-lg uppercase tracking-widest shadow-2xl"
                  >
                    Secure Shell $100
                  </Button>
                  <div className="flex items-center justify-center gap-3 text-white/60">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-tighter">
                      Verified Authentic
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 animate-pulse"></div>
                <AirbearWheel
                  size="xl"
                  glowing
                  animated
                  effectType="fire"
                  className="w-64 h-64 md:w-80 md:h-80 opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
              <Crown className="w-64 h-64 text-white" />
            </div>
          </div>
        </HolographicCard>
      </section>
    </div>
  );
}