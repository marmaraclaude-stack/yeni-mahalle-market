"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BUSINESS } from "@/lib/business";

// Hash linkler "/#..." — /urunler gibi alt sayfalardan da çalışsın.
const LINKS = [
  { label: "Ürünler", href: "/urunler" },
  { label: "Konum", href: "/#konum" },
  { label: "Hizmetler", href: "/#hizmetler" },
  { label: "Yorumlar", href: "/#yorumlar" },
  { label: "İletişim", href: "/#iletisim" },
  { label: "Hesabım", href: "/hesap" },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-3.2-6.4L20 4l-1.4 3.3A8 8 0 0 1 20 12Zm-5.2 2.1-1.3-.5a.7.7 0 0 0-.7.1l-.8.8a5.6 5.6 0 0 1-2.5-2.5l.8-.8a.7.7 0 0 0 .1-.7l-.5-1.3a.7.7 0 0 0-.8-.4l-1.2.3a.7.7 0 0 0-.5.8 6.7 6.7 0 0 0 6 6 .7.7 0 0 0 .8-.5l.3-1.2a.7.7 0 0 0-.4-.8Z" />
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);

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
          <a href="#top" className="brand" aria-label={BUSINESS.name} onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="" width={36} height={36} className="brand__logo" />
            <span className="brand__name">
              <span className="brand__sans">Yeni Mahalle</span>
              <span className="brand__serif">Market</span>
            </span>
          </a>

          <nav className="nav__links" aria-label="Ana menü">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav__link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__cta">
            <a
              href={BUSINESS.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp nav__order"
            >
              <WhatsAppIcon /> Sipariş ver
            </a>
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
            <a key={l.label} href={l.href} className="nav-panel__link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={BUSINESS.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--whatsapp nav-panel__order"
          onClick={() => setOpen(false)}
        >
          <WhatsAppIcon /> WhatsApp&apos;tan sipariş ver
        </a>
      </div>
    </div>
  );
}
