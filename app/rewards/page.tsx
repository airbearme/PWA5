"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthContext } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Star,
  Crown,
  Zap,
  ShoppingBag,
  Coffee,
  ArrowRight,
  Ticket,
  Sparkles,
  Package,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";

const rewards = [
  {
    id: 1,
    name: "Free Solar Pulse Coffee",
    desc: "Redeem for any artisanal coffee at participating bodega units.",
    cost: 200,
    category: "Bodega",
    icon: Coffee,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    name: "VIP Transit Pass",
    desc: "24-hour priority booking for all AirBear solar units.",
    cost: 500,
    category: "Service",
    icon: Ticket,
    gradient: "from-primary to-emerald-600",
  },
  {
    id: 3,
    name: "Vanguard Jacket",
    desc: "Limited edition eco-performance gear. Physical shipping included.",
    cost: 2500,
    category: "Mercantile",
    icon: Package,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 4,
    name: "Quantum Ride Pack",
    desc: "10 free solar rides anywhere in the Binghamton grid.",
    cost: 1500,
    category: "Service",
    icon: Zap,
    gradient: "from-purple-500 to-pink-600",
  },
];

export default function RewardsPage() {
  const { user } = useAuthContext();
  const points = 1240; // Mock data for premium feel

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 pt-20 relative z-10">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-amber-500 absolute -top-4 -right-4 animate-pulse" />
              <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center border border-amber-500/20 rotate-12">
                <Gift className="w-10 h-10 text-amber-500 -rotate-12" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Solar{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Rewards
            </span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
            Liquidate your accumulated eco-points for premium goods and
            services.
          </p>
        </motion.div>

        {/* Balance HUD */}
        <motion.div
          className="max-w-md mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphism border-amber-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10 text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
                Available Balance
              </p>
              <div className="flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                <p className="text-6xl font-black tracking-tighter">
                  {points.toLocaleString()}
                </p>
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                ECO POINTS READY FOR SYNC
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
              <Crown className="w-48 h-48" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          </Card>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="glass-morphism border-white/5 overflow-hidden rounded-[2.5rem] group hover:border-amber-500/30 transition-all flex flex-col h-full">
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reward.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}
                    >
                      <reward.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="bg-white/5 text-muted-foreground border-white/10 uppercase text-[10px] font-black tracking-widest">
                      {reward.category}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-muted-foreground font-medium mb-6 leading-relaxed">
                    {reward.desc}
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        Requirement
                      </p>
                      <p
                        className={`text-3xl font-black ${
                          points >= reward.cost
                            ? "text-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        {reward.cost}
                      </p>
                    </div>
                    <Progress
                      value={Math.min((points / reward.cost) * 100, 100)}
                      className="h-2 bg-white/5"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/5">
                  <Button
                    disabled={points < reward.cost}
                    className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs ${
                      points >= reward.cost
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {points >= reward.cost
                      ? "REDEEM REWARD"
                      : `LOCKED: ${reward.cost - points} MORE POINTS`}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Milestone Tracker */}
        <motion.div
          className="mt-20 p-12 glass-morphism border-primary/20 rounded-[3rem] relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                Community Impact Mileposts
              </h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                When the Binghamton grid reaches{" "}
                <span className="text-primary font-bold">100,000kg</span> of
                total CO2 offset, all active agents will receive a{" "}
                <span className="text-amber-500 font-bold">
                  Found&#39;er Core
                </span>{" "}
                badge.
              </p>
              <div className="w-full md:w-[400px] space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Grid Total: 87,422kg</span>
                  <span>Target: 100,000kg</span>
                </div>
                <Progress value={87.4} className="h-3 bg-primary/10" />
              </div>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="user"
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="w-16 h-16 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white font-black text-xs">
                +420
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sparkles className="w-64 h-64" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}