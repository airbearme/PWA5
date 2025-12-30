import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QueryProvider from "@/components/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    template: "%s | AirBear",
  },
  description:
    "Experience the future of sustainable transportation with AirBear in Binghamton, NY. Solar-powered rideshare with an onboard mobile bodega.",
  keywords: [
    "rideshare",
    "solar powered",
    "mobile bodega",
    "Binghamton",
    "sustainable",
    "eco-friendly",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${orbitron.variable} font-inter antialiased selection:bg-primary/30 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col bg-background">
                {/* Enhanced Global Special Effects Background */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                  {/* Plasma Vortex Background */}
                  <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] airbear-plasma rounded-full opacity-20 dark:opacity-10"></div>

                  {/* Solar Rays Effect */}
                  <div className="absolute top-[20%] -right-[20%] w-[50%] h-[50%] airbear-solar-rays rounded-full opacity-30 dark:opacity-15"></div>

                  {/* God Rays */}
                  <div className="absolute -bottom-[40%] left-[10%] w-[60%] h-[60%] airbear-god-rays rounded-full opacity-25 dark:opacity-10"></div>

                  {/* Eco Breeze Waves */}
                  <div className="absolute top-[60%] left-[70%] w-[40%] h-[30%] airbear-eco-breeze rounded-full opacity-40 dark:opacity-20"></div>

                  {/* Permanent Particle Systems */}
                  <div className="absolute top-[15%] left-[15%] w-[20%] h-[20%] particle-system opacity-60 dark:opacity-30"></div>
                  <div className="absolute bottom-[25%] right-[20%] w-[18%] h-[18%] particle-system opacity-50 dark:opacity-25"></div>
                  <div className="absolute top-[70%] left-[50%] w-[15%] h-[15%] particle-system opacity-70 dark:opacity-35"></div>

                  {/* Floating Energy Orbs */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute rounded-full animate-float opacity-30 dark:opacity-15 ${
                        i % 3 === 0 ? 'bg-primary/20' :
                        i % 3 === 1 ? 'bg-amber-500/15' :
                        'bg-purple-500/20'
                      }`}
                      style={{
                        width: Math.random() * 30 + 20 + "px",
                        height: Math.random() * 30 + 20 + "px",
                        left: Math.random() * 90 + 5 + "%",
                        top: Math.random() * 90 + 5 + "%",
                        animationDelay: Math.random() * 10 + "s",
                        animationDuration: (Math.random() * 20 + 15) + "s",
                      }}
                    />
                  ))}

                  {/* Subtle Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                    <div className="w-full h-full bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                  </div>
                </div>

                <Header />
                <main className="flex-1 transition-all duration-500 ease-in-out">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
              <Analytics />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}