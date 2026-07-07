import type { NextConfig } from "next";

// Tum yanitlara uygulanan guvenlik basliklari. Clickjacking (admin paneli
// dahil), MIME-sniffing, referrer sizintisi ve tarayici ozellik erisimine
// karsi temel koruma. HSTS yalniz production'da anlamli (HTTPS).
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // next/image kullanilmiyor (duz <img>); uzak desen listesi kaldirildi.
  experimental: {
    serverActions: {
      // Admin panelinden ürün görseli yükleme (4MB dosya + form alanları)
      bodySizeLimit: "5mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
