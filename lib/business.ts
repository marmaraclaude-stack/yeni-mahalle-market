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
    display: "Haftanın 7 günü · 07:30 – 00:00",
    opens: "07:30",
    closes: "00:00",
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

/** Ürün kategorileri — schema.org kataloğu (SEO). UI sırası CategoryGrid'de. */
export const PRODUCT_CATEGORIES = [
  "Meyve & Sebze",
  "Şarküteri & Et",
  "Ekmek & Fırın",
  "Süt & Kahvaltılık",
  "İçecek & Su",
  "Bakliyat & Makarna",
  "Konserve & Hazır Yemek",
  "Yağ, Sos & Baharat",
  "Atıştırmalık",
  "Cips & Kuruyemiş",
  "Çikolata & Şekerleme",
  "Kahve & Çay",
  "Dondurma",
  "Donuk Gıda",
  "Zeytin & Turşu",
  "Temizlik & Deterjan",
  "Kağıt Ürünleri",
  "Kişisel Bakım",
  "Vitamin & İlk Yardım",
  "Tek Kullanımlık & Piknik",
  "Bebek",
  "Evcil Hayvan",
  "Sigara & Tütün",
  "Mangal & Kömür",
  "Çakmak, Kibrit & Tüp",
  "Şarj Aleti & Pil",
  "Plaj, Mayo & Terlik",
  "Güneş Kremi & Plaj",
  "Şişme Bot & Havuz",
  "Sinek & Böcek Kovucu",
] as const;

/** Hizmet verilen bölgeler — yerel SEO için. */
export const SERVICE_AREAS = [
  "Yeni Mahalle, Sapanca",
  "Şirin Mahalle, Sapanca",
  "Kırkpınar, Sapanca",
  "Sapanca, Sakarya",
  "Maşukiye",
];

/**
 * Google'in resmi rehberi: "self-controlled" sitelerde aggregateRating
 * göndermek policy violation — manuel aksiyon riski (Search Console)
 * + rich result yetkisi kaybı + arama sonuçlarından kaldırılma riski.
 * Yıldız ratingi sadece GBP'den okunur, schema'dan gönderilmez.
 * Ref: developers.google.com/search/docs/appearance/structured-data/review-snippet
 */
export function buildLocalBusinessJsonLd() {
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
    openingHours: "Mo-Su 07:30-24:00",
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
