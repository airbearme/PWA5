"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Zap,
  Search,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "How do I book a solar unit?",
    a: "Access the tactical map from your HUD, select an available unit or docking spot, and initiate deployment. Our solar fleet is ready 24/7.",
  },
  {
    q: "What is the Mobile Bodega?",
    a: "Every AirBear unit is equipped with a curated selection of local goods. Browse and purchase directly from your HUD during transit.",
  },
  {
    q: "How do I earn Solar Points?",
    a: "Points are accumulated through eco-friendly mileage, product purchases, and completing tactical challenges found in your mission log.",
  },
  {
    q: "Are the vehicles autonomous?",
    a: "Our current fleet is operator-driven for maximum safety, but is built on a modular platform ready for future autonomous integration.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <motion.div
          className="text-center mb-16 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20">
              <LifeBuoy className="w-10 h-10 text-primary animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">
            Support <span className="text-primary">Grid</span>
          </h1>
          <div className="max-w-xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search the archives..."
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Search className="absolute right-6 top-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Mission Intelligence",
              label: "READ DOCS",
              icon: BookOpen,
            },
            { title: "Direct Link", label: "START CHAT", icon: MessageSquare },
            { title: "Fleet Status", label: "VIEW GRID", icon: Zap },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-morphism border-primary/10 p-8 rounded-[2rem] h-full flex flex-col items-center text-center space-y-6 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <c.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {c.title}
                </h3>
                <Button
                  variant="ghost"
                  className="font-black uppercase tracking-widest text-[10px] text-primary group"
                >
                  {c.label}{" "}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-10 text-center">
            Frequently Requested Intel
          </h2>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-morphism border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all">
                <div className="p-8 space-y-4">
                  <h4 className="text-xl font-bold flex items-center gap-4">
                    <span className="text-primary font-black text-xs uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                      Question
                    </span>
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground font-medium leading-relaxed pl-14 border-l-2 border-primary/20 ml-4">
                    {faq.a}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center p-12 glass-morphism border-primary/10 rounded-[3rem]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
            Still in the dark?
          </h3>
          <p className="text-muted-foreground font-medium mb-8">
            Establish a secure voice uplink with Binghamton Sector Command.
          </p>
          <Button className="eco-gradient text-white font-black px-12 h-14 rounded-2xl hover-lift shadow-xl shadow-primary/20">
            CALL SECTOR COMMAND
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
