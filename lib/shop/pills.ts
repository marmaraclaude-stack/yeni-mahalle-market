// Ürün pilleri (rozetler) — yönetici ürün formunda seçer, ürün kartında ve
// detay sayfasında rozet olarak çıkar. Kaynak: products.pills text[].
//
// Tasarım notu: pil ZORUNLU DEĞİL. Çoğu üründe boş kalır; yalnızca müşteriye
// gerçekten bir şey söyleyen ürünlerde işaretlenir (ör. laktozsuz süt,
// günlük gelen peynir). Herkese pil takılırsa rozetler anlamını yitirir.
//
// "Öne çıkan" (is_featured) ve "Çok satan" (is_best_seller) BURADA YOK —
// onlar ayrı anahtarlar ve sıralamayı da etkiliyor; burada yalnızca ürünün
// kendi niteliğini anlatan etiketler var.

/** Pil rengi — shop.module.css / urun.module.css içindeki ton sınıfları. */
export type PillTone = "info" | "fresh" | "cold" | "alt" | "accent";

export interface PillDef {
  /** products.pills dizisinde saklanan anahtar (kebab-case, değişmez). */
  key: string;
  /** Müşteriye görünen metin. */
  label: string;
  tone: PillTone;
  /** Yönetici formunda gruplama başlığı. */
  group: string;
  /** Yöneticiye ipucu: bu pil ne zaman takılır. */
  hint: string;
}

export const PILL_GROUPS = [
  "Beslenme & Diyet",
  "İçerik & Üretim",
  "Tazelik & Saklama",
  "Sunum & Kampanya",
] as const;

/** Katalog — 20 pil. Sıra, yönetici formundaki gösterim sırasıdır. */
export const PILLS: PillDef[] = [
  // — Beslenme & Diyet (7)
  { key: "laktozsuz", label: "Laktozsuz", tone: "info", group: "Beslenme & Diyet",
    hint: "Laktozu parçalanmış ürün (laktaz enzimli süt, yoğurt, peynir)." },
  { key: "glutensiz", label: "Glutensiz", tone: "info", group: "Beslenme & Diyet",
    hint: "Gluten içermeyen; çölyak hastaları için uygun ürün." },
  { key: "seker-ilavesiz", label: "Şeker İlavesiz", tone: "info", group: "Beslenme & Diyet",
    hint: "İlave şeker yok (meyvenin doğal şekeri olabilir)." },
  { key: "probiyotik", label: "Probiyotik", tone: "info", group: "Beslenme & Diyet",
    hint: "Canlı probiyotik kültür içeren yoğurt, kefir, içecek." },
  { key: "yuksek-protein", label: "Yüksek Protein", tone: "info", group: "Beslenme & Diyet",
    hint: "Protein oranı öne çıkan ürün (quark, süzme, protein bar)." },
  { key: "tam-tahilli", label: "Tam Tahıllı", tone: "info", group: "Beslenme & Diyet",
    hint: "Tam buğday / tam tahıl unu ile üretilmiş." },
  { key: "az-yagli", label: "Az Yağlı", tone: "info", group: "Beslenme & Diyet",
    hint: "Light / yağı azaltılmış ürün." },

  // — İçerik & Üretim (6)
  { key: "organik", label: "Organik", tone: "fresh", group: "İçerik & Üretim",
    hint: "Organik sertifikalı ürün." },
  { key: "katkisiz", label: "Katkısız", tone: "fresh", group: "İçerik & Üretim",
    hint: "Koruyucu / renklendirici / aroma katkısı içermez." },
  { key: "vegan", label: "Vegan", tone: "fresh", group: "İçerik & Üretim",
    hint: "Hayvansal içerik yok (bitkisel süt, vegan atıştırmalık)." },
  { key: "helal", label: "Helal Sertifikalı", tone: "fresh", group: "İçerik & Üretim",
    hint: "Helal belgeli et ve şarküteri ürünleri." },
  { key: "yerli-uretim", label: "Yerli Üretim", tone: "fresh", group: "İçerik & Üretim",
    hint: "Türkiye'de üretilmiş ürün." },
  { key: "ev-yapimi", label: "Ev Yapımı", tone: "fresh", group: "İçerik & Üretim",
    hint: "El yapımı / ev usulü üretim (reçel, turşu, mantı)." },

  // — Tazelik & Saklama (4)
  { key: "gunluk-taze", label: "Günlük Taze", tone: "fresh", group: "Tazelik & Saklama",
    hint: "Her gün taze gelen ürün (ekmek, süt, peynir, balık, sebze)." },
  { key: "mevsiminde", label: "Mevsiminde", tone: "fresh", group: "Tazelik & Saklama",
    hint: "Mevsimi olan meyve/sebze — en lezzetli dönemde." },
  { key: "yoresel", label: "Yöresel", tone: "fresh", group: "Tazelik & Saklama",
    hint: "Belirli bir yöreye ait ürün (Ezine peyniri, Antep fıstığı)." },
  { key: "dondurulmus", label: "Dondurulmuş", tone: "cold", group: "Tazelik & Saklama",
    hint: "Şoklanmış / donuk reyon ürünü — soğuk zincirle taşınır." },

  // — Sunum & Kampanya (3)
  { key: "yeni-urun", label: "Yeni Ürün", tone: "alt", group: "Sunum & Kampanya",
    hint: "Rafa yeni giren ürün. Birkaç hafta sonra kaldırmayı unutmayın." },
  { key: "aile-boyu", label: "Aile Boyu", tone: "alt", group: "Sunum & Kampanya",
    hint: "Büyük boy / ekonomik paket (2 kg yoğurt, 10'lu paket)." },
  { key: "firsat", label: "Fırsat Ürünü", tone: "accent", group: "Sunum & Kampanya",
    hint: "Kısa süreli fiyat avantajı olan ürün." },
];

const BY_KEY = new Map(PILLS.map((p) => [p.key, p]));

/** Bilinen bir pil anahtarının tanımı; bilinmiyorsa undefined. */
export function pillByKey(key: string): PillDef | undefined {
  return BY_KEY.get(key);
}

/**
 * Ürünün gösterilecek pilleri — bilinmeyen anahtarlar elenir, katalog
 * sırasına göre sabitlenir (kayıt sırası kartlar arasında oynamasın).
 */
export function productPills(p: { pills?: string[] | null }): PillDef[] {
  const set = new Set(p.pills ?? []);
  if (set.size === 0) return [];
  return PILLS.filter((d) => set.has(d.key));
}

/** Yönetici formu için gruplanmış katalog. */
export function pillsByGroup(): { group: string; items: PillDef[] }[] {
  return PILL_GROUPS.map((g) => ({
    group: g,
    items: PILLS.filter((p) => p.group === g),
  }));
}
