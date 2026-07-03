// Sepet sayfası — server component: mağaza ayarlarını (teslimat ücreti, min sepet)
// okuyup client CartView'a geçirir. Sepet içeriği localStorage'da (CartProvider).

import type { Metadata } from "next";
import { getShopSettings } from "@/lib/shop/settings";
import CartView from "./CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description: "Sepetinizdeki ürünleri düzenleyin ve siparişinizi tamamlayın.",
};

export default async function SepetPage() {
  const settings = await getShopSettings();

  return (
    <CartView
      deliveryFee={settings.delivery_fee}
      freeDeliveryOver={settings.free_delivery_over}
      minOrderTotal={settings.min_order_total}
      orderingOpen={settings.ordering_open}
      closedMessage={settings.closed_message}
    />
  );
}
