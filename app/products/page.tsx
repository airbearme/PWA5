"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutButton } from "@/components/checkout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Leaf,
  Sparkles,
  Search,
  ShoppingBag,
  Zap,
  Star,
  Info,
} from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";

// Enhanced products for demonstration
const mockProducts = [
  {
    id: 1,
    name: "AirBear Signature Organic Milk",
    description:
      "Fresh, grass-fed whole milk from pasture-raised local farms. Perfect for a morning boost.",
    price: 4.99,
    category: "beverages",
    isEcoFriendly: true,
    stock: 12,
    rating: 4.9,
    img: "🥛",
  },
  {
    id: 2,
    name: "Solar-Ripened Crisp Apples",
    description:
      "Sun-kissed organic honeycrisp apples picked fresh daily at the Binghamton orchards.",
    price: 3.49,
    category: "food",
    isEcoFriendly: true,
    stock: 45,
    rating: 4.7,
    img: "🍎",
  },
  {
    id: 3,
    name: "Happy Hens Golden Eggs",
    description:
      "Farm-fresh organic eggs from free-range hens. The ultimate local breakfast staple.",
    price: 6.99,
    category: "food",
    isEcoFriendly: true,
    stock: 3,
    rating: 5.0,
    img: "🥚",
  },
  {
    id: 4,
    name: "CEO Holographic T-Shirt",
    description:
      "Exclusive limited-edition AirBear CEO Signature T-Shirt. Pure luxury, pure sustainability.",
    price: 100.0,
    category: "accessories",
    isEcoFriendly: true,
    stock: 99,
    rating: 5.0,
    img: "👕",
  },
  {
    id: 5,
    name: "Eco-Breeze Sparkling Water",
    description:
      "Infused with local botanicals and stored in 100% recyclable glass. Pure hydration.",
    price: 2.99,
    category: "beverages",
    isEcoFriendly: true,
    stock: 24,
    rating: 4.5,
    img: "💧",
  },
  {
    id: 6,
    name: "Solar Crunch Granola",
    description:
      "Baked with honey and solar power. The perfect on-the-go snack for your AirBear ride.",
    price: 5.49,
    category: "snacks",
    isEcoFriendly: true,
    stock: 18,
    rating: 4.8,
    img: "🥣",
  },
];

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Stocking the Bodega..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-amber-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header HUD */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-amber-500/20">
            <ShoppingBag className="w-3 h-3 mr-2" /> Mobile Bodega Live
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Curated{" "}
            <span className="airbear-holographic bg-clip-text text-transparent text-outline-strong px-2">
              Local Goodies
            </span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto uppercase tracking-tighter text-xs">
            Shop farm-fresh essentials during your eco-ride. Pick up upon
            arrival.
          </p>
        </motion.div>

        {/* Search & Tabs HUD */}
        <motion.div
          className="bg-card/50 backdrop-blur-xl border border-primary/20 p-6 rounded-3xl shadow-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search the bodega..."
                className="pl-12 h-14 bg-muted/30 border-primary/10 rounded-2xl focus:ring-primary text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="h-14 px-6 rounded-2xl border-primary/20 hover:bg-primary/5"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span>Cart (0)</span>
              </Button>
            </div>
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="mt-8"
          >
            <TabsList className="bg-muted/50 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-2 h-auto">
              {["all", "beverages", "food", "snacks", "accessories"].map(
                (cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg h-10"
                  >
                    {cat}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Products Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-morphism border-primary/10 overflow-hidden group hover-lift h-full flex flex-col">
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-amber-500/10 flex items-center justify-center text-7xl relative">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:scale-110 transition-transform duration-500">
                      {product.img}
                    </span>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {product.isEcoFriendly && (
                        <Badge className="bg-emerald-500/90 text-white font-black uppercase text-[10px] border-none">
                          <Leaf className="w-3 h-3 mr-1" /> ECO
                        </Badge>
                      )}
                      {product.stock < 5 && (
                        <Badge
                          variant="destructive"
                          className="font-black uppercase text-[10px]"
                        >
                          LOW STOCK
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-black tracking-tight leading-tight flex-1 pr-4">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 flex-1">
                      {product.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
                            Price
                          </span>
                          <span className="text-3xl font-black text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">
                            Impact
                          </span>
                          <span className="text-xs font-bold text-emerald-500 flex items-center">
                            <Zap className="w-3 h-3 mr-1" /> 100% SOLAR
                          </span>
                        </div>
                      </div>

                      <CheckoutButton
                        items={[
                          {
                            price_data: {
                              currency: "usd",
                              product_data: { name: product.name },
                              unit_amount: Math.round(product.price * 100),
                            },
                            quantity: 1,
                          },
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🛸</div>
            <h3 className="text-2xl font-black tracking-tight mb-2">
              Bodega Signal Lost
            </h3>
            <p className="text-muted-foreground font-medium">
              No products match your current filters. Try scanning again.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 bg-primary text-white font-bold px-8 h-12 rounded-xl hover-lift"
            >
              RESET FILTERS
            </Button>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Card className="flex-1 glass-morphism p-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase">Pickup Policy</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Purchased items will be handed to you by your AirBear driver
                upon pickup or during your ride.
              </p>
            </div>
          </Card>

          <Card className="flex-1 glass-morphism p-6 flex gap-4 items-center border-amber-500/20">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase">Rewards Program</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Earn 5 Eco-Points for every product purchased. Points can be
                redeemed for FREE holographic CEO rides!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
