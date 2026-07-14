// Canlı Destek sayfası (/destek) — mobil/tablette FAB buraya yönlendirir.
// Tam sayfa, işlevsel sohbet (ChatCore variant="page"). SiteNav + footer.

import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ChatCore from "@/components/ChatWidget/ChatCore";
import styles from "./destek.module.css";

export const metadata: Metadata = {
  title: "Canlı Destek",
  description:
    "Yeni Mahalle Market canlı destek. Sipariş, teslimat ve ürün sorularınızı yazın, en kısa sürede dönelim.",
  alternates: { canonical: "/destek" },
  robots: { index: false, follow: false },
};

export default function DestekPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className="container">
          <div className={styles.wrap}>
            <ChatCore variant="page" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
