// Admin — Stok: ürün stok adetleri tek yerden yönetilir.
// Adet girilir; sipariş geldikçe otomatik düşer, 0'a inince ürün "tükendi"
// olur. null (takipsiz) ürünler yalnız stokta/tükendi bayrağıyla çalışır.

import { listStock } from "@/lib/shop/admin-actions";
import StockTable from "./StockTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stok" };

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filtre?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const filtre = ["dusuk", "tukendi", "takipsiz"].includes(sp.filtre ?? "")
    ? (sp.filtre as "dusuk" | "tukendi" | "takipsiz")
    : undefined;

  const rows = await listStock({ q, filter: filtre });

  return (
    <>
      <h1 className={styles.title}>Stok</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        Stok adedini girin; sipariş geldikçe otomatik düşer, 0&apos;a inince ürün
        kendiliğinden &quot;tükendi&quot; olur. Adet girilmeyen (takipsiz) ürünler
        yalnız stokta/tükendi bayrağıyla çalışmaya devam eder.
      </p>
      <StockTable rows={rows} q={q} filtre={filtre} />
    </>
  );
}
