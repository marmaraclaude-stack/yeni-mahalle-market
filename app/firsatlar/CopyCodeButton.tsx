"use client";

// "Kodu Kopyala" — kupon kodunu panoya kopyalar, kısa süreli "Kopyalandı"
// geri bildirimi gösterir. Fırsatlar sayfasındaki kupon kartlarında kullanılır.

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./firsatlar.module.css";

export default function CopyCodeButton({ code }: { code: string }) {
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
      // Pano izni yoksa sessiz geç; kod metni kartta zaten seçilebilir.
    }
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
