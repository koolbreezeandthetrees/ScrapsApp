import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vn1bxts254.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
