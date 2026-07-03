"use server";

// Admin e-ticaret Server Action'ları.
// HER action önce parola oturumunu (admin_auth cookie) doğrular,
// sonra service-role client ile yazar — RLS'te yazma policy'si bilinçli olarak yok.

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShopSettings,
} from "@/lib/shop/types";

/** updateProduct için satır içi düzenlenebilir alanlar. */
export interface ProductPatch {
  name?: string;
  brand?: string;
  size_text?: string;
  category_slug?: string;
  price?: number;
  compare_at_price?: number | null;
  in_stock?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  sort?: number;
}

/** createProduct girdisi — slug sunucuda üretilir. */
export interface NewProductInput {
  category_slug: string;
  name: string;
  price: number;
  size_text?: string;
  brand?: string;
}

/** shop_settings güncellemesi (id hariç kısmi). */
export type SettingsPatch = Partial<Omit<ShopSettings, "id">>;

const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

/** Yetki kapısı — admin cookie yoksa hata fırlatır. */
async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Yetkisiz erişim — admin girişi gerekli.");
  }
}

/** Siparişle ilgili admin sayfalarının önbelleğini tazele. */
function revalidateOrderPages(orderId?: string): void {
  revalidatePath("/admin");
  revalidatePath("/admin/siparisler");
  if (orderId) revalidatePath(`/admin/siparisler/${orderId}`);
}

/** Ürünle ilgili sayfaların önbelleğini tazele (vitrin dahil). */
function revalidateProductPages(): void {
  revalidatePath("/admin");
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
}

// ------------------------------------------------------------
// Siparişler
// ------------------------------------------------------------

/** Sipariş durumunu değiştir. Kapıda ödemeli sipariş teslim edilince ödemeyi de "paid" yapar. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Geçersiz sipariş durumu: ${status}`);
  }
  const supabase = createAdminClient();

  const patch: { status: OrderStatus; payment_status?: PaymentStatus } = {
    status,
  };

  // Kapıda ödeme + teslim edildi → tahsilat yapılmış say.
  if (status === "delivered") {
    const { data } = await supabase
      .from("orders")
      .select("payment_method, payment_status")
      .eq("id", orderId)
      .maybeSingle();
    const row = data as {
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
    } | null;
    if (row && row.payment_method !== "iyzico" && row.payment_status === "pending") {
      patch.payment_status = "paid";
    }
  }

  const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
  if (error) throw new Error(`Sipariş durumu güncellenemedi: ${error.message}`);
  revalidateOrderPages(orderId);
}

/** Ödeme durumunu değiştir (paid / pending / failed / refunded). */
export async function setPaymentStatus(
  orderId: string,
  status: PaymentStatus,
): Promise<void> {
  await requireAdmin();
  if (!PAYMENT_STATUSES.includes(status)) {
    throw new Error(`Geçersiz ödeme durumu: ${status}`);
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: status })
    .eq("id", orderId);
  if (error) throw new Error(`Ödeme durumu güncellenemedi: ${error.message}`);
  revalidateOrderPages(orderId);
}

/** İç notu (kurye adı, hatırlatma vs.) güncelle. */
export async function updateAdminNote(
  orderId: string,
  note: string,
): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ admin_note: note.slice(0, 2000) })
    .eq("id", orderId);
  if (error) throw new Error(`Not kaydedilemedi: ${error.message}`);
  revalidateOrderPages(orderId);
}

// ------------------------------------------------------------
// Ürünler
// ------------------------------------------------------------

/** Türkçe karakterleri sadeleştirip URL dostu slug üret. */
function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Ürün alanlarını kısmi güncelle (fiyat/stok/aktif/ad...). */
export async function updateProduct(
  id: string,
  patch: ProductPatch,
): Promise<void> {
  await requireAdmin();
  if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0)) {
    throw new Error("Geçersiz fiyat.");
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw new Error(`Ürün güncellenemedi: ${error.message}`);
  revalidateProductPages();
}

/** Yeni ürün ekle — slug addan üretilir, çakışırsa rastgele son ek denenir. */
export async function createProduct(data: NewProductInput): Promise<void> {
  await requireAdmin();
  const name = data.name.trim();
  if (!name) throw new Error("Ürün adı boş olamaz.");
  if (!data.category_slug) throw new Error("Kategori seçin.");
  if (!Number.isFinite(data.price) || data.price < 0) {
    throw new Error("Geçersiz fiyat.");
  }

  const supabase = createAdminClient();
  const base = slugify([data.brand ?? "", name, data.size_text ?? ""].join(" ")) || "urun";

  // Slug çakışmasında 3 kez rastgele son ekle dene.
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug =
      attempt === 0
        ? base
        : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("products").insert({
      category_slug: data.category_slug,
      name,
      slug,
      brand: (data.brand ?? "").trim(),
      size_text: (data.size_text ?? "").trim(),
      price: data.price,
    });
    if (!error) {
      revalidateProductPages();
      return;
    }
    lastError = error.message;
    if (error.code !== "23505") break; // unique ihlali değilse tekrar deneme
  }
  throw new Error(`Ürün eklenemedi: ${lastError}`);
}

/** Ürünü aktif/pasif yap (vitrinde göster/gizle). */
export async function toggleProductActive(
  id: string,
  active: boolean,
): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: active })
    .eq("id", id);
  if (error) throw new Error(`Ürün durumu değiştirilemedi: ${error.message}`);
  revalidateProductPages();
}

// ------------------------------------------------------------
// Ayarlar
// ------------------------------------------------------------

/** shop_settings (tek satır, id=1) güncelle — satır yoksa oluşturur. */
export async function updateSettings(patch: SettingsPatch): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("shop_settings")
    .upsert({ id: 1, ...patch });
  if (error) throw new Error(`Ayarlar kaydedilemedi: ${error.message}`);
  revalidatePath("/admin/ayarlar");
  revalidatePath("/admin");
  // Ayarlar vitrin ve ödeme akışını da etkiler.
  revalidatePath("/odeme");
  revalidatePath("/sepet");
}
