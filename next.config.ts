import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Admin panelinden ürün görseli yükleme (4MB dosya + form alanları)
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
