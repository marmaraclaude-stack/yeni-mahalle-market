// Admin — kurye rehberi (couriers tablosu).
// Server component: kuryeleri service-role ile çeker, listeyi client
// CouriersTable'a verir. Tablo kurulmamışsa (migration eksik) anlaşılır mesaj.

import { listCouriers } from "@/lib/shop/admin-actions";
import type { Courier } from "@/lib/shop/types";
import CouriersTable from "./CouriersTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kuryeler" };

export default async function AdminCouriersPage() {
  let couriers: Courier[] = [];
  let loadError: string | null = null;

  try {
    const result = await listCouriers();
    if (result.ok) {
      couriers = result.couriers;
    } else {
      loadError = result.error ?? "Kuryeler yüklenemedi.";
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Kuryeler</h1>
      <p className={styles.subtitle}>
        Kayıtlı kuryeler: sipariş detayında kurye bilgisi kartından hızlıca
        seçilir, ad ve telefon otomatik dolar.
      </p>

      {loadError ? (
        <div className={styles.empty}>
          Kuryeler yüklenemedi.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <CouriersTable couriers={couriers} />
      )}
    </>
  );
}
