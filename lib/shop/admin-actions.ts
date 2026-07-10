"use server";

// Admin e-ticaret Server Action'ları.
// HER action önce parola oturumunu (admin_auth cookie) doğrular,
// sonra service-role client ile yazar — RLS'te yazma policy'si bilinçli olarak yok.

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/admin/actions";
import {
  writeActiveLocation,
  writeCourierLocation,
} from "@/lib/shop/location-ingest";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryBySlug } from "@/lib/shop/categories";
import { BANNER_ICONS } from "@/lib/shop/icons";
import type {
  Courier,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShopSettings,
  Vehicle,
} from "@/lib/shop/types";
import type { ChatMessage, ChatSession } from "@/lib/supabase/types";

/** updateProduct için düzenlenebilir alanlar — slug BİLİNÇLİ olarak yok (URL kırılmasın). */
export interface ProductPatch {
  name?: string;
  brand?: string;
  size_text?: string;
  description?: string;
  unit?: string;
  category_slug?: string;
  subcategory_slug?: string | null;
  price?: number;
  compare_at_price?: number | null;
  sold_by_weight?: boolean;
  weight_min_grams?: number;
  weight_step_grams?: number;
  pack_prices?: Record<string, number> | null;
  in_stock?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  sort?: number;
}

/** Görsel yükleme/kaldırma action'larının dönüş tipi (form sonucu). */
export interface ImageActionResult {
  ok: boolean;
  error?: string;
}

/** createProduct girdisi — slug sunucuda üretilir. */
export interface NewProductInput {
  category_slug: string;
  name: string;
  price: number;
  size_text?: string;
  brand?: string;
  unit?: string;
}

/** shop_settings güncellemesi (id hariç kısmi). */
export type SettingsPatch = Partial<Omit<ShopSettings, "id">>;

/** coupons tablosunun satır tipi (kolon adları migration ile birebir). */
export interface Coupon {
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  value: number;
  min_order_total: number;
  max_uses: number | null;
  per_user_limit: number; // üye başına kullanım; 0 = sınırsız
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

/** createCoupon girdisi — expires_at "YYYY-AA-GG" (boş/null = süresiz). */
export interface NewCouponInput {
  code: string;
  description?: string;
  discount_type: "percent" | "fixed";
  value: number;
  min_order_total?: number;
  max_uses?: number | null;
  per_user_limit?: number; // 0 = üye başına sınırsız (varsayılan 1)
  expires_at?: string | null;
}

/** updateCoupon için kısmi alanlar — code (PK) değiştirilemez. */
export interface CouponPatch {
  description?: string;
  discount_type?: "percent" | "fixed";
  value?: number;
  min_order_total?: number;
  max_uses?: number | null;
  per_user_limit?: number; // 0 = üye başına sınırsız
  expires_at?: string | null; // "YYYY-AA-GG" veya null (süresiz)
  is_active?: boolean;
}

/** Kupon action'larının dönüş tipi — hata mesajı client'a güvenle taşınır. */
export interface CouponActionResult {
  ok: boolean;
  error?: string;
}

/** createBanner girdisi — id/created_at sunucuda üretilir. CTA kaldırıldı. */
export interface NewBannerInput {
  title: string;
  subtitle?: string;
  icon?: string; // BANNER_ICON_OPTIONS anahtarı (boş = otomatik)
  tint?: number; // CATEGORY_TINTS index (0-7)
  sort?: number;
}

/** updateBanner için kısmi alanlar — id (PK) değiştirilemez. CTA kaldırıldı. */
export interface BannerPatch {
  title?: string;
  subtitle?: string;
  icon?: string; // BANNER_ICON_OPTIONS anahtarı (boş = otomatik)
  tint?: number;
  is_active?: boolean;
  sort?: number;
}

/** Banner action'larının dönüş tipi — hata mesajı client'a güvenle taşınır. */
export interface BannerActionResult {
  ok: boolean;
  error?: string;
}

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
    throw new Error("Yetkisiz erişim. Admin girişi gerekli.");
  }
}

/** Siparişle ilgili admin sayfalarının önbelleğini tazele. */
function revalidateOrderPages(orderId?: string): void {
  revalidatePath("/admin");
  revalidatePath("/admin/siparisler");
  if (orderId) revalidatePath(`/admin/siparisler/${orderId}`);
}

/** Ürünle ilgili sayfaların önbelleğini tazele (vitrin + detay dahil). */
function revalidateProductPages(opts: { id?: string; slug?: string } = {}): void {
  revalidatePath("/admin");
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  if (opts.id) revalidatePath(`/admin/urunler/${opts.id}`);
  if (opts.slug) revalidatePath(`/urunler/${opts.slug}`);
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

  const { data: cur } = await supabase
    .from("orders")
    .select("status, payment_method, payment_status")
    .eq("id", orderId)
    .maybeSingle();
  const row = cur as {
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
  } | null;

  // Kapıda ödeme + teslim edildi → tahsilat yapılmış say.
  if (
    status === "delivered" &&
    row &&
    row.payment_method !== "iyzico" &&
    row.payment_status === "pending"
  ) {
    patch.payment_status = "paid";
  }

  const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
  if (error) throw new Error(`Sipariş durumu güncellenemedi: ${error.message}`);

  // İptal edildiyse (ilk kez) kalemlerin stoğunu geri ekle.
  if (status === "cancelled" && row && row.status !== "cancelled") {
    await restoreOrderStock(orderId);
  }
  revalidateOrderPages(orderId);
}

/** Siparişin kalemlerini stok takipli ürünlere geri ekle (iptal/silme). */
async function restoreOrderStock(orderId: string): Promise<void> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("order_items")
    .select("product_id, qty")
    .eq("order_id", orderId);
  const items = (data ?? []) as { product_id: string | null; qty: number }[];
  for (const it of items) {
    if (!it.product_id) continue;
    await supabase.rpc("restore_stock", { pid: it.product_id, amount: it.qty });
  }
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

/**
 * Siparişe kurye bilgisi (ad + telefon) ata. Boş bırakılınca kurye kaldırılır.
 * "Kurye Yolda" durumunda müşteri takip sayfasında bu bilgiler gösterilir.
 */
export async function setCourier(
  orderId: string,
  name: string,
  phone: string,
): Promise<void> {
  await requireAdmin();
  if (!orderId.trim()) throw new Error("Geçersiz sipariş.");
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      courier_name: name.trim().slice(0, 120),
      courier_phone: phone.trim().slice(0, 40),
    })
    .eq("id", orderId);
  if (error) throw new Error(`Kurye bilgisi kaydedilemedi: ${error.message}`);
  revalidateOrderPages(orderId);
}

/**
 * Siparişi KALICI olarak sil. order_items ve order_events satırları
 * FK cascade ile birlikte silinir (şemada on delete cascade tanımlı).
 */
export async function deleteOrder(orderId: string): Promise<void> {
  await requireAdmin();
  if (!orderId.trim()) throw new Error("Geçersiz sipariş.");
  const supabase = createAdminClient();
  // İptal edilmemiş siparişi silerken stok geri eklenir (iptalde zaten eklendi).
  const { data: cur } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();
  if ((cur as { status: string } | null)?.status !== "cancelled") {
    await restoreOrderStock(orderId);
  }
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw new Error(`Sipariş silinemedi: ${error.message}`);
  revalidateOrderPages();
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

/**
 * Ürün alanlarını kısmi güncelle. TÜM düzenlenebilir alanlar desteklenir;
 * slug ASLA yeniden üretilmez (ad değişse bile eski URL çalışmaya devam eder).
 * Sadece beyaz listedeki alanlar DB'ye geçer.
 */
export async function updateProduct(
  id: string,
  patch: ProductPatch,
): Promise<void> {
  await requireAdmin();

  const clean: ProductPatch = {};
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new Error("Ürün adı boş olamaz.");
    clean.name = name;
  }
  if (patch.brand !== undefined) clean.brand = patch.brand.trim();
  if (patch.size_text !== undefined) clean.size_text = patch.size_text.trim();
  if (patch.description !== undefined) clean.description = patch.description.trim();
  if (patch.unit !== undefined) clean.unit = patch.unit.trim() || "adet";
  if (patch.category_slug !== undefined) {
    if (!categoryBySlug(patch.category_slug)) {
      throw new Error("Geçersiz kategori.");
    }
    clean.category_slug = patch.category_slug;
  }
  if (patch.subcategory_slug !== undefined)
    clean.subcategory_slug = patch.subcategory_slug || null;
  if (patch.price !== undefined) {
    if (!Number.isFinite(patch.price) || patch.price < 0) {
      throw new Error("Geçersiz fiyat.");
    }
    clean.price = patch.price;
  }
  if (patch.compare_at_price !== undefined) {
    if (
      patch.compare_at_price !== null &&
      (!Number.isFinite(patch.compare_at_price) || patch.compare_at_price < 0)
    ) {
      throw new Error("Geçersiz eski fiyat.");
    }
    clean.compare_at_price = patch.compare_at_price;
  }
  if (patch.sold_by_weight !== undefined)
    clean.sold_by_weight = patch.sold_by_weight;
  if (patch.weight_min_grams !== undefined) {
    const v = Math.round(patch.weight_min_grams);
    if (!Number.isFinite(v) || v < 1 || v > 100000) {
      throw new Error("Geçersiz en az miktar.");
    }
    clean.weight_min_grams = v;
  }
  if (patch.weight_step_grams !== undefined) {
    const v = Math.round(patch.weight_step_grams);
    if (!Number.isFinite(v) || v < 1 || v > 100000) {
      throw new Error("Geçersiz adım miktarı.");
    }
    clean.weight_step_grams = v;
  }
  if (patch.pack_prices !== undefined) {
    // Yalnız pozitif sayısal değerleri sakla; boşsa null.
    let cleaned: Record<string, number> | null = null;
    if (patch.pack_prices) {
      const acc: Record<string, number> = {};
      for (const [k, v] of Object.entries(patch.pack_prices)) {
        if (typeof v === "number" && Number.isFinite(v) && v > 0) {
          acc[k] = Math.round(v * 100) / 100;
        }
      }
      if (Object.keys(acc).length > 0) cleaned = acc;
    }
    clean.pack_prices = cleaned;
  }
  if (patch.in_stock !== undefined) clean.in_stock = patch.in_stock;
  if (patch.is_active !== undefined) clean.is_active = patch.is_active;
  if (patch.is_featured !== undefined) clean.is_featured = patch.is_featured;
  if (patch.is_best_seller !== undefined) clean.is_best_seller = patch.is_best_seller;
  if (patch.sort !== undefined) clean.sort = patch.sort;
  if (Object.keys(clean).length === 0) return;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(clean)
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(`Ürün güncellenemedi: ${error.message}`);
  revalidateProductPages({ id, slug: (data as { slug: string } | null)?.slug });
}

/** Yeni ürün ekle — slug addan üretilir, çakışırsa rastgele son ek denenir.
 *  Oluşturulan ürünün id + slug'ını döndürür (düzenleme sayfasına yönlendirme). */
export async function createProduct(
  data: NewProductInput,
): Promise<{ id: string; slug: string }> {
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
    const { data: inserted, error } = await supabase
      .from("products")
      .insert({
        category_slug: data.category_slug,
        name,
        slug,
        brand: (data.brand ?? "").trim(),
        size_text: (data.size_text ?? "").trim(),
        unit: (data.unit ?? "adet").trim() || "adet",
        price: data.price,
      })
      .select("id, slug")
      .single();
    if (!error && inserted) {
      revalidateProductPages();
      return inserted as { id: string; slug: string };
    }
    lastError = error?.message ?? "bilinmeyen hata";
    if (error?.code !== "23505") break; // unique ihlali değilse tekrar deneme
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
// Ürün görselleri (Supabase Storage — "product-images" bucket'ı)
// ------------------------------------------------------------

const IMAGE_BUCKET = "product-images";
const IMAGE_MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type AdminClient = ReturnType<typeof createAdminClient>;

/** Bucket yoksa public olarak oluştur; "zaten var" hatasını yut. */
async function ensureImageBucket(supabase: AdminClient): Promise<string | null> {
  const { error } = await supabase.storage.createBucket(IMAGE_BUCKET, {
    public: true,
  });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    return error.message;
  }
  return null;
}

/** Public URL'den bucket içi dosya yolunu çıkar (bizim bucket değilse null). */
function storagePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/object/public/${IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length).split("?")[0];
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** Eski görsel dosyasını storage'dan silmeyi dene — başarısızlık akışı bozmaz. */
async function tryRemoveStorageFile(
  supabase: AdminClient,
  path: string | null,
): Promise<void> {
  if (!path) return;
  try {
    await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  } catch {
    // Sessizce yut: dosya kalsa da image_url artık ona işaret etmiyor.
  }
}

/**
 * Ürün görseli yükle. Form kullanımı: <input type="file" name="image"> içeren
 * bir <form action={uploadProductImage.bind(null, productId)}> (veya sarmalayan
 * inline server action). Dosya adına rastgele sonek eklenir ki tarayıcı
 * cache'i eski görseli göstermesin; eski dosya silinmeye çalışılır.
 */
export async function uploadProductImage(
  productId: string,
  formData: FormData,
): Promise<ImageActionResult> {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Bir görsel dosyası seçin." };
  }
  const ext = IMAGE_MIME_EXT[file.type];
  if (!ext) {
    return { ok: false, error: "Sadece JPEG, PNG veya WebP formatı kabul edilir." };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { ok: false, error: "Görsel en fazla 4 MB olabilir." };
  }

  const supabase = createAdminClient();
  const { data: prodData, error: prodError } = await supabase
    .from("products")
    .select("id, slug, image_url")
    .eq("id", productId)
    .maybeSingle();
  if (prodError) {
    return { ok: false, error: `Ürün okunamadı: ${prodError.message}` };
  }
  if (!prodData) return { ok: false, error: "Ürün bulunamadı." };
  const product = prodData as { id: string; slug: string; image_url: string | null };

  const bucketError = await ensureImageBucket(supabase);
  if (bucketError) {
    return { ok: false, error: `Görsel deposu hazırlanamadı: ${bucketError}` };
  }

  // Rastgele 6 karakterlik sonek: her yüklemede yeni dosya adı → cache sorunu yok.
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${productId}-${rand}.${ext}`;
  const body = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, body, { contentType: file.type, upsert: true });
  if (uploadError) {
    return { ok: false, error: `Görsel yüklenemedi: ${uploadError.message}` };
  }

  const { data: pub } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("products")
    .update({ image_url: pub.publicUrl })
    .eq("id", productId);
  if (updateError) {
    // DB'ye yazılamadıysa az önce yüklenen dosyayı geri temizlemeyi dene.
    await tryRemoveStorageFile(supabase, path);
    return { ok: false, error: `Görsel adresi kaydedilemedi: ${updateError.message}` };
  }

  const oldPath = storagePathFromPublicUrl(product.image_url);
  if (oldPath && oldPath !== path) {
    await tryRemoveStorageFile(supabase, oldPath);
  }

  revalidateProductPages({ id: productId, slug: product.slug });
  return { ok: true };
}

/** Ürün görselini kaldır: image_url'i null yap, dosyayı storage'dan silmeyi dene. */
export async function removeProductImage(
  productId: string,
): Promise<ImageActionResult> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: prodData, error: prodError } = await supabase
    .from("products")
    .select("slug, image_url")
    .eq("id", productId)
    .maybeSingle();
  if (prodError) {
    return { ok: false, error: `Ürün okunamadı: ${prodError.message}` };
  }
  if (!prodData) return { ok: false, error: "Ürün bulunamadı." };
  const product = prodData as { slug: string; image_url: string | null };

  const { error: updateError } = await supabase
    .from("products")
    .update({ image_url: null })
    .eq("id", productId);
  if (updateError) {
    return { ok: false, error: `Görsel kaldırılamadı: ${updateError.message}` };
  }

  await tryRemoveStorageFile(supabase, storagePathFromPublicUrl(product.image_url));
  revalidateProductPages({ id: productId, slug: product.slug });
  return { ok: true };
}

/**
 * Ürünü KALICI olarak sil. cart_items FK cascade ile temizlenir; order_items
 * product_id NULL olur (sipariş geçmişi korunur). Görsel storage'dan silinir.
 */
export async function deleteProduct(productId: string): Promise<void> {
  await requireAdmin();
  if (!productId.trim()) throw new Error("Geçersiz ürün.");
  const supabase = createAdminClient();

  const { data: prodData } = await supabase
    .from("products")
    .select("slug, image_url")
    .eq("id", productId)
    .maybeSingle();
  const product = prodData as { slug: string; image_url: string | null } | null;

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(`Ürün silinemedi: ${error.message}`);

  if (product?.image_url) {
    await tryRemoveStorageFile(
      supabase,
      storagePathFromPublicUrl(product.image_url),
    );
  }
  revalidateProductPages({ id: productId, slug: product?.slug });
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

// ------------------------------------------------------------
// Kuponlar
// ------------------------------------------------------------

const COUPON_CODE_RE = /^[A-Z0-9]{3,20}$/;

/** Kodu büyük harfe çevirip doğrula; geçersizse null. */
function normalizeCouponCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return COUPON_CODE_RE.test(code) ? code : null;
}

/** coupons tablosu henüz kurulmamışsa anlaşılır Türkçe mesaj üret. */
function couponDbError(
  error: { code?: string; message: string },
  fallback: string,
): string {
  const missingTable =
    error.code === "42P01" || // Postgres: undefined_table
    error.code === "PGRST205" || // PostgREST: tablo şema önbelleğinde yok
    /coupons/i.test(error.message) &&
      /does not exist|could not find the table|schema cache/i.test(error.message);
  if (missingTable) {
    return "Kupon tablosu kurulmamış, migration'ı çalıştırın.";
  }
  return `${fallback}: ${error.message}`;
}

/**
 * "YYYY-AA-GG" tarihini gün SONU (Türkiye saati) timestamptz'e çevir —
 * kupon seçilen günün sonuna kadar geçerli kalır. Boş/null = süresiz.
 * Geçersiz biçimde string yerine hata mesajı dönmek için { error } kullanılır.
 */
function parseExpiresAt(
  raw: string | null | undefined,
): { value: string | null } | { error: string } {
  if (raw === undefined || raw === null || raw.trim() === "") {
    return { value: null };
  }
  const day = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return { error: "Geçersiz son kullanma tarihi." };
  }
  return { value: `${day}T23:59:59+03:00` };
}

/** İndirim değerini tipine göre doğrula; sorun varsa hata mesajı döner. */
function validateCouponValue(
  discountType: "percent" | "fixed",
  value: number,
): string | null {
  if (discountType !== "percent" && discountType !== "fixed") {
    return "Geçersiz indirim tipi.";
  }
  if (!Number.isFinite(value) || value <= 0) {
    return "İndirim değeri sıfırdan büyük olmalı.";
  }
  if (discountType === "percent" && value > 100) {
    return "Yüzde indirim 100'den büyük olamaz.";
  }
  return null;
}

/** Üye başına kullanım limitini doğrula: >= 0 tam sayı (0 = sınırsız). */
function validatePerUserLimit(value: number): string | null {
  if (!Number.isInteger(value) || value < 0) {
    return "Üye başına kullanım 0 veya daha büyük bir tam sayı olmalı (0 = sınırsız).";
  }
  return null;
}

/** Yeni kupon oluştur — kod büyük harfe çevrilir, [A-Z0-9]{3,20} olmalı. */
export async function createCoupon(
  input: NewCouponInput,
): Promise<CouponActionResult> {
  await requireAdmin();

  const code = normalizeCouponCode(input.code);
  if (!code) {
    return {
      ok: false,
      error: "Kupon kodu 3-20 karakter, sadece harf (A-Z) ve rakam olmalı.",
    };
  }
  const valueError = validateCouponValue(input.discount_type, input.value);
  if (valueError) return { ok: false, error: valueError };

  const minOrder = input.min_order_total ?? 0;
  if (!Number.isFinite(minOrder) || minOrder < 0) {
    return { ok: false, error: "Geçersiz minimum sepet tutarı." };
  }
  const maxUses = input.max_uses ?? null;
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses < 1)) {
    return { ok: false, error: "Maksimum kullanım en az 1 olmalı (boş = sınırsız)." };
  }
  const perUserLimit = input.per_user_limit ?? 1;
  const perUserError = validatePerUserLimit(perUserLimit);
  if (perUserError) return { ok: false, error: perUserError };
  const expires = parseExpiresAt(input.expires_at);
  if ("error" in expires) return { ok: false, error: expires.error };

  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").insert({
    code,
    description: (input.description ?? "").trim(),
    discount_type: input.discount_type,
    value: input.value,
    min_order_total: minOrder,
    max_uses: maxUses,
    per_user_limit: perUserLimit,
    expires_at: expires.value,
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: `"${code}" kodlu bir kupon zaten var.` };
    }
    return { ok: false, error: couponDbError(error, "Kupon eklenemedi") };
  }
  revalidatePath("/admin/kuponlar");
  return { ok: true };
}

/** Kupon alanlarını kısmi güncelle (code hariç — PK). */
export async function updateCoupon(
  code: string,
  patch: CouponPatch,
): Promise<CouponActionResult> {
  await requireAdmin();

  const normalized = normalizeCouponCode(code);
  if (!normalized) return { ok: false, error: "Geçersiz kupon kodu." };

  const clean: Record<string, unknown> = {};
  if (patch.description !== undefined) clean.description = patch.description.trim();
  if (patch.discount_type !== undefined || patch.value !== undefined) {
    // Tip ve değer birlikte doğrulanır; eksik olan mevcut satırdan okunmaz,
    // bu yüzden ikisinden biri değişiyorsa ikisi de gönderilmelidir.
    if (patch.discount_type === undefined || patch.value === undefined) {
      return {
        ok: false,
        error: "İndirim tipi ve değeri birlikte güncellenmeli.",
      };
    }
    const valueError = validateCouponValue(patch.discount_type, patch.value);
    if (valueError) return { ok: false, error: valueError };
    clean.discount_type = patch.discount_type;
    clean.value = patch.value;
  }
  if (patch.min_order_total !== undefined) {
    if (!Number.isFinite(patch.min_order_total) || patch.min_order_total < 0) {
      return { ok: false, error: "Geçersiz minimum sepet tutarı." };
    }
    clean.min_order_total = patch.min_order_total;
  }
  if (patch.max_uses !== undefined) {
    if (
      patch.max_uses !== null &&
      (!Number.isInteger(patch.max_uses) || patch.max_uses < 1)
    ) {
      return { ok: false, error: "Maksimum kullanım en az 1 olmalı (boş = sınırsız)." };
    }
    clean.max_uses = patch.max_uses;
  }
  if (patch.per_user_limit !== undefined) {
    const perUserError = validatePerUserLimit(patch.per_user_limit);
    if (perUserError) return { ok: false, error: perUserError };
    clean.per_user_limit = patch.per_user_limit;
  }
  if (patch.expires_at !== undefined) {
    const expires = parseExpiresAt(patch.expires_at);
    if ("error" in expires) return { ok: false, error: expires.error };
    clean.expires_at = expires.value;
  }
  if (patch.is_active !== undefined) clean.is_active = patch.is_active;
  if (Object.keys(clean).length === 0) return { ok: true };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("coupons")
    .update(clean)
    .eq("code", normalized);
  if (error) {
    return { ok: false, error: couponDbError(error, "Kupon güncellenemedi") };
  }
  revalidatePath("/admin/kuponlar");
  return { ok: true };
}

/** Kuponu aktif/pasif yap. */
export async function toggleCoupon(
  code: string,
  active: boolean,
): Promise<CouponActionResult> {
  await requireAdmin();
  const normalized = normalizeCouponCode(code);
  if (!normalized) return { ok: false, error: "Geçersiz kupon kodu." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: active })
    .eq("code", normalized);
  if (error) {
    return { ok: false, error: couponDbError(error, "Kupon durumu değiştirilemedi") };
  }
  revalidatePath("/admin/kuponlar");
  return { ok: true };
}

/** Kuponu kalıcı olarak sil. */
export async function deleteCoupon(code: string): Promise<CouponActionResult> {
  await requireAdmin();
  const normalized = normalizeCouponCode(code);
  if (!normalized) return { ok: false, error: "Geçersiz kupon kodu." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("code", normalized);
  if (error) {
    return { ok: false, error: couponDbError(error, "Kupon silinemedi") };
  }
  revalidatePath("/admin/kuponlar");
  return { ok: true };
}

// ------------------------------------------------------------
// Bannerlar
// ------------------------------------------------------------

/** banners tablosu henüz kurulmamışsa anlaşılır Türkçe mesaj üret. */
function bannerDbError(
  error: { code?: string; message: string },
  fallback: string,
): string {
  const missingTable =
    error.code === "42P01" || // Postgres: undefined_table
    error.code === "PGRST205" || // PostgREST: tablo şema önbelleğinde yok
    /banners/i.test(error.message) &&
      /does not exist|could not find the table|schema cache/i.test(error.message);
  if (missingTable) {
    return "Banner tablosu kurulmamış, migration'ı çalıştırın.";
  }
  return `${fallback}: ${error.message}`;
}

/** Banner değişince admin listesi + banner gösteren vitrin sayfalarını tazele. */
function revalidateBannerPages(): void {
  revalidatePath("/admin/bannerlar");
  revalidatePath("/");
  revalidatePath("/urunler");
}

/** tint 0-7 arası tam sayı mı? */
function isValidTint(tint: number): boolean {
  return Number.isInteger(tint) && tint >= 0 && tint <= 7;
}

/**
 * Banner ikon anahtarını doğrula: boş kabul edilir (içeriğe göre otomatik
 * çözülür), doluysa BANNER_ICONS'ta tanımlı olmalı; tanımsızsa boşa düşürür.
 */
function normalizeBannerIcon(icon: string): string {
  const key = icon.trim();
  return key && BANNER_ICONS[key] ? key : "";
}

/** Yeni banner oluştur — başlık zorunlu, tint 0-7. CTA artık kullanılmaz. */
export async function createBanner(
  input: NewBannerInput,
): Promise<BannerActionResult> {
  await requireAdmin();

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Banner başlığı boş olamaz." };

  const tint = input.tint ?? 0;
  if (!isValidTint(tint)) {
    return { ok: false, error: "Geçersiz renk (tint 0-7 arası olmalı)." };
  }
  const sort = input.sort ?? 0;
  if (!Number.isInteger(sort)) {
    return { ok: false, error: "Sıra tam sayı olmalı." };
  }

  const supabase = createAdminClient();
  // cta_text/cta_href kolonları şemada NOT NULL default '' — göndermeyince boş kalır.
  const { error } = await supabase.from("banners").insert({
    title,
    subtitle: (input.subtitle ?? "").trim(),
    icon: normalizeBannerIcon(input.icon ?? ""),
    tint,
    sort,
  });
  if (error) {
    return { ok: false, error: bannerDbError(error, "Banner eklenemedi") };
  }
  revalidateBannerPages();
  return { ok: true };
}

/** Banner alanlarını kısmi güncelle (sıra değişikliği de buradan). */
export async function updateBanner(
  id: string,
  patch: BannerPatch,
): Promise<BannerActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz banner." };

  const clean: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (!title) return { ok: false, error: "Banner başlığı boş olamaz." };
    clean.title = title;
  }
  if (patch.subtitle !== undefined) clean.subtitle = patch.subtitle.trim();
  if (patch.icon !== undefined) clean.icon = normalizeBannerIcon(patch.icon);
  if (patch.tint !== undefined) {
    if (!isValidTint(patch.tint)) {
      return { ok: false, error: "Geçersiz renk (tint 0-7 arası olmalı)." };
    }
    clean.tint = patch.tint;
  }
  if (patch.sort !== undefined) {
    if (!Number.isInteger(patch.sort)) {
      return { ok: false, error: "Sıra tam sayı olmalı." };
    }
    clean.sort = patch.sort;
  }
  if (patch.is_active !== undefined) clean.is_active = patch.is_active;
  if (Object.keys(clean).length === 0) return { ok: true };

  const supabase = createAdminClient();
  const { error } = await supabase.from("banners").update(clean).eq("id", id);
  if (error) {
    return { ok: false, error: bannerDbError(error, "Banner güncellenemedi") };
  }
  revalidateBannerPages();
  return { ok: true };
}

/** Banner'ı aktif/pasif yap (vitrinde göster/gizle). */
export async function toggleBanner(
  id: string,
  active: boolean,
): Promise<BannerActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz banner." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("banners")
    .update({ is_active: active })
    .eq("id", id);
  if (error) {
    return { ok: false, error: bannerDbError(error, "Banner durumu değiştirilemedi") };
  }
  revalidateBannerPages();
  return { ok: true };
}

/** Banner'ı kalıcı olarak sil. */
export async function deleteBanner(id: string): Promise<BannerActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz banner." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) {
    return { ok: false, error: bannerDbError(error, "Banner silinemedi") };
  }
  revalidateBannerPages();
  return { ok: true };
}

// ------------------------------------------------------------
// Kuryeler (kayıtlı kurye rehberi — couriers tablosu)
// ------------------------------------------------------------

/** Kurye action'larının dönüş tipi — hata mesajı client'a güvenle taşınır. */
export interface CourierActionResult {
  ok: boolean;
  error?: string;
}

/** listCouriers dönüşü — kurye listesi + hata mesajı. */
export interface CouriersResult {
  ok: boolean;
  couriers: Courier[];
  error?: string;
}

/** couriers tablosu henüz kurulmamışsa anlaşılır Türkçe mesaj üret. */
function courierDbError(
  error: { code?: string; message: string },
  fallback: string,
): string {
  const missingTable =
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    (/couriers/i.test(error.message) &&
      /does not exist|could not find the table|schema cache/i.test(error.message));
  if (missingTable) {
    return "Kurye tablosu kurulmamış, migration'ı çalıştırın.";
  }
  return `${fallback}: ${error.message}`;
}

/** Kurye listesini çek — aktifler üstte, sonra ada göre. */
export async function listCouriers(): Promise<CouriersResult> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("couriers")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });
  if (error) {
    return { ok: false, couriers: [], error: courierDbError(error, "Kuryeler yüklenemedi") };
  }
  return { ok: true, couriers: (data ?? []) as Courier[] };
}

/** Yeni kurye ekle — ad zorunlu, telefon opsiyonel. */
export async function createCourier(
  name: string,
  phone: string,
): Promise<CourierActionResult> {
  await requireAdmin();
  const cleanName = name.trim().slice(0, 120);
  if (!cleanName) return { ok: false, error: "Kurye adı boş olamaz." };

  // Panele giriş için 4 haneli kod otomatik üretilir (admin sonradan değiştirebilir).
  const code = String(randomInt(1000, 10000));

  const supabase = createAdminClient();
  const { error } = await supabase.from("couriers").insert({
    name: cleanName,
    phone: phone.trim().slice(0, 40),
    login_code: code,
  });
  if (error) {
    return { ok: false, error: courierDbError(error, "Kurye eklenemedi") };
  }
  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

/** Kurye adını ve telefonunu güncelle (ad 1-60, telefon en çok 20 karakter). */
export async function updateCourier(
  id: string,
  patch: { name: string; phone: string; login_code?: string },
): Promise<CourierActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz kurye." };

  const cleanName = patch.name.trim();
  if (cleanName.length < 1 || cleanName.length > 60) {
    return { ok: false, error: "Kurye adı 1-60 karakter olmalı." };
  }
  const cleanPhone = patch.phone.trim();
  if (cleanPhone.length > 20) {
    return { ok: false, error: "Telefon en fazla 20 karakter olabilir." };
  }
  const update: { name: string; phone: string; login_code?: string } = {
    name: cleanName,
    phone: cleanPhone,
  };
  if (patch.login_code !== undefined) {
    const code = patch.login_code.trim().slice(0, 20);
    update.login_code = code;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("couriers")
    .update(update)
    .eq("id", id);
  if (error) {
    return { ok: false, error: courierDbError(error, "Kurye güncellenemedi") };
  }
  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

/** Kuryeyi kalıcı olarak sil (siparişlere yazılmış ad/telefon etkilenmez). */
export async function deleteCourier(id: string): Promise<CourierActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz kurye." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("couriers").delete().eq("id", id);
  if (error) {
    return { ok: false, error: courierDbError(error, "Kurye silinemedi") };
  }
  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

// ------------------------------------------------------------
// Araçlar — GPS cihazı araca takılıdır; kurye ataması değiştirilebilir.
// ------------------------------------------------------------

export interface VehicleActionResult {
  ok: boolean;
  error?: string;
}

/** vehicles tablosu kurulmamışsa anlaşılır mesaj. */
function vehicleDbError(error: { message: string }, fallback: string): string {
  if (/vehicles/i.test(error.message) && /not (exist|found)|relation/i.test(error.message)) {
    return "Araçlar tablosu henüz kurulmamış.";
  }
  return `${fallback}: ${error.message}`;
}

/** Araç listesini çek — aktifler üstte, sonra ada göre. */
export async function listVehicles(): Promise<{
  ok: boolean;
  vehicles: Vehicle[];
  error?: string;
}> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });
  if (error) {
    return { ok: false, vehicles: [], error: vehicleDbError(error, "Araçlar yüklenemedi") };
  }
  return { ok: true, vehicles: (data ?? []) as Vehicle[] };
}

/** Yeni araç ekle — ad zorunlu, plaka opsiyonel. */
export async function createVehicle(
  name: string,
  plate: string,
): Promise<VehicleActionResult> {
  await requireAdmin();
  const cleanName = name.trim().slice(0, 60);
  if (!cleanName) return { ok: false, error: "Araç adı boş olamaz." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("vehicles").insert({
    name: cleanName,
    plate: plate.trim().slice(0, 20),
  });
  if (error) return { ok: false, error: vehicleDbError(error, "Araç eklenemedi") };
  revalidatePath("/admin/araclar");
  return { ok: true };
}

/** Araç güncelle: ad, plaka ve kurye ataması. */
export async function updateVehicle(
  id: string,
  patch: { name: string; plate: string; courier_id: string | null },
): Promise<VehicleActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz araç." };
  const cleanName = patch.name.trim();
  if (cleanName.length < 1 || cleanName.length > 60) {
    return { ok: false, error: "Araç adı 1-60 karakter olmalı." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("vehicles")
    .update({
      name: cleanName,
      plate: patch.plate.trim().slice(0, 20),
      courier_id: patch.courier_id || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: vehicleDbError(error, "Araç güncellenemedi") };
  revalidatePath("/admin/araclar");
  return { ok: true };
}

/** Aracı aktif/pasif yap (pasif araç konum yazsa da siparişe işlenmez). */
export async function toggleVehicle(
  id: string,
  active: boolean,
): Promise<VehicleActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz araç." };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("vehicles")
    .update({ is_active: active })
    .eq("id", id);
  if (error) return { ok: false, error: vehicleDbError(error, "Araç güncellenemedi") };
  revalidatePath("/admin/araclar");
  return { ok: true };
}

/** Aracı kalıcı olarak sil. */
export async function deleteVehicle(id: string): Promise<VehicleActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz araç." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) return { ok: false, error: vehicleDbError(error, "Araç silinemedi") };
  revalidatePath("/admin/araclar");
  return { ok: true };
}

// ------------------------------------------------------------
// Stok — adet girilir; sipariş geldikçe otomatik düşer (decrement_stock RPC).
// ------------------------------------------------------------

export interface StockRow {
  id: string;
  name: string;
  brand: string;
  size_text: string;
  category_slug: string;
  unit: string;
  sold_by_weight: boolean;
  stock_qty: number | null;
  in_stock: boolean;
  image_url: string | null;
}

export type StockFilter = "dusuk" | "tukendi" | "takipsiz";

export interface StockPageData {
  rows: StockRow[];
  total: number;
  counts: Record<StockFilter, number>;
}

const STOCK_COLS =
  "id, name, brand, size_text, category_slug, unit, sold_by_weight, stock_qty, in_stock, image_url";
const STOCK_PAGE_SIZE = 50;

/** "Düşük" eşiği: adetlide ≤5, gram bazlıda ≤2000 g. */
function isLowStock(r: Pick<StockRow, "stock_qty" | "sold_by_weight">): boolean {
  return (
    r.stock_qty !== null &&
    r.stock_qty > 0 &&
    r.stock_qty <= (r.sold_by_weight ? 2000 : 5)
  );
}

/**
 * Stok sayfası: sunucu taraflı sayfalama (50/sayfa) + kategori/arama/filtre.
 * counts: aktif k/q kapsamında çip sayıları.
 */
export async function listStock(opts: {
  q?: string;
  category?: string;
  filter?: StockFilter;
  page?: number;
}): Promise<StockPageData> {
  await requireAdmin();
  const supabase = createAdminClient();
  const q = opts.q?.trim();
  const page = Math.max(1, opts.page ?? 1);

  // Temel kapsam (kategori + arama) — çipler ve liste aynı kapsamı kullanır.
  const base = () => {
    let query = supabase.from("products").select(STOCK_COLS).eq("is_active", true);
    if (opts.category) query = query.eq("category_slug", opts.category);
    if (q) query = query.ilike("name", `%${q}%`);
    return query;
  };
  const baseCount = () => {
    let query = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if (opts.category) query = query.eq("category_slug", opts.category);
    if (q) query = query.ilike("name", `%${q}%`);
    return query;
  };

  // Çip sayıları: tükendi/takipsiz DB'den; düşük için adaylar bellekte süzülür.
  const [tukendiRes, takipsizRes, dusukCandRes] = await Promise.all([
    baseCount().eq("in_stock", false),
    baseCount().is("stock_qty", null),
    supabase
      .from("products")
      .select("id, stock_qty, sold_by_weight")
      .eq("is_active", true)
      .not("stock_qty", "is", null)
      .gt("stock_qty", 0)
      .lte("stock_qty", 2000)
      .limit(2000)
      .then((r) => r),
  ]);
  let dusukCands = ((dusukCandRes.data ?? []) as StockRow[]).filter(isLowStock);
  // Kategori/arama kapsamı düşük adaylarına da uygulanmalı — id bazlı ikinci
  // filtre yerine kapsamlı sorgu (aday sayısı küçük olduğundan bellekte).
  if (opts.category || q) {
    const { data } = await base()
      .not("stock_qty", "is", null)
      .gt("stock_qty", 0)
      .lte("stock_qty", 2000)
      .limit(2000);
    dusukCands = ((data ?? []) as StockRow[]).filter(isLowStock);
  }
  const counts: Record<StockFilter, number> = {
    dusuk: dusukCands.length,
    tukendi: tukendiRes.count ?? 0,
    takipsiz: takipsizRes.count ?? 0,
  };

  // Liste: "düşük" bellekte sayfalanır; diğerleri DB range ile.
  if (opts.filter === "dusuk") {
    const sorted = [...dusukCands].sort(
      (a, b) => (a.stock_qty ?? 0) - (b.stock_qty ?? 0),
    );
    const from = (page - 1) * STOCK_PAGE_SIZE;
    return {
      rows: sorted.slice(from, from + STOCK_PAGE_SIZE),
      total: sorted.length,
      counts,
    };
  }

  let listQuery = base();
  let countQuery = baseCount();
  if (opts.filter === "tukendi") {
    listQuery = listQuery.eq("in_stock", false);
    countQuery = countQuery.eq("in_stock", false);
  } else if (opts.filter === "takipsiz") {
    listQuery = listQuery.is("stock_qty", null);
    countQuery = countQuery.is("stock_qty", null);
  }

  const { count } = await countQuery;
  const total = count ?? 0;
  const from = (page - 1) * STOCK_PAGE_SIZE;
  const { data, error } = await listQuery
    .order("stock_qty", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true })
    .order("id", { ascending: true })
    .range(from, from + STOCK_PAGE_SIZE - 1);
  if (error || !data) return { rows: [], total, counts };
  return { rows: data as StockRow[], total, counts };
}

/** Stok adedini elle ayarla. null = takibi kapat (yalnız bayrakla yönetilir). */
export async function setProductStock(
  id: string,
  qty: number | null,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz ürün." };
  let clean: number | null = null;
  if (qty !== null) {
    clean = Math.round(Number(qty));
    if (!Number.isFinite(clean) || clean < 0 || clean > 1000000) {
      return { ok: false, error: "Geçersiz stok adedi." };
    }
  }
  const supabase = createAdminClient();
  const patch: { stock_qty: number | null; in_stock?: boolean } = {
    stock_qty: clean,
  };
  // Adet girildiyse bayrak otomatik: 0 → tükendi, >0 → stokta.
  if (clean !== null) patch.in_stock = clean > 0;
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) return { ok: false, error: `Stok güncellenemedi: ${error.message}` };
  revalidatePath("/admin/stok");
  revalidateProductPages({ id });
  return { ok: true };
}

// ------------------------------------------------------------
// Teslimat / canlı konum — admin panelinden (owner teslimat yapıyorsa)
// ------------------------------------------------------------

export interface DeliveryOrder {
  order_no: string;
  status: string;
  customer_name: string;
  phone: string;
  address_line: string;
  address_note: string;
  courier_name: string;
  courier_phone: string;
  courier_lat: number | null;
  courier_lng: number | null;
  courier_location_at: string | null;
}

/**
 * Aktif (teslim/iptal olmayan) tüm siparişler — teslimat sayfası bunları
 * teslim edilene kadar gösterir. Konum yalnız "Kurye Yolda" için anlamlıdır.
 */
export async function listActiveDeliveries(): Promise<DeliveryOrder[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "order_no, status, customer_name, phone, address_line, address_note, courier_name, courier_phone, courier_lat, courier_lng, courier_location_at",
    )
    .not("status", "in", "(delivered,cancelled)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DeliveryOrder[];
}

/**
 * Bu cihazın GPS konumunu paylaş. courierId verilirse yalnız o kuryenin
 * "Kurye Yolda" siparişlerine, yoksa tüm on_the_way siparişlere yazılır.
 */
export async function adminShareLocation(
  lat: number,
  lng: number,
  courierId?: string,
): Promise<{ ok: boolean; count?: number; error?: string }> {
  await requireAdmin();
  const res =
    courierId && courierId.trim()
      ? await writeCourierLocation(courierId, lat, lng)
      : await writeActiveLocation(lat, lng);
  if (!res.ok) return { ok: false, error: "Konum kaydedilemedi." };
  return { ok: true, count: res.count };
}

/** Kuryeyi aktif/pasif yap (pasif kurye sipariş dropdown'ında görünmez). */
export async function toggleCourier(
  id: string,
  active: boolean,
): Promise<CourierActionResult> {
  await requireAdmin();
  if (!id.trim()) return { ok: false, error: "Geçersiz kurye." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("couriers")
    .update({ is_active: active })
    .eq("id", id);
  if (error) {
    return { ok: false, error: courierDbError(error, "Kurye durumu değiştirilemedi") };
  }
  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

// ------------------------------------------------------------
// Kurye görselleri (Supabase Storage — "courier-images" bucket'ı)
// Ürün görseli deseninin birebir kurye karşılığı; couriers.image_url
// NOT NULL default '' olduğundan "yok" durumu boş string ile temsil edilir.
// ------------------------------------------------------------

const COURIER_IMAGE_BUCKET = "courier-images";

/**
 * Kurye görsel bucket'ını hazırla: yoksa public oluştur, VARSA public olduğundan
 * emin ol. Eskiden private oluşturulmuş bir bucket getPublicUrl'i erişilemez
 * kıldığı için yükleme "çalışıyor ama görsel açılmıyor" hatasına yol açıyordu;
 * updateBucket ile her seferinde public'e sabitliyoruz.
 */
async function ensureCourierImageBucket(
  supabase: AdminClient,
): Promise<string | null> {
  const { error: createError } = await supabase.storage.createBucket(
    COURIER_IMAGE_BUCKET,
    { public: true },
  );
  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    return createError.message;
  }
  // Bucket zaten vardıysa (veya yeni oluşturulduysa) public olduğunu garantile.
  const { error: updateError } = await supabase.storage.updateBucket(
    COURIER_IMAGE_BUCKET,
    { public: true },
  );
  if (updateError) {
    return updateError.message;
  }
  return null;
}

/** Public URL'den kurye bucket içi dosya yolunu çıkar (bizim bucket değilse null). */
function courierStoragePathFromPublicUrl(url: string): string | null {
  if (!url) return null;
  const marker = `/object/public/${COURIER_IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length).split("?")[0];
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** Eski kurye görselini storage'dan silmeyi dene — başarısızlık akışı bozmaz. */
async function tryRemoveCourierFile(
  supabase: AdminClient,
  path: string | null,
): Promise<void> {
  if (!path) return;
  try {
    await supabase.storage.from(COURIER_IMAGE_BUCKET).remove([path]);
  } catch {
    // Sessizce yut: dosya kalsa da image_url artık ona işaret etmiyor.
  }
}

/**
 * Kurye avatar görseli yükle — ürün görseli yükleme deseninin aynısı.
 * Form kullanımı: <input type="file" name="image">. Dosya adına rastgele
 * sonek eklenir (cache kırma); eski dosya silinmeye çalışılır.
 */
export async function uploadCourierImage(
  courierId: string,
  formData: FormData,
): Promise<ImageActionResult> {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Bir görsel dosyası seçin." };
  }
  const ext = IMAGE_MIME_EXT[file.type];
  if (!ext) {
    return { ok: false, error: "Sadece JPEG, PNG veya WebP formatı kabul edilir." };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { ok: false, error: "Görsel en fazla 4 MB olabilir." };
  }

  const supabase = createAdminClient();
  const { data: courierData, error: courierError } = await supabase
    .from("couriers")
    .select("id, image_url")
    .eq("id", courierId)
    .maybeSingle();
  if (courierError) {
    return { ok: false, error: courierDbError(courierError, "Kurye okunamadı") };
  }
  if (!courierData) return { ok: false, error: "Kurye bulunamadı." };
  const courier = courierData as { id: string; image_url: string | null };

  const bucketError = await ensureCourierImageBucket(supabase);
  if (bucketError) {
    return { ok: false, error: `Görsel deposu hazırlanamadı: ${bucketError}` };
  }

  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${courierId}-${rand}.${ext}`;
  const body = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(COURIER_IMAGE_BUCKET)
    .upload(path, body, { contentType: file.type, upsert: true });
  if (uploadError) {
    return { ok: false, error: `Görsel yüklenemedi: ${uploadError.message}` };
  }

  const { data: pub } = supabase.storage
    .from(COURIER_IMAGE_BUCKET)
    .getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("couriers")
    .update({ image_url: pub.publicUrl })
    .eq("id", courierId);
  if (updateError) {
    await tryRemoveCourierFile(supabase, path);
    return { ok: false, error: `Görsel adresi kaydedilemedi: ${updateError.message}` };
  }

  const oldPath = courierStoragePathFromPublicUrl(courier.image_url ?? "");
  if (oldPath && oldPath !== path) {
    await tryRemoveCourierFile(supabase, oldPath);
  }

  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

/** Kurye görselini kaldır: image_url'i boş yap, dosyayı storage'dan silmeyi dene. */
export async function removeCourierImage(
  courierId: string,
): Promise<ImageActionResult> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: courierData, error: courierError } = await supabase
    .from("couriers")
    .select("image_url")
    .eq("id", courierId)
    .maybeSingle();
  if (courierError) {
    return { ok: false, error: courierDbError(courierError, "Kurye okunamadı") };
  }
  if (!courierData) return { ok: false, error: "Kurye bulunamadı." };
  const courier = courierData as { image_url: string | null };

  const { error: updateError } = await supabase
    .from("couriers")
    .update({ image_url: "" })
    .eq("id", courierId);
  if (updateError) {
    return { ok: false, error: `Görsel kaldırılamadı: ${updateError.message}` };
  }

  await tryRemoveCourierFile(
    supabase,
    courierStoragePathFromPublicUrl(courier.image_url ?? ""),
  );
  revalidatePath("/admin/kuryeler");
  return { ok: true };
}

// ------------------------------------------------------------
// Üyeler (müşteri hesapları — auth.users + customer_profiles)
// ------------------------------------------------------------

/** Üye listesi satırı — auth.users + customer_profiles + sipariş sayısı. */
export interface MemberRow {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  order_count: number;
}

/** listMembers dönüşü — hata mesajı client'a güvenle taşınır. */
export interface MembersResult {
  ok: boolean;
  members: MemberRow[];
  error?: string;
}

/** createMember girdisi. */
export interface NewMemberInput {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

/** Üye action'larının dönüş tipi. */
export interface MemberActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Tüm üyeleri (müşteri hesaplarını) listele. auth.admin.listUsers ilk sayfayı
 * (yüksek perPage) çeker; customer_profiles ile join edilir ve orders'tan
 * kullanıcı başına iptal-dahil sipariş sayısı hesaplanır.
 */
export async function listMembers(): Promise<MembersResult> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (userError) {
    return { ok: false, members: [], error: `Üyeler alınamadı: ${userError.message}` };
  }
  const users = userData.users ?? [];
  const ids = users.map((u) => u.id);

  // Profil bilgileri (ad, telefon) — customer_profiles.
  const profiles = new Map<string, { full_name: string; phone: string }>();
  if (ids.length > 0) {
    const { data: profData } = await supabase
      .from("customer_profiles")
      .select("id, full_name, phone")
      .in("id", ids);
    for (const p of (profData ?? []) as {
      id: string;
      full_name: string;
      phone: string;
    }[]) {
      profiles.set(p.id, { full_name: p.full_name, phone: p.phone });
    }
  }

  // Kullanıcı başına sipariş sayısı — orders.user_id gruplu sayım.
  const orderCounts = new Map<string, number>();
  if (ids.length > 0) {
    const { data: orderData } = await supabase
      .from("orders")
      .select("user_id")
      .in("user_id", ids);
    for (const row of (orderData ?? []) as { user_id: string | null }[]) {
      if (row.user_id) {
        orderCounts.set(row.user_id, (orderCounts.get(row.user_id) ?? 0) + 1);
      }
    }
  }

  const members: MemberRow[] = users.map((u) => {
    const prof = profiles.get(u.id);
    const meta = (u.user_metadata ?? {}) as { full_name?: string; phone?: string };
    return {
      id: u.id,
      email: u.email ?? "",
      full_name: prof?.full_name || meta.full_name || "",
      phone: prof?.phone || meta.phone || "",
      created_at: u.created_at ?? "",
      order_count: orderCounts.get(u.id) ?? 0,
    };
  });
  // En yeni üye üstte.
  members.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return { ok: true, members };
}

/**
 * Yeni üye oluştur — e-posta onaylı (email_confirm: true) açılır, profil
 * satırı handle_new_user trigger'ıyla otomatik oluşur (full_name, phone metadata).
 */
export async function createMember(
  input: NewMemberInput,
): Promise<MemberActionResult> {
  await requireAdmin();

  const email = input.email.trim().toLowerCase();
  const fullName = input.full_name.trim();
  const phone = input.phone.trim();
  const password = input.password;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Geçerli bir e-posta adresi girin." };
  }
  if (fullName.length < 2) {
    return { ok: false, error: "Ad soyad girin." };
  }
  if (typeof password !== "string" || password.length < 6) {
    return { ok: false, error: "Parola en az 6 karakter olmalı." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });
  if (error) {
    if (/already been registered|already exists|duplicate/i.test(error.message)) {
      return { ok: false, error: "Bu e-posta ile kayıtlı bir üye zaten var." };
    }
    return { ok: false, error: `Üye oluşturulamadı: ${error.message}` };
  }
  revalidatePath("/admin/uyeler");
  return { ok: true };
}

/**
 * Üyenin parolasını admin yetkisiyle sıfırla. Service-role client'ın
 * GoTrue admin API'si (auth.admin.updateUserById) kullanılır; üyenin
 * mevcut oturumları etkilenmez, yeni girişte yeni parola geçerlidir.
 */
export async function adminSetMemberPassword(
  userId: string,
  newPassword: string,
): Promise<MemberActionResult> {
  await requireAdmin();
  if (!userId.trim()) return { ok: false, error: "Geçersiz üye." };
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return { ok: false, error: "Yeni parola en az 6 karakter olmalı." };
  }
  if (newPassword.length > 72) {
    return { ok: false, error: "Yeni parola en fazla 72 karakter olabilir." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) {
    return { ok: false, error: `Parola güncellenemedi: ${error.message}` };
  }
  return { ok: true };
}

/** Üyenin ad soyad ve telefonunu güncelle (customer_profiles satırı). */
export async function updateMemberProfile(
  userId: string,
  patch: { full_name: string; phone: string },
): Promise<MemberActionResult> {
  await requireAdmin();
  if (!userId.trim()) return { ok: false, error: "Geçersiz üye." };

  const fullName = patch.full_name.trim();
  if (fullName.length < 2 || fullName.length > 120) {
    return { ok: false, error: "Ad soyad 2-120 karakter olmalı." };
  }
  const phone = patch.phone.trim();
  if (phone.length > 40) {
    return { ok: false, error: "Telefon en fazla 40 karakter olabilir." };
  }

  const supabase = createAdminClient();
  // Eski hesaplarda profil satırı eksik olabilir; upsert ile garanti edilir.
  const { error } = await supabase
    .from("customer_profiles")
    .upsert({ id: userId, full_name: fullName, phone });
  if (error) {
    return { ok: false, error: `Üye güncellenemedi: ${error.message}` };
  }
  revalidatePath("/admin/uyeler");
  return { ok: true };
}

/** Üyeyi kalıcı olarak sil (auth.users; profil/adres cascade ile gider). */
export async function deleteMember(userId: string): Promise<MemberActionResult> {
  await requireAdmin();
  if (!userId.trim()) return { ok: false, error: "Geçersiz üye." };

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    return { ok: false, error: `Üye silinemedi: ${error.message}` };
  }
  revalidatePath("/admin/uyeler");
  return { ok: true };
}

// ------------------------------------------------------------
// Sohbetler (canlı destek — chat_sessions / chat_messages)
// ------------------------------------------------------------

/** Sohbet action'larının dönüş tipi — hata mesajı client'a güvenle taşınır. */
export interface ChatActionResult {
  ok: boolean;
  error?: string;
}

/** listChatSessions dönüşü — oturum listesi + hata mesajı. */
export interface ChatSessionsResult {
  ok: boolean;
  sessions: ChatSession[];
  error?: string;
}

/** fetchSessionMessages dönüşü — mesaj listesi + hata mesajı. */
export interface ChatMessagesResult {
  ok: boolean;
  messages: ChatMessage[];
  error?: string;
}

/** sendAdminMessage dönüşü — eklenen mesaj satırı + hata mesajı. */
export interface AdminMessageResult {
  ok: boolean;
  message?: ChatMessage;
  error?: string;
}

/** Sohbet oturumlarını listele (en son mesaj alan üstte). Polling için kullanılır. */
export async function listChatSessions(): Promise<ChatSessionsResult> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("last_message_at", { ascending: false })
    .limit(200);
  if (error) {
    return { ok: false, sessions: [], error: `Sohbetler yüklenemedi: ${error.message}` };
  }
  return { ok: true, sessions: (data ?? []) as ChatSession[] };
}

/**
 * Bir oturumun mesajlarını getir. afterIso verilirse yalnız created_at >
 * afterIso olan yeni mesajlar döner (polling); verilmezse tüm geçmiş (artan).
 */
export async function fetchSessionMessages(
  sessionId: string,
  afterIso?: string | null,
): Promise<ChatMessagesResult> {
  await requireAdmin();
  if (!sessionId.trim()) {
    return { ok: false, messages: [], error: "Geçersiz sohbet." };
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (afterIso) {
    query = query.gt("created_at", afterIso);
  }

  const { data, error } = await query;
  if (error) {
    return { ok: false, messages: [], error: `Mesajlar yüklenemedi: ${error.message}` };
  }
  return { ok: true, messages: (data ?? []) as ChatMessage[] };
}

/** Admin yanıtı gönder; eklenen satırı döndür. */
export async function sendAdminMessage(
  sessionId: string,
  text: string,
): Promise<AdminMessageResult> {
  await requireAdmin();
  if (!sessionId.trim()) return { ok: false, error: "Geçersiz sohbet." };
  const content = text.trim();
  if (!content || content.length > 1000) {
    return { ok: false, error: "Mesaj 1-1000 karakter olmalı." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      sender: "admin",
      content,
    })
    .select("*")
    .single();
  if (error || !data) {
    return { ok: false, error: `Mesaj gönderilemedi: ${error?.message ?? "bilinmeyen hata"}` };
  }
  return { ok: true, message: data as ChatMessage };
}

/**
 * Sohbet oturumunu KALICI olarak sil. Bağlı chat_messages satırları
 * FK on delete cascade ile birlikte silinir (chat şemasında tanımlı).
 */
export async function deleteChatSession(
  sessionId: string,
): Promise<ChatActionResult> {
  await requireAdmin();
  if (!sessionId.trim()) return { ok: false, error: "Geçersiz sohbet." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) {
    return { ok: false, error: `Sohbet silinemedi: ${error.message}` };
  }
  revalidatePath("/admin/sohbetler");
  return { ok: true };
}

/** Bir sohbeti okundu işaretle (unread_admin=false). Admin oturumu açınca kullanılır. */
export async function markSessionRead(
  sessionId: string,
): Promise<ChatActionResult> {
  await requireAdmin();
  if (!sessionId.trim()) return { ok: false, error: "Geçersiz sohbet." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("chat_sessions")
    .update({ unread_admin: false })
    .eq("id", sessionId);
  if (error) {
    return { ok: false, error: `Sohbet okundu işaretlenemedi: ${error.message}` };
  }
  revalidatePath("/admin/sohbetler");
  return { ok: true };
}
