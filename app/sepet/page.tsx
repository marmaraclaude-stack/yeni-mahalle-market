// Sepet sayfası — server component: mağaza ayarlarını (teslimat ücreti, min sepet)
// ve auth durumunu okuyup client CartView'a geçirir. Sipariş vermek üyelik
// gerektirir; girişsiz kullanıcıya CartView'da bilgilendirme notu gösterilir.
// Sepet içeriği localStorage'da (CartProvider).

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getShopSettings } from "@/lib/shop/settings";
import SiteNav from "@/components/SiteNav";
import CartView from "./CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünleri düzenleyin ve siparişinizi tamamlayın.",
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
      />
    </>
  );
}
