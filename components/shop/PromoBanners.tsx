// Kampanya banner'ları — Getir/Trendyol kalıbı. Server komponent: banners
// tablosunu ANON client ile çeker (is_active=true, sort asc). Tablo yoksa,
// sorgu hata verirse ya da hiç aktif banner yoksa null döner (site patlamaz).
// Görünümü BannerCarousel (client) çizer: 6 sn otomatik kayma, tam
// genişlik tek kart scroll-snap düzeni (peek yok), ok butonları
// (masaüstü), nokta göstergeleri, reduced-motion desteği.
// variant: "home" → kendi section--tight + container kabuğu (ana sayfa);
//          "catalog" → kabuksuz blok (/urunler başlığı ile katalog arası).

import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/lib/shop/types";
import BannerCarousel from "@/components/shop/BannerCarousel";
import styles from "@/components/shop/PromoBanners.module.css";

export default async function PromoBanners({
  variant = "catalog",
}: {
  variant?: "home" | "catalog";
}) {
  let banners: Banner[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });

    // Tablo henüz oluşturulmadıysa (migration atılmadı) sessizce kaybol.
    if (error) return null;
    banners = (data ?? []) as Banner[];
  } catch {
    return null;
  }

  if (banners.length === 0) return null;

  if (variant === "home") {
    // Ana sayfa: hero stat kartları ile banner arasındaki ritmi dengeler
    // (homeSection). >=1024px'te homeWrap container sınırını aşıp full-bleed
    // olur; <1024px'te container gibi davranır (globals.css .container kopyası).
    return (
      <section className={styles.homeSection} aria-label="Kampanyalar">
        <div className={styles.homeWrap}>
          <BannerCarousel banners={banners} variant="home" />
        </div>
      </section>
    );
  }

  return (
    <div className={styles.catalogWrap}>
      <BannerCarousel banners={banners} variant="catalog" />
    </div>
  );
}
