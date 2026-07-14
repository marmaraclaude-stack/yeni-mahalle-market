"use client";

// Sohbet FAB'ı. Masaüstünde (≥1024px) yüzen ChatCore panelini açar;
// mobil/tablette (<1024px) /destek SAYFASINA yönlendirir (kullanıcı isteği:
// küçük ekranlarda tam sayfa, işlevsel sohbet). Sohbet mantığı ChatCore'da.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatCore from "./ChatCore";
import styles from "./chat-widget.module.css";

const DESK_QUERY = "(min-width: 1024px)";

export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  /** Masaüstü mü? (ölçüm client'ta yapılır) */
  const isDesktop = () =>
    typeof window !== "undefined" && window.matchMedia(DESK_QUERY).matches;

  const activate = () => {
    if (isDesktop()) setOpen((v) => !v);
    else router.push("/destek");
  };

  // Ana sayfadaki "Canlı Destek Başlat" butonu bu event'i tetikler.
  useEffect(() => {
    const openChat = () => {
      if (isDesktop()) setOpen(true);
      else router.push("/destek");
    };
    window.addEventListener("ym:open-chat", openChat);
    return () => window.removeEventListener("ym:open-chat", openChat);
  }, [router]);

  return (
    <>
      <button
        type="button"
        className={`${styles.fab}${open ? ` ${styles.fabOpen}` : ""}`}
        onClick={activate}
        aria-label={open ? "Sohbeti kapat" : "Canlı destek"}
        aria-expanded={open}
      >
        <svg
          className={styles.fabIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h8M8 14h5" />
            </>
          )}
        </svg>
      </button>

      {open && <ChatCore variant="widget" onClose={() => setOpen(false)} />}
    </>
  );
}
