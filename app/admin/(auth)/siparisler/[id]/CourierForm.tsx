"use client";

// Sipariş detayı — kurye atama. İki mod: kayıtlı kuryelerden DROPDOWN seçimi
// (ad + telefon otomatik dolar) veya "Elle gir". Kaydet, setCourier server
// action'ını çağırır; boş ad + telefon kuryeyi kaldırır.

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCourier } from "@/lib/shop/admin-actions";
import type { Courier } from "@/lib/shop/types";
import styles from "../../../admin.module.css";

export default function CourierForm({
  orderId,
  couriers,
  initialName,
  initialPhone,
}: {
  orderId: string;
  couriers: Courier[];
  initialName: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"saved" | "manual">(
    couriers.length > 0 ? "saved" : "manual",
  );
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Mevcut atanan kurye kayıtlılardan biriyle eşleşiyorsa dropdown onu seçili tutar.
  const currentKey = useMemo(() => {
    const match = couriers.find(
      (c) => c.name === initialName && c.phone === initialPhone,
    );
    return match ? match.id : "";
  }, [couriers, initialName, initialPhone]);
  const [selectedId, setSelectedId] = useState(currentKey);

  function onSelectSaved(id: string) {
    setSelectedId(id);
    setSavedMsg(null);
    if (!id) {
      setName("");
      setPhone("");
      return;
    }
    const courier = couriers.find((c) => c.id === id);
    if (courier) {
      setName(courier.name);
      setPhone(courier.phone);
    }
  }

  function save() {
    setBusy(true);
    setSavedMsg(null);
    startTransition(async () => {
      try {
        await setCourier(orderId, name, phone);
        setSavedMsg(
          name.trim() ? "Kurye bilgisi kaydedildi." : "Kurye kaldırıldı.",
        );
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  const assigned = initialName.trim() || initialPhone.trim();

  return (
    <div className={styles.courierForm}>
      {assigned ? (
        <div className={styles.courierCurrent}>
          <span className={styles.courierCurrentLabel}>Atanan kurye</span>
          <strong>{initialName || "·"}</strong>
          {initialPhone && (
            <a href={`tel:${initialPhone}`} className={styles.telLink}>
              {initialPhone}
            </a>
          )}
        </div>
      ) : (
        <p className={styles.hint}>Bu siparişe henüz kurye atanmadı.</p>
      )}

      {/* Mod seçimi: kayıtlıdan seç / elle gir */}
      <div className={styles.segmented} role="group" aria-label="Kurye giriş yöntemi">
        <button
          type="button"
          onClick={() => setMode("saved")}
          className={`${styles.segBtn} ${mode === "saved" ? styles["segBtn--active"] : ""}`}
          aria-pressed={mode === "saved"}
        >
          Kayıtlı Kurye
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`${styles.segBtn} ${mode === "manual" ? styles["segBtn--active"] : ""}`}
          aria-pressed={mode === "manual"}
        >
          Elle Gir
        </button>
      </div>

      {mode === "saved" ? (
        couriers.length === 0 ? (
          <p className={styles.hint}>
            Henüz kayıtlı kurye yok. Kuryeler sayfasından ekleyin veya
            &quot;Elle Gir&quot; ile yazın.
          </p>
        ) : (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="courier-select">
              Kurye seç
            </label>
            <select
              id="courier-select"
              value={selectedId}
              onChange={(e) => onSelectSaved(e.target.value)}
              className={styles.select}
            >
              <option value="">Kurye yok / kaldır</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.phone ? ` — ${c.phone}` : ""}
                </option>
              ))}
            </select>
          </div>
        )
      ) : (
        <>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="courier-name">
              Kurye adı
            </label>
            <input
              id="courier-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSavedMsg(null);
              }}
              className={styles.input}
              placeholder="Örn. Ahmet Y."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="courier-phone">
              Kurye telefonu
            </label>
            <input
              id="courier-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSavedMsg(null);
              }}
              className={styles.input}
              inputMode="tel"
              placeholder="05XX XXX XX XX"
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
      >
        {busy ? "Kaydediliyor…" : "Kurye Bilgisini Kaydet"}
      </button>

      {savedMsg && <p className={styles.courierSaved}>{savedMsg}</p>}
      <p className={styles.hint}>
        Kurye atandığında müşteri takip sayfasında &quot;Kuryeniz yolda&quot;
        kartıyla ad ve telefon görünür. Boş bırakılırsa kurye kaldırılır.
      </p>
    </div>
  );
}
