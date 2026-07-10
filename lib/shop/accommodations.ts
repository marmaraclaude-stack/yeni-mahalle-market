// Sapanca Yeni Mahalle Market (40.6914, 30.2641) merkezli, motorla ~15 dakika
// mesafedeki konaklama tesisleri ve toplu konut/siteler — sipariş akışında
// "otel/bungalovda mı konaklıyorsunuz?" seçimi için. Web aramasıyla derlendi;
// admin listeyi bu dosyadan genişletebilir.

export interface Accommodation {
  /** Tesis/site adı (görünen). */
  name: string;
  /** Bölge: "Sapanca" | "Kırkpınar" | "Mahmudiye" | "Kurtköy" | "Maşukiye" */
  area: string;
  /** Tür: "otel" | "bungalov" | "apart" | "pansiyon" | "tatil köyü" | "site" */
  type: string;
}

export const ACCOMMODATIONS: Accommodation[] = [
  // Kırkpınar
  { name: "7 Tepe Moonlight", area: "Kırkpınar", type: "bungalov" },
  { name: "Akasya Evleri", area: "Kırkpınar", type: "site" },
  { name: "Didi Butik Otel Sapanca", area: "Kırkpınar", type: "otel" },
  { name: "Dost Evleri Sitesi", area: "Kırkpınar", type: "site" },
  { name: "Ecem Sitesi", area: "Kırkpınar", type: "site" },
  { name: "Gölevi Resort Sapanca", area: "Kırkpınar", type: "otel" },
  { name: "Güral Sapanca Wellness Park", area: "Kırkpınar", type: "otel" },
  { name: "Kırkpınar Otantik Otel", area: "Kırkpınar", type: "otel" },
  { name: "Kırkpınar Suit Otel", area: "Kırkpınar", type: "otel" },
  { name: "Natural Garden Kırkpınar", area: "Kırkpınar", type: "apart" },
  { name: "NG Sapanca Wellness & Convention", area: "Kırkpınar", type: "otel" },
  { name: "Sapanca Alfa Suites & Spa", area: "Kırkpınar", type: "otel" },
  { name: "Sapanca Çayır Çimen Otel", area: "Kırkpınar", type: "otel" },
  { name: "Sapanca Glamping Tiny House", area: "Kırkpınar", type: "bungalov" },
  { name: "Sapanca Villa Kırkpınar", area: "Kırkpınar", type: "apart" },
  { name: "Village Kırkpınar", area: "Kırkpınar", type: "site" },
  { name: "Wellwood Green Sapanca", area: "Kırkpınar", type: "otel" },
  { name: "Yakut Sitesi", area: "Kırkpınar", type: "site" },

  // Kurtköy (Sapanca)
  { name: "Kurtköy Park Bungalov", area: "Kurtköy", type: "bungalov" },
  { name: "Kurtköy Park Suit Bungalov", area: "Kurtköy", type: "bungalov" },

  // Mahmudiye
  { name: "Sapanca Mahmudiye Resort Bungalov", area: "Mahmudiye", type: "bungalov" },

  // Maşukiye
  { name: "Babil Bungalov Hotel", area: "Maşukiye", type: "bungalov" },
  { name: "Boğaziçi Butik Otel & Bungalov", area: "Maşukiye", type: "otel" },
  { name: "Elgarden Hotel & Spa", area: "Maşukiye", type: "otel" },
  { name: "Heinz Restaurant & Bungalov", area: "Maşukiye", type: "bungalov" },
  { name: "Maşukiye Bota Bungalov", area: "Maşukiye", type: "bungalov" },
  { name: "Maşukiye Cansu Bungalov Otel", area: "Maşukiye", type: "bungalov" },
  { name: "Maşukiye Dream House", area: "Maşukiye", type: "bungalov" },
  { name: "Maşukiye Otel", area: "Maşukiye", type: "otel" },
  { name: "My Green Boutique Hotel", area: "Maşukiye", type: "otel" },
  { name: "Tree Bungalov Maşukiye", area: "Maşukiye", type: "bungalov" },
  { name: "Vadi Resort Maşukiye", area: "Maşukiye", type: "tatil köyü" },

  // Sapanca merkez ve çevresi
  { name: "Albero Sapanca Tiny House", area: "Sapanca", type: "bungalov" },
  { name: "Art Bungalov", area: "Sapanca", type: "bungalov" },
  { name: "Berra Resort Tatil Köyü", area: "Sapanca", type: "tatil köyü" },
  { name: "Butik Evler Sapanca", area: "Sapanca", type: "bungalov" },
  { name: "Cabir Deluxe Hotel Sapanca", area: "Sapanca", type: "otel" },
  { name: "Dedeman Village Sapanca", area: "Sapanca", type: "otel" },
  { name: "Eksado Resort", area: "Sapanca", type: "bungalov" },
  { name: "Elite World Grand Sapanca", area: "Sapanca", type: "otel" },
  { name: "Feronia Suites", area: "Sapanca", type: "otel" },
  { name: "Göldibi Suit Bungalov", area: "Sapanca", type: "bungalov" },
  { name: "Harmony Green Village Resort", area: "Sapanca", type: "tatil köyü" },
  { name: "Hilloria Tatil Köyü", area: "Sapanca", type: "tatil köyü" },
  { name: "İstanbul Dere Sitesi", area: "Sapanca", type: "site" },
  { name: "Kaya Palace Sapanca", area: "Sapanca", type: "otel" },
  { name: "Lago's Sapanca", area: "Sapanca", type: "bungalov" },
  { name: "Lotus Home Sapanca", area: "Sapanca", type: "apart" },
  { name: "Montana Butik Pansiyon", area: "Sapanca", type: "pansiyon" },
  { name: "Naturköy", area: "Sapanca", type: "tatil köyü" },
  { name: "NG Enjoy Sapanca", area: "Sapanca", type: "otel" },
  { name: "ON7 Sapanca Private", area: "Sapanca", type: "otel" },
  { name: "Ramada Resort by Wyndham Thermal Sapanca", area: "Sapanca", type: "otel" },
  { name: "Richmond Nua Wellness & Spa", area: "Sapanca", type: "otel" },
  { name: "Sapanca Aqua Wellness SPA Hotel", area: "Sapanca", type: "otel" },
  { name: "Sapanca Bamboolow Resort", area: "Sapanca", type: "bungalov" },
  { name: "Sapanca Gölgibi Bungalov", area: "Sapanca", type: "bungalov" },
  { name: "Sapanca Kestanelik TOKİ Konutları", area: "Sapanca", type: "site" },
  { name: "Sapanca Kıyı Bungalov & Cafe", area: "Sapanca", type: "bungalov" },
  { name: "Sapanca Kuruçeşme Tiny House", area: "Sapanca", type: "bungalov" },
  { name: "Sapanora Hotel", area: "Sapanca", type: "otel" },
  { name: "SASA Harmanlık", area: "Sapanca", type: "bungalov" },
  { name: "Şenler Butik Otel", area: "Sapanca", type: "otel" },
  { name: "Şifa Villaları Sitesi", area: "Sapanca", type: "site" },
  { name: "Velour Hotel Sapanca", area: "Sapanca", type: "otel" },
  { name: "Wind Hotel Sapanca", area: "Sapanca", type: "otel" },
];

/** Ada göre arama için normalize edilmiş liste (datalist değerleri). */
export function accommodationLabel(a: Accommodation): string {
  return `${a.name} (${a.area})`;
}

/** Bölge merkezi yaklaşık koordinatları — tesis seçilince markete kuş uçuşu
 *  mesafe tahmini için (müşteri konum paylaşmasa bile ücret/bölge kontrolü
 *  çalışsın). Tesis bazında koordinat tutulmaz; bölge merkezi yeterli hassasiyettir. */
export const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  Sapanca: { lat: 40.6883, lng: 30.2675 },
  "Kırkpınar": { lat: 40.7052, lng: 30.221 },
  Mahmudiye: { lat: 40.666, lng: 30.235 },
  "Kurtköy": { lat: 40.696, lng: 30.183 },
  "Maşukiye": { lat: 40.689, lng: 30.158 },
};

/** "Tesis Adı (Bölge)" etiketinden bölge koordinatını çöz; bulunamazsa null. */
export function coordsForAccommodationLabel(
  label: string,
): { lat: number; lng: number } | null {
  const m = label.match(/\(([^)]+)\)\s*$/);
  const area = m?.[1]?.trim();
  return (area && AREA_COORDS[area]) || null;
}
