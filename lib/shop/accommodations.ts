// Sapanca çevresi (~1 saat) konaklama tesisleri — sipariş akışında
// "otel/bungalovda mı konaklıyorsunuz?" seçimi için. Web aramasıyla derlendi;
// admin listeyi bu dosyadan genişletebilir.

export interface Accommodation {
  /** Tesis adı (görünen). */
  name: string;
  /** Bölge: "Sapanca" | "Kırkpınar" | "Maşukiye" | "Kartepe" | "Serdivan" | "Adapazarı" | "İzmit" | "Arifiye" | "Kurtköy" | "Mahmudiye" */
  area: string;
  /** Tür: "otel" | "bungalov" | "apart" | "pansiyon" | "tatil köyü" */
  type: string;
}

export const ACCOMMODATIONS: Accommodation[] = [
  // Adapazarı
  { name: "Ada Elit Hotel", area: "Adapazarı", type: "otel" },
  { name: "Arya Hotel", area: "Adapazarı", type: "otel" },
  { name: "Hotel Bonvie", area: "Adapazarı", type: "otel" },
  { name: "Sakarya Grand Otel", area: "Adapazarı", type: "otel" },

  // Arifiye
  { name: "Arifiye Otel", area: "Arifiye", type: "otel" },
  { name: "Continent Luxury Suites Sakarya", area: "Arifiye", type: "apart" },
  { name: "Radisson Blu Hotel Sakarya", area: "Arifiye", type: "otel" },
  { name: "The Grey Hotel", area: "Arifiye", type: "otel" },
  { name: "Tolso Wooden House", area: "Arifiye", type: "bungalov" },

  // İzmit
  { name: "Baltürk House Hotel", area: "İzmit", type: "otel" },
  { name: "Emex Otel Kocaeli", area: "İzmit", type: "otel" },
  { name: "Hampton by Hilton Kocaeli", area: "İzmit", type: "otel" },
  { name: "Hotel Altınnal", area: "İzmit", type: "otel" },
  { name: "Luxor Garden Hotel", area: "İzmit", type: "otel" },
  { name: "Masal Otel", area: "İzmit", type: "otel" },
  { name: "New Balturk Hotel İzmit", area: "İzmit", type: "otel" },
  { name: "Pasha Palas Hotel", area: "İzmit", type: "otel" },
  { name: "Ramada Plaza by Wyndham İzmit", area: "İzmit", type: "otel" },
  { name: "Tryp by Wyndham İzmit", area: "İzmit", type: "otel" },
  { name: "Wes Hotel", area: "İzmit", type: "otel" },

  // Kartepe
  { name: "Bal Bungalow Kartepe", area: "Kartepe", type: "bungalov" },
  { name: "Cevizdibi Otel", area: "Kartepe", type: "otel" },
  { name: "Dedeman Kartepe", area: "Kartepe", type: "otel" },
  { name: "İbrahim Ağa Konağı", area: "Kartepe", type: "otel" },
  { name: "Kadifeli Konak Boutique Hotel", area: "Kartepe", type: "otel" },
  { name: "Karmatte Bungalow", area: "Kartepe", type: "bungalov" },
  { name: "Kartepe Köşkü Otel", area: "Kartepe", type: "otel" },
  { name: "Kartepe Snow Vista", area: "Kartepe", type: "bungalov" },
  { name: "Rivada Hotel", area: "Kartepe", type: "otel" },
  { name: "The Green Park Kartepe Resort & Spa", area: "Kartepe", type: "otel" },
  { name: "Wellborn Luxury Hotel", area: "Kartepe", type: "otel" },
  { name: "Yeşil Düş Vadisi Bungalow", area: "Kartepe", type: "bungalov" },

  // Kırkpınar
  { name: "7 Tepe Moonlight", area: "Kırkpınar", type: "bungalov" },
  { name: "Didi Butik Otel Sapanca", area: "Kırkpınar", type: "otel" },
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
  { name: "Wellwood Green Sapanca", area: "Kırkpınar", type: "otel" },

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
  { name: "Sapanca Kıyı Bungalov & Cafe", area: "Sapanca", type: "bungalov" },
  { name: "Sapanca Kuruçeşme Tiny House", area: "Sapanca", type: "bungalov" },
  { name: "Sapanora Hotel", area: "Sapanca", type: "otel" },
  { name: "SASA Harmanlık", area: "Sapanca", type: "bungalov" },
  { name: "Şenler Butik Otel", area: "Sapanca", type: "otel" },
  { name: "Velour Hotel Sapanca", area: "Sapanca", type: "otel" },
  { name: "Wind Hotel Sapanca", area: "Sapanca", type: "otel" },

  // Serdivan
  { name: "Hotel ON7 Sakarya", area: "Serdivan", type: "otel" },
  { name: "İncipark Hotel", area: "Serdivan", type: "otel" },
  { name: "Limapark Hotel", area: "Serdivan", type: "otel" },
  { name: "Luxon Hotel", area: "Serdivan", type: "otel" },
  { name: "Roof 264 Hotel and Suites", area: "Serdivan", type: "otel" },
  { name: "Sakarya Hotel & Wellness Spa", area: "Serdivan", type: "otel" },
  { name: "Sen Hotel", area: "Serdivan", type: "otel" },
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
  Kartepe: { lat: 40.72, lng: 30.073 },
  Serdivan: { lat: 40.766, lng: 30.367 },
  "Adapazarı": { lat: 40.781, lng: 30.403 },
  Arifiye: { lat: 40.713, lng: 30.352 },
  "İzmit": { lat: 40.7654, lng: 29.9408 },
};

/** "Tesis Adı (Bölge)" etiketinden bölge koordinatını çöz; bulunamazsa null. */
export function coordsForAccommodationLabel(
  label: string,
): { lat: number; lng: number } | null {
  const m = label.match(/\(([^)]+)\)\s*$/);
  const area = m?.[1]?.trim();
  return (area && AREA_COORDS[area]) || null;
}
