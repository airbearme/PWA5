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
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            // IMPORTANT: 'unsafe-inline' is currently required for Next.js client-side hydration.
            // A nonce-based approach would be more secure but requires a more complex setup.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: *.supabase.co; connect-src 'self' *.supabase.co wss://*.supabase.co https://vercel.live; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
          }
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
