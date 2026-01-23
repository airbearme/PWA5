// PWA configuration handled separately
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            // 🛡️ Sentinel: CSP added to mitigate XSS.
            // 'unsafe-eval' and 'unsafe-inline' are required for Next.js and Stripe.js,
            // representing a calculated security trade-off.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.com *.supabase.co *.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.supabase.co; connect-src 'self' *.supabase.co; font-src 'self'; object-src 'none'; frame-ancestors 'self';",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "airbear.me" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://airbear.me",
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Exclude client directory from build (it's a separate Vite app)
  serverExternalPackages: [],
};

export default nextConfig;

/**
 * Workspace root hardening (lockfile-safe)
 */
export const outputFileTracingRoot = new URL('.', import.meta.url).pathname;
