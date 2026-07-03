"use client";

// Site üst menüsü. Linkler: Ana Sayfa, Ürünler, Fırsatlar, İletişim.
// Sağda auth-aware butonlar: girişsizse "Giriş Yap" (ghost) + "Kayıt Ol" (accent),
// girişliyse "Hesabım" (ghost, /hesap). Durum: Supabase browser client +
// onAuthStateChange. Mobil panel aynı linkler + altta aynı auth butonları.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { createClient } from "@/lib/supabase/client";
import styles from "./SiteNav.module.css";

const LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Fırsatlar", href: "/firsatlar" },
  { label: "İletişim", href: "/iletisim" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  // null = henüz bilinmiyor (ilk yükleme) — masaüstünde iskelet gösterilir
  const [authed, setAuthed] = useState<boolean | null>(null);

  // Auth durumu: ilk okuma + oturum değişikliklerini dinle
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setAuthed(Boolean(data.session?.user));
      })
      .catch(() => {
        if (active) setAuthed(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Menü açıkken sayfa kaymasın
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="nav-shell">
      <div className="container">
        <header className="nav" aria-label="Üst menü">
          <Link href="/" className="brand" aria-label={BUSINESS.name} onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="" width={36} height={36} className="brand__logo" />
            <span className="brand__name">
              <span className="brand__sans">Yeni Mahalle</span>
              <span className="brand__serif">Market</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Ana menü">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="nav__link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav__cta">
            <div className={styles.auth}>
              {authed === null ? (
                <span className={styles.authSkeleton} aria-hidden="true" />
              ) : authed ? (
                <Link href="/hesap" className={`btn btn--ghost ${styles.authBtn}`}>
                  <UserRound aria-hidden="true" /> Hesabım
                </Link>
              ) : (
                <>
                  <Link href="/giris" className={`btn btn--ghost ${styles.authBtn}`}>
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" className={`btn btn--accent ${styles.authBtn}`}>
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              className="nav__burger"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobil / tablet — soldan açılan tam sayfa menü */}
      <div className={`nav-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true">
        <div className="nav-panel__top">
          <span className="brand brand--panel">
            <img src="/logo.png" alt="" width={36} height={36} className="brand__logo" />
            <span className="brand__name">
              <span className="brand__sans">Yeni Mahalle</span>
              <span className="brand__serif">Market</span>
            </span>
          </span>
          <button
            type="button"
            className="nav-panel__close"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="nav-panel__links" aria-label="Mobil menü">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="nav-panel__link" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.panelAuth}>
          {authed === null ? null : authed ? (
            <Link
              href="/hesap"
              className={`btn btn--ghost ${styles.panelBtn}`}
              onClick={() => setOpen(false)}
            >
              <UserRound aria-hidden="true" /> Hesabım
            </Link>
          ) : (
            <>
              <Link
                href="/giris"
                className={`btn btn--ghost ${styles.panelBtn}`}
                onClick={() => setOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className={`btn btn--accent ${styles.panelBtn}`}
                onClick={() => setOpen(false)}
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
