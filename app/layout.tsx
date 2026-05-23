import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { BUSINESS, buildLocalBusinessJsonLd } from "@/lib/business";
import ChatWidgetMount from "@/components/ChatWidget";

const urbanist = Urbanist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
  alternates: {
    canonical: "/",
  },
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
  verification: {
    // Google Search Console doğrulaması yapıldığında token'ı buraya:
    // google: "verification-token",
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
    <html lang="tr" className={urbanist.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <ChatWidgetMount />
      </body>
    </html>
  );
}
