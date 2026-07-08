"use client";

// Kurye tarafı: tarayıcı GPS'ini izleyip konumu sunucuya yazar.
// watchPosition ile arka planda güncel tutar; kurye durdurana kadar sürer.

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { updateCourierLocation } from "@/lib/shop/courier-tracking";
import styles from "./kurye.module.css";

type ShareState = "idle" | "starting" | "sharing" | "error";

export default function CourierShare({
  orderNo,
  token,
}: {
  orderNo: string;
  token: string;
}) {
  const [state, setState] = useState<ShareState>("idle");
  const [message, setMessage] = useState<string>("");
  const [lastAt, setLastAt] = useState<string>("");
  const watchId = useRef<number | null>(null);
  // Aynı anda birden fazla yazma gitmesin.
  const sending = useRef(false);

  const stop = useCallback(() => {
    if (watchId.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  // Sayfa kapanınca izlemeyi bırak.
  useEffect(() => stop, [stop]);

  const push = useCallback(
    async (lat: number, lng: number) => {
      if (sending.current) return;
      sending.current = true;
      try {
        const res = await updateCourierLocation(orderNo, token, lat, lng);
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
    },
    [orderNo, token],
  );

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState("error");
      setMessage("Bu cihaz konum paylaşımını desteklemiyor.");
      return;
    }
    setState("starting");
    setMessage("");
    // Önce tek atış — hızlı geri bildirim, izin isteği.
    navigator.geolocation.getCurrentPosition(
      (pos) => push(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setState("error");
        setMessage(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni verilmedi. Tarayıcı ayarlarından izin verin."
            : "Konum alınamadı. Açık alanda tekrar deneyin.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
    // Sürekli izleme.
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

  const isSharing = state === "sharing" || state === "starting";

  return (
    <div className={styles.share}>
      {!isSharing ? (
        <button type="button" className={styles.startBtn} onClick={start}>
          <MapPin aria-hidden="true" /> Konumu paylaşmaya başla
        </button>
      ) : (
        <button type="button" className={styles.stopBtn} onClick={handleStop}>
          Paylaşımı durdur
        </button>
      )}

      {state === "starting" && (
        <p className={styles.status}>
          <Loader2 className={styles.spin} aria-hidden="true" /> Konum alınıyor…
        </p>
      )}
      {state === "sharing" && (
        <p className={`${styles.status} ${styles.statusOk}`}>
          <CheckCircle2 aria-hidden="true" /> Canlı paylaşılıyor
          {lastAt ? ` · son güncelleme ${lastAt}` : ""}
        </p>
      )}
      {state === "error" && message && (
        <p className={`${styles.status} ${styles.statusErr}`}>{message}</p>
      )}
      {state === "idle" && message && (
        <p className={styles.status}>{message}</p>
      )}

      <p className={styles.hint}>
        Müşteri, siparişini takip ederken konumunuzu haritada görür. Teslimat
        bitince paylaşımı durdurabilirsiniz.
      </p>
    </div>
  );
}
