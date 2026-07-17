"use client";

// Teslimat operasyon ekranı.
//  - Üst: özet kutuları + "bu cihazdan paylaş" (kurye seçerek)
//  - Sol: canlı Leaflet haritası — pinler ARAÇLARDAN (renkli, araç+kurye lejantı)
//  - Sağ: teslim edilene kadar tüm aktif siparişler (durum rozetli)
// Cihaz linkleri Araçlar sayfasına taşındı.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
} from "lucide-react";
import {
  adminShareLocation,
  listActiveDeliveries,
  type DeliveryOrder,
} from "@/lib/shop/admin-actions";
import { BUSINESS } from "@/lib/business";
import styles from "../../admin.module.css";

const CourierMap = dynamic(() => import("./CourierMap"), {
  ssr: false,
  loading: () => <div className={styles.deliveryMapEmpty}>Harita yükleniyor…</div>,
});

interface CourierBase {
  id: string;
  name: string;
  phone: string;
}
interface VehiclePin {
  id: string;
  name: string;
  plate: string;
  courierName: string;
  lat: number | null;
  lng: number | null;
  at: string | null;
}

// Araç pin renkleri (haritada + lejantta).
const PALETTE = [
  "#e11d48",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#db2777",
];

const STATUS_LABELS: Record<string, string> = {
  new: "Yeni",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  on_the_way: "Kurye Yolda",
};
const STATUS_PRIORITY: Record<string, number> = {
  on_the_way: 0,
  preparing: 1,
  confirmed: 2,
  new: 3,
};

type ShareState = "idle" | "starting" | "sharing" | "error";

function agoText(iso: string | null): string {
  if (!iso) return "konum yok";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins <= 0) return "az önce";
  if (mins === 1) return "1 dk önce";
  return `${mins} dk önce`;
}
function mapsAt(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
function dirTo(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address,
  )}`;
}

export default function DeliveryTracker({
  orders,
  couriers,
  vehicles,
}: {
  orders: DeliveryOrder[];
  couriers: CourierBase[];
  vehicles: VehiclePin[];
}) {
  const router = useRouter();
  const [list, setList] = useState(orders);
  const [state, setState] = useState<ShareState>("idle");
  const [message, setMessage] = useState("");
  const [lastAt, setLastAt] = useState("");
  const [shareCourier, setShareCourier] = useState(couriers[0]?.id ?? "");
  const watchId = useRef<number | null>(null);
  const sending = useRef(false);

  // Sipariş listesi + araç konumları periyodik tazelensin (router.refresh
  // araç verisini sunucudan yeniden getirir).
  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const fresh = await listActiveDeliveries();
        if (!cancelled) setList(fresh);
        router.refresh();
      } catch {
        /* yut */
      }
    }, 20_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [router]);

  // Renkli araç pinleri (konumu olanlar haritada).
  const colored = useMemo(
    () =>
      vehicles.map((v, i) => ({ ...v, color: PALETTE[i % PALETTE.length] })),
    [vehicles],
  );
  const mapPins = useMemo(
    () =>
      colored
        .filter((v) => v.lat != null && v.lng != null)
        .map((v) => ({
          id: v.id,
          name: v.courierName ? `${v.name} · ${v.courierName}` : v.name,
          lat: v.lat as number,
          lng: v.lng as number,
          color: v.color,
          lastLoc: v.at,
        })),
    [colored],
  );

  const stop = useCallback(() => {
    if (watchId.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);
  useEffect(() => stop, [stop]);

  const push = useCallback(
    async (lat: number, lng: number) => {
      if (sending.current) return;
      sending.current = true;
      try {
        const res = await adminShareLocation(lat, lng, shareCourier || undefined);
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
              ? "Konum alındı; seçili kuryenin yolda siparişi yok."
              : "",
          );
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
    [shareCourier],
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
  const onTheWayCount = list.filter((o) => o.status === "on_the_way").length;
  const liveVehicles = mapPins.length;
  const sorted = useMemo(
    () =>
      [...list].sort(
        (a, b) =>
          (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9),
      ),
    [list],
  );

  return (
    <div className={styles.deliveryWrap}>
      {/* Üst: özet + bu cihazdan paylaş */}
      <div className={styles.deliveryTop}>
        <div className={styles.deliveryStats}>
          <div className={styles.deliveryStat}>
            <span className={styles.deliveryStatNum}>{list.length}</span>
            <span className={styles.deliveryStatLbl}>Aktif sipariş</span>
          </div>
          <div className={styles.deliveryStat}>
            <span className={styles.deliveryStatNum}>{onTheWayCount}</span>
            <span className={styles.deliveryStatLbl}>Yolda</span>
          </div>
          <div className={styles.deliveryStat}>
            <span className={styles.deliveryStatNum}>
              {liveVehicles}
              <span className={styles.deliveryStatSub}>/{vehicles.length}</span>
            </span>
            <span className={styles.deliveryStatLbl}>Canlı araç</span>
          </div>
        </div>

        <div className={styles.deliverySharePane}>
          <div className={styles.deliverySharePaneTop}>
            <Navigation size={15} aria-hidden />
            Bu cihazdan konum paylaş
          </div>
          <div className={styles.deliveryShareRow}>
            <select
              value={shareCourier}
              onChange={(e) => setShareCourier(e.target.value)}
              className={styles.select}
              aria-label="Hangi kurye olarak"
              disabled={isSharing}
            >
              <option value="">Tümü (tüm Kurye Yolda)</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!isSharing ? (
              <button
                type="button"
                onClick={start}
                className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                <MapPin size={16} /> Başla
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className={styles.actionBtn}
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                Durdur
              </button>
            )}
          </div>
          {state === "starting" && (
            <p className={styles.deliveryStatus}>
              <Loader2 className={styles.deliverySpin} /> Konum alınıyor…
            </p>
          )}
          {state === "sharing" && !message && (
            <p className={`${styles.deliveryStatus} ${styles.deliveryOk}`}>
              <CheckCircle2 /> Canlı paylaşılıyor{lastAt ? ` · ${lastAt}` : ""}
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
        </div>
      </div>

      {/* Ana pano: sol harita · sağ liste */}
      <div className={styles.deliveryGrid}>
        <div className={styles.deliveryMapCol}>
          <div className={styles.deliveryMapHead}>
            <h2 className={styles.deliverySectionTitle}>
              <MapPin size={16} aria-hidden /> Canlı harita
            </h2>
            {colored.length > 0 && (
              <div className={styles.deliveryLegend}>
                {colored.map((v) => (
                  <span key={v.id} className={styles.deliveryLegendItem}>
                    <span
                      className={styles.deliveryLegendDot}
                      style={{ background: v.color }}
                      aria-hidden
                    />
                    {v.name}
                    {v.courierName ? ` · ${v.courierName}` : ""}
                    <span
                      className={
                        v.lat != null
                          ? styles.deliveryLegendLive
                          : styles.deliveryLegendOff
                      }
                    >
                      {v.lat != null ? agoText(v.at) : "sinyal yok"}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.deliveryMapBox}>
            <CourierMap
              market={BUSINESS.geo}
              couriers={mapPins}
              orders={list
                .filter((o) => o.courier_lat != null && o.courier_lng != null)
                .map((o) => ({
                  no: o.order_no,
                  customer: o.customer_name,
                  lat: o.courier_lat as number,
                  lng: o.courier_lng as number,
                }))}
            />
          </div>
        </div>

        <div className={styles.deliverySide}>
          <h2 className={styles.deliverySectionTitle}>
            <Package size={16} aria-hidden /> Aktif siparişler ({list.length})
          </h2>
          {list.length === 0 ? (
            <div className={styles.deliverySideEmpty}>
              <Package size={26} aria-hidden />
              <span>Aktif sipariş yok</span>
              <small>
                Yeni sipariş geldiğinde teslim edilene kadar burada görünür.
              </small>
            </div>
          ) : (
            <div className={styles.deliverySideList}>
              {sorted.map((o) => {
                const has =
                  o.status === "on_the_way" &&
                  o.courier_lat != null &&
                  o.courier_lng != null;
                return (
                  <div key={o.order_no} className={styles.deliveryCard}>
                    <div className={styles.deliveryCardTop}>
                      <span className={styles.deliveryOrderNo}>{o.order_no}</span>
                      <span
                        className={`${styles.deliveryBadge} ${
                          styles[`deliveryBadge--${o.status}`] ?? ""
                        }`}
                      >
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                    <p className={styles.deliveryCustomer}>{o.customer_name}</p>
                    <p className={styles.deliveryAddr}>{o.address_line}</p>
                    {o.address_note && (
                      <p className={styles.deliveryCourier}>Not: {o.address_note}</p>
                    )}
                    {o.courier_name && (
                      <p className={styles.deliveryCourier}>
                        Kurye: {o.courier_name}
                      </p>
                    )}
                    {o.status === "on_the_way" && (
                      <p className={styles.deliveryCourier}>
                        <span
                          className={`${styles.deliveryDotInline} ${
                            has ? styles.deliveryDotInlineOn : ""
                          }`}
                          aria-hidden
                        />
                        {has
                          ? `Konum ${agoText(o.courier_location_at)}`
                          : "Konum bekleniyor"}
                      </p>
                    )}
                    <div className={styles.deliveryCardActions}>
                      {o.phone && (
                        <a href={`tel:${o.phone}`} className={styles.deliveryMini}>
                          <Phone size={13} /> Ara
                        </a>
                      )}
                      <a
                        href={dirTo(o.address_line)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.deliveryMini}
                      >
                        <Navigation size={13} /> Yol tarifi
                      </a>
                      {has && (
                        <a
                          href={mapsAt(o.courier_lat!, o.courier_lng!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.deliveryMini}
                        >
                          <MapPin size={13} /> Haritada gör
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
