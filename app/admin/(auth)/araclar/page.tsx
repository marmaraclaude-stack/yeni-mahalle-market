// Admin — Araçlar: motorlar + GPS cihaz entegrasyonu.
// GPS cihazı ARACA takılıdır; kurye ataması buradan değiştirilir. Cihaz,
// araca özel kalıcı linke konum gönderir; konum araçta ve atanmış kuryenin
// "Kurye Yolda" siparişlerinde görünür.

import { listVehicles, listCouriers } from "@/lib/shop/admin-actions";
import { vehicleIngestToken } from "@/lib/shop/location-ingest";
import { BUSINESS } from "@/lib/business";
import type { Courier, Vehicle } from "@/lib/shop/types";
import VehiclesTable from "./VehiclesTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Araçlar" };

export default async function VehiclesPage() {
  let vehicles: Vehicle[] = [];
  let loadError: string | undefined;
  try {
    const r = await listVehicles();
    vehicles = r.vehicles;
    if (!r.ok) loadError = r.error;
  } catch {
    loadError = "Araçlar yüklenemedi.";
  }

  let couriers: Courier[] = [];
  try {
    const r = await listCouriers();
    if (r.ok) couriers = r.couriers.filter((c) => c.is_active);
  } catch {
    couriers = [];
  }

  const rows = vehicles.map((v) => ({
    ...v,
    ingestUrl: `${BUSINESS.url}/api/konum?v=${v.id}&key=${vehicleIngestToken(
      v.id,
    )}&lat={LAT}&lng={LNG}`,
  }));

  return (
    <>
      <h1 className={styles.title}>Araçlar</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        GPS cihazı araca takılıdır; hangi kuryenin hangi motoru kullandığını
        buradan atarsınız. Cihaz, aracın kendi linkine konum gönderir; konum
        atanmış kuryenin yoldaki siparişlerine otomatik işlenir.
      </p>
      {loadError && <p className={styles.formError}>{loadError}</p>}
      <VehiclesTable
        vehicles={rows}
        couriers={couriers.map((c) => ({ id: c.id, name: c.name }))}
      />
    </>
  );
}
