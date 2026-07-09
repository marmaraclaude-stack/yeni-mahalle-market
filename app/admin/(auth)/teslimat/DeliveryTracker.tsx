"use client";

// Teslimat merkezi (kurye bazlı). Canlı Leaflet haritası (market + çevresi +
// renkli kurye pinleri), aktif teslimat kartları, owner konum paylaşımı ve
// her kuryeye özel kalıcı motor takip linki.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Radio,
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
  ingestUrl: string;
}

// Kurye pin renkleri (haritada + lejantta).
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

function last10(v: string): string {
  return String(v ?? "").replace(/\D/g, "").slice(-10);
}
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
}: {
  orders: DeliveryOrder[];
  couriers: CourierBase[];
}) {
  const router = useRouter();
  const [list, setList] = useState(orders);
  const [state, setState] = useState<ShareState>("idle");
  const [message, setMessage] = useState("");
  const [lastAt, setLastAt] = useState("");
  const [shareCourier, setShareCourier] = useState(couriers[0]?.id ?? "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);
  const sending = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const fresh = await listActiveDeliveries();
        if (!cancelled) setList(fresh);
      } catch {
        /* yut */
      }
    }, 20_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Kurye başına istatistik + renk (sipariş listesinden türetilir).
  const stats = useMemo(() => {
    return couriers.map((c, i) => {
      const color = PALETTE[i % PALETTE.length];
      const mine = last10(c.phone);
      const my = list.filter(
        (o) => mine.length === 10 && last10(o.courier_phone) === mine,
      );
      let lastLoc: string | null = null;
      let lat: number | null = null;
      let lng: number | null = null;
      for (const o of my) {
        if (
          o.status === "on_the_way" &&
          o.courier_location_at &&
          o.courier_lat != null &&
          o.courier_lng != null &&
          (!lastLoc || o.courier_location_at > lastLoc)
        ) {
          lastLoc = o.courier_location_at;
          lat = o.courier_lat;
          lng = o.courier_lng;
        }
      }
      return { ...c, color, activeCount: my.length, lastLoc, lat, lng };
    });
  }, [couriers, list]);

  const mapCouriers = useMemo(
    () =>
      stats
        .filter((s) => s.lat != null && s.lng != null)
        .map((s) => ({
          id: s.id,
          name: s.name,
          lat: s.lat as number,
          lng: s.lng as number,
          color: s.color,
          lastLoc: s.lastLoc,
        })),
    [stats],
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
              ? "Konum alındı ama seçili kuryenin 'Kurye Yolda' siparişi yok."
              : "",
          );
          try {
            setList(await listActiveDeliveries());
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

  const copy = useCallback((id: string, url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
      })
      .catch(() => undefined);
  }, []);

  const isSharing = state === "sharing" || state === "starting";

  const onTheWayCount = list.filter((o) => o.status === "on_the_way").length;
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
              {mapCouriers.length}
              <span className={styles.deliveryStatSub}>/{stats.length}</span>
            </span>
            <span className={styles.deliveryStatLbl}>Canlı kurye</span>
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
        <section className={styles.deliveryMapCard}>
          <div className={styles.deliveryMapHead}>
            <h2 className={styles.deliveryMapTitle}>
              <MapPin size={18} aria-hidden /> Canlı harita
            </h2>
            {stats.length > 0 && (
              <div className={styles.deliveryLegend}>
                {stats.map((s) => (
                  <span key={s.id} className={styles.deliveryLegendItem}>
                    <span
                      className={styles.deliveryLegendDot}
                      style={{ background: s.color }}
                      aria-hidden
                    />
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.deliveryMapBox}>
            <CourierMap market={BUSINESS.geo} couriers={mapCouriers} />
          </div>
        </section>

        <div className={styles.deliverySide}>
          <h2 className={styles.deliverySectionTitle}>
            <Package size={16} aria-hidden /> Aktif siparişler ({list.length})
          </h2>
          {list.length === 0 ? (
            <div className={styles.deliverySideEmpty}>
              <Package size={26} aria-hidden />
              <span>Aktif sipariş yok</span>
              <small>Yeni sipariş geldiğinde teslim edilene kadar burada görünür.</small>
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
                      <p className={styles.deliveryCourier}>
                        Not: {o.address_note}
                      </p>
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
                        <a
                          href={`tel:${o.phone}`}
                          className={styles.deliveryMini}
                        >
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

          <h2 className={styles.deliverySectionTitle}>
            <Radio size={16} aria-hidden /> Kurye takip cihazları
          </h2>
          {stats.length === 0 ? (
            <div className={styles.empty}>
              Aktif kurye yok. Kuryeler sayfasından ekleyin.
            </div>
          ) : (
            <div className={styles.deliverySideList}>
              {stats.map((s) => (
                <div key={s.id} className={styles.deliveryDeviceCard}>
                  <div className={styles.deliveryCardTop}>
                    <span className={styles.deliveryOrderNo}>
                      <span
                        className={styles.deliveryLegendDot}
                        style={{ background: s.color, marginRight: 6 }}
                        aria-hidden
                      />
                      {s.name}
                    </span>
                    <span
                      className={`${styles.deliveryDot} ${
                        s.lat != null ? styles.deliveryDotOn : ""
                      }`}
                    >
                      {s.lat != null ? agoText(s.lastLoc) : "konum yok"}
                    </span>
                  </div>
                  <p className={styles.deliveryCourier}>
                    {s.activeCount} aktif teslimat · {s.phone || "telefon yok"}
                  </p>
                  <div className={styles.deliveryUrlRow} style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      readOnly
                      value={s.ingestUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className={styles.deliveryUrl}
                      aria-label={`${s.name} motor takip linki`}
                    />
                    <button
                      type="button"
                      onClick={() => copy(s.id, s.ingestUrl)}
                      className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {copiedId === s.id ? (
                        <Check size={15} />
                      ) : (
                        <Copy size={15} />
                      )}
                      {copiedId === s.id ? "Kopyalandı" : "Kopyala"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
