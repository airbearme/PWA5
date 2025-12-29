"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, Users, Play } from "lucide-react";

export default function EcoImpact() {
  const impactData = [
    {
      icon: Leaf,
      title: "CO₂ Reduction",
      value: "2,847 kg",
      subtitle: "CO₂ Saved This Month",
      color: "text-emerald-500",
      progressColor: "bg-emerald-500",
      gradient: "from-emerald-100 to-green-100",
      progress: 68,
    },
    {
      icon: Sun,
      title: "Solar Energy",
      value: "15,240 kWh",
      subtitle: "Clean Energy Generated",
      color: "text-amber-500",
      progressColor: "bg-amber-500",
      gradient: "from-orange-100 to-amber-100",
      progress: 82,
    },
    {
      icon: Users,
      title: "Community",
      value: "3,247",
      subtitle: "Active Community Members",
      color: "text-primary",
      progressColor: "bg-primary",
      gradient: "from-blue-100 to-emerald-100",
      progress: 91,
    },
  ];

  return (
    <section id="eco" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-4">
            Growing a <span className="text-primary">Greener</span> Binghamton
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Every AirBear ride contributes to a cleaner, more sustainable
            future.
          </p>
        </motion.div>

        {/* Eco Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {impactData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass-morphism hover-lift group h-full border-primary/10 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-xl">
                      {item.title}
                    </h3>
                    <item.icon
                      className={`h-8 w-8 ${item.color} group-hover:animate-bounce`}
                    />
                  </div>

                  {/* Visual representation */}
                  <div
                    className={`relative h-48 bg-gradient-to-b ${item.gradient} dark:from-emerald-900/40 dark:to-green-900/20 rounded-2xl mb-6 overflow-hidden flex items-center justify-center`}
                  >
                    <div className="text-7xl">
                      {item.title === "CO₂ Reduction" && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          🌳
                        </motion.div>
                      )}

                      {item.title === "Solar Energy" && (
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ☀️
                        </motion.div>
                      )}

                      {item.title === "Community" && (
                        <motion.div
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          🤝
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <motion.div
                      className={`text-4xl font-black ${item.color} mb-1`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item.value}
                    </motion.div>
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      {item.subtitle}
                    </div>

                    {/* Progress bar */}
                    <div className="bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        className={`${item.progressColor} h-full rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weekly Challenge */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glass-morphism max-w-4xl mx-auto border-primary/20 p-8 rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-left space-y-6">
                <div className="inline-flex bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Live Challenge
                </div>
                <h3 className="text-3xl font-black text-foreground">
                  Weekly Eco Challenge
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Join 3,247 other Binghamton residents this week. Book 3
                  eco-rides and earn a limited edition digital badge and 50
                  Eco-Points!
                </p>
                <Button
                  size="lg"
                  className="eco-gradient text-white font-bold px-8 h-14 rounded-xl hover-lift animate-neon-glow"
                >
                  Join the Mission{" "}
                  <Play className="ml-2 h-5 w-5 fill-current" />
                </Button>
              </div>

              <div className="relative w-64 h-64 shrink-0">
                <motion.div
                  className="absolute inset-0 airbear-holographic rounded-full border-4 border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-4 glass-morphism rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎯</div>
                    <div className="font-black text-primary uppercase tracking-tighter">
                      SPIN & WIN
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
