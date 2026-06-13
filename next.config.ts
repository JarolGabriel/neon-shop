import type { NextConfig } from "next";

const supabaseOrigin =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ??
  "https://nekjvszntyaswghwtrig.supabase.co";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${supabaseOrigin}/storage/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/dise%C3%B1o-personalizado",
        destination: "/diseno-personalizado",
        permanent: true,
      },
      {
        source: "/diseño-personalizado",
        destination: "/diseno-personalizado",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    qualities: [75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nekjvszntyaswghwtrig.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
