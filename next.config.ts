import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // allow photo uploads up to 6 MB from the admin panel
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;