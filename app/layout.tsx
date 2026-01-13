import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AnimationProvider } from "@/components/animation-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import FloatingMascot from "@/components/floating-mascot";
import { ErrorBoundary } from "@/components/error-boundary";
import { validateRuntimeEnv } from "@/lib/auto-load-env";
import "./globals.css";

// Validate environment variables on app load
if (typeof window === "undefined") {
  validateRuntimeEnv();
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: {
    default: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    template: "%s | AirBear",
  },
  description:
    "Experience sustainable transportation with AirBear - solar-powered rideshare service with onboard mobile bodegas in Binghamton, NY.",
  keywords: [
    "rideshare",
    "solar powered",
    "mobile bodega",
    "Binghamton NY",
    "sustainable transport",
    "eco-friendly",
  ],
  authors: [{ name: "AirBear" }],
  creator: "AirBear",
  publisher: "AirBear",
  metadataBase: new URL("https://airbear.me"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AirBear",
  },
  applicationName: "AirBear",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://airbear.me",
    siteName: "AirBear",
    title: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    description: "Experience sustainable transportation with AirBear",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AirBear - Solar-Powered Rideshare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirBear - Solar-Powered Rideshare & Mobile Bodega",
    description: "Experience sustainable transportation with AirBear",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  generator: "v0.app",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ff6b35" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const dynamic = "force-dynamic";

/**
 * 🎨 CORE UI/UX FOUNDATION - PERMANENT & PROTECTED
 *
 * ⚠️ CRITICAL: Dark mode is the default brand experience.
 * DO NOT change defaultTheme or enableSystem without approval.
 *
 * See: CORE_UI_FOUNDATION.md for documentation
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {/* 🎨 CORE: Dark mode permanently enabled - DO NOT CHANGE */}
        <AnimationProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthProvider>
                {children}
                <FloatingMascot />
                <PWAInstallPrompt />
                <Toaster />
                <Analytics />
            </AuthProvider>
          </ThemeProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
