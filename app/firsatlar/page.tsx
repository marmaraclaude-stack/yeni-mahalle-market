// Fırsatlar — /firsatlar. İndirimli ürünler: compare_at_price dolu ve
// fiyattan büyük olan aktif ürünler, en yüksek indirim oranı önce.
// DB hazır değilse veya fırsat yoksa zarif boş durum gösterilir.

import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import SiteNav from "@/components/SiteNav";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./firsatlar.module.css";

export const metadata: Metadata = {
  title: "Fırsatlar",
  description:
    "Yeni Mahalle Market'te indirimli ürünler. Fırsatları kaçırma, seç sepete ekle, Sapanca içinde kapına gelsin.",
};

/** İndirim oranı (0-1). compare_at_price dolu ürünler için çağrılır. */
function discountRate(p: Product): number {
  if (p.compare_at_price === null || p.compare_at_price <= 0) return 0;
  return (p.compare_at_price - p.price) / p.compare_at_price;
}

export default async function FirsatlarPage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .not("compare_at_price", "is", null)
      .order("sort", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    // PostgREST iki kolonu karşılaştıramaz — compare_at_price > price süzgeci burada
    products = ((data ?? []) as Product[]).filter(
      (p) => p.compare_at_price !== null && p.compare_at_price > p.price,
    );
    // En yüksek indirim oranı önce
    products.sort((a, b) => discountRate(b) - discountRate(a));
  } catch {
    // DB henüz kurulmamış olabilir — site patlamasın, boş durum gösterilir
    products = [];
  }

  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon} aria-hidden="true">
                <BadgePercent size={22} strokeWidth={1.9} />
              </span>
              <h1 className={styles.title}>Fırsatlar</h1>
            </div>
            <p className={styles.sub}>
              İndirimli ürünler burada. Seç, sepete ekle, Sapanca içinde kapına
              gelsin.
            </p>
            {products.length > 0 && (
              <span className={styles.count}>
                {products.length} indirimli ürün
              </span>
            )}
          </header>

          {products.length === 0 ? (
            <section className={styles.empty} role="status">
              <span className={styles.emptyIcon} aria-hidden="true">
                <BadgePercent size={26} strokeWidth={1.8} />
              </span>
              <h2>Şu an aktif fırsat yok, yakında!</h2>
              <p>
                İndirimler eklendikçe burada yayınlanacak. O zamana kadar tüm
                ürünlerimize göz atabilirsin.
              </p>
              <Link href="/urunler" className="btn btn--accent">
                Ürünlere Göz At
              </Link>
            </section>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
