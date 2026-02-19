import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "utfs.io",
          },
          {
            protocol: "https",
            hostname: "**.ufs.sh",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },
        ],
      },

  async rewrites() {
    return [
      {
        source: "/api/uploadthing",
        destination: "http://localhost:3000/api/uploadthing",
      },
    ];
  },
};

export default nextConfig;