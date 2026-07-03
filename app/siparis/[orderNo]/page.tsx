// Sipariş takip sayfası — /siparis/[orderNo]
// Giriş yapmış kullanıcı kendi siparişini RLS ile direkt görür;
// misafir için telefon doğrulama formu (GuestTracking) gösterilir.
// ?yeni=1 → "sipariş alındı" banner'ı, ?odeme=ok|hata → iyzico dönüş banner'ı.

import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, PartyPopper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS } from "@/lib/business";
import type { Order, OrderEvent, OrderItem } from "@/lib/shop/types";
import OrderDetails from "./OrderDetails";
import GuestTracking from "./GuestTracking";
import TrackingPoller from "./TrackingPoller";
import styles from "./siparis.module.css";

export const metadata: Metadata = {
  title: "Sipariş Takibi",
  robots: { index: false, follow: false },
};

type OrderWithRelations = Order & {
  order_items: OrderItem[];
  order_events: OrderEvent[];
};

export default async function OrderTrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { orderNo: rawOrderNo } = await params;
  const sp = await searchParams;

  const orderNo = decodeURIComponent(rawOrderNo).trim().toUpperCase();
  const odeme = typeof sp.odeme === "string" ? sp.odeme : undefined;
  const isNew = sp.yeni === "1";

  // Giriş yapmış kullanıcı: RLS sayesinde yalnız kendi siparişi döner.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let owned: OrderWithRelations | null = null;
  if (user) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*), order_events(*)")
      .eq("order_no", orderNo)
      .maybeSingle();
    owned = (data as OrderWithRelations | null) ?? null;
  }

  const events = owned
    ? [...owned.order_events].sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      )
    : [];
  const isActive =
    owned !== null &&
    owned.status !== "delivered" &&
    owned.status !== "cancelled";

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          Yeni Mahalle Market
        </Link>
        <nav className={styles.topLinks} aria-label="Sayfa bağlantıları">
          <Link href="/urunler">Ürünler</Link>
          <Link href="/hesap">Hesabım</Link>
        </nav>
      </header>

      <div className={styles.container}>
        {/* Banner'lar */}
        {isNew && (
          <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
            <PartyPopper aria-hidden="true" />
            <p>
              <strong>Siparişiniz alındı 🎉</strong> Sipariş numaranız{" "}
              <b>{orderNo}</b> — durumunu bu sayfadan takip edebilirsiniz.
            </p>
          </div>
        )}
        {odeme === "ok" && (
          <div className={`${styles.banner} ${styles.bannerSuccess}`} role="status">
            <CheckCircle2 aria-hidden="true" />
            <p>
              <strong>Ödemeniz alındı.</strong> Siparişiniz en kısa sürede
              hazırlanmaya başlayacak.
            </p>
          </div>
        )}
        {odeme === "hata" && (
          <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
            <AlertTriangle aria-hidden="true" />
            <p>
              <strong>Ödeme tamamlanamadı.</strong> Kartınızdan çekim yapılmadı.
              Bizi arayarak veya WhatsApp&apos;tan yazarak yardım alabilirsiniz.
            </p>
          </div>
        )}

        {owned ? (
          <>
            <OrderDetails
              order={owned}
              items={owned.order_items}
              events={events}
            />
            <TrackingPoller active={isActive} />
          </>
        ) : (
          <GuestTracking orderNo={orderNo} />
        )}

        <p className={styles.helpLine}>
          Bir sorun mu var?{" "}
          <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a> numarasından bize
          ulaşabilirsiniz.
        </p>
      </div>
    </main>
  );
}
