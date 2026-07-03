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
  image_url: string | null;
  is_active: boolean;
  in_stock: boolean;
  is_featured: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
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
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  note: string;
  admin_note: string;
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
  qty: number;
  line_total: number;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: string;
  note: string;
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
  qty: number;
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
