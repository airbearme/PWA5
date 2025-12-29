"use client";

import { motion } from "framer-motion";
import { Shield, EyeOff, Lock, Database, Globe, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  const points = [
    {
      title: "Telemetry Masking",
      icon: EyeOff,
      text: "Your precise coordinates are only broadcast to active fleet operators during a mission. Once a deployment is complete, telemetry is archived and anonymized.",
    },
    {
      title: "Quantum Encryption",
      icon: Lock,
      text: "All agent communications and identity data are secured via end-to-end quantum-safe encryption protocols.",
    },
    {
      title: "Zero Third-Party Sync",
      icon: Share2,
      text: "We do not sell your mission data to external corporate grids. Your activity history belongs exclusively to the AirBear network.",
    },
    {
      title: "Data Sovereignty",
      icon: Database,
      text: "Agents retain the right to terminate their profile and purge all non-essential mission logs from our central archives at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-20">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Privacy <span className="text-emerald-500">Manifesto</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Grid Privacy Level: MAXIMAL
          </p>
        </motion.div>

        <div className="grid gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism border-emerald-500/10 rounded-[2rem] overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="p-8 flex items-start gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                    <p.icon className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 p-12 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Globe className="w-12 h-12 text-emerald-500 mx-auto mb-6 opacity-30" />
          <p className="text-sm font-bold text-muted-foreground leading-relaxed">
            We operate in full compliance with GDPR and CCPA directives, while
            exceeding standard privacy benchmarks through our custom blockchain
            telemetry integration.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
