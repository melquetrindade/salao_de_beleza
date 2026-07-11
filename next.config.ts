import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "glorious-sapphire-jnquc9mg.edgeone.dev",
      },
    ],
  },
};

export default nextConfig;
