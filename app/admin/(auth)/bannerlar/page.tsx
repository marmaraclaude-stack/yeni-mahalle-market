// Admin — kampanya banner yönetimi (banners tablosu).
// Server component: banner'ları service-role ile çeker, tabloyu client'a verir.
// Tablo henüz kurulmamışsa (migration eksik) anlaşılır kurulum mesajı gösterir.

import { createAdminClient } from "@/lib/supabase/admin";
import type { Banner } from "@/lib/shop/types";
import BannersTable from "./BannersTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bannerlar" };

/** Hata, banners tablosunun hiç kurulmamış olmasından mı kaynaklanıyor? */
function isMissingTableError(error: { code?: string; message: string }): boolean {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /does not exist|could not find the table|schema cache/i.test(error.message)
  );
}

export default async function AdminBannersPage() {
  let banners: Banner[] = [];
  let loadError: string | null = null;
  let needsSetup = false;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      if (isMissingTableError(error)) {
        needsSetup = true;
      } else {
        loadError = error.message;
      }
    } else {
      banners = (data ?? []) as Banner[];
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Bannerlar</h1>
      <p className={styles.subtitle}>
        Kampanya banner&apos;ları: ana sayfa ve ürünler sayfasının üstünde
        sırayla döner, aktif olmayanlar gösterilmez.
      </p>

      {needsSetup ? (
        <div className={styles.empty}>
          Banner tablosu kurulmamış, migration&apos;ı çalıştırın.
          <br />
          <small>supabase/migrations/20260703400000_banners.sql</small>
        </div>
      ) : loadError ? (
        <div className={styles.empty}>
          Bannerlar yüklenemedi.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <BannersTable banners={banners} />
      )}
    </>
  );
}
