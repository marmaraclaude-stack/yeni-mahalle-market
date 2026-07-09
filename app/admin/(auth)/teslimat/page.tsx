// Admin → Teslimat: "Kurye Yolda" siparişler + tek dokunuşla canlı konum
// paylaşımı. Owner teslimat yaparken bu sayfadan konumu paylaşır; müşteri
// sipariş takibinde haritada görür. Ayrı panel/link gerekmez.

import { listOnTheWayOrders } from "@/lib/shop/admin-actions";
import DeliveryTracker from "./DeliveryTracker";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teslimat" };

export default async function DeliveryPage() {
  const orders = await listOnTheWayOrders();
  return (
    <>
      <h1 className={styles.title}>Teslimat</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        &quot;Kurye Yolda&quot; siparişler burada listelenir. Teslimata çıkan
        kişi bu sayfadan <b>Konumu paylaş</b> derse müşteri siparişini canlı
        haritada takip eder.
      </p>
      <DeliveryTracker orders={orders} />
    </>
  );
}
