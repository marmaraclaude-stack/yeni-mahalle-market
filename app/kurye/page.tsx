// Kurye giriş paneli — /kurye
// Kurye telefon + kod ile giriş yapar; tek girişle kendine atanmış tüm aktif
// siparişleri görür ve konumunu paylaşır. Her sipariş için ayrı link gerekmez.

import type { Metadata } from "next";
import { getSessionCourier } from "@/lib/shop/courier-auth";
import { getCourierActiveOrders } from "@/lib/shop/courier-tracking";
import CourierLogin from "./CourierLogin";
import CourierDashboard from "./CourierDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kurye Paneli",
  robots: { index: false, follow: false },
};

export default async function CourierPanelPage() {
  const courier = await getSessionCourier();
  if (!courier) return <CourierLogin />;
  const orders = await getCourierActiveOrders();
  return <CourierDashboard courierName={courier.name} orders={orders} />;
}
