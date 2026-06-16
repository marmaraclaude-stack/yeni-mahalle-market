export const BUSINESS = {
  name: "Yeni Mahalle Market",
  legalName: "Yeni Mahalle Market",
  category: "Bakkal",
  schemaType: "GroceryStore",
  description:
    "Sapanca Yeni Mahalle'de hizmet veren marketimizde taze meyve, sebze, şarküteri ürünleri ve tüm market ihtiyaçlarınızı uygun fiyatlarla karşılayabilirsiniz. Adrese teslim hizmetimizle siparişleriniz kapınıza kadar gelir. Haftanın 7 günü 07:30'dan itibaren hizmetinizdeyiz.",
  shortDescription:
    "Sapanca Yeni Mahalle'nin marketi. Taze meyve sebze, şarküteri ve günlük market ihtiyaçları, adrese teslim.",
  address: {
    street: "Yeni Mah., Kurtuluş Caddesi",
    postalCode: "54600",
    city: "Sapanca",
    region: "Sakarya",
    country: "TR",
    full: "Yeni Mah., Kurtuluş Caddesi, 54600 Sapanca / Sakarya",
  },
  phone: {
    display: "0532 596 37 55",
    intl: "+905325963755",
    href: "tel:+905325963755",
  },
  whatsapp: {
    href: "https://wa.me/905325963755",
    display: "WhatsApp'tan yaz",
  },
  instagram: {
    href: "https://www.instagram.com/yenimahallemarket/",
    handle: "@yenimahallemarket",
  },
  hours: {
    display: "Haftanın 7 günü · 07:30 – 22:30",
    opens: "07:30",
    closes: "22:30",
    daysDisplay: "Pazartesi · Pazar",
  },
  geo: { lat: 40.6914, lng: 30.2641 },
  googleStoreCode: "13227824233344056896",
  // Google Place ID — bu doldurulduğunda /api/reviews Google Places API'ye gerçek çağrı atabilir.
  // Şimdilik bos. lib/reviews.ts placeholder veri kullanıyor.
  googlePlaceId: "",
  domain: "sapancayenimahallemarket.com",
  url: "https://sapancayenimahallemarket.com",
  googleMapsCidUrl: "https://www.google.com/maps?cid=13227824233344056896",
  googleReviewsUrl:
    "https://www.google.com/maps?cid=13227824233344056896&hl=tr",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=Yeni%20Mahalle%20Market%20Sapanca%20Sakarya&t=&z=16&ie=UTF8&iwloc=&output=embed",
  googleMapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Yeni+Mahalle+Market+Sapanca+Sakarya",
} as const;

/** Ürün kategorileri — hem UI hem schema.org kataloğu için tek kaynak. */
export const PRODUCT_CATEGORIES = [
  "Meyve & Sebze",
  "Şarküteri & Et",
  "Ekmek & Fırın",
  "Süt & Kahvaltılık",
  "İçecek & Su",
  "Atıştırmalık",
  "Sigara & Tütün",
  "Mangal & Kömür",
  "Plaj, Mayo & Terlik",
  "Şarj Aleti & Pil",
] as const;

/** Hizmet verilen bölgeler — yerel SEO için. */
export const SERVICE_AREAS = [
  "Yeni Mahalle, Sapanca",
  "Şirin Mahalle, Sapanca",
  "Kırkpınar, Sapanca",
  "Sapanca, Sakarya",
  "Maşukiye",
];

export function buildLocalBusinessJsonLd(rating?: { average: number; count: number }) {
  return {
    "@context": "https://schema.org",
    "@type": ["GroceryStore", "LocalBusiness", "Store"],
    "@id": `${BUSINESS.url}/#localbusiness`,
    name: BUSINESS.name,
    alternateName: ["Yeni Mahalle Market Sapanca", "Sapanca Yeni Mahalle Market"],
    legalName: BUSINESS.legalName,
    slogan: "Mahallenin marketi, kapına kadar teslimat.",
    image: [`${BUSINESS.url}/Hero.png`],
    logo: `${BUSINESS.url}/Hero.png`,
    url: BUSINESS.url,
    telephone: BUSINESS.phone.intl,
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    paymentAccepted: "Nakit, Kredi Kartı, Banka Kartı",
    description: BUSINESS.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      postalCode: BUSINESS.address.postalCode,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    hasMap: BUSINESS.googleMapsCidUrl,
    openingHours: "Mo-Su 07:30-22:30",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: BUSINESS.hours.opens,
        closes: BUSINESS.hours.closes,
      },
    ],
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "Place", name })),
    sameAs: [
      BUSINESS.instagram.href,
      BUSINESS.whatsapp.href,
      BUSINESS.googleMapsCidUrl,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ürün Kategorileri",
      itemListElement: PRODUCT_CATEGORIES.map((cat) => ({
        "@type": "OfferCatalog",
        name: cat,
      })),
    },
    makesOffer: {
      "@type": "Offer",
      name: "Adrese teslim market alışverişi",
      description:
        "Mahalle içi ücretsiz, adrese teslim market alışverişi. WhatsApp veya telefonla sipariş.",
      areaServed: "Sapanca, Sakarya",
      availability: "https://schema.org/InStock",
    },
  };
}
