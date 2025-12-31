"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AirbearWheel from "./airbear-wheel";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";

// ⚡ Bolt: Wrapped the Footer component with React.memo to prevent unnecessary re-renders.
// Since the footer is static, this optimization ensures it only renders once,
// improving performance on pages where other components cause re-renders.
const Footer = React.memo(function Footer() {
  const quickLinks = [
    { name: "Book a Ride", href: "/map" },
    { name: "Shop Bodega", href: "/products" },
    { name: "Eco Impact", href: "/#eco" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Safety", href: "/safety" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="relative bg-[#0a0a0a] text-white border-t border-primary/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-8 text-center md:text-left">
            <Link href="/">
              <motion.div
                className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <AirbearWheel size="md" animated glowing />
                <div>
                  <h3 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                    AirBear
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    The Solar Revolution
                  </p>
                </div>
              </motion.div>
            </Link>

            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
              <span className="text-emerald-500 font-bold italic">
                &quot;AirBear flair, ride without a care—solar power in the
                air!&quot;
              </span>
              <br />
              <br />
              Leading Binghamton into a post-carbon future with autonomous-ready
              solar transport, community-sourced goods, and zero-emission
              logistics.
            </p>

            <div className="flex justify-center md:justify-start space-x-4">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors group"
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-8">
              Navigation
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.p
                      className="text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-8">
              Resources
            </h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <motion.p
                      data-testid={`footer-support-${link.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-sm font-bold text-muted-foreground hover:text-white transition-colors cursor-pointer inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-8">
              Newsletter
            </h4>
            <div className="relative group">
              <input
                type="email"
                placeholder="Join the grid..."
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-relaxed">
              Sync your inbox with the{" "}
              <span className="text-primary italic">Solar Pulse</span>.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Fleet Signal: <span className="text-emerald-500">Strong</span> •
              Network: <span className="text-emerald-500">Secure</span>
            </p>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            © 2024 AirBear Quantum Logistics • Binghamton HQ
          </p>

          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="text-muted-foreground">Powered by</span>
            <span className="text-primary bg-primary/10 px-2 py-1 rounded">
              C4V Solar LFP
            </span>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </footer>
  );
});

export default Footer;
