// Admin — kupon yönetimi (coupons tablosu).
// Server component: kuponları service-role ile çeker, tabloyu client'a verir.
// Tablo henüz kurulmamışsa (migration eksik) anlaşılır kurulum mesajı gösterir.

import { createAdminClient } from "@/lib/supabase/admin";
import type { Coupon } from "@/lib/shop/admin-actions";
import CouponsTable from "./CouponsTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kuponlar" };

/** Hata, coupons tablosunun hiç kurulmamış olmasından mı kaynaklanıyor? */
function isMissingTableError(error: { code?: string; message: string }): boolean {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /does not exist|could not find the table|schema cache/i.test(error.message)
  );
}

export default async function AdminCouponsPage() {
  let coupons: Coupon[] = [];
  let loadError: string | null = null;
  let needsSetup = false;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      if (isMissingTableError(error)) {
        needsSetup = true;
      } else {
        loadError = error.message;
      }
    } else {
      coupons = (data ?? []) as Coupon[];
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Kuponlar</h1>
      <p className={styles.subtitle}>
        İndirim kuponları: müşteri ödeme adımında kodu girer, indirim otomatik uygulanır.
      </p>

      {needsSetup ? (
        <div className={styles.empty}>
          Kupon tablosu kurulmamış, migration&apos;ı çalıştırın.
          <br />
          <small>supabase/migrations/20260703300000_coupons.sql</small>
        </div>
      ) : loadError ? (
        <div className={styles.empty}>
          Kuponlar yüklenemedi.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <CouponsTable coupons={coupons} />
      )}
    </>
  );
}
