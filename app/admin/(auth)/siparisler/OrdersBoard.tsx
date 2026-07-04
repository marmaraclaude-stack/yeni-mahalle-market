"use client";

// Sipariş panosu — durum filtre chip'leri, durum ilerletme/iptal butonları,
// 15 sn'de bir router.refresh() ile tazelenir (veri server component'ten gelir).

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteOrder, updateOrderStatus } from "@/lib/shop/admin-actions";
import {
  formatTL,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/shop/types";
import type { Order, OrderStatus } from "@/lib/shop/types";
import styles from "../../admin.module.css";

/** Bir sonraki durum + buton etiketi. */
const NEXT_STEP: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  new: { to: "confirmed", label: "Onayla" },
  confirmed: { to: "preparing", label: "Hazırlanıyor" },
  preparing: { to: "on_the_way", label: "Kurye Yolda" },
  on_the_way: { to: "delivered", label: "Teslim Edildi" },
};

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "new", label: "Yeni" },
  { key: "confirmed", label: "Onaylandı" },
  { key: "preparing", label: "Hazırlanıyor" },
  { key: "on_the_way", label: "Kurye Yolda" },
  { key: "delivered", label: "Teslim Edildi" },
  { key: "cancelled", label: "İptal" },
];

/** Renkli durum rozeti sınıfı (new=amber, confirmed=camgöbeği, preparing=mavi,
 *  on_the_way=mor, delivered=yeşil, cancelled=kırmızı). */
function statusBadgeClass(status: OrderStatus): string {
  return `${styles.badge} ${styles[`badge--${status}`]}`;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function paymentPillClass(status: Order["payment_status"]): string {
  if (status === "paid") return styles["pill--ok"];
  if (status === "pending") return styles["pill--warn"];
  return styles["pill--err"];
}

export default function OrdersBoard({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // 15 saniyede bir sunucu verisini tazele (yeni sipariş düşerse görünsün).
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 15000);
    return () => clearInterval(timer);
  }, [router]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) map.set(o.status, (map.get(o.status) ?? 0) + 1);
    return map;
  }, [orders]);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  function setStatus(order: Order, to: OrderStatus) {
    if (to === "cancelled" && !window.confirm(`${order.order_no} iptal edilsin mi?`)) {
      return;
    }
    setBusyId(order.id);
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, to);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  }

  function removeOrder(order: Order) {
    if (
      !window.confirm(
        `${order.order_no} siparişi KALICI olarak silinsin mi? Bu işlem geri alınamaz.`,
      )
    ) {
      return;
    }
    setBusyId(order.id);
    startTransition(async () => {
      try {
        await deleteOrder(order.id);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <>
      <div className={styles.chips} role="group" aria-label="Durum filtresi">
        {FILTERS.map((f) => {
          const count =
            f.key === "all" ? orders.length : (counts.get(f.key) ?? 0);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`${styles.chip} ${filter === f.key ? styles["chip--active"] : ""}`}
            >
              {f.key !== "all" && (
                <span
                  className={`${styles.chipDot} ${styles[`chipDot--${f.key}`]}`}
                  aria-hidden
                />
              )}
              {f.label} <span className={styles.chipCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className={styles.empty}>Bu filtrede sipariş yok.</div>
      ) : (
        <div className={styles.boardList}>
          {visible.map((o) => {
            const next = NEXT_STEP[o.status];
            const busy = busyId === o.id;
            return (
              <article
                key={o.id}
                className={`${styles.orderCard} ${o.status === "new" ? styles["orderCard--new"] : ""}`}
              >
                <div className={styles.orderMain}>
                  <div className={styles.orderTop}>
                    <Link
                      href={`/admin/siparisler/${o.id}`}
                      className={styles.orderNo}
                    >
                      {o.order_no}
                    </Link>
                    <span className={statusBadgeClass(o.status)}>
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                    <span className={`${styles.pill} ${paymentPillClass(o.payment_status)}`}>
                      {PAYMENT_METHOD_LABELS[o.payment_method]} ·{" "}
                      {PAYMENT_STATUS_LABELS[o.payment_status]}
                    </span>
                  </div>
                  <div className={styles.orderMeta}>
                    {o.customer_name} ·{" "}
                    <a href={`tel:${o.phone}`} className={styles.telLink}>
                      {o.phone}
                    </a>{" "}
                    · {formatDateTime(o.created_at)}
                  </div>
                </div>
                <div className={styles.orderSide}>
                  <span className={styles.orderTotal}>{formatTL(Number(o.total))}</span>
                  <div className={styles.orderActions}>
                    {next && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
                        disabled={busy}
                        onClick={() => setStatus(o, next.to)}
                        aria-label={`${o.order_no} durumunu ilerlet: ${next.label}`}
                      >
                        {busy ? "…" : next.label}
                      </button>
                    )}
                    {o.status !== "delivered" && o.status !== "cancelled" && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
                        disabled={busy}
                        onClick={() => setStatus(o, "cancelled")}
                        aria-label={`${o.order_no} siparişini iptal et`}
                      >
                        İptal
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles["actionBtn--delete"]}`}
                      disabled={busy}
                      onClick={() => removeOrder(o)}
                      aria-label={`${o.order_no} siparişini kalıcı olarak sil`}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
