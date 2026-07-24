// E-ticaret şemasının TS karşılıkları.
// Kaynak: supabase/migrations/20260703100000_eticaret_schema.sql

export interface ShopCategory {
  slug: string;
  name: string;
  tint: number; // CategoryGrid TINTS index (0-7)
  icon: string; // lucide ikon adı (kebab-case)
  sort: number;
  is_orderable: boolean;
}

/** Etiket bilgileri — 100 g/ml başına besin değerleri (null = bilinmiyor). */
export interface ProductNutrition {
  enerji_kcal?: number | null;
  enerji_kj?: number | null;
  yag_g?: number | null;
  doymus_yag_g?: number | null;
  karbonhidrat_g?: number | null;
  seker_g?: number | null;
  protein_g?: number | null;
  tuz_g?: number | null;
}

/** Ürün etiket/detay bilgileri (products.details jsonb) — şarküteri vb.
 *  paketli ürünlerde Migros tarzı "Ürün Bilgileri / Besin Değerleri"
 *  sekmelerini besler. Tümü opsiyonel; null alan gösterilmez. */
export interface ProductDetails {
  icindekiler?: string | null;
  net_miktar?: string | null;
  saklama?: string | null;
  mensei?: string | null;
  uretici?: string | null;
  besin100?: ProductNutrition | null;
}

export interface Product {
  id: string;
  category_slug: string;
  /** Yönetici elle seçtiyse alt kategori slug'ı; null → kural tabanlı atama. */
  subcategory_slug: string | null;
  name: string;
  slug: string;
  brand: string;
  size_text: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  unit: string;
  /** true ise fiyat KİLOGRAM başınadır ve müşteri gram seçer (meyve-sebze). */
  sold_by_weight: boolean;
  /** Gram satış ölçeği: en az miktar + adım (iri ürünlerde kg ölçeği). */
  weight_min_grams: number;
  weight_step_grams: number;
  /** Adet ürünlerde paket fiyatları (toplu alım indirimi); null = yok. */
  pack_prices: PackPrices | null;
  /** Stok adedi (adetli üründe adet, gram bazlıda GRAM). null = takip yok. */
  stock_qty: number | null;
  /** Etiket/detay bilgileri (jsonb); null = girilmemiş. */
  details: ProductDetails | null;
  image_url: string | null;
  /** Markaya atanmış kampanya etiketi (vitrin pili) — sunucuda eklenir. */
  brand_campaign?: string | null;
  is_active: boolean;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean; // vitrinde "Çok Satan" grubu
  sort: number;
  created_at: string;
  updated_at: string;
}

/** Araç (motor) — vehicles tablosu. GPS cihazı araca takılıdır; courier_id
 *  o an aracı kullanan kurye (değiştirilebilir). Yalnız service-role okur/yazar. */
export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  courier_id: string | null;
  last_lat: number | null;
  last_lng: number | null;
  last_at: string | null;
  is_active: boolean;
  created_at: string;
}

/** Kayıtlı kurye — couriers tablosu (yalnız service-role okur/yazar). */
export interface Courier {
  id: string;
  name: string;
  phone: string;
  image_url: string; // avatar foto public URL'i; boş = görsel yok
  is_active: boolean;
  /** Kurye paneline giriş kodu (telefon + kod). Boş = giriş kapalı. */
  login_code: string;
  created_at: string;
}

export type PaymentMethod = "cod_cash" | "cod_card" | "iyzico";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  order_no: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  address_line: string;
  address_note: string;
  items_subtotal: number;
  delivery_fee: number;
  coupon_code: string | null;
  discount_total: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  note: string;
  admin_note: string;
  courier_name: string;
  courier_phone: string;
  courier_lat: number | null;
  courier_lng: number | null;
  courier_location_at: string | null;
  /** Sipariş anında hesaplanan kuş uçuşu mesafe (km); konum yoksa null. */
  delivery_km: number | null;
  iyzico_token: string | null;
  iyzico_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  unit_price: number;
  /** Gram bazlı ürünlerde qty = GRAM, unit_price = kg fiyatı; değilse adet. */
  qty: number;
  line_total: number;
  sold_by_weight: boolean;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: string;
  note: string;
  created_at: string;
}

export type CouponDiscountType = "percent" | "fixed";

/** Kupon — coupons tablosu (yalnız service-role okur/yazar). */
export interface Coupon {
  code: string; // BÜYÜK harf saklanır (örn. HOSGELDIN20)
  description: string;
  discount_type: CouponDiscountType;
  value: number; // percent: %X, fixed: ₺X
  min_order_total: number; // 0 = alt sınır yok
  max_uses: number | null; // null = sınırsız
  per_user_limit: number; // üye başına kullanım; 0 = sınırsız
  used_count: number;
  is_active: boolean;
  expires_at: string | null; // null = süresiz
  created_at: string;
}

/**
 * Kampanya banner'ı — banners tablosu.
 * Vitrin anon client ile yalnız aktifleri okur (RLS: is_active = true);
 * yazmalar service-role (admin Server Action) üzerinden yapılır.
 */
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string; // boş = buton yok
  cta_href: string; // /firsatlar, /urunler?k=... vb.
  icon: string; // BANNER_ICON_OPTIONS anahtarı; boş = içeriğe göre otomatik
  tint: number; // CATEGORY_TINTS index (0-7) zemin
  is_active: boolean;
  sort: number;
  created_at: string;
}

export interface ShopSettings {
  id: 1;
  delivery_fee: number;
  free_delivery_over: number;
  /** Dahil km sonrası km başına ek ücret (0 = mesafe ücretlendirmesi kapalı). */
  delivery_per_km: number;
  /** Taban ücrete dahil mesafe (km) — bunun üstü km başı ücretlendirilir. */
  delivery_km_included: number;
  /** En uzak teslimat mesafesi (km); 0 = sınırsız. Aşılırsa sipariş alınmaz. */
  delivery_max_km: number;
  min_order_total: number;
  cod_cash_enabled: boolean;
  cod_card_enabled: boolean;
  iyzico_enabled: boolean;
  ordering_open: boolean;
  closed_message: string;
}

export interface CustomerProfile {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  title: string;
  line: string;
  district: string;
  note: string;
  created_at: string;
}

/** Sepet satırı — localStorage'da tutulur, fiyat sunucuda TEKRAR doğrulanır. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  sizeText: string;
  price: number; // gösterim için; sipariş anında sunucu fiyatı esas alınır
  imageUrl: string | null;
  categorySlug: string;
  /** Gram bazlı ürünlerde qty = GRAM (adım kadar); değilse adet. */
  qty: number;
  soldByWeight: boolean;
  /** Gram satış ölçeği (ürün bazında) — stepper/clamp bunları kullanır. */
  weightMin: number;
  weightStep: number;
  /** Adet paket fiyatları (toplu indirim); null = yok. */
  packPrices: PackPrices | null;
}

/** Sipariş durumlarının Türkçe etiketleri + akış sırası. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Sipariş Alındı",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  on_the_way: "Kurye Yolda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod_cash: "Kapıda Nakit",
  cod_card: "Kapıda Kart",
  iyzico: "Online Kart (iyzico)",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Ödeme Bekliyor",
  paid: "Ödendi",
  failed: "Başarısız",
  refunded: "İade Edildi",
};

/**
 * Teslimat ücretini hesapla (saf — client/sunucu ortak).
 * free_delivery_over aşıldıysa 0; değilse taban + dahil km sonrası km başı ücret.
 */
export function calcDeliveryFee(
  settings: Pick<
    ShopSettings,
    "delivery_fee" | "free_delivery_over" | "delivery_per_km" | "delivery_km_included"
  >,
  subtotal: number,
  /** Markete kuş uçuşu mesafe (km); bilinmiyorsa null → yalnız taban ücret. */
  distanceKm?: number | null,
): number {
  if (settings.free_delivery_over > 0 && subtotal >= settings.free_delivery_over) {
    return 0;
  }
  let fee = settings.delivery_fee;
  if (
    settings.delivery_per_km > 0 &&
    typeof distanceKm === "number" &&
    Number.isFinite(distanceKm) &&
    distanceKm > settings.delivery_km_included
  ) {
    fee += (distanceKm - settings.delivery_km_included) * settings.delivery_per_km;
  }
  return Math.round(fee * 100) / 100;
}

/** İki koordinat arası kuş uçuşu mesafe (km) — Haversine. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.asin(Math.sqrt(s)) * 100) / 100;
}

/** Fiyatı "₺123,50" biçiminde yaz. */
export function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value);
}

// ------------------------------------------------------------
// Gram bazlı (kilogram fiyatlı) satış — meyve-sebze vb.
// Fiyat kg başınadır; sepette/siparişte qty GRAM olarak tutulur.
// ------------------------------------------------------------
export const WEIGHT_STEP_GRAMS = 250; // varsayılan +/- adım ve en küçük ekleme
export const WEIGHT_MIN_GRAMS = 250; // varsayılan en az miktar
export const WEIGHT_MAX_GRAMS = 40000; // en çok (40 kg) — iri ürünler için tavan

/**
 * Ürünün gram satış ölçeği: en az miktar + adım (ürün bazında).
 * Karpuz/kavun gibi iri ürünlerde admin 5 kg / 1 kg girer → 5-6-7-8 kg seçimi.
 * Alanlar yoksa (eski kayıt) varsayılan 250 g / 250 g kullanılır.
 */
export function weightMinFor(p: { weight_min_grams?: number | null }): number {
  const v = Number(p.weight_min_grams);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : WEIGHT_MIN_GRAMS;
}
export function weightStepFor(p: { weight_step_grams?: number | null }): number {
  const v = Number(p.weight_step_grams);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : WEIGHT_STEP_GRAMS;
}
/** Hazır miktar çipleri: en azdan başlayıp 4 adım (min, min+adım, +2, +3). */
export function weightPresets(minGrams: number, stepGrams: number): number[] {
  return [0, 1, 2, 3].map((i) => minGrams + i * stepGrams);
}

/**
 * Ürün gram bazlı mı satılıyor?
 * - Açık işaret (sold_by_weight) VARSA her zaman gram bazlıdır, veya
 * - Meyve-sebze kategorisinde ve kilogram fiyatlıysa (unit="kg") otomatik
 *   gram bazlıdır — böylece her ürünü tek tek işaretlemek gerekmez, paketli
 *   kg ürünleri (un, şeker vb. başka kategoriler) etkilenmez.
 */
export function isWeightBased(p: {
  sold_by_weight?: boolean | null;
  unit?: string | null;
  category_slug?: string | null;
}): boolean {
  return (
    p.sold_by_weight === true ||
    (p.category_slug === "meyve-sebze" &&
      (p.unit === "kg" || p.unit === "gram"))
  );
}

/** Gram bazlı qty'yi [min, max] arasına al ve tam sayıya yuvarla. */
export function clampGrams(
  grams: number,
  minGrams: number = WEIGHT_MIN_GRAMS,
): number {
  const g = Math.round(Number(grams) || 0);
  return Math.min(WEIGHT_MAX_GRAMS, Math.max(minGrams, g));
}

/** Adet ürünlerde paket fiyatları: { "2": 189.99, "3": 279.99, "4": 359.99 }.
 *  Tanımlıysa o adet için toplam fiyat budur (toplu alım indirimi); yoksa
 *  adet × birim fiyat. */
export type PackPrices = Record<string, number>;

/** Belirli adet için tanımlı paket fiyatı (yoksa null). */
export function packPriceFor(
  packPrices: PackPrices | null | undefined,
  qty: number,
): number | null {
  const v = packPrices?.[String(qty)];
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
}

/**
 * Satır toplamı: gram bazlıysa kg fiyatı × (gram/1000); adet ürünlerde paket
 * fiyatı tanımlıysa o (toplu indirim), değilse fiyat × adet.
 */
export function computeLineTotal(
  price: number,
  qty: number,
  soldByWeight: boolean,
  packPrices?: PackPrices | null,
): number {
  if (soldByWeight) return Math.round(((price * qty) / 1000) * 100) / 100;
  const pack = packPriceFor(packPrices, qty);
  if (pack != null) return Math.round(pack * 100) / 100;
  return Math.round(price * qty * 100) / 100;
}

/** Gram miktarını okunur yaz: "500 g" · "1 kg" · "1,5 kg". */
export function formatGrams(grams: number): string {
  if (grams < 1000) return `${grams} g`;
  const kg = grams / 1000;
  const text = Number.isInteger(kg) ? String(kg) : String(kg).replace(".", ",");
  return `${text} kg`;
}

/**
 * Birim fiyat bilgisi (Getir/Migros netliği): paket fiyatını gramaj/hacim ya
 * da adede bölüp "₺X / kg" · "₺X / L" · "₺X / adet" döndürür. Gram bazlı
 * (kg picker) ürünlerde ve tam 1 kg / 1 L olanlarda bilgi tekrar olacağından
 * null döner. Ör. 125 g / ₺199,99 → "₺1.599,92 / kg".
 */
export function unitPriceLabel(product: {
  price: number;
  size_text: string;
  unit: string;
  sold_by_weight?: boolean | null;
  category_slug?: string | null;
}): string | null {
  const { price, size_text, unit } = product;
  if (!price || price <= 0) return null;
  // Zaten kg ile (gram picker) satılıyorsa fiyat zaten "/kg" gösteriliyor.
  if (unit === "kg" || isWeightBased(product)) return null;
  const s = (size_text ?? "").toLocaleLowerCase("tr-TR").replace(/,/g, ".");

  // Gramaj/hacim, opsiyonel "NxM birim" (örn. "6x0.5 l", "2x160 g")
  const wv = s.match(/(?:(\d+(?:\.\d+)?)\s*[x×]\s*)?(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/);
  if (wv) {
    const count = wv[1] ? parseFloat(wv[1]) : 1;
    const qty = parseFloat(wv[2]);
    const u = wv[3];
    const total = count * qty;
    if (total > 0) {
      if (u === "kg" || u === "g") {
        const grams = u === "kg" ? total * 1000 : total;
        if (grams === 1000) return null;
        const perKg = price / (grams / 1000);
        return `${formatTL(Math.round(perKg * 100) / 100)} / kg`;
      }
      const ml = u === "l" ? total * 1000 : total;
      if (ml === 1000) return null;
      const perL = price / (ml / 1000);
      return `${formatTL(Math.round(perL * 100) / 100)} / L`;
    }
  }

  // Çoklu adet: "8'li", "60'lı", "12 adet" vb.
  const cnt = s.match(/(\d+)\s*['’]?\s*(?:l[iıuü]|adet)\b/);
  if (cnt) {
    const n = parseInt(cnt[1], 10);
    if (n > 1) {
      const per = price / n;
      return `${formatTL(Math.round(per * 100) / 100)} / adet`;
    }
  }
  return null;
}

/** Gram-paket birimi mi? (fiyat pakete aittir; "/gram" son eki gösterilmez). */
export function isGramPackUnit(unit: string | null | undefined): boolean {
  return unit === "gram" || unit === "gr" || unit === "g";
}

/**
 * Listede/başlıkta kg fiyatı yerine EN AZ miktarın (paket) fiyatı gösterilsin mi?
 * Yalnız birimi "gram" olan gram bazlı ürünlerde (ör. 125 g ahududu → ₺200).
 * Birimi "kg" olanlar (domates, karpuz) kg fiyatını gösterir — manuel kontrol.
 */
export function showsPackPrice(p: {
  sold_by_weight?: boolean | null;
  unit?: string | null;
  category_slug?: string | null;
}): boolean {
  return isWeightBased(p) && p.unit === "gram";
}
