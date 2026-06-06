import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BUSINESS, buildLocalBusinessJsonLd } from "@/lib/business";
import WhatsAppFab from "@/components/WhatsAppFab";

// Gövde + UI sans — Geist (next/font, self-host).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Display sans — Switzer, Fontshare üzerinden <link> ile (next/font Fontshare desteklemiyor).

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: `${BUSINESS.name} · Sapanca Yeni Mahalle Bakkalı · Adrese Teslim`,
    template: `%s · ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  applicationName: BUSINESS.name,
  generator: "Next.js",
  keywords: [
    "Yeni Mahalle Market",
    "Sapanca bakkal",
    "Sapanca market",
    "Sapanca Yeni Mahalle",
    "Sapanca adrese teslim market",
    "Sakarya Sapanca bakkal",
    "şarküteri Sapanca",
    "meyve sebze Sapanca",
    "Kurtuluş Caddesi market",
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  category: "Local Business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} · Sapanca Yeni Mahalle Bakkalı`,
    description: BUSINESS.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.name,
    description: BUSINESS.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "TR-54",
    "geo.placename": "Sapanca",
    "geo.position": `${BUSINESS.geo.lat};${BUSINESS.geo.lng}`,
    ICBM: `${BUSINESS.geo.lat}, ${BUSINESS.geo.lng}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <html lang="tr" className={geist.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
