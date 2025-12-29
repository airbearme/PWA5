"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  Menu,
  User,
  Settings,
  LogOut,
  Award,
  Gift,
  Zap,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";
import AirbearWheel from "@/components/airbear-wheel";
import { useAuthContext } from "@/components/auth-provider";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Rides", href: "/map", icon: MapPin },
    { name: "Bodega", href: "/products", icon: ShoppingBag },
    { name: "Impact", href: "/#eco", icon: Zap },
  ];

  const isActive = (href: string) => {
    if (href === "/#eco") return false;
    return pathname === href;
  };

  return (
    <motion.header
      className="relative z-50 glass-morphism border-b border-primary/10 sticky top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <AirbearWheel
                  size="md"
                  className="group-hover:rotate-180 transition-transform duration-700"
                  animated
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tighter leading-none bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
                  AirBear
                </h1>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mt-1">
                  Solar Motion
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`px-4 h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all hover:bg-primary/5 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5 shadow-inner"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 mr-2 ${
                      isActive(item.href) ? "text-primary" : ""
                    }`}
                  />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-xl border border-primary/10 hover:bg-primary/5"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-12 w-12 rounded-xl p-0 hover:bg-primary/5 border border-primary/10"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-white font-black">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 glass-morphism border-primary/20 p-2 rounded-2xl"
                  align="end"
                >
                  <div className="p-3">
                    <p className="font-black text-sm uppercase tracking-tighter">
                      {user.user_metadata?.username ||
                        user.email?.split("@")[0]}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 cursor-pointer">
                      <User className="mr-3 h-4 w-4 text-primary" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem
                    className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="font-black uppercase text-[10px] tracking-widest rounded-xl px-6"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button className="eco-gradient text-white font-black uppercase text-[10px] tracking-widest rounded-xl px-6 h-11 hover-lift shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden border border-primary/10 rounded-xl"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="glass-morphism border-l border-primary/20 w-80 p-0"
              >
                <div className="p-6 pt-12 flex flex-col h-full">
                  <div className="flex items-center space-x-3 mb-12">
                    <AirbearWheel size="md" animated />
                    <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                      AirBear
                    </h2>
                  </div>
                  <nav className="space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] px-6 ${
                            isActive(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          <item.icon className="mr-4 h-5 w-5" />
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-primary/10">
                    {!user ? (
                      <div className="grid gap-3">
                        <Link
                          href="/auth"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link
                          href="/auth?mode=signup"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest eco-gradient text-white">
                            Join the Revolution
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                          >
                            Go to HUD
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-destructive"
                        >
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
