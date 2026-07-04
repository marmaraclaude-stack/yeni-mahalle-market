// Ürün detay sayfası — /urunler/[slug]. Server component.
// Next.js 16: params bir Promise — await edilmeli.
// Ürün anon client'la slug üzerinden çekilir (is_active=true);
// bulunamazsa (veya DB hazır değilse) notFound().
// Düzen (Getir sadeliği): --container içinde 2 kolonlu BEYAZ KART —
// solda büyük görsel (tint placeholder), sağda kategori pill + ad + fiyat +
// stok + adet/sepet aksiyonları + teslimat notu. Açıklama varsa altta
// "Ürün Hakkında" kartı; en altta skorlamalı "Benzer Ürünler" raili.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import { formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
import SiteNav from "@/components/SiteNav";
import DetailActions from "./DetailActions";
import styles from "./urun.module.css";

type Params = Promise<{ slug: string }>;

/** Ürünü slug ile çek — generateMetadata + page aynı istekte tek sorgu (React cache). */
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) return null;
    return (data as Product | null) ?? null;
  } catch {
    // DB hazır değilse detay sayfası 404'e düşer — site patlamaz.
    return null;
  }
});

// Benzerlik skorunda atılan anlamsız Türkçe kelimeler.
const NAME_STOPWORDS = new Set(["ve", "ile", "için", "li", "lu"]);

/**
 * Ürün adından anlamlı kelime kümesi çıkar:
 * Türkçe lowercase, 3 harften uzun, stopword değil,
 * rakamla başlayan (gramaj: "500", "1.5l" vb.) token'lar atılır.
 */
function nameTokens(name: string): Set<string> {
  const tokens = name
    .toLocaleLowerCase("tr-TR")
    .split(/[^0-9a-zçğıöşüâîû]+/)
    .filter(
      (t) => t.length > 3 && !NAME_STOPWORDS.has(t) && !/^\d/.test(t)
    );
  return new Set(tokens);
}

/**
 * Benzer ürünler — gerçek benzerlik: aynı kategoriden ~30 aday çekilir, skorlanır.
 * +4 aynı marka (boş olmayan, case-insensitive) · +2 her ortak anlamlı ad kelimesi
 * · +1 fiyat yakınlığı (fark < %30). Skor desc → is_featured → sort.
 * İlk 8 alınır; skor 0 olanlar sıralamaya girmez — 4'ten az kalırsa
 * kategori sırasından (is_featured, sort, name) tamamlanır.
 */
async function getSimilarProducts(product: Product): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category_slug", product.category_slug)
      .neq("id", product.id)
      .order("is_featured", { ascending: false })
      .order("sort", { ascending: true })
      .order("name", { ascending: true })
      .limit(30);
    if (error) return [];
    const candidates = (data ?? []) as Product[];
    if (candidates.length === 0) return [];

    const baseTokens = nameTokens(product.name);
    const baseBrand = product.brand.trim().toLocaleLowerCase("tr-TR");

    const scored = candidates.map((p, index) => {
      let score = 0;
      const brand = p.brand.trim().toLocaleLowerCase("tr-TR");
      if (baseBrand && brand && brand === baseBrand) score += 4;
      for (const token of nameTokens(p.name)) {
        if (baseTokens.has(token)) score += 2;
      }
      if (
        product.price > 0 &&
        Math.abs(p.price - product.price) / product.price < 0.3
      ) {
        score += 1;
      }
      return { p, score, index };
    });

    const ranked = scored
      .filter((s) => s.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(b.p.is_featured) - Number(a.p.is_featured) ||
          a.p.sort - b.p.sort ||
          a.index - b.index
      )
      .map((s) => s.p);

    const result = ranked.slice(0, 8);
    if (result.length < 4) {
      // Skorlu sonuç azsa kategori sırasından tamamla (doldurma, 8'e kadar).
      const picked = new Set(result.map((p) => p.id));
      for (const p of candidates) {
        if (result.length >= 8) break;
        if (!picked.has(p.id)) result.push(p);
      }
    }
    return result;
  } catch {
    return [];
  }
}

/**
 * Birim fiyat (Getir "gram başı" netliği): paket/adet fiyatını gramaj ya da
 * adede böler. size_text gramaj/hacim ("500 g", "6x0,5 L") içeriyorsa
 * "₺X / kg" veya "₺X / L"; çoklu adet ("8'li", "60'lı") içeriyorsa "₺X / adet".
 * Zaten kg bazlı satılan (unit "kg") ya da tam 1 kg / 1 L olan ürünlerde
 * bilgi tekrar olacağından null döner.
 */
function unitPriceLabel(product: Product): string | null {
  const { price, size_text, unit } = product;
  if (!price || price <= 0 || unit === "kg") return null;
  const s = size_text.toLocaleLowerCase("tr-TR").replace(/,/g, ".");

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

/** Görsel üzerine küçük bilgi çipleri (opsiyonel, kategoriye göre).
    Sadece taze kategoriler için "Günlük taze"; diğerlerinde çip yok. */
function infoChips(categorySlug: string): { icon: typeof Leaf; label: string }[] {
  if (categorySlug === "meyve-sebze" || categorySlug === "ekmek-firin") {
    return [{ icon: Leaf, label: "Günlük taze" }];
  }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Ürün bulunamadı" };
  }
  return {
    // Kök layout şablonu "%s · Yeni Mahalle Market" ekler
    title: product.name,
    description:
      product.description ||
      `${product.name} ve yüzlerce market ürünü Yeni Mahalle Market'te. Seç, sepete ekle, Sapanca içinde adresine gelsin.`,
  };
}

export default async function UrunDetayPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const similar = await getSimilarProducts(product);

  const cat = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[cat?.tint ?? 0] ?? CATEGORY_TINTS[0];
  const Icon = iconFor(cat?.icon ?? "shopping-basket");

  const compareAt = product.compare_at_price;
  const discounted = compareAt !== null && compareAt > product.price;
  const discountPct = discounted
    ? Math.round((1 - product.price / compareAt) * 100)
    : 0;

  const metaText = [product.brand, product.size_text]
    .filter(Boolean)
    .join(" · ");

  const unitPrice = unitPriceLabel(product);
  const chips = infoChips(product.category_slug);

  // İndirimdeki net tasarruf (eski fiyat - güncel fiyat).
  const saving = discounted ? compareAt - product.price : 0;

  // "Ürün Hakkında" künye satırları — açıklama olmasa da sayfa dolu dursun.
  const specs = [
    { label: "Marka", value: product.brand },
    { label: "Miktar", value: product.size_text },
    { label: "Kategori", value: cat?.name ?? "" },
    { label: "Satış birimi", value: product.unit },
  ].filter((s) => s.value && s.value.trim() !== "");

  return (
    <>
      <SiteNav />

      <main className={styles.page}>
        <div className="container">
          {/* Beyaz kart: solda görsel, sağda bilgi + aksiyonlar */}
          <section className={styles.heroCard}>
            <div
              className={`${styles.media}${
                product.image_url ? "" : ` ${styles.mediaPlaceholder}`
              }`}
              style={
                product.image_url
                  ? undefined
                  : { background: tintBg, color: tintFg }
              }
            >
              {discounted && product.in_stock && (
                <span className={styles.mediaBadge}>%{discountPct} indirim</span>
              )}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                />
              ) : (
                <Icon
                  className={styles.mediaGlyph}
                  size={116}
                  strokeWidth={1.1}
                  aria-hidden="true"
                />
              )}
              {!product.in_stock && (
                <span className={styles.mediaOut}>Stokta yok</span>
              )}
              {product.in_stock && chips.length > 0 && (
                <div className={styles.chips} aria-hidden="true">
                  {chips.map((chip) => (
                    <span key={chip.label} className={styles.chip}>
                      <chip.icon size={13} strokeWidth={2.2} />
                      {chip.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.info}>
              {cat && (
                <Link
                  href={`/urunler?k=${cat.slug}`}
                  className={styles.catPill}
                  style={{ background: tintBg, color: tintFg }}
                >
                  <Icon size={13} strokeWidth={2} aria-hidden="true" />
                  {cat.name}
                </Link>
              )}

              <h1 className={styles.title}>{product.name}</h1>

              {metaText && <p className={styles.meta}>{metaText}</p>}

              <p className={styles.priceRow}>
                <span className={styles.price}>{formatTL(product.price)}</span>
                {product.unit !== "adet" && (
                  <span className={styles.unit}>/ {product.unit}</span>
                )}
                {discounted && (
                  <s className={styles.compare}>{formatTL(compareAt)}</s>
                )}
                {discounted && (
                  <span className={styles.discount}>%{discountPct} indirim</span>
                )}
              </p>

              {unitPrice && (
                <p className={styles.unitPrice}>Birim fiyat: {unitPrice}</p>
              )}

              {discounted && (
                <p className={styles.savings}>
                  Bu üründe {formatTL(saving)} tasarruf ediyorsun
                </p>
              )}

              <p
                className={`${styles.stock} ${
                  product.in_stock ? styles.stockIn : styles.stockOut
                }`}
                role="status"
              >
                <span className={styles.stockDot} aria-hidden="true" />
                {product.in_stock ? "Stokta var" : "Stokta yok"}
              </p>

              <DetailActions product={product} />
            </div>
          </section>

          {/* Ürün Hakkında — açıklama + künye satırları (ayrı beyaz kart) */}
          {(product.description || specs.length > 0) && (
            <section className={styles.descCard} aria-labelledby="urun-hakkinda">
              <h2 id="urun-hakkinda" className={styles.descHead}>
                Ürün Hakkında
              </h2>
              {product.description && (
                <p className={styles.descText}>{product.description}</p>
              )}
              {specs.length > 0 && (
                <dl className={styles.specs}>
                  {specs.map((spec) => (
                    <div key={spec.label} className={styles.specRow}>
                      <dt className={styles.specLabel}>{spec.label}</dt>
                      <dd className={styles.specValue}>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}

          {/* Benzer ürünler — yatay kaydırılabilir rail */}
          {similar.length > 0 && (
            <section className={styles.similar} aria-labelledby="benzer-urunler">
              <div className={styles.similarHead}>
                <h2 id="benzer-urunler" className={styles.similarTitle}>
                  Benzer Ürünler
                </h2>
                <p className={styles.similarSub}>
                  Aynı kategoriden senin için seçtiklerimiz
                </p>
              </div>
              <div className={styles.rail} role="list">
                {similar.map((p) => (
                  <div key={p.id} className={styles.railItem} role="listitem">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
