// Kurye konum paylaşım sayfası — /kurye/[orderNo]?t=<token>
// Tokenli link kuryeye verilir; kurye "Konumu paylaş" der, tarayıcı
// GPS'i watchPosition ile izleyip updateCourierLocation'a yazar.
// Token geçersizse sipariş bilgisi gösterilmez.

import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCourierToken } from "@/lib/shop/courier-token";
import type { Order } from "@/lib/shop/types";
import CourierShare from "./CourierShare";
import styles from "./kurye.module.css";

export const metadata: Metadata = {
  title: "Kurye Konum Paylaşımı",
  robots: { index: false, follow: false },
};

export default async function CourierSharePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { orderNo: rawOrderNo } = await params;
  const sp = await searchParams;
  const orderNo = decodeURIComponent(rawOrderNo).trim().toUpperCase();
  const token = typeof sp.t === "string" ? sp.t : "";

  const supabase = createAdminClient();
  const { data: orderRow } = await supabase
    .from("orders")
    .select("id, order_no, status, customer_name, address_line")
    .eq("order_no", orderNo)
    .maybeSingle();

  const order = orderRow as Pick<
    Order,
    "id" | "order_no" | "status" | "customer_name" | "address_line"
  > | null;

  const authorized = order != null && verifyCourierToken(order.id, token);

  if (!authorized || !order) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Bağlantı geçersiz</h1>
          <p className={styles.muted}>
            Bu konum paylaşım bağlantısı geçersiz veya süresi dolmuş. Lütfen
            market yönetiminden güncel bağlantıyı isteyin.
          </p>
        </div>
      </main>
    );
  }

  const finished = order.status === "delivered" || order.status === "cancelled";

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Yeni Mahalle Market · Kurye</span>
        <h1 className={styles.title}>Sipariş {order.order_no}</h1>
        <p className={styles.customer}>
          <strong>{order.customer_name}</strong>
          <br />
          {order.address_line}
        </p>
        {finished ? (
          <p className={styles.muted}>
            Bu sipariş tamamlanmış. Konum paylaşımına gerek yok.
          </p>
        ) : (
          <CourierShare orderNo={order.order_no} token={token} />
        )}
      </div>
    </main>
  );
}
