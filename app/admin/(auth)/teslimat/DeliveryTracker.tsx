"use client";

// Teslimat merkezi (kurye bazlı). Bölümler:
//  1) Bu cihazdan paylaş — owner teslimattaysa kurye seçip GPS paylaşır
//  2) Canlı harita — seçili kuryenin son konumu (API anahtarsız embed)
//  3) Aktif teslimatlar — sipariş kartları (ara, yol tarifi, haritada gör)
//  4) Kurye takip cihazları — her kuryenin KALICI motor linki (kopyala/aç)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Radio,
} from "lucide-react";
import {
  adminShareLocation,
  listOnTheWayOrders,
  type DeliveryOrder,
} from "@/lib/shop/admin-actions";
import styles from "../../admin.module.css";

interface CourierBase {
  id: string;
  name: string;
  phone: string;
  ingestUrl: string;
}

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
function mapsEmbed(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
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
  const [mapCourier, setMapCourier] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);
  const sending = useRef(false);

  // Sipariş listesini periyodik tazele (yeni "Kurye Yolda" + konum güncellensin).
  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const fresh = await listOnTheWayOrders();
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

  // Kurye başına istatistik (sipariş sayısı + son konum) — listeden türetilir.
  const stats = useMemo(() => {
    return couriers.map((c) => {
      const mine = last10(c.phone);
      const my = list.filter(
        (o) => mine.length === 10 && last10(o.courier_phone) === mine,
      );
      let lastLoc: string | null = null;
      let lat: number | null = null;
      let lng: number | null = null;
      for (const o of my) {
        if (
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
      return { ...c, activeCount: my.length, lastLoc, lat, lng };
    });
  }, [couriers, list]);

  // Harita: seçili kurye yoksa konumu olan ilk kuryeyi seç.
  const mapTarget =
    stats.find((s) => s.id === mapCourier && s.lat != null) ??
    stats.find((s) => s.lat != null) ??
    null;

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

  return (
    <div className={styles.deliveryWrap}>
      {/* 1) Bu cihazdan paylaş */}
      <section className={styles.deliveryShare}>
        <div className={styles.deliveryShareHead}>
          <span className={styles.deliveryShareIcon} aria-hidden>
            <Navigation size={20} />
          </span>
          <div>
            <strong>Bu cihazdan konum paylaş</strong>
            <p>Owner/teslimatçı bu telefonun GPS&apos;ini paylaşır.</p>
          </div>
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
              <MapPin size={16} /> Paylaşmaya başla
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
      </section>

      {/* 2) Canlı harita */}
      {stats.length > 0 && (
        <section className={styles.deliveryMapCard}>
          <div className={styles.deliveryMapHead}>
            <h2 className={styles.panelTitle} style={{ margin: 0 }}>
              <MapPin size={16} aria-hidden style={{ verticalAlign: "-3px" }} />{" "}
              Canlı harita
            </h2>
            <div className={styles.deliveryTabs}>
              {stats.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setMapCourier(s.id)}
                  className={`${styles.deliveryTab} ${
                    mapTarget?.id === s.id ? styles.deliveryTabOn : ""
                  }`}
                >
                  <Bike size={13} /> {s.name}
                  <span
                    className={`${styles.deliveryLive} ${
                      s.lat != null ? styles.deliveryLiveOn : ""
                    }`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>
          {mapTarget && mapTarget.lat != null && mapTarget.lng != null ? (
            <>
              <div className={styles.deliveryMapFrame}>
                <iframe
                  key={`${mapTarget.id}-${mapTarget.lastLoc}`}
                  title={`${mapTarget.name} konumu`}
                  src={mapsEmbed(mapTarget.lat, mapTarget.lng)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className={styles.deliveryMapMeta}>
                <b>{mapTarget.name}</b> · güncellendi {agoText(mapTarget.lastLoc)}{" "}
                ·{" "}
                <a
                  href={mapsAt(mapTarget.lat, mapTarget.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps&apos;te aç
                </a>
              </p>
            </>
          ) : (
            <div className={styles.deliveryMapEmpty}>
              Henüz konum yok. Kuryenin motor cihazı veya telefonu konum
              gönderince burada canlı harita belirir.
            </div>
          )}
        </section>
      )}

      {/* 3) Aktif teslimatlar */}
      <h2 className={styles.panelTitle} style={{ marginTop: 24 }}>
        <Package size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Aktif
        teslimatlar ({list.length})
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
                {o.address_note && (
                  <p className={styles.deliveryCourier}>Not: {o.address_note}</p>
                )}
                {o.courier_name && (
                  <p className={styles.deliveryCourier}>
                    Kurye: {o.courier_name}
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

      {/* 4) Kurye takip cihazları (kalıcı motor linkleri) */}
      <h2 className={styles.panelTitle} style={{ marginTop: 24 }}>
        <Radio size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Kurye
        takip cihazları
      </h2>
      {stats.length === 0 ? (
        <div className={styles.empty}>
          Aktif kurye yok. Kuryeler sayfasından kurye ekleyin; her kuryeye özel
          motor takip linki burada görünür.
        </div>
      ) : (
        <div className={styles.deliveryList}>
          {stats.map((s) => (
            <div key={s.id} className={styles.deliveryDeviceCard}>
              <div className={styles.deliveryCardTop}>
                <span className={styles.deliveryOrderNo}>
                  <Bike size={14} style={{ verticalAlign: "-2px" }} /> {s.name}
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
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  {copiedId === s.id ? <Check size={15} /> : <Copy size={15} />}
                  {copiedId === s.id ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
            </div>
          ))}
          <p className={styles.deliveryDeviceNote}>
            Bu linki kuryenin motoruna takılı SIM&apos;li GPS cihazına ya da
            telefon uygulamasına (Android: GPSLogger, iOS/Android: Owntracks)
            girin. Cihaz <b>{"{LAT}"}</b> ve <b>{"{LNG}"}</b> yerine gerçek
            konumu koyar; konum yalnız o kuryenin siparişlerine işlenir. Sipariş{" "}
            <b>Teslim Edildi</b> olunca takip otomatik kapanır.{" "}
            <b>Not:</b> AirTag çalışmaz (GPS/genel API yok); SIM&apos;li GPS
            takip cihazı gerekir.
          </p>
        </div>
      )}
    </div>
  );
}
