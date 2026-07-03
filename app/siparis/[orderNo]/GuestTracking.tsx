"use client";

// Misafir sipariş takibi: telefon doğrulama formu → server action ile
// sipariş getirilir. Doğrulandıktan sonra aktif siparişte 20 sn'de bir
// aynı action yeniden çağrılarak durum tazelenir.

import { useActionState, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  trackOrder,
  trackOrderAction,
  type TrackingState,
} from "@/lib/shop/tracking-actions";
import OrderDetails from "./OrderDetails";
import styles from "./siparis.module.css";

const POLL_MS = 20_000;
const INITIAL: TrackingState = {};

export default function GuestTracking({ orderNo }: { orderNo: string }) {
  const [state, formAction, pending] = useActionState(trackOrderAction, INITIAL);
  // Polling ile gelen güncel veri form state'inin üzerine yazılır.
  const [live, setLive] = useState<TrackingState | null>(null);

  const current = live?.data ?? state.data;
  const phone = state.phone;
  const status = current?.order.status;

  useEffect(() => {
    if (!current || !phone) return;
    if (status === "delivered" || status === "cancelled") return;

    const no = current.order.order_no;
    const id = setInterval(() => {
      trackOrder(no, phone).then((next) => {
        if (next.data) setLive(next);
      });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [current, phone, status]);

  if (current) {
    return (
      <OrderDetails
        order={current.order}
        items={current.items}
        events={current.events}
      />
    );
  }

  return (
    <div className={styles.verifyCard}>
      <span className={styles.eyebrow}>Sipariş takibi</span>
      <h1 className={styles.verifyTitle}>{orderNo}</h1>
      <p className={styles.verifySub}>
        Siparişinizi görüntülemek için sipariş verirken kullandığınız telefon
        numarasını girin.
      </p>

      <form action={formAction} className={styles.verifyForm}>
        <input type="hidden" name="orderNo" value={orderNo} />
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Telefon numarası</span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="05XX XXX XX XX"
            autoComplete="tel"
            required
          />
        </label>

        {state.error && (
          <p className={styles.formError} role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn--accent"
          disabled={pending}
          aria-label="Siparişi görüntüle"
        >
          <Search aria-hidden="true" />
          {pending ? "Sorgulanıyor..." : "Siparişi görüntüle"}
        </button>
      </form>
    </div>
  );
}
