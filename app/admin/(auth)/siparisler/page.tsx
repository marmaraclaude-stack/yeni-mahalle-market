// Admin — sipariş listesi. Siparişler service-role ile sunucuda çekilir,
// filtreleme/aksiyonlar client'taki OrdersBoard'da yapılır.

import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/shop/types";
import OrdersBoard from "./OrdersBoard";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Siparişler" };

export default async function AdminOrdersPage() {
  let orders: Order[] = [];
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      loadError = error.message;
    } else {
      orders = (data ?? []) as Order[];
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Siparişler</h1>
      <p className={styles.subtitle}>
        Tüm siparişler · liste 15 saniyede bir kendini yeniler.
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
