// 30 kategori — CategoryGrid ile birebir aynı sıra/tint; slug'lar URL ve DB anahtarı.
// DB'deki shop_categories tablosu bu listeden seed edilir; UI bu sabiti kullanır
// (kategori listesi için ekstra sorguya gerek yok — katalog değişmez veri).

export interface CategoryDef {
  slug: string;
  name: string;
  tint: number; // TINTS index (0-7) — CategoryGrid ile aynı palet
  icon: string; // lucide ikon adı (kebab-case)
  orderable: boolean;
}

/** CategoryGrid.TINTS ile aynı palet — vitrin placeholder'ları için. */
export const CATEGORY_TINTS: [string, string][] = [
  ["#eafaf0", "#159b57"], // 0 yeşil
  ["#fdeceb", "#df513c"], // 1 mercan
  ["#fdf4e1", "#cf8910"], // 2 amber
  ["#eaf1fe", "#2f6fed"], // 3 mavi
  ["#e6f7fb", "#0e93a8"], // 4 cam göbeği
  ["#f2ecfd", "#7a52d6"], // 5 mor
  ["#fdebf3", "#d6489b"], // 6 pembe
  ["#e7f6f2", "#11917a"], // 7 deniz yeşili
];

export const SHOP_CATEGORIES: CategoryDef[] = [
  { slug: "meyve-sebze", name: "Meyve & Sebze", tint: 0, icon: "carrot", orderable: true },
  { slug: "sarkuteri-et", name: "Şarküteri & Et", tint: 1, icon: "beef", orderable: true },
  { slug: "ekmek-firin", name: "Ekmek & Fırın", tint: 2, icon: "croissant", orderable: true },
  { slug: "sut-kahvaltilik", name: "Süt & Kahvaltılık", tint: 3, icon: "milk", orderable: true },
  { slug: "icecek-su", name: "İçecek & Su", tint: 4, icon: "cup-soda", orderable: true },
  { slug: "bakliyat-makarna", name: "Bakliyat & Makarna", tint: 2, icon: "wheat", orderable: true },
  { slug: "konserve-hazir-yemek", name: "Konserve & Hazır Yemek", tint: 1, icon: "soup", orderable: true },
  { slug: "yag-sos-baharat", name: "Yağ, Sos & Baharat", tint: 7, icon: "droplets", orderable: true },
  { slug: "atistirmalik", name: "Atıştırmalık", tint: 5, icon: "cookie", orderable: true },
  { slug: "cips-kuruyemis", name: "Cips & Kuruyemiş", tint: 2, icon: "nut", orderable: true },
  { slug: "cikolata-sekerleme", name: "Çikolata & Şekerleme", tint: 6, icon: "candy", orderable: true },
  { slug: "kahve-cay", name: "Kahve & Çay", tint: 1, icon: "coffee", orderable: true },
  { slug: "dondurma", name: "Dondurma", tint: 4, icon: "ice-cream-cone", orderable: true },
  { slug: "donuk-gida", name: "Donuk Gıda", tint: 3, icon: "snowflake", orderable: true },
  { slug: "zeytin-tursu", name: "Zeytin & Turşu", tint: 0, icon: "citrus", orderable: true },
  { slug: "temizlik-deterjan", name: "Temizlik & Deterjan", tint: 7, icon: "spray-can", orderable: true },
  { slug: "kagit-urunleri", name: "Kağıt Ürünleri", tint: 3, icon: "scroll-text", orderable: true },
  { slug: "kisisel-bakim", name: "Kişisel Bakım", tint: 6, icon: "sparkles", orderable: true },
  { slug: "vitamin-ilk-yardim", name: "Vitamin & İlk Yardım", tint: 0, icon: "pill", orderable: true },
  { slug: "tek-kullanimlik-piknik", name: "Tek Kullanımlık & Piknik", tint: 2, icon: "utensils", orderable: true },
  { slug: "bebek", name: "Bebek", tint: 6, icon: "baby", orderable: true },
  { slug: "evcil-hayvan", name: "Evcil Hayvan", tint: 5, icon: "paw-print", orderable: true },
  // Tütün: 4207/4733 sayılı kanunlar gereği online satış YASAK — sepete eklenemez.
  { slug: "sigara-tutun", name: "Sigara & Tütün", tint: 1, icon: "cigarette", orderable: false },
  { slug: "mangal-komur", name: "Mangal & Kömür", tint: 2, icon: "flame", orderable: true },
  { slug: "cakmak-kibrit-tup", name: "Çakmak, Kibrit & Tüp", tint: 1, icon: "flame-kindling", orderable: true },
  { slug: "sarj-aleti-pil", name: "Şarj Aleti & Pil", tint: 3, icon: "battery-charging", orderable: true },
  { slug: "plaj-mayo-terlik", name: "Plaj, Mayo & Terlik", tint: 4, icon: "umbrella", orderable: true },
  { slug: "gunes-kremi-plaj", name: "Güneş Kremi & Plaj", tint: 2, icon: "sun", orderable: true },
  { slug: "sisme-bot-havuz", name: "Şişme Bot & Havuz", tint: 4, icon: "life-buoy", orderable: true },
  { slug: "sinek-bocek-kovucu", name: "Sinek & Böcek Kovucu", tint: 0, icon: "bug", orderable: true },
];

export function categoryBySlug(slug: string): CategoryDef | undefined {
  return SHOP_CATEGORIES.find((c) => c.slug === slug);
}
