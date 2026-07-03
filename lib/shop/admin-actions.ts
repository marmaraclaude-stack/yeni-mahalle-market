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
