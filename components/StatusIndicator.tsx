"use client";

import { useEffect, useState } from "react";

const OPEN_MIN = 7 * 60 + 30; // 07:30
const CLOSE_MIN = 2 * 60;     // 02:00 (ertesi gün — gece yarısını aşar)

/** Istanbul saatine göre dakika cinsinden şu an. */
function istanbulMinutes(): number {
  const parts = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return h * 60 + m;
}

export default function StatusIndicator() {
  // Sunucu/ilk render ile uyum için başlangıçta null; mount sonrası hesapla.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(istanbulMinutes());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Gece yarısını aşan mesai: 07:30'dan sonra AÇIK ya da 02:00'dan önce AÇIK.
  const open = now !== null && (now >= OPEN_MIN || now < CLOSE_MIN);

  // Mount öncesi nötr durum (yanıp sönmeyi engelle)
  const label = now === null ? "07:30 - 02:00 arası açık" : open ? "Şu an açık" : "Şu an kapalı";
  const detail =
    now === null
      ? null
      : open
        ? "02:00'a kadar sipariş alıyoruz"
        : "07:30'da tekrar açılıyoruz";

  return (
    <div
      className={`status${open ? " status--open" : now === null ? "" : " status--closed"}`}
      role="status"
      aria-live="polite"
    >
      <span className="status__dot" aria-hidden="true" />
      <span className="status__label">{label}</span>
      {detail && (
        <>
          <span className="status__sep" aria-hidden="true" />
          <span className="status__detail">{detail}</span>
        </>
      )}
    </div>
  );
}
