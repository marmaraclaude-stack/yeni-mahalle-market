// Marka yönetimi — /admin/markalar.
// Ürün düzenleme formundaki marka listesi shop_brands tablosundan gelir;
// marka seçilince "Üretici / işletmeci" alanı buradaki değerle otomatik
// dolar. Bu sayfada markalar aranır, eklenir, düzenlenir ve silinir;
// her markanın kaç üründe kullanıldığı görünür.

import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ShopBrand } from "@/lib/shop/admin-actions";
import styles from "../../admin.module.css";
import BrandsManager from "./BrandsManager";

export const metadata: Metadata = {
  title: "Markalar · Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MarkalarPage() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("shop_brands")
    .select("id, name, producer");

  // Marka başına ürün sayısı: brand kolonu sayfa sayfa çekilir
  // (PostgREST tek istekte en fazla 1000 satır döndürür).
  const counts = new Map<string, number>();
  let unbranded = 0;
  if (!error) {
    for (let from = 0; ; from += 1000) {
      const { data: rows, error: pageError } = await supabase
        .from("products")
        .select("brand")
        .range(from, from + 999);
      if (pageError || !rows || rows.length === 0) break;
      for (const r of rows as { brand: string | null }[]) {
        const b = (r.brand ?? "").trim();
        if (!b) unbranded += 1;
        else counts.set(b, (counts.get(b) ?? 0) + 1);
      }
      if (rows.length < 1000) break;
    }
  }

  const brands = ((data ?? []) as ShopBrand[])
    .map((b) => ({ ...b, count: counts.get(b.name) ?? 0 }))
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return (
    <>
      <h1 className={styles.title}>Markalar</h1>
      <p className={styles.subtitle}>
        Ürün düzenlemedeki marka listesi buradan gelir; marka seçilince
        &quot;Üretici / işletmeci&quot; alanı buradaki değerle otomatik dolar.
        Marka adını değiştirirsen o markadaki tüm ürünler yeni ada taşınır.
      </p>
      {error ? (
        <div className={styles.empty}>Markalar yüklenemedi: {error.message}</div>
      ) : (
        <BrandsManager brands={brands} unbranded={unbranded} />
      )}
    </>
  );
}
