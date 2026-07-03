// Sipariş detayı — durum zaman çizelgesi + kalemler + toplamlar.
// Yönergesiz (shared) komponent: giriş yapmış kullanıcı için server'da,
// misafir takipte client'ta render edilir. Server-only import İÇERMEZ.

import { Check, Clock, MapPin, Package, XCircle } from "lucide-react";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatTL,
  type Order,
  type OrderEvent,
  type OrderItem,
  type OrderStatus,
} from "@/lib/shop/types";
import styles from "./siparis.module.css";

/** Tarihi Türkiye saatiyle kısa biçimde yaz. */
function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetails({
  order,
  items,
  events,
}: {
  order: Order;
  items: OrderItem[];
  events: OrderEvent[];
}) {
  const isCancelled = order.status === "cancelled";
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);

  // Her durum için en güncel event zamanı (varsa).
  const timeFor = (status: OrderStatus): string | null => {
    const hits = events.filter((e) => e.status === status);
    return hits.length > 0 ? hits[hits.length - 1].created_at : null;
  };
  const cancelledAt = timeFor("cancelled");

  return (
    <div className={styles.details}>
      {/* Başlık */}
      <div className={styles.headCard}>
        <div>
          <span className={styles.eyebrow}>Sipariş takibi</span>
          <h1 className={styles.orderNo}>{order.order_no}</h1>
          <p className={styles.headMeta}>
            {formatWhen(order.created_at)} · {items.length} kalem ·{" "}
            {formatTL(order.total)}
          </p>
        </div>
        <span
          className={`${styles.statusChip} ${
            isCancelled
              ? styles.statusChipCancelled
              : order.status === "delivered"
                ? styles.statusChipDone
                : styles.statusChipActive
          }`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* İptal — kırmızı özel durum */}
      {isCancelled && (
        <div className={styles.cancelledBox} role="status">
          <XCircle aria-hidden="true" />
          <div>
            <strong>Sipariş iptal edildi</strong>
            <p>
              {cancelledAt ? `${formatWhen(cancelledAt)} · ` : ""}
              Sorularınız için bizi arayabilir veya WhatsApp&apos;tan
              yazabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* Durum zaman çizelgesi */}
      <section
        className={`${styles.card} ${isCancelled ? styles.timelineMuted : ""}`}
        aria-label="Sipariş durumu"
      >
        <h2 className={styles.cardTitle}>
          <Clock aria-hidden="true" /> Sipariş durumu
        </h2>
        <ol className={styles.timeline}>
          {ORDER_STATUS_FLOW.map((status, i) => {
            const done = !isCancelled && currentIdx >= i;
            const current = !isCancelled && currentIdx === i;
            const when = timeFor(status);
            return (
              <li
                key={status}
                className={`${styles.step} ${done ? styles.stepDone : ""} ${
                  current ? styles.stepCurrent : ""
                }`}
              >
                <span className={styles.stepDot} aria-hidden="true">
                  {done && <Check />}
                </span>
                <div className={styles.stepBody}>
                  <span className={styles.stepLabel}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                  {done && when && (
                    <span className={styles.stepTime}>{formatWhen(when)}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Kalemler + toplamlar */}
      <section className={styles.card} aria-label="Sipariş kalemleri">
        <h2 className={styles.cardTitle}>
          <Package aria-hidden="true" /> Ürünler
        </h2>
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQty}>
                  {item.qty} × {formatTL(item.unit_price)}
                </span>
              </div>
              <span className={styles.itemTotal}>
                {formatTL(item.line_total)}
              </span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          <div className={styles.totalRow}>
            <dt>Ara toplam</dt>
            <dd>{formatTL(order.items_subtotal)}</dd>
          </div>
          <div className={styles.totalRow}>
            <dt>Teslimat</dt>
            <dd>
              {order.delivery_fee > 0 ? formatTL(order.delivery_fee) : "Ücretsiz"}
            </dd>
          </div>
          <div className={`${styles.totalRow} ${styles.totalGrand}`}>
            <dt>Toplam</dt>
            <dd>{formatTL(order.total)}</dd>
          </div>
        </dl>
        <p className={styles.paymentLine}>
          {PAYMENT_METHOD_LABELS[order.payment_method]} ·{" "}
          <span
            className={
              order.payment_status === "paid"
                ? styles.paymentPaid
                : order.payment_status === "failed"
                  ? styles.paymentFailed
                  : styles.paymentPending
            }
          >
            {PAYMENT_STATUS_LABELS[order.payment_status]}
          </span>
        </p>
      </section>

      {/* Teslimat bilgisi */}
      <section className={styles.card} aria-label="Teslimat bilgileri">
        <h2 className={styles.cardTitle}>
          <MapPin aria-hidden="true" /> Teslimat
        </h2>
        <p className={styles.addressName}>{order.customer_name}</p>
        <p className={styles.addressLine}>{order.address_line}</p>
        {order.address_note && (
          <p className={styles.addressNote}>Not: {order.address_note}</p>
        )}
        {order.note && (
          <p className={styles.addressNote}>Sipariş notu: {order.note}</p>
        )}
      </section>
    </div>
  );
}
