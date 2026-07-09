// Admin → Teslimat: "Kurye Yolda" siparişler + tek dokunuşla canlı konum
// paylaşımı. Owner teslimat yaparken bu sayfadan konumu paylaşır; müşteri
// sipariş takibinde haritada görür. Ayrı panel/link gerekmez.

import { listOnTheWayOrders } from "@/lib/shop/admin-actions";
import { ingestToken } from "@/lib/shop/location-ingest";
import { BUSINESS } from "@/lib/business";
import DeliveryTracker from "./DeliveryTracker";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teslimat" };

export default async function DeliveryPage() {
  const orders = await listOnTheWayOrders();
  // Motora takılı GPS cihazı / telefon uygulaması için sabit konum alım linki.
  const ingestUrl = `${BUSINESS.url}/api/konum?key=${ingestToken()}&lat={LAT}&lng={LNG}`;
  return (
    <>
      <h1 className={styles.title}>Teslimat</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        &quot;Kurye Yolda&quot; siparişler burada listelenir. Teslimata çıkan
        kişi bu sayfadan <b>Konumu paylaş</b> derse müşteri siparişini canlı
        haritada takip eder.
      </p>
      <DeliveryTracker orders={orders} ingestUrl={ingestUrl} />
    </>
  );
}
