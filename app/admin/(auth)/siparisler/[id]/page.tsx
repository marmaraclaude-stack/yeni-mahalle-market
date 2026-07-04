// Admin — sipariş detayı: kalemler, adres, notlar, ödeme ve durum yönetimi.
// Server component; yazma işlemleri lib/shop/admin-actions üzerinden.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  listCouriers,
  setPaymentStatus,
  updateAdminNote,
  updateOrderStatus,
} from "@/lib/shop/admin-actions";
import DeleteOrderButton from "./DeleteOrderButton";
import CourierForm from "./CourierForm";
import {
  formatTL,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/shop/types";
import type {
  Courier,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/lib/shop/types";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sipariş Detayı" };

const NEXT_STEP: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  new: { to: "confirmed", label: "Onayla" },
  confirmed: { to: "preparing", label: "Hazırlanıyor" },
  preparing: { to: "on_the_way", label: "Kurye Yolda" },
  on_the_way: { to: "delivered", label: "Teslim Edildi" },
};

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: orderData, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <>
        <h1 className={styles.title}>Sipariş</h1>
        <div className={styles.empty}>Sipariş yüklenemedi: {error.message}</div>
      </>
    );
  }
  if (!orderData) notFound();
  const order = orderData as Order;

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("name");
  const items = (itemsData ?? []) as OrderItem[];

  // Kurye dropdown'ı için kayıtlı kuryeleri çek (tablo yoksa boş liste).
  let couriers: Courier[] = [];
  try {
    const couriersResult = await listCouriers();
    if (couriersResult.ok) {
      couriers = couriersResult.couriers.filter((c) => c.is_active);
    }
  } catch {
    couriers = [];
  }

  // Formlardan gelen değerleri action'lara bağlayan inline server action'lar.
  async function savePaymentAction(formData: FormData) {
    "use server";
    const value = String(formData.get("payment_status") ?? "");
    if ((PAYMENT_STATUSES as string[]).includes(value)) {
      await setPaymentStatus(id, value as PaymentStatus);
    }
  }

  async function saveNoteAction(formData: FormData) {
    "use server";
    await updateAdminNote(id, String(formData.get("admin_note") ?? ""));
  }

  const next = NEXT_STEP[order.status];

  return (
    <>
      <Link
        href="/admin/siparisler"
        className={styles.backLink}
        style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
      >
        <ChevronLeft size={15} aria-hidden />
        Siparişler
      </Link>
      <h1 className={styles.title}>{order.order_no}</h1>
      <p className={styles.subtitle} style={{ marginBottom: 16 }}>
        {formatDateTime(order.created_at)} ·{" "}
        {PAYMENT_METHOD_LABELS[order.payment_method]}
      </p>

      {/* Renkli durum + ödeme rozetleri */}
      <div className={styles.orderTop} style={{ marginBottom: 18 }}>
        <span className={`${styles.badge} ${styles[`badge--${order.status}`]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
        <span
          className={`${styles.pill} ${
            order.payment_status === "paid"
              ? styles["pill--ok"]
              : order.payment_status === "pending"
                ? styles["pill--warn"]
                : styles["pill--err"]
          }`}
        >
          {PAYMENT_STATUS_LABELS[order.payment_status]}
        </span>
      </div>

      {/* Durum butonları */}
      <div className={styles.orderActions} style={{ marginBottom: 24 }}>
        {next && (
          <form action={updateOrderStatus.bind(null, order.id, next.to)}>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
            >
              {next.label}
            </button>
          </form>
        )}
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <form action={updateOrderStatus.bind(null, order.id, "cancelled")}>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
            >
              Siparişi İptal Et
            </button>
          </form>
        )}
        <DeleteOrderButton orderId={order.id} orderNo={order.order_no} />
      </div>

      {/* Dengeli iki kolon: sol = kalemler + müşteri, sağ = ödeme/kurye/not */}
      <div className={styles.orderDetailGrid}>
        <div className={styles.orderDetailCol}>
          {/* Kalemler */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Kalemler</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Birim</th>
                    <th>Adet</th>
                    <th>Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td>{formatTL(Number(it.unit_price))}</td>
                      <td>{it.qty}</td>
                      <td>{formatTL(Number(it.line_total))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Ara toplam</td>
                    <td>{formatTL(Number(order.items_subtotal))}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Teslimat</td>
                    <td>{formatTL(Number(order.delivery_fee))}</td>
                  </tr>
                  <tr className={styles.tableTotal}>
                    <td colSpan={3}>Toplam</td>
                    <td>{formatTL(Number(order.total))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Müşteri + adres */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Müşteri &amp; Adres</h2>
            <dl className={styles.kvList}>
              <div className={styles.kv}>
                <dt>Ad Soyad</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div className={styles.kv}>
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${order.phone}`} className={styles.telLink}>
                    {order.phone}
                  </a>
                </dd>
              </div>
              <div className={styles.kv}>
                <dt>Adres</dt>
                <dd>{order.address_line}</dd>
              </div>
              {order.address_note && (
                <div className={styles.kv}>
                  <dt>Adres Tarifi</dt>
                  <dd>{order.address_note}</dd>
                </div>
              )}
              {order.note && (
                <div className={styles.kv}>
                  <dt>Müşteri Notu</dt>
                  <dd>{order.note}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <div className={styles.orderDetailCol}>
          {/* Ödeme durumu */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Ödeme Durumu</h2>
            <form action={savePaymentAction} className={styles.inlineForm}>
              <div className={styles.field} style={{ flex: "1 1 180px" }}>
                <label className={styles.label} htmlFor="payment_status">
                  Durum
                </label>
                <select
                  id="payment_status"
                  name="payment_status"
                  defaultValue={order.payment_status}
                  className={styles.select}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {PAYMENT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
              >
                Kaydet
              </button>
            </form>
          </section>

          {/* Kurye bilgisi — kayıtlı kuryeden seç veya elle gir */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Kurye Bilgisi</h2>
            <CourierForm
              orderId={order.id}
              couriers={couriers}
              initialName={order.courier_name}
              initialPhone={order.courier_phone}
            />
          </section>

          {/* İç not */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>İç Not</h2>
            <form action={saveNoteAction} className={styles.stackForm}>
              <label className={styles.label} htmlFor="admin_note">
                Sadece admin görür (kurye adı, hatırlatma vs.)
              </label>
              <textarea
                id="admin_note"
                name="admin_note"
                rows={4}
                defaultValue={order.admin_note}
                className={styles.textarea}
                style={{ width: "100%" }}
              />
              <button
                type="submit"
                className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
              >
                Notu Kaydet
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
