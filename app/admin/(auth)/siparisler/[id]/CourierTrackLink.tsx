"use client";

// Admin: kuryeye verilecek tokenli konum paylaşım linki + kopyala butonu.
// Kurye bu linki telefonunda açıp GPS paylaşır; müşteri canlı haritada görür.

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import styles from "../../../admin.module.css";

export default function CourierTrackLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // pano erişimi yoksa sessizce geç — link zaten görünür
    }
  };

  return (
    <div className={styles.courierLinkBox}>
      <p className={styles.courierLinkHint}>
        Bu linki kuryeye gönderin. Kurye açıp <b>“Konumu paylaş”</b> derse
        müşteri siparişini canlı takip eder.
      </p>
      <div className={styles.courierLinkRow}>
        <input
          type="text"
          readOnly
          value={url}
          className={styles.courierLinkInput}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          onClick={copy}
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionBtn}
        >
          <ExternalLink size={15} /> Aç
        </a>
      </div>
    </div>
  );
}
