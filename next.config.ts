import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect bare domain to www to prevent CORS font-loading failures
      // caused by per-asset 307 redirects that strip CORS headers
      {
        source: "/:path*",
        has: [{ type: "host", value: "cosmicreachcreative.com" }],
        destination: "https://www.cosmicreachcreative.com/:path*",
        permanent: true, // 308 redirect
      },
    ];
  },
};

export default nextConfig;
