// Sepet sayfası: server component: mağaza ayarlarını (teslimat ücreti, min sepet),
// auth durumunu ve "Bunları unutma" önerilerini (is_featured ürünler) okuyup
// client CartView'a geçirir. Sipariş vermek üyelik gerektirir; girişsiz
// kullanıcıya CartView'da özet kartı içinde giriş/kayıt bloğu gösterilir.
// Sepet içeriği localStorage/DB'de (CartProvider).

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getShopSettings } from "@/lib/shop/settings";
import type { Product } from "@/lib/shop/types";
import SiteNav from "@/components/SiteNav";
import CartView from "./CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünleri düzenleyin ve siparişinizi tamamlayın.",
  robots: { index: false, follow: false },
};

export default async function SepetPage() {
  const settings = await getShopSettings();

  // Auth durumu server'dan okunur; hata olursa girişsiz varsayılır (sayfa patlamaz).
  let loggedIn = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = user !== null;
  } catch {
    loggedIn = false;
  }

  // "Bunları unutma" önerileri: öne çıkan aktif ürünler (anon client).
  // 8 tane çekilir; CartView sepette olanları eleyip ilk 4'ünü gösterir.
  // DB hazır değilse boş liste ile devam edilir (bölüm gizlenir).
  let featured: Product[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .eq("in_stock", true)
      .order("sort", { ascending: true })
      .order("name", { ascending: true })
      .limit(8);
    if (!error && data) featured = data as Product[];
  } catch {
    featured = [];
  }

  return (
    <>
      <SiteNav />
      <CartView
        loggedIn={loggedIn}
        deliveryFee={settings.delivery_fee}
        freeDeliveryOver={settings.free_delivery_over}
        minOrderTotal={settings.min_order_total}
        orderingOpen={settings.ordering_open}
        closedMessage={settings.closed_message}
        featured={featured}
      />
    </>
  );
}
