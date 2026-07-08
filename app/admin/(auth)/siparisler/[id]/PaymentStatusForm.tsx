"use client";

// Sipariş detayı — ödeme durumu formu. Select + Kaydet; setPaymentStatus
// server action'ını useTransition ile çağırır. Başarıda "Kaydedildi" mesajı +
// router.refresh() (üstteki ödeme rozeti server'da yeniden render olsun);
// hata olursa mesaj gösterir. Eski inline server action + <select defaultValue>
// gönderiminde görsel geri bildirim yoktu; bu bileşen onu giderir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPaymentStatus } from "@/lib/shop/admin-actions";
import { PAYMENT_STATUS_LABELS } from "@/lib/shop/types";
import type { PaymentStatus } from "@/lib/shop/types";
import styles from "../../../admin.module.css";

const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export default function PaymentStatusForm({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function save() {
    setBusy(true);
    setSavedMsg(null);
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await setPaymentStatus(orderId, status);
        setSavedMsg("Kaydedildi.");
        router.refresh();
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "Ödeme durumu kaydedilemedi.",
        );
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <div className={styles.stackForm} style={{ alignItems: "stretch" }}>
      <div className={styles.inlineForm}>
        <div className={styles.field} style={{ flex: "1 1 180px" }}>
          <label className={styles.label} htmlFor="payment_status">
            Durum
          </label>
          <select
            id="payment_status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as PaymentStatus);
              setSavedMsg(null);
              setErrorMsg(null);
            }}
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
          type="button"
          onClick={save}
          disabled={busy}
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          {busy ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
      {savedMsg && <p className={styles.courierSaved}>{savedMsg}</p>}
      {errorMsg && <p className={styles.formError}>{errorMsg}</p>}
    </div>
  );
}
