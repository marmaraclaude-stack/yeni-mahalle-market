"use server";

// Admin e-ticaret Server Action'ları.
// HER action önce parola oturumunu (admin_auth cookie) doğrular,
// sonra service-role client ile yazar — RLS'te yazma policy'si bilinçli olarak yok.

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryBySlug } from "@/lib/shop/categories";
import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShopSettings,
} from "@/lib/shop/types";

/** updateProduct için düzenlenebilir alanlar — slug BİLİNÇLİ olarak yok (URL kırılmasın). */
export interface ProductPatch {
  name?: string;
  brand?: string;
  size_text?: string;
  description?: string;
  unit?: string;
  category_slug?: string;
  price?: number;
  compare_at_price?: number | null;
  in_stock?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
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

/** createBanner girdisi — id/created_at sunucuda üretilir. */
export interface NewBannerInput {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_href?: string;
  tint?: number; // CATEGORY_TINTS index (0-7)
  sort?: number;
}

/** updateBanner için kısmi alanlar — id (PK) değiştirilemez. */
export interface BannerPatch {
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_href?: string;
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
  if (patch.in_stock !== undefined) clean.in_stock = patch.in_stock;
  if (patch.is_active !== undefined) clean.is_active = patch.is_active;
  if (patch.is_featured !== undefined) clean.is_featured = patch.is_featured;
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
 * CTA çiftini doğrula: metin varsa link zorunlu, link göreli yol ("/...")
 * veya http(s) URL olmalı. Sorun varsa hata mesajı döner.
 */
function validateBannerCta(ctaText: string, ctaHref: string): string | null {
  if (ctaText && !ctaHref) {
    return "CTA metni girildiyse CTA linki de zorunlu.";
  }
  if (ctaHref && !/^(\/|https?:\/\/)/.test(ctaHref)) {
    return "CTA linki / ile başlamalı (örn. /firsatlar) veya tam URL olmalı.";
  }
  return null;
}

/** Yeni banner oluştur — başlık zorunlu, tint 0-7. */
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
  const ctaText = (input.cta_text ?? "").trim();
  const ctaHref = (input.cta_href ?? "").trim();
  const ctaError = validateBannerCta(ctaText, ctaHref);
  if (ctaError) return { ok: false, error: ctaError };

  const supabase = createAdminClient();
  const { error } = await supabase.from("banners").insert({
    title,
    subtitle: (input.subtitle ?? "").trim(),
    cta_text: ctaText,
    cta_href: ctaHref,
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
  if (patch.cta_text !== undefined || patch.cta_href !== undefined) {
    // CTA çifti birlikte doğrulanır; eksik olan mevcut satırdan okunmaz,
    // bu yüzden ikisinden biri değişiyorsa ikisi de gönderilmelidir.
    if (patch.cta_text === undefined || patch.cta_href === undefined) {
      return { ok: false, error: "CTA metni ve linki birlikte güncellenmeli." };
    }
    const ctaText = patch.cta_text.trim();
    const ctaHref = patch.cta_href.trim();
    const ctaError = validateBannerCta(ctaText, ctaHref);
    if (ctaError) return { ok: false, error: ctaError };
    clean.cta_text = ctaText;
    clean.cta_href = ctaHref;
  }
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
