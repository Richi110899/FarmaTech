import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  // ...otras configuraciones...
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
