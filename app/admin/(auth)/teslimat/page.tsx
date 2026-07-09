// Admin → Teslimat: kurye bazlı canlı takip merkezi.
// - Her kuryeye özel kalıcı motor takip linki (SIM'li GPS cihazı bu linke yazar)
// - Aktif "Kurye Yolda" siparişler (müşteri ara, yol tarifi, haritada gör)
// - Owner teslimat yapıyorsa bu cihazdan konum paylaşımı (kurye seçerek)

import { listOnTheWayOrders, listCouriers } from "@/lib/shop/admin-actions";
import { courierIngestToken } from "@/lib/shop/location-ingest";
import { BUSINESS } from "@/lib/business";
import type { Courier } from "@/lib/shop/types";
import DeliveryTracker from "./DeliveryTracker";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teslimat" };

export default async function DeliveryPage() {
  const orders = await listOnTheWayOrders();

  let activeCouriers: Courier[] = [];
  try {
    const r = await listCouriers();
    if (r.ok) activeCouriers = r.couriers.filter((c) => c.is_active);
  } catch {
    activeCouriers = [];
  }

  const couriers = activeCouriers.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    // Motora takılı GPS cihazının/uygulamanın yazacağı KALICI, kuryeye özel link.
    ingestUrl: `${BUSINESS.url}/api/konum?c=${c.id}&key=${courierIngestToken(
      c.id,
    )}&lat={LAT}&lng={LNG}`,
  }));

  return (
    <>
      <h1 className={styles.title}>Teslimat</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        Kurye bazlı canlı takip. Her kuryenin motoruna takılı GPS cihazı kendi
        linkine konum gönderir; müşteri siparişini canlı haritada izler. Owner
        teslimat yapıyorsa aşağıdan kurye seçip bu cihazdan da paylaşabilir.
      </p>
      <DeliveryTracker orders={orders} couriers={couriers} />
    </>
  );
}
