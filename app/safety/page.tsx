"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Heart,
  Eye,
  Bell,
  PhoneCall,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SafetyPage() {
  const protocols = [
    {
      title: "Tactical Verification",
      desc: "Every AirBear operator undergoes a rigorous background sync and tactical training program.",
      icon: ShieldCheck,
    },
    {
      title: "Real-time Telemetry",
      desc: "Your mission is tracked in high-fidelity 24/7 by our central command grid.",
      icon: Eye,
    },
    {
      title: "Secure Comms",
      desc: "All communication between agents and command is encrypted via quantum-safe protocols.",
      icon: Lock,
    },
    {
      title: "Emergency Beacon",
      desc: "Instant access to local emergency services directly from your tactical HUD.",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <motion.div
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-6 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px]">
            Secure Operations
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">
            Safety <span className="text-emerald-500">Protocols</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-3xl mx-auto text-xl leading-relaxed">
            At AirBear, security isn&apos;t just a feature—it&apos;s the core
            architecture of our solar-powered revolution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {protocols.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism border-emerald-500/10 overflow-hidden rounded-[2.5rem] p-10 group hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                    <p.icon className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-destructive/5 border border-destructive/20 rounded-[3rem] p-12 text-center space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto animate-pulse" />
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Zero Tolerance Policy
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg">
              result in immediate and permanent grid deactivation. We maintain a
              sanctuary of sustainable movement.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
