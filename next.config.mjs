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
            // Using 'unsafe-eval' and 'unsafe-inline' for now to avoid breaking existing functionality.
            // A stricter policy using nonces or hashes should be implemented in the future.
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co *.stripe.com *.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' *.supabase.co data:; connect-src 'self' *.supabase.co *.stripe.com *.vercel-insights.com; frame-src *.stripe.com; font-src 'self';",
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
