"use client";

import { motion } from "framer-motion";
import { useAuthContext } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Trophy,
  Leaf,
  Zap,
  Star,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";
import Link from "next/link";

const challenges = [
  {
    id: 1,
    title: "Eco Pulse",
    desc: "Complete 3 solar rides in a single day.",
    points: 100,
    progress: 1,
    target: 3,
    type: "Daily",
    icon: Flame,
    color: "primary",
  },
  {
    id: 2,
    title: "Grid Pioneer",
    desc: "Visit 5 unique docking spots in Binghamton.",
    points: 250,
    progress: 3,
    target: 5,
    type: "Weekly",
    icon: Target,
    color: "amber-500",
  },
  {
    id: 3,
    title: "Zero Emission",
    desc: "Save 10kg of CO2 this month through solar transit.",
    points: 500,
    progress: 4.2,
    target: 10,
    type: "Monthly",
    icon: Leaf,
    color: "emerald-500",
  },
];

export default function ChallengesPage() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      {/* Hero Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 pt-20 relative z-10">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge
            variant="outline"
            className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.3em]"
          >
            Tactical Missions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Eco{" "}
            <span className="airbear-holographic bg-clip-text text-transparent">
              Challenges
            </span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
            Complete specialized missions to accelerate your evolution in the
            solar grid.
          </p>
        </motion.div>

        {/* Stats HUD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              label: "Active Missions",
              val: "3",
              icon: Target,
              color: "text-primary",
            },
            {
              label: "Total Points",
              val: "1,240",
              icon: Zap,
              color: "text-amber-500",
            },
            {
              label: "Global Rank",
              val: "#42",
              icon: Trophy,
              color: "text-emerald-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism border-primary/10 p-6 rounded-3xl hover-lift">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <p
                      className={`text-4xl font-black tracking-tighter ${stat.color}`}
                    >
                      {stat.val}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Challenges List */}
        <div className="space-y-6">
          {challenges.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="glass-morphism border-primary/10 overflow-hidden rounded-[2rem] group hover:border-primary/30 transition-all">
                <div className="flex flex-col md:flex-row p-8 gap-8 items-center">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform`}
                  >
                    <challenge.icon className="w-10 h-10 text-primary" />
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                      <h3 className="text-2xl font-black uppercase tracking-tight">
                        {challenge.title}
                      </h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black">
                        {challenge.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      {challenge.desc}
                    </p>
                  </div>

                  <div className="w-full md:w-64 space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Progress</span>
                      <span>
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                    <Progress
                      value={(challenge.progress / challenge.target) * 100}
                      className="h-2 bg-primary/10"
                    />
                  </div>

                  <div className="text-center md:text-right min-w-[120px]">
                    <p className="text-2xl font-black text-primary">
                      +{challenge.points}
                    </p>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                      Solar Points
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bonus Section */}
        <motion.div
          className="mt-20 p-12 eco-gradient rounded-[3rem] text-white relative overflow-hidden text-center md:text-left shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="space-y-4 flex-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Elite Vanguard Program
              </h2>
              <p className="font-bold text-white/80 max-w-xl">
                Reach level 10 to unlock exclusive night missions, premium
                vehicle skins, and priority docking privileges.
              </p>
              <Button className="bg-white text-emerald-900 font-black px-8 h-12 rounded-xl hover:bg-emerald-50">
                VIEW RANKINGS
              </Button>
            </div>
            <div className="relative">
              <AirbearWheel size="xl" glowing animated />
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Award className="w-64 h-64" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
