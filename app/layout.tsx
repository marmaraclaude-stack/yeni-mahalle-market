import type { Metadata, Viewport } from "next";
import { Geist, Baloo_2 } from "next/font/google";
import "./globals.css";
import { BUSINESS, buildLocalBusinessJsonLd } from "@/lib/business";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/shop/CartProvider";
import CartFab from "@/components/shop/CartFab";

// Gövde + UI sans — Geist (next/font, self-host).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Marka wordmark "Yeni Mahalle Market" — logodaki yuvarlak-kalın tarz.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Display sans — Switzer, Fontshare üzerinden <link> ile yüklenir.

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: `${BUSINESS.name} · Sapanca Yeni Mahalle · Adrese Teslim Market`,
    template: `%s · ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  applicationName: BUSINESS.name,
  generator: "Next.js",
  keywords: [
    // Marka
    "Yeni Mahalle Market",
    "Yeni Mahalle Market Sapanca",
    "Sapanca Yeni Mahalle Market",
    "yenimahallemarket",
    "yeni mahalle marketi",
    // Yerel — market / bakkal
    "Sapanca market",
    "Sapanca bakkal",
    "Sapanca süpermarket",
    "Sapanca manav",
    "Sapanca şarküteri",
    "Sakarya Sapanca market",
    "Sakarya Sapanca bakkal",
    "Yeni Mahalle Sapanca market",
    "Şirin Mahalle market",
    "Kurtuluş Caddesi market Sapanca",
    "Sapanca açık market",
    "Sapanca 7/24 market",
    // Teslimat
    "Sapanca adrese teslim market",
    "Sapanca eve teslim market",
    "Sapanca market siparişi",
    "Sapanca online market",
    "Sapanca market online sipariş",
    "Sapanca su siparişi",
    "Sapanca markete telefonla sipariş",
    // Kategoriler
    "Sapanca meyve sebze",
    "Sapanca mangal kömürü",
    "Sapanca piknik malzemeleri",
    "Sapanca şarj aleti",
    "Sapanca mayo plaj malzemeleri",
    "Sapanca terlik",
    "Sapanca sigara satışı",
    "Sapanca içecek su",
    "Sapanca ekmek fırın",
    "Sapanca kişisel bakım",
    "Sapanca eczane ürünleri",
    "Sapanca piknik malzemeleri",
    "Sapanca tek kullanımlık tabak çatal",
    // Turizm bölgeleri
    "Sapanca bungalov market",
    "Sapanca tatil köyü market",
    "Kırkpınar market",
    "Maşukiye market",
    "Sapanca göl kenarı market",
  ],
  authors: [{ name: BUSINESS.name, url: BUSINESS.url }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  category: "Local Business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} · Sapanca Yeni Mahalle · Adrese Teslim Market`,
    description: BUSINESS.shortDescription,
    images: [
      {
        url: "/Hero.png",
        width: 1200,
        height: 900,
        alt: `${BUSINESS.name} · Sapanca Kurtuluş Caddesi`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} · Sapanca Adrese Teslim Market`,
    description: BUSINESS.shortDescription,
    images: ["/Hero.png"],
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
    <html lang="tr" className={`${geist.variable} ${baloo.variable}`}>
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
        <CartProvider>
          {children}
          {/* Canlı destek balonu — sağ alt köşe (admin dışında). */}
          <ChatWidget />
          <CartFab />
        </CartProvider>
      </body>
    </html>
  );
}
