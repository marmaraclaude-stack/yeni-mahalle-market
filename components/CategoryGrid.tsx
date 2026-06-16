"use client";

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
  type LucideIcon,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";

type Cat = { Icon: LucideIcon; label: string };

// 27 kategori — günlük temeller önce, niş/sezonluk sonra.
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
  return (
    <div className="cats" role="list">
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
  );
}
