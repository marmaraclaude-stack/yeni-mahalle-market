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
import { LayoutGrid, Leaf, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import {
  computeLineTotal,
  formatGrams,
  formatTL,
  isWeightBased,
  showsPackPrice,
  unitPriceLabel,
  weightMinFor,
} from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import { BUSINESS } from "@/lib/business";
import { iconFor } from "@/components/shop/ProductCard";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DetailActions from "./DetailActions";
import ProductInfoTabs from "./ProductInfoTabs";
import SimilarRail from "./SimilarRail";
import styles from "./urun.module.css";

// Sağ kolon güven/teslimat rozetleri — kalıcı, kompakt grid (boşluğu doldurur,
// sade durur). Sapanca içi teslimat + ödeme seçenekleri + güven vurgusu.
const TRUST_BADGES = [
  { icon: Truck, title: "Hızlı teslimat", sub: "Sapanca içine" },
  { icon: Wallet, title: "Kapıda ödeme", sub: "Nakit / kart" },
  { icon: ShieldCheck, title: "Güvenli ödeme", sub: "iyzico ile" },
  { icon: Sparkles, title: "Özenli seçim", sub: "Tazesi tek tek" },
] as const;

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
      .limit(50);
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

    const result = ranked.slice(0, 10);
    if (result.length < 4) {
      // Skorlu sonuç azsa kategori sırasından tamamla (doldurma, 10'a kadar).
      const picked = new Set(result.map((p) => p.id));
      for (const p of candidates) {
        if (result.length >= 10) break;
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
    return { title: "Ürün bulunamadı", robots: { index: false } };
  }
  const description =
    product.description ||
    `${product.name} ve yüzlerce market ürünü Yeni Mahalle Market'te. Seç, sepete ekle, Sapanca içinde adresine gelsin.`;
  return {
    // Kök layout şablonu "%s · Yeni Mahalle Market" ekler
    title: product.name,
    description,
    alternates: { canonical: `/urunler/${slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
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
  const byWeight = isWeightBased(product);
  const weightMin = weightMinFor(product);
  // Yalnız birimi "gram" olan ürünlerde başlık fiyatı EN AZ miktarın fiyatıdır
  // (ör. 125 g → ₺200); kg fiyatı altta bilgi. Diğerlerinde ürünün kendi fiyatı.
  const packMode = showsPackPrice(product);
  const headlinePrice = packMode
    ? computeLineTotal(product.price, weightMin, true)
    : product.price;

  const compareAt = product.compare_at_price;
  const discounted = compareAt !== null && compareAt > product.price;
  const discountPct = discounted
    ? Math.round((1 - product.price / compareAt) * 100)
    : 0;

  // Gram bazlı üründe gramaj gösterilmez (müşteri gramı kendi seçer).
  // Gramaj (ör. "125 g" referans paket) yönetici ne girdiyse gösterilir.
  const metaText = [product.brand, product.size_text]
    .filter(Boolean)
    .join(" · ");

  const unitPrice = unitPriceLabel(product);
  const chips = infoChips(product.category_slug);

  // İndirimdeki net tasarruf (başlık fiyatı ölçeğinde).
  const saving =
    discounted && compareAt !== null
      ? (packMode
          ? computeLineTotal(compareAt, weightMin, true)
          : compareAt) - headlinePrice
      : 0;

  // "Ürün Hakkında" künye satırları — açıklama olmasa da sayfa dolu dursun.
  const specs = [
    { label: "Marka", value: product.brand },
    { label: "Miktar", value: product.size_text },
    { label: "Kategori", value: cat?.name ?? "" },
    {
      label: "Satış birimi",
      value: byWeight ? "Kilogram (gramla satılır)" : product.unit,
    },
  ].filter((s) => s.value && s.value.trim() !== "");

  const productUrl = `${BUSINESS.url}/urunler/${slug}`;
  const productDescription =
    product.description ||
    `${product.name} ve yüzlerce market ürünü Yeni Mahalle Market'te. Seç, sepete ekle, Sapanca içinde adresine gelsin.`;
  const brand = product.brand.trim();

  // Product yapisal verisi: fiyat, para birimi, stok durumu ve marka.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    ...(product.image_url ? { image: [product.image_url] } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "TRY",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };

  // BreadcrumbList: Ana Sayfa > Ürünler > kategori > ürün.
  const breadcrumbItems = [
    { name: "Ana Sayfa", item: BUSINESS.url },
    { name: "Ürünler", item: `${BUSINESS.url}/urunler` },
    ...(cat
      ? [{ name: cat.name, item: `${BUSINESS.url}/urunler?k=${cat.slug}` }]
      : []),
    { name: product.name, item: productUrl },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className={styles.page}>
        <div className="container">
          {/* Üst gezinme: kataloğa dönüş + kategori kırıntısı */}
          <nav className={styles.crumbs} aria-label="Sayfa yolu">
            <Link href="/urunler" className={styles.crumbAll}>
              <LayoutGrid size={16} strokeWidth={2} aria-hidden="true" />
              Tüm Ürünler
            </Link>
            {cat && (
              <>
                <span className={styles.crumbSep} aria-hidden="true">/</span>
                <Link href={`/urunler?k=${cat.slug}`} className={styles.crumbLink}>
                  {cat.name}
                </Link>
              </>
            )}
          </nav>

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
                <span className={styles.price}>{formatTL(headlinePrice)}</span>
                {/* kg/gram ürünlerde /kg alttaki bilgi satırında; burada yalnız paket vb. */}
                {!byWeight &&
                  product.unit !== "adet" &&
                  product.unit !== "gram" && (
                    <span className={styles.unit}>/ {product.unit}</span>
                  )}
                {discounted && (
                  <s className={styles.compare}>
                    {formatTL(
                      packMode && compareAt !== null
                        ? computeLineTotal(compareAt, weightMin, true)
                        : compareAt!,
                    )}
                  </s>
                )}
                {discounted && (
                  <span className={styles.discount}>%{discountPct} indirim</span>
                )}
              </p>

              {byWeight ? (
                <p className={styles.unitPrice}>
                  {packMode ? `${formatGrams(weightMin)} · ` : ""}
                  {formatTL(product.price)} / kg
                </p>
              ) : unitPrice ? (
                <p className={styles.unitPrice}>Birim fiyat: {unitPrice}</p>
              ) : null}

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

              <ul className={styles.trust}>
                {TRUST_BADGES.map((badge) => (
                  <li key={badge.title} className={styles.trustItem}>
                    <span className={styles.trustIcon} aria-hidden="true">
                      <badge.icon size={18} strokeWidth={2} />
                    </span>
                    <span className={styles.trustText}>
                      <span className={styles.trustTitle}>{badge.title}</span>
                      <span className={styles.trustSub}>{badge.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Ürün Bilgileri — Migros yapısında sekmeli kart (etiket bilgileri
              + besin değerleri); detay yoksa açıklama + künye tek sekmede */}
          {(product.description || product.details || specs.length > 0) && (
            <ProductInfoTabs
              description={product.description}
              details={product.details ?? null}
              specs={specs}
            />
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
              <SimilarRail products={similar} />
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
