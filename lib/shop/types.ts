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

export interface Product {
  id: string;
  category_slug: string;
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
  image_url: string | null;
  is_active: boolean;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean; // vitrinde "Çok Satan" grubu
  sort: number;
  created_at: string;
  updated_at: string;
}

/** Kayıtlı kurye — couriers tablosu (yalnız service-role okur/yazar). */
export interface Courier {
  id: string;
  name: string;
  phone: string;
  image_url: string; // avatar foto public URL'i; boş = görsel yok
  is_active: boolean;
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
  /** Gram bazlı ürünlerde qty = GRAM (250'şer adım); değilse adet. */
  qty: number;
  soldByWeight: boolean;
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
export const WEIGHT_STEP_GRAMS = 250; // +/- adım ve en küçük ekleme
export const WEIGHT_MIN_GRAMS = 250; // en az sipariş miktarı
export const WEIGHT_MAX_GRAMS = 10000; // en çok (10 kg)

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
    (p.category_slug === "meyve-sebze" && p.unit === "kg")
  );
}

/** Gram bazlı qty'yi [min, max] arasına al ve tam sayıya yuvarla. */
export function clampGrams(grams: number): number {
  const g = Math.round(Number(grams) || 0);
  return Math.min(WEIGHT_MAX_GRAMS, Math.max(WEIGHT_MIN_GRAMS, g));
}

/** Satır toplamı: gram bazlıysa kg fiyatı × (gram/1000), değilse fiyat × adet. */
export function computeLineTotal(
  price: number,
  qty: number,
  soldByWeight: boolean,
): number {
  const raw = soldByWeight ? (price * qty) / 1000 : price * qty;
  return Math.round(raw * 100) / 100;
}

/** Gram miktarını okunur yaz: "500 g" · "1 kg" · "1,5 kg". */
export function formatGrams(grams: number): string {
  if (grams < 1000) return `${grams} g`;
  const kg = grams / 1000;
  const text = Number.isInteger(kg) ? String(kg) : String(kg).replace(".", ",");
  return `${text} kg`;
}
