// Admin — sipariş listesi. Siparişler service-role ile sunucuda çekilir,
// filtreleme/aksiyonlar client'taki OrdersBoard'da yapılır.
// ?uye=<userId> GET parametresi verilirse yalnız o üyenin siparişleri
// listelenir ve başlıkta üyenin adı gösterilir; parametre yokken davranış aynı.

import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/shop/types";
import OrdersBoard from "./OrdersBoard";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Siparişler" };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ uye?: string | string[] }>;
}) {
  const { uye } = await searchParams;
  const uyeRaw = Array.isArray(uye) ? uye[0] : uye;
  // Geçersiz biçimli id'yi sorguya taşımadan ele (uuid kolonunda hata verir).
  const memberId = uyeRaw && UUID_RE.test(uyeRaw.trim()) ? uyeRaw.trim() : null;

  let orders: Order[] = [];
  let memberName: string | null = null;
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (memberId) {
      query = query.eq("user_id", memberId);
    }

    const { data, error } = await query;
    if (error) {
      loadError = error.message;
    } else {
      orders = (data ?? []) as Order[];
    }

    // Üye filtresi varsa başlık için adı çek (yoksa e-posta yerine kısa id).
    if (memberId && !loadError) {
      const { data: prof } = await supabase
        .from("customer_profiles")
        .select("full_name")
        .eq("id", memberId)
        .maybeSingle();
      const fullName = (prof as { full_name: string } | null)?.full_name?.trim();
      memberName = fullName || memberId.slice(0, 8);
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>
        {memberName ? `Üye siparişleri: ${memberName}` : "Siparişler"}
      </h1>
      <p className={styles.subtitle}>
        {memberName
          ? "Yalnız bu üyenin siparişleri listeleniyor · liste 15 saniyede bir kendini yeniler."
          : "Tüm siparişler · liste 15 saniyede bir kendini yeniler."}
      </p>
      {loadError ? (
        <div className={styles.empty}>
          Siparişler yüklenemedi. Veritabanı kurulumu yapılmamış olabilir.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <OrdersBoard orders={orders} />
      )}
    </>
  );
}
