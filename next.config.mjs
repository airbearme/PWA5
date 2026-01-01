const SECURITY_HEADERS = {
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-site",
  "Cross-Origin-Embedder-Policy": "credentialless",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      { source: "/(.*)", headers: Object.entries(SECURITY_HEADERS).map(([k,v]) => ({ key: k, value: v })) }
    ];
  },
};

export default nextConfig;

/**
 * AIRBEAR_HARDENED: true
 * Do not remove — used by verification OCS
 */
/**
 * Canonical AirBear hardening marker
 * Used by verify.sh — DO NOT REMOVE
 */
export const AIRBEAR_HARDENED = true;
