"use client";

// Kupon kodu kopyalama — iki görünüm:
// - "button": kupon kartının altındaki accent "Kodu Kopyala" butonu.
// - "code": kupon kartındaki büyük mono kod alanı; tıklanınca da kopyalar.
// İkisi de kopyalayınca kısa süreli "Kopyalandı" geri bildirimi gösterir.

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./firsatlar.module.css";

type Props = {
  code: string;
  variant?: "button" | "code";
};

export default function CopyCodeButton({ code, variant = "button" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unmount olurken bekleyen zamanlayıcıyı temizle
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Pano izni yoksa sessiz geç; kod bilette zaten okunur durumda.
    }
  }

  if (variant === "code") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`${styles.codeChip}${copied ? ` ${styles.codeChipDone}` : ""}`}
        aria-live="polite"
        aria-label={
          copied ? `${code} kopyalandı` : `${code} kodunu panoya kopyala`
        }
        title="Kopyalamak için tıkla"
      >
        <span className={styles.codeText}>{code}</span>
        <span className={styles.codeHint} aria-hidden="true">
          {copied ? (
            <Check size={14} strokeWidth={2.4} />
          ) : (
            <Copy size={14} strokeWidth={2} />
          )}
          {copied ? "Kopyalandı" : "Kopyalamak için tıkla"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${styles.copyBtn}${copied ? ` ${styles.copyBtnDone}` : ""}`}
      aria-live="polite"
    >
      {copied ? (
        <Check size={15} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <Copy size={15} strokeWidth={2} aria-hidden="true" />
      )}
      {copied ? "Kopyalandı" : "Kodu Kopyala"}
    </button>
  );
}
