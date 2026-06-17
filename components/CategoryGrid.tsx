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
  ShoppingBasket,
  Check,
  X,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";

type Cat = { Icon: LucideIcon; label: string };

const CATEGORIES: Cat[] = [
  { Icon: Carrot, label: "Meyve & Sebze" },
  { Icon: Beef, label: "Şarküteri & Et" },
  { Icon: Croissant, label: "Ekmek & Fırın" },
  { Icon: Milk, label: "Süt & Kahvaltılık" },
  { Icon: CupSoda, label: "İçecek & Su" },
  { Icon: Wheat, label: "Bakliyat & Makarna" },
  { Icon: Soup, label: "Konserve & Hazır Yemek" },
  { Icon: Droplets, label: "Yağ, Sos & Baharat" },
  { Icon: Cookie, label: "Atıştırmalık" },
  { Icon: Nut, label: "Cips & Kuruyemiş" },
  { Icon: Candy, label: "Çikolata & Şekerleme" },
  { Icon: Coffee, label: "Kahve & Çay" },
  { Icon: IceCreamCone, label: "Dondurma" },
  { Icon: Snowflake, label: "Donuk Gıda" },
  { Icon: Citrus, label: "Zeytin & Turşu" },
  { Icon: SprayCan, label: "Temizlik & Deterjan" },
  { Icon: ScrollText, label: "Kağıt Ürünleri" },
  { Icon: Baby, label: "Bebek" },
  { Icon: PawPrint, label: "Evcil Hayvan" },
  { Icon: Cigarette, label: "Sigara & Tütün" },
  { Icon: Flame, label: "Mangal & Kömür" },
  { Icon: FlameKindling, label: "Çakmak, Kibrit & Tüp" },
  { Icon: BatteryCharging, label: "Şarj Aleti & Pil" },
  { Icon: Umbrella, label: "Plaj, Mayo & Terlik" },
  { Icon: Sun, label: "Güneş Kremi & Plaj" },
  { Icon: LifeBuoy, label: "Şişme Bot & Havuz" },
  { Icon: Bug, label: "Sinek & Böcek Kovucu" },
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
          "Merhaba, şu reyonlardan sipariş vermek istiyorum:\n" +
            selected.map((s) => "• " + s).join("\n"),
        )}`
      : BUSINESS.whatsapp.href;

  return (
    <>
      <div ref={railRef} className="cats" role="list">
        {CATEGORIES.map((c) => {
          const active = selected.includes(c.label);
          return (
            <button
              key={c.label}
              type="button"
              className={`cat${active ? " is-selected" : ""}`}
              aria-pressed={active}
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
        className={`basket${selected.length ? " is-active" : ""}`}
        role="region"
        aria-label="Sipariş listen"
      >
        <span
          ref={basketRef}
          className={`basket__icon${bump ? " bump" : ""}`}
          key={bump}
          aria-hidden="true"
        >
          <ShoppingBasket size={20} strokeWidth={2} />
          <span className="basket__count">{selected.length}</span>
        </span>

        <div className="basket__chips">
          {selected.map((label) => (
            <button
              key={label}
              type="button"
              className="basket__chip"
              onClick={() => setSelected((p) => p.filter((l) => l !== label))}
            >
              {label}
              <X size={12} strokeWidth={2.5} />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="basket__clear"
          aria-label="Listeyi temizle"
          onClick={() => setSelected([])}
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
    </>
  );
}
