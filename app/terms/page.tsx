"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Scale,
  DollarSign,
  Ban,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function TermsPage() {
  const sections = [
    {
      icon: Shield,
      title: "Tactical Service Description",
      content:
        "AirBear provides an advanced grid of solar-powered rickshaw units and mobile bodega platforms in the Binghamton sector. We facilitate sustainable movement and zero-emission logistics for authorized agents.",
    },
    {
      icon: Scale,
      title: "Agent Responsibilities",
      content:
        "Agents must maintain operational integrity. Any use of the grid for non-sanctioned or illegal activity will result in immediate termination of service and blacklisting from the AirBear network.",
    },
    {
      icon: DollarSign,
      title: "Solar Credits & Syncing",
      content:
        "All transactions are synchronized via our secure protocol. Fares and product costs are calculated in real-time based on grid demand and resource availability.",
    },
    {
      icon: Ban,
      title: "Prohibited Interference",
      content:
        "Unauthorized modification of solar units, interference with telemetry signals, or harassment of other agents is strictly forbidden by sector command.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-20">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Terms of <span className="text-primary">Operations</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Last Sync: Oct 14, 2025
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism border-primary/10 rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 bg-primary/5">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-muted-foreground font-medium">
                    {s.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              By accessing the AirBear grid, you acknowledge full compliance
              with sector directives.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
