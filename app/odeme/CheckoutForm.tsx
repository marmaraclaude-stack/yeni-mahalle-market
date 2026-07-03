"use client";

// Checkout formu — teslimat bilgileri + ödeme yöntemi seçimi + createOrder action.
// Sayfa yalnız girişli kullanıcıya açılır (page.tsx redirect'i); bilgiler
// profilden ön-dolu gelir ama input'lar düzenlenebilir kalır.
// Kapıda ödeme → /siparis/[orderNo]?yeni=1; iyzico → ödeme sayfasına yönlendirme.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  Banknote,
  CreditCard,
  Lock,
  ShoppingBasket,
  TicketPercent,
} from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { validateCoupon } from "@/lib/shop/coupons";
import { createOrder } from "@/lib/shop/order-actions";
import { formatTL, PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/shop/types";
import styles from "./odeme.module.css";

export interface CheckoutDefaults {
  name: string;
  phone: string;
  address: string;
  addressNote: string;
}

interface CheckoutFormProps {
  defaults: CheckoutDefaults;
  methods: PaymentMethod[];
  deliveryFee: number;
  freeDeliveryOver: number;
  minOrderTotal: number;
  orderingOpen: boolean;
  closedMessage: string;
}

const METHOD_HINTS: Record<PaymentMethod, string> = {
  cod_cash: "Kapıda kuryeye nakit ödersiniz.",
  cod_card: "Kapıda kuryeye kartla ödersiniz.",
  iyzico: "iyzico güvencesiyle şimdi kartla ödersiniz.",
};

function MethodIcon({ method }: { method: PaymentMethod }) {
  if (method === "cod_cash") return <Banknote aria-hidden="true" />;
  if (method === "cod_card") return <CreditCard aria-hidden="true" />;
  return <Lock aria-hidden="true" />;
}

interface AppliedCoupon {
  code: string;
  description: string;
  discount: number;
}

export default function CheckoutForm({
  defaults,
  methods,
  deliveryFee,
  freeDeliveryOver,
  minOrderTotal,
  orderingOpen,
  closedMessage,
}: CheckoutFormProps) {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(methods[0] ?? null);

  // Kupon: input + uygulanan kupon + hata durumu. Sunucu createOrder'da
  // kuponu YENİDEN doğrular; buradaki indirim yalnız gösterim içindir.
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, startCouponTransition] = useTransition();

  // 0 = ücretsiz teslimat eşiği yok — settings.calcDeliveryFee ile aynı kural
  const fee =
    freeDeliveryOver > 0 && subtotal >= freeDeliveryOver ? 0 : deliveryFee;
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const total = Math.max(
    0,
    Math.round((subtotal + fee - discount) * 100) / 100,
  );
  const belowMin = minOrderTotal > 0 && subtotal < minOrderTotal;

  function applyCoupon() {
    const code = couponInput.trim();
    if (!code || couponPending) return;
    setCouponError(null);
    startCouponTransition(async () => {
      const result = await validateCoupon(code, subtotal);
      if (!result.ok) {
        setCoupon(null);
        setCouponError(result.error);
        return;
      }
      setCoupon({
        code: result.code,
        description: result.description,
        discount: result.discount,
      });
      setCouponInput("");
    });
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponError(null);
  }

  // Sipariş vermeye kapalıysa / sepet boşsa form yerine bilgi göster.
  if (!orderingOpen) {
    return (
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <h1 className={styles.title}>Siparişi Tamamla</h1>
          </header>
          <div className={styles.notice} role="status">
            <p>{closedMessage}</p>
            <Link href="/urunler" className="btn btn--ghost">
              Ürünlere Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (lines.length === 0 && !pending) {
    return (
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <h1 className={styles.title}>Siparişi Tamamla</h1>
          </header>
          <div className={styles.notice}>
            <ShoppingBasket aria-hidden="true" className={styles.noticeIcon} />
            <p>Sepetiniz boş. Önce sepete ürün ekleyin.</p>
            <Link href="/urunler" className="btn btn--accent">
              Alışverişe Başla <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);

    if (!method) {
      setError("Bir ödeme yöntemi seçin.");
      return;
    }
    if (belowMin) {
      setError(`Minimum sipariş tutarı ${formatTL(minOrderTotal)}.`);
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      addressLine: String(form.get("addressLine") ?? ""),
      addressNote: String(form.get("addressNote") ?? ""),
      note: String(form.get("note") ?? ""),
      paymentMethod: method,
      lines: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
      couponCode: coupon?.code,
    };

    startTransition(async () => {
      const result = await createOrder(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clear();
      if (result.paymentPageUrl) {
        // iyzico ödeme sayfasına git — dönüşte callback siparişi günceller.
        window.location.assign(result.paymentPageUrl);
      } else {
        router.push(`/siparis/${result.orderNo}?yeni=1`);
      }
    });
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>Siparişi Tamamla</h1>
          <p className={styles.sub}>
            Teslimat bilgilerini doldur, ödeme yöntemini seç, siparişini gönder.
          </p>
        </header>

        <form className={styles.layout} onSubmit={handleSubmit}>
          <div className={styles.formCol}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepNum} aria-hidden="true">
                  1
                </span>
                Teslimat Bilgileri
              </h2>
              {(defaults.name || defaults.phone || defaults.address) && (
                <p className={styles.prefillNote}>
                  Bilgileriniz hesabınızdan dolduruldu, gerekirse düzenleyin.
                </p>
              )}
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label htmlFor="customerName">Ad Soyad *</label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    defaultValue={defaults.name}
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    defaultValue={defaults.phone}
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="addressLine">Teslimat Adresi *</label>
                  <textarea
                    id="addressLine"
                    name="addressLine"
                    required
                    minLength={10}
                    rows={3}
                    autoComplete="street-address"
                    defaultValue={defaults.address}
                    placeholder="Mahalle, cadde/sokak, bina ve daire no · Sapanca"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="addressNote">Adres Notu</label>
                  <input
                    id="addressNote"
                    name="addressNote"
                    type="text"
                    defaultValue={defaults.addressNote}
                    placeholder="Kapı kodu, tarif vb. (isteğe bağlı)"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="note">Sipariş Notu</label>
                  <input
                    id="note"
                    name="note"
                    type="text"
                    placeholder="Örn: poşet istemiyorum (isteğe bağlı)"
                  />
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.stepNum} aria-hidden="true">
                  2
                </span>
                Ödeme Yöntemi
              </h2>
              {methods.length === 0 ? (
                <p className={styles.warn} role="status">
                  Şu an çevrimiçi ödeme yöntemi tanımlı değil. Canlı destekten
                  bize yazabilirsiniz.
                </p>
              ) : (
                <div
                  className={styles.methods}
                  role="radiogroup"
                  aria-label="Ödeme yöntemi"
                >
                  {methods.map((m) => (
                    <label
                      key={m}
                      className={`${styles.method} ${
                        method === m ? styles.methodActive : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m}
                        checked={method === m}
                        onChange={() => setMethod(m)}
                      />
                      <MethodIcon method={m} />
                      <span className={styles.methodText}>
                        <span className={styles.methodName}>
                          {PAYMENT_METHOD_LABELS[m]}
                        </span>
                        <span className={styles.methodHint}>{METHOD_HINTS[m]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className={styles.summary} aria-label="Sipariş özeti">
            <h2 className={styles.cardTitle}>
              <span className={styles.stepNum} aria-hidden="true">
                3
              </span>
              Sipariş Özeti
            </h2>
            <ul className={styles.summaryLines}>
              {lines.map((line) => (
                <li key={line.productId}>
                  <span className={styles.summaryLineName}>
                    {line.qty} × {line.name}
                  </span>
                  <span className={styles.summaryLinePrice}>
                    {formatTL(line.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.coupon}>
              {coupon ? (
                <div className={styles.couponApplied} role="status">
                  <TicketPercent aria-hidden="true" className={styles.couponIcon} />
                  <span className={styles.couponInfo}>
                    <strong>{coupon.code}</strong>
                    {coupon.description && <span>{coupon.description}</span>}
                  </span>
                  <span className={styles.couponAmount}>
                    -{formatTL(discount)}
                  </span>
                  <button
                    type="button"
                    className={styles.couponRemove}
                    onClick={removeCoupon}
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="couponCode" className={styles.couponLabel}>
                    Kupon Kodu
                  </label>
                  <div className={styles.couponRow}>
                    <input
                      id="couponCode"
                      type="text"
                      className={styles.couponInput}
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoupon();
                        }
                      }}
                      placeholder="Kupon kodunuz varsa girin"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={20}
                    />
                    <button
                      type="button"
                      className={styles.couponBtn}
                      onClick={applyCoupon}
                      disabled={couponPending || !couponInput.trim()}
                    >
                      {couponPending ? "Kontrol ediliyor…" : "Uygula"}
                    </button>
                  </div>
                </>
              )}
              {couponError && (
                <p className={styles.couponError} role="alert">
                  {couponError}
                </p>
              )}
            </div>

            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt>Ara Toplam</dt>
                <dd>{formatTL(subtotal)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Teslimat Ücreti</dt>
                <dd>{fee === 0 ? "Ücretsiz" : formatTL(fee)}</dd>
              </div>
              {coupon && discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <dt>İndirim ({coupon.code})</dt>
                  <dd>-{formatTL(discount)}</dd>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <dt>Toplam</dt>
                <dd>{formatTL(total)}</dd>
              </div>
            </dl>

            {belowMin && (
              <p className={styles.warn} role="status">
                Minimum sipariş tutarı {formatTL(minOrderTotal)}. Sepetinize ürün
                ekleyin.
              </p>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`btn btn--accent ${styles.submitBtn}`}
              disabled={pending || belowMin || methods.length === 0}
            >
              {pending
                ? "Sipariş gönderiliyor…"
                : method === "iyzico"
                  ? "Ödemeye Geç"
                  : "Siparişi Gönder"}
              {!pending && <ArrowRight aria-hidden="true" />}
            </button>
            <Link href="/sepet" className={styles.backLink}>
              Sepete geri dön
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
