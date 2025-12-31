import { SECURITY_HEADERS } from "./lib/security-headers.js";

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
