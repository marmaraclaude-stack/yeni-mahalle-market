"use client";

// Teslimat konum paylaşımı — admin cihazının GPS'ini "Kurye Yolda" siparişlere
// yazar (watchPosition). Sipariş listesi 30 sn'de bir tazelenir.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Package,
} from "lucide-react";
import {
  adminShareLocation,
  listOnTheWayOrders,
  type DeliveryOrder,
} from "@/lib/shop/admin-actions";
import styles from "../../admin.module.css";

type ShareState = "idle" | "starting" | "sharing" | "error";

function agoText(iso: string | null): string {
  if (!iso) return "konum yok";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins <= 0) return "az önce";
  if (mins === 1) return "1 dk önce";
  return `${mins} dk önce`;
}

export default function DeliveryTracker({
  orders,
}: {
  orders: DeliveryOrder[];
}) {
  const router = useRouter();
  const [list, setList] = useState(orders);
  const [state, setState] = useState<ShareState>("idle");
  const [message, setMessage] = useState("");
  const [lastAt, setLastAt] = useState("");
  const watchId = useRef<number | null>(null);
  const sending = useRef(false);

  const stop = useCallback(() => {
    if (watchId.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);
  useEffect(() => stop, [stop]);

  // Liste tazeleme (yeni "Kurye Yolda" siparişler görünsün).
  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const fresh = await listOnTheWayOrders();
        if (!cancelled) setList(fresh);
      } catch {
        /* yut */
      }
    }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const push = useCallback(
    async (lat: number, lng: number) => {
      if (sending.current) return;
      sending.current = true;
      try {
        const res = await adminShareLocation(lat, lng);
        if (res.ok) {
          setState("sharing");
          setLastAt(
            new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          );
          setMessage(
            res.count === 0
              ? "Konum alındı ama şu an 'Kurye Yolda' sipariş yok."
              : "",
          );
          try {
            setList(await listOnTheWayOrders());
          } catch {
            /* yut */
          }
        } else {
          setState("error");
          setMessage(res.error ?? "Konum gönderilemedi.");
        }
      } catch {
        setState("error");
        setMessage("Bağlantı hatası. İnternetinizi kontrol edin.");
      } finally {
        sending.current = false;
      }
    },
    [],
  );

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState("error");
      setMessage("Bu cihaz konum paylaşımını desteklemiyor.");
      return;
    }
    setState("starting");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => push(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setState("error");
        setMessage(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni verilmedi. Telefon/tarayıcı ayarlarından izin verin."
            : "Konum alınamadı. Açık alanda tekrar deneyin.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => push(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState("error");
          setMessage("Konum izni kapatıldı.");
          stop();
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 },
    );
  }, [push, stop]);

  const handleStop = useCallback(() => {
    stop();
    setState("idle");
    setMessage("Konum paylaşımı durduruldu.");
    router.refresh();
  }, [stop, router]);

  const isSharing = state === "sharing" || state === "starting";

  return (
    <div className={styles.deliveryWrap}>
      <section className={styles.deliveryShare}>
        <div className={styles.deliveryShareHead}>
          <span className={styles.deliveryShareIcon} aria-hidden>
            <Navigation size={20} />
          </span>
          <div>
            <strong>Canlı konum paylaşımı</strong>
            <p>Konumunuz tüm &quot;Kurye Yolda&quot; siparişlere işlenir.</p>
          </div>
        </div>
        {!isSharing ? (
          <button
            type="button"
            onClick={start}
            className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
          >
            <MapPin size={16} /> Konumu paylaşmaya başla
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className={styles.actionBtn}
            style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
          >
            Paylaşımı durdur
          </button>
        )}
        {state === "starting" && (
          <p className={styles.deliveryStatus}>
            <Loader2 className={styles.deliverySpin} /> Konum alınıyor…
          </p>
        )}
        {state === "sharing" && !message && (
          <p className={`${styles.deliveryStatus} ${styles.deliveryOk}`}>
            <CheckCircle2 /> Canlı paylaşılıyor
            {lastAt ? ` · ${lastAt}` : ""}
          </p>
        )}
        {message && (
          <p
            className={`${styles.deliveryStatus} ${
              state === "error" ? styles.deliveryErr : ""
            }`}
          >
            {message}
          </p>
        )}
      </section>

      <h2 className={styles.panelTitle} style={{ marginTop: 22 }}>
        <Package size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Kurye
        Yolda ({list.length})
      </h2>
      {list.length === 0 ? (
        <div className={styles.empty}>
          Şu an &quot;Kurye Yolda&quot; sipariş yok. Bir siparişi &quot;Kurye
          Yolda&quot; yapınca burada görünür.
        </div>
      ) : (
        <div className={styles.deliveryList}>
          {list.map((o) => {
            const has = o.courier_lat != null && o.courier_lng != null;
            return (
              <div key={o.order_no} className={styles.deliveryCard}>
                <div className={styles.deliveryCardTop}>
                  <span className={styles.deliveryOrderNo}>{o.order_no}</span>
                  <span
                    className={`${styles.deliveryDot} ${
                      has ? styles.deliveryDotOn : ""
                    }`}
                  >
                    {has ? `konum ${agoText(o.courier_location_at)}` : "konum yok"}
                  </span>
                </div>
                <p className={styles.deliveryCustomer}>{o.customer_name}</p>
                <p className={styles.deliveryAddr}>{o.address_line}</p>
                {o.courier_name && (
                  <p className={styles.deliveryCourier}>Kurye: {o.courier_name}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
