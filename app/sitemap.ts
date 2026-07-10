import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";

// Statik + dinamik ürün URL'leri. Ürünler PostgREST 1000 satır limiti için
// range(from, from+999) döngüsüyle sayfalanarak TÜM aktif ürünler çekilir.
// DB hazır değilse (veya hata) yalnız statik URL'lerle devam edilir.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: BUSINESS.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BUSINESS.url}/urunler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BUSINESS.url}/firsatlar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BUSINESS.url}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BUSINESS.url}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Yasal sayfalar — iyzico satıcı kriterleri
    {
      url: `${BUSINESS.url}/teslimat-ve-iade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BUSINESS.url}/gizlilik-politikasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BUSINESS.url}/mesafeli-satis-sozlesmesi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BUSINESS.url}/on-bilgilendirme-formu`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const supabase = await createClient();
    const PAGE = 1000;
    const products: { slug: string; updated_at: string }[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true)
        .range(from, from + PAGE - 1);
      if (error) throw error;
      const batch = (data ?? []) as { slug: string; updated_at: string }[];
      products.push(...batch);
      if (batch.length < PAGE) break; // son sayfa
    }

    for (const p of products) {
      routes.push({
        url: `${BUSINESS.url}/urunler/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    // DB hazır değilse yalnız statik URL'lerle devam et.
  }

  return routes;
}
