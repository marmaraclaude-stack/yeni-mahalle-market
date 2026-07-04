"use client";

// Sipariş detayı — kurye atama. SADECE kayıtlı kuryelerden DROPDOWN seçimi:
// seçilen kuryenin adı + telefonu (+ görsel önizlemesi) otomatik gelir,
// Kaydet setCourier server action'ını çağırır. "Kurye yok / kaldır" seçilip
// kaydedilince kurye kaldırılır. Kayıtlı kurye yoksa Kuryeler sayfasına yönlendirir.

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
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

  const selected = couriers.find((c) => c.id === selectedId) ?? null;
  const assigned = initialName.trim() || initialPhone.trim();

  function save() {
    setBusy(true);
    setSavedMsg(null);
    const courier = couriers.find((c) => c.id === selectedId);
    const name = courier ? courier.name : "";
    const phone = courier ? courier.phone : "";
    startTransition(async () => {
      try {
        await setCourier(orderId, name, phone);
        setSavedMsg(name ? "Kurye bilgisi kaydedildi." : "Kurye kaldırıldı.");
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  // Kayıtlı kurye yoksa: elle giriş YOK — Kuryeler sayfasına yönlendir.
  if (couriers.length === 0) {
    return (
      <div className={styles.courierForm}>
        {assigned && (
          <div className={styles.courierCurrent}>
            <span className={styles.courierCurrentLabel}>Atanan kurye</span>
            <strong>{initialName || "·"}</strong>
            {initialPhone && (
              <a href={`tel:${initialPhone}`} className={styles.telLink}>
                {initialPhone}
              </a>
            )}
          </div>
        )}
        <p className={styles.hint}>
          Henüz kayıtlı kurye yok. Önce Kuryeler sayfasından kurye ekleyin.
        </p>
        <div className={styles.courierEmptyAction}>
          <Link
            href="/admin/kuryeler"
            className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
          >
            Kuryeler sayfasına git
          </Link>
        </div>
      </div>
    );
  }

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

      <div className={styles.field}>
        <label className={styles.label} htmlFor="courier-select">
          Kurye seç
        </label>
        <select
          id="courier-select"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setSavedMsg(null);
          }}
          className={styles.select}
        >
          <option value="">Kurye yok / kaldır</option>
          {couriers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.phone ? ` · ${c.phone}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Seçilen kuryenin görsel + telefon önizlemesi */}
      {selected && (
        <div className={styles.courierAvatarCell}>
          {selected.image_url ? (
            <img
              src={selected.image_url}
              alt={selected.name}
              className={styles.courierAvatar}
              loading="lazy"
            />
          ) : (
            <span className={styles.courierAvatarEmpty} aria-hidden>
              {selected.name.trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}
          <div>
            <strong>{selected.name}</strong>
            {selected.phone && (
              <div className={styles.prodMeta}>{selected.phone}</div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={busy}
        className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
      >
        {busy ? "Kaydediliyor…" : "Kaydet"}
      </button>

      {savedMsg && <p className={styles.courierSaved}>{savedMsg}</p>}
      <p className={styles.hint}>
        Kurye atandığında müşteri takip sayfasında &quot;Kuryeniz yolda&quot;
        kartıyla ad ve telefon görünür. &quot;Kurye yok / kaldır&quot; seçilirse
        kurye kaldırılır.
      </p>
    </div>
  );
}
