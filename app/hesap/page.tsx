// Hesabım: /hesap
// Server component: oturum yoksa /giris'e yönlendirir. Profil bilgisi +
// kendi siparişleri (RLS ile anon server client) + çıkış butonu.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Phone, ShoppingBasket, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  formatTL,
  type CustomerProfile,
  type OrderStatus,
  type PaymentMethod,
} from "@/lib/shop/types";
import SiteNav from "@/components/SiteNav";
import LogoutButton from "./LogoutButton";
import styles from "./hesap.module.css";

export const metadata: Metadata = {
  title: "Hesabım",
  robots: { index: false, follow: false },
};

/** Sipariş listesi için daraltılmış satır tipi. */
interface OrderRow {
  id: string;
  order_no: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total: number;
  created_at: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Her sipariş durumu için ayrı renk rozeti. */
function statusClass(status: OrderStatus): string {
  switch (status) {
    case "new":
      return styles.stNew;
    case "confirmed":
      return styles.stConfirmed;
    case "preparing":
      return styles.stPreparing;
    case "on_the_way":
      return styles.stOnTheWay;
    case "delivered":
      return styles.stDone;
    case "cancelled":
      return styles.stCancelled;
  }
}

export default async function HesapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris?next=/hesap");
  }

  // Profil + siparişler: RLS yalnız kullanıcının kendi satırlarını döndürür.
  const [profileRes, ordersRes] = await Promise.all([
    supabase
      .from("customer_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("id, order_no, status, payment_method, total, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const profile = (profileRes.data as CustomerProfile | null) ?? null;
  const orders = (ordersRes.data ?? []) as OrderRow[];

  const displayName = profile?.full_name || user.email || "Müşteri";

  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className={`container ${styles.container}`}>
        {/* Profil kartı */}
        <section className={styles.profileCard} aria-label="Profil bilgileri">
          <div className={styles.avatar} aria-hidden="true">
            <User />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.eyebrow}>Hesabım</span>
            <h1 className={styles.name}>{displayName}</h1>
            <p className={styles.meta}>
              {user.email}
              {profile?.phone && (
                <>
                  {" · "}
                  <Phone aria-hidden="true" /> {profile.phone}
                </>
              )}
            </p>
          </div>
          <LogoutButton />
        </section>

        {/* Sipariş listesi */}
        <section className={styles.card} aria-label="Siparişlerim">
          <h2 className={styles.cardTitle}>
            <ShoppingBasket aria-hidden="true" /> Siparişlerim
          </h2>

          {orders.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <ShoppingBasket />
              </span>
              <p className={styles.emptyTitle}>Henüz bir siparişin yok</p>
              <p>
                İlk siparişini ver, Sapanca içinde kapına getirelim. Verdiğin
                siparişleri burada takip edebilirsin.
              </p>
              <Link href="/urunler" className="btn btn--accent">
                Alışverişe başla
              </Link>
            </div>
          ) : (
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/siparis/${order.order_no}`}
                    className={styles.orderRow}
                  >
                    <div className={styles.orderMain}>
                      <span className={styles.orderNo}>{order.order_no}</span>
                      <span className={styles.orderDate}>
                        {formatDate(order.created_at)} ·{" "}
                        {PAYMENT_METHOD_LABELS[order.payment_method]}
                      </span>
                    </div>
                    <div className={styles.orderSide}>
                      <span
                        className={`${styles.statusChip} ${statusClass(order.status)}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className={styles.orderTotal}>
                        {formatTL(order.total)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        </div>
      </main>
    </>
  );
}
