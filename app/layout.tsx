import type { Metadata, Viewport } from "next";
import { Geist, Montserrat } from "next/font/google";
import "./globals.css";
import { BUSINESS, buildLocalBusinessJsonLd } from "@/lib/business";
import { REVIEW_STATS } from "@/lib/reviews";
import WhatsAppFab from "@/components/WhatsAppFab";

// Gövde + UI sans — Geist (next/font, self-host).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Marka wordmark "Yeni Mahalle" için — Montserrat Black (900).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["900"],
  display: "swap",
});

// Display sans — Switzer + "Market" wordmark için display serif,
// Fontshare üzerinden <link> ile yüklenir.

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
    "Sapanca WhatsApp market sipariş",
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
        alt: `${BUSINESS.name} — Sapanca Kurtuluş Caddesi`,
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
  const jsonLd = buildLocalBusinessJsonLd({
    average: REVIEW_STATS.average,
    count: REVIEW_STATS.count,
  });

  return (
    <html lang="tr" className={`${geist.variable} ${montserrat.variable}`}>
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
        {/* "Market" kelimesi için display serif. Kyrial Display Pro
            ücretli/Adobe Fonts; en yakın açık alternatif Fraunces
            italic — sonradan istersen kit ile değiştirebiliriz. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600&display=swap"
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
