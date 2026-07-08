"use client";

// Müşteri tarafı: kuryenin canlı konumunu haritada göster.
// getCourierLocation'ı ~12 sn'de bir yoklar; API anahtarı gerektirmeyen
// Google Maps embed iframe kullanır (q=lat,lng&output=embed).

import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { getCourierLocation, type CourierLocation } from "@/lib/shop/courier-tracking";
import styles from "./siparis.module.css";

const POLL_MS = 12_000;

/** Konum zamanını "az önce / 2 dk önce" gibi göster. */
function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins <= 0) return "az önce";
  if (mins === 1) return "1 dakika önce";
  return `${mins} dakika önce`;
}

export default function CourierLiveMap({ orderNo }: { orderNo: string }) {
  const [loc, setLoc] = useState<CourierLocation | null>(null);
  const [waiting, setWaiting] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await getCourierLocation(orderNo);
        if (cancelled) return;
        if (!res.active) {
          setWaiting(false);
          return; // teslim/iptal — polling'i durdur
        }
        if (res.location) setLoc(res.location);
        setWaiting(false);
      } catch {
        // sessizce yut — bir sonraki turda tekrar dener
      }
      if (!cancelled) timer.current = setTimeout(tick, POLL_MS);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [orderNo]);

  if (!loc) {
    return (
      <div className={styles.mapPending}>
        <Navigation aria-hidden="true" />
        <span>
          {waiting
            ? "Kurye konumu alınıyor…"
            : "Kurye yola çıkınca konumu burada canlı göreceksiniz."}
        </span>
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=16&output=embed`;

  return (
    <div className={styles.mapWrap}>
      <div className={styles.mapFrame}>
        <iframe
          title="Kurye konumu"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className={styles.mapMeta}>
        <span className={styles.mapLiveDot} aria-hidden="true" />
        Canlı konum · güncellendi {ago(loc.at)}
      </p>
    </div>
  );
}
