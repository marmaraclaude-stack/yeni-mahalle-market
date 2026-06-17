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

export default function CategoryGrid() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // tam kolon adımı: kart genişliği + gap. Bir sayfa = 2 kolon.
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

  return (
    <>
      <div ref={railRef} className="cats" role="list">
        {CATEGORIES.map((c) => (
          <a
            key={c.label}
            href={BUSINESS.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="cat"
            role="listitem"
          >
            <span className="cat__icon" aria-hidden="true">
              <c.Icon size={24} strokeWidth={1.6} />
            </span>
            <span className="cat__label">{c.label}</span>
          </a>
        ))}
      </div>

      {/* Sadece mobil/tablette görünen kaydırma kontrolleri */}
      <div className="cats__nav" aria-hidden="true">
        <button
          type="button"
          className="cats__arrow"
          aria-label="Önceki kategoriler"
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className="cats__arrow"
          aria-label="Sonraki kategoriler"
          onClick={() => scrollBy(1)}
          disabled={!canNext}
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </>
  );
}
