"use client";

// Kurye paneli — atanmış aktif siparişler + tek dokunuşla canlı konum paylaşımı.
// watchPosition ile GPS izlenir; konum kuryenin TÜM aktif siparişlerine yazılır.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  CheckCircle2,
  Loader2,
  LogOut,
  MapPin,
  Package,
} from "lucide-react";
import { logoutCourier } from "@/lib/shop/courier-auth";
import {
  getCourierActiveOrders,
  shareCourierLocation,
  type CourierPanelOrder,
} from "@/lib/shop/courier-tracking";
import styles from "./panel.module.css";

const STATUS_LABELS: Record<string, string> = {
  new: "Sipariş Alındı",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  on_the_way: "Yolda",
};

type ShareState = "idle" | "starting" | "sharing" | "error";

export default function CourierDashboard({
  courierName,
  orders,
}: {
  courierName: string;
  orders: CourierPanelOrder[];
}) {
  const router = useRouter();
  const [state, setState] = useState<ShareState>("idle");
  const [message, setMessage] = useState("");
  const [lastAt, setLastAt] = useState("");
  const [orderList, setOrderList] = useState(orders);
  const watchId = useRef<number | null>(null);
  const sending = useRef(false);

  const stop = useCallback(() => {
    if (watchId.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);
  useEffect(() => stop, [stop]);

  // Yeni sipariş atandıkça panel kendini güncellesin (30 sn'de bir yoklar).
  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const fresh = await getCourierActiveOrders();
        if (!cancelled) setOrderList(fresh);
      } catch {
        // sessizce geç — bir sonraki turda yeniden dener
      }
    }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const push = useCallback(async (lat: number, lng: number) => {
    if (sending.current) return;
    sending.current = true;
    try {
      const res = await shareCourierLocation(lat, lng);
      if (res.ok) {
        setState("sharing");
        setLastAt(
          new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        );
        setMessage("");
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
  }, []);

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
            ? "Konum izni verilmedi. Tarayıcı/telefon ayarlarından izin verin."
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
  }, [stop]);

  async function handleLogout() {
    stop();
    await logoutCourier();
    router.refresh();
  }

  const isSharing = state === "sharing" || state === "starting";

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.dashHead}>
          <span className={styles.logo} aria-hidden="true">
            <Bike />
          </span>
          <div>
            <span className={styles.eyebrow}>Kurye Paneli</span>
            <h1 className={styles.title}>{courierName}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
            aria-label="Çıkış yap"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Konum paylaşımı */}
        <div className={styles.share}>
          {!isSharing ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={start}
              disabled={orderList.length === 0}
            >
              <MapPin size={18} aria-hidden="true" /> Konumu paylaşmaya başla
            </button>
          ) : (
            <button
              type="button"
              className={styles.stopBtn}
              onClick={handleStop}
            >
              Paylaşımı durdur
            </button>
          )}
          {state === "starting" && (
            <p className={styles.status}>
              <Loader2 className={styles.spin} aria-hidden="true" /> Konum
              alınıyor…
            </p>
          )}
          {state === "sharing" && (
            <p className={`${styles.status} ${styles.statusOk}`}>
              <CheckCircle2 aria-hidden="true" /> Canlı paylaşılıyor
              {lastAt ? ` · son güncelleme ${lastAt}` : ""}
            </p>
          )}
          {(state === "error" || state === "idle") && message && (
            <p
              className={`${styles.status} ${
                state === "error" ? styles.statusErr : ""
              }`}
            >
              {message}
            </p>
          )}
          {state === "error" && (
            <div className={styles.permHelp}>
              <strong>Konum açılmıyor mu?</strong>
              <span>
                iPhone: Ayarlar → Gizlilik ve Güvenlik → Konum Servisleri → açık;
                sonra Safari → “Uygulamayı Kullanırken”. Ardından bu sayfayı
                yenileyip tekrar deneyin.
              </span>
              <span>
                Android: Chrome adres çubuğundaki kilit → İzinler → Konum → İzin
                ver.
              </span>
            </div>
          )}
        </div>

        {/* Aktif siparişler */}
        <h2 className={styles.sectionTitle}>
          <Package size={16} aria-hidden="true" /> Götürdüğüm siparişler (
          {orderList.length})
        </h2>
        {orderList.length === 0 ? (
          <p className={styles.muted}>
            Şu an size atanmış aktif sipariş yok. Yeni sipariş atandığında burada
            otomatik görünür.
          </p>
        ) : (
          <ul className={styles.orders}>
            {orderList.map((o) => (
              <li key={o.orderNo} className={styles.order}>
                <div className={styles.orderTop}>
                  <span className={styles.orderNo}>{o.orderNo}</span>
                  <span className={styles.orderStatus}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                </div>
                <p className={styles.orderName}>{o.customerName}</p>
                <p className={styles.orderAddr}>{o.addressLine}</p>
                {o.addressNote && (
                  <p className={styles.orderNote}>Not: {o.addressNote}</p>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    o.addressLine,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dirLink}
                >
                  <MapPin size={14} aria-hidden="true" /> Yol tarifi
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.hint}>
          Konumunuz yalnızca teslim edene kadar, atanmış siparişlerinizin
          müşterilerine gösterilir.
        </p>
      </div>
    </main>
  );
}
