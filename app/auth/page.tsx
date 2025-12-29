"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AirbearWheel } from "@/components/airbear-wheel";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    role: "user" as "user" | "driver" | "admin",
  });

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              role: formData.role,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "OAuth Error",
        description: error.message || "OAuth login failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4">
          <AirbearWheel size="xl" className="opacity-30" animated />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <AirbearWheel size="lg" className="opacity-20 animate-pulse-glow" />
        </div>
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AirbearWheel size="xl" glowing className="animate-pulse-glow" />
          </motion.div>

          <h2 className="text-3xl font-black text-foreground">
            Welcome to{" "}
            <span className="airbear-holographic bg-clip-text text-transparent text-outline-strong px-2">
              AirBear
            </span>
          </h2>
          <p className="mt-2 text-muted-foreground font-medium uppercase tracking-widest text-xs">
            Join the sustainable transportation revolution
          </p>
        </div>

        <Card className="glass-morphism shadow-2xl border-primary/20 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "signin" | "signup")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger
                  value="signin"
                  data-testid="tab-signin"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  data-testid="tab-signup"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin("google")}
                className="hover-lift border-primary/20 hover:bg-primary/5 rounded-xl h-12"
              >
                <img
                  src="/google-icon.svg"
                  className="w-5 h-5 mr-2"
                  alt="Google"
                />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin("apple")}
                className="hover-lift border-primary/20 hover:bg-primary/5 rounded-xl h-12"
              >
                <img
                  src="/apple-icon.svg"
                  className="w-5 h-5 mr-2"
                  alt="Apple"
                />
                Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground font-bold tracking-tighter">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          id="username"
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          placeholder="BearLover420"
                          required={mode === "signup"}
                          className="pl-10 h-12 bg-muted/30 border-primary/10 rounded-xl focus:ring-primary"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="hi@airbear.me"
                    required
                    className="pl-10 h-12 bg-muted/30 border-primary/10 rounded-xl focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    className="pl-10 h-12 bg-muted/30 border-primary/10 rounded-xl focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="••••••••"
                        required={mode === "signup"}
                        className="h-12 bg-muted/30 border-primary/10 rounded-xl focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                        I am a...
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={
                            formData.role === "user" ? "default" : "outline"
                          }
                          onClick={() => handleInputChange("role", "user")}
                          className="rounded-xl h-10 font-bold"
                        >
                          Rider 🚗
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.role === "driver" ? "default" : "outline"
                          }
                          onClick={() => handleInputChange("role", "driver")}
                          className="rounded-xl h-10 font-bold"
                        >
                          Driver 🐼
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 eco-gradient text-white text-lg font-black rounded-xl hover-lift shadow-xl animate-neon-glow mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <AirbearWheel size="sm" className="mr-3" animated />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    {mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Safe • Secure • Solar
          </p>
          <div className="flex justify-center gap-4 text-xs font-bold text-primary">
            <Link href="/terms" className="hover:underline">
              TERMS
            </Link>
            <span className="text-muted/30">|</span>
            <Link href="/privacy" className="hover:underline">
              PRIVACY
            </Link>
            <span className="text-muted/30">|</span>
            <Link href="/help" className="hover:underline">
              HELP
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
