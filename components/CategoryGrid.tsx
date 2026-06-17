"use client";

import { useEffect, useRef, useState } from "react";
import {
  Carrot,
  Beef,
  Croissant,
  Milk,
  CupSoda,
  Wheat,
  Soup,
  Droplets,
  Cookie,
  Nut,
  Candy,
  Coffee,
  IceCreamCone,
  Snowflake,
  Citrus,
  SprayCan,
  ScrollText,
  Baby,
  PawPrint,
  Cigarette,
  Flame,
  FlameKindling,
  BatteryCharging,
  Umbrella,
  Sun,
  LifeBuoy,
  Bug,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShoppingBasket,
  Check,
  X,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";

type Cat = { Icon: LucideIcon; label: string; t: number };

// Yumuşak pastel paleti [arka plan, ön plan] — kategori grubuna göre.
const TINTS: [string, string][] = [
  ["#eafaf0", "#159b57"], // 0 yeşil
  ["#fdeceb", "#df513c"], // 1 mercan
  ["#fdf4e1", "#cf8910"], // 2 amber
  ["#eaf1fe", "#2f6fed"], // 3 mavi
  ["#e6f7fb", "#0e93a8"], // 4 cam göbeği
  ["#f2ecfd", "#7a52d6"], // 5 mor
  ["#fdebf3", "#d6489b"], // 6 pembe
  ["#e7f6f2", "#11917a"], // 7 deniz yeşili
];

const CATEGORIES: Cat[] = [
  { Icon: Carrot, label: "Meyve & Sebze", t: 0 },
  { Icon: Beef, label: "Şarküteri & Et", t: 1 },
  { Icon: Croissant, label: "Ekmek & Fırın", t: 2 },
  { Icon: Milk, label: "Süt & Kahvaltılık", t: 3 },
  { Icon: CupSoda, label: "İçecek & Su", t: 4 },
  { Icon: Wheat, label: "Bakliyat & Makarna", t: 2 },
  { Icon: Soup, label: "Konserve & Hazır Yemek", t: 1 },
  { Icon: Droplets, label: "Yağ, Sos & Baharat", t: 7 },
  { Icon: Cookie, label: "Atıştırmalık", t: 5 },
  { Icon: Nut, label: "Cips & Kuruyemiş", t: 2 },
  { Icon: Candy, label: "Çikolata & Şekerleme", t: 6 },
  { Icon: Coffee, label: "Kahve & Çay", t: 1 },
  { Icon: IceCreamCone, label: "Dondurma", t: 4 },
  { Icon: Snowflake, label: "Donuk Gıda", t: 3 },
  { Icon: Citrus, label: "Zeytin & Turşu", t: 0 },
  { Icon: SprayCan, label: "Temizlik & Deterjan", t: 7 },
  { Icon: ScrollText, label: "Kağıt Ürünleri", t: 3 },
  { Icon: Baby, label: "Bebek", t: 6 },
  { Icon: PawPrint, label: "Evcil Hayvan", t: 5 },
  { Icon: Cigarette, label: "Sigara & Tütün", t: 1 },
  { Icon: Flame, label: "Mangal & Kömür", t: 2 },
  { Icon: FlameKindling, label: "Çakmak, Kibrit & Tüp", t: 1 },
  { Icon: BatteryCharging, label: "Şarj Aleti & Pil", t: 3 },
  { Icon: Umbrella, label: "Plaj, Mayo & Terlik", t: 4 },
  { Icon: Sun, label: "Güneş Kremi & Plaj", t: 2 },
  { Icon: LifeBuoy, label: "Şişme Bot & Havuz", t: 4 },
  { Icon: Bug, label: "Sinek & Böcek Kovucu", t: 0 },
];

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CategoryGrid() {
  const railRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLSpanElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [bump, setBump] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const scrollByCol = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".cat");
    const step = card ? card.getBoundingClientRect().width + 10 : el.clientWidth / 2;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Liste boşalınca paneli kapat
  useEffect(() => {
    if (selected.length === 0) setExpanded(false);
  }, [selected.length]);

  // Poşete uçma animasyonu
  const flyToBasket = (iconEl: HTMLElement | null) => {
    const target = basketRef.current;
    if (!iconEl || !target || prefersReduced()) return;
    const a = iconEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const clone = iconEl.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, {
      position: "fixed",
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
      margin: "0",
      zIndex: "80",
      pointerEvents: "none",
      borderRadius: "14px",
    } as CSSStyleDeclaration);
    document.body.appendChild(clone);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = clone.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(0.7)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.2 },
      ],
      { duration: 620, easing: "cubic-bezier(.45,0,.35,1)" },
    );
    anim.onfinish = () => {
      clone.remove();
      setBump((n) => n + 1);
    };
  };

  const toggle = (label: string, cardEl: HTMLButtonElement) => {
    setSelected((prev) => {
      if (prev.includes(label)) return prev.filter((l) => l !== label);
      // ekleme → uç
      flyToBasket(cardEl.querySelector<HTMLElement>(".cat__icon"));
      return [...prev, label];
    });
  };

  const waUrl =
    selected.length > 0
      ? `${BUSINESS.whatsapp.href}?text=${encodeURIComponent(
          "Merhaba, şu kategorilerden sipariş vermek istiyorum:\n" +
            selected.map((s) => "• " + s).join("\n"),
        )}`
      : BUSINESS.whatsapp.href;

  return (
    <>
      <div ref={railRef} className="cats" role="list">
        {CATEGORIES.map((c) => {
          const active = selected.includes(c.label);
          const [bg, fg] = TINTS[c.t];
          return (
            <button
              key={c.label}
              type="button"
              className={`cat${active ? " is-selected" : ""}`}
              aria-pressed={active}
              style={{ "--cat-bg": bg, "--cat-fg": fg } as React.CSSProperties}
              onClick={(e) => toggle(c.label, e.currentTarget)}
            >
              <span className="cat__icon" aria-hidden="true">
                <c.Icon size={24} strokeWidth={1.6} />
              </span>
              <span className="cat__label">{c.label}</span>
              <span className="cat__check" aria-hidden="true">
                <Check size={13} strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      {/* mobil kaydırma kontrolleri */}
      <div className="cats__nav" aria-hidden="true">
        <button
          type="button"
          className="cats__arrow"
          aria-label="Önceki kategoriler"
          onClick={() => scrollByCol(-1)}
          disabled={!canPrev}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className="cats__arrow"
          aria-label="Sonraki kategoriler"
          onClick={() => scrollByCol(1)}
          disabled={!canNext}
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Sepet barı — kategori seçilince belirir */}
      <div
        className={`basket${selected.length ? " is-active" : ""}${expanded ? " is-expanded" : ""}`}
        role="region"
        aria-label="Sipariş listen"
      >
        {/* Yukarı açılan tam liste */}
        <div className="basket__panel" role="list">
          <div className="basket__panel-head">
            <span className="basket__panel-title">Listendeki kategoriler</span>
            <button
              type="button"
              className="basket__panel-close"
              aria-label="Listeyi kapat"
              onClick={() => setExpanded(false)}
            >
              <ChevronDown size={18} strokeWidth={2.2} />
            </button>
          </div>
          <div className="basket__panel-list">
            {selected.map((label) => {
              const cat = CATEGORIES.find((c) => c.label === label);
              const fg = cat ? TINTS[cat.t][1] : "#999";
              return (
                <div className="basket__row" role="listitem" key={label}>
                  <span
                    className="basket__row-dot"
                    style={{ background: fg }}
                    aria-hidden="true"
                  />
                  <span className="basket__row-label">{label}</span>
                  <button
                    type="button"
                    className="basket__row-remove"
                    aria-label={`${label} çıkar`}
                    onClick={() => setSelected((p) => p.filter((l) => l !== label))}
                  >
                    <X size={15} strokeWidth={2.2} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="basket__bar">
          <span
            ref={basketRef}
            className={`basket__icon${bump ? " bump" : ""}`}
            key={bump}
            aria-hidden="true"
          >
            <ShoppingBasket size={20} strokeWidth={2} />
            <span className="basket__count">{selected.length}</span>
          </span>

          <button
            type="button"
            className="basket__meta"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <span className="basket__meta-title">
              {selected.length === 1 ? "1 kategori" : `${selected.length} kategori`}
            </span>
            <span className="basket__meta-sub">
              {expanded ? "kapat" : "listeni gör"}
              <ChevronUp size={13} strokeWidth={2.4} className="basket__meta-chev" />
            </span>
          </button>

          {/* Mini renk önizlemesi — ilk 4 kategorinin tonu */}
          {selected.length > 0 && (
            <span className="basket__preview" aria-hidden="true">
              {selected.slice(0, 4).map((label) => {
                const cat = CATEGORIES.find((c) => c.label === label);
                const fg = cat ? TINTS[cat.t][1] : "#fff";
                return (
                  <span
                    key={label}
                    className="basket__preview-dot"
                    style={{ background: fg }}
                  />
                );
              })}
              {selected.length > 4 && (
                <span className="basket__preview-more">
                  +{selected.length - 4}
                </span>
              )}
            </span>
          )}

          <span className="basket__divider" aria-hidden="true" />

          <button
            type="button"
            className="basket__clear"
            aria-label="Listeyi temizle"
            onClick={() => {
              setSelected([]);
              setExpanded(false);
            }}
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp basket__send"
          >
            WhatsApp&apos;tan gönder
          </a>
        </div>
      </div>
    </>
  );
}
