// Admin → Teslimat: canlı operasyon ekranı.
// Harita pinleri ARAÇLARDAN gelir (GPS cihazı araca takılı; Araçlar sayfası).
// Sağda teslim edilene kadar tüm aktif siparişler; owner isterse bu cihazdan
// kurye seçerek konum paylaşır.

import {
  listActiveDeliveries,
  listCouriers,
  listVehicles,
} from "@/lib/shop/admin-actions";
import type { Courier, Vehicle } from "@/lib/shop/types";
import DeliveryTracker from "./DeliveryTracker";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teslimat" };

export default async function DeliveryPage() {
  const orders = await listActiveDeliveries();

  let couriers: Courier[] = [];
  try {
    const r = await listCouriers();
    if (r.ok) couriers = r.couriers.filter((c) => c.is_active);
  } catch {
    couriers = [];
  }

  let vehicles: Vehicle[] = [];
  try {
    const r = await listVehicles();
    if (r.ok) vehicles = r.vehicles.filter((v) => v.is_active);
  } catch {
    vehicles = [];
  }

  const courierNames = new Map(couriers.map((c) => [c.id, c.name]));

  return (
    <>
      <h1 className={styles.title}>Teslimat</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        Araçların canlı konumu ve teslim edilene kadar tüm aktif siparişler.
        GPS cihaz kurulumu <b>Araçlar</b> sayfasındadır.
      </p>
      <DeliveryTracker
        orders={orders}
        couriers={couriers.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
        }))}
        vehicles={vehicles.map((v) => ({
          id: v.id,
          name: v.name,
          plate: v.plate,
          courierName: v.courier_id ? courierNames.get(v.courier_id) ?? "" : "",
          lat: v.last_lat,
          lng: v.last_lng,
          at: v.last_at,
        }))}
      />
    </>
  );
}
