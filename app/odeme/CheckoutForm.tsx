"use client";

// Checkout formu — teslimat bilgileri + ödeme yöntemi seçimi + createOrder action.
// Sayfa yalnız girişli kullanıcıya açılır (page.tsx redirect'i); bilgiler
// profilden ön-dolu gelir ama input'lar düzenlenebilir kalır.
// Kapıda ödeme → /siparis/[orderNo]?yeni=1; iyzico → ödeme sayfasına yönlendirme.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Banknote,
  BedDouble,
  Check,
  CreditCard,
  LocateFixed,
  Lock,
  ShieldCheck,
  ShoppingBasket,
  TicketPercent,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { linkifyPhone } from "@/components/shop/linkifyPhone";
import { validateCoupon } from "@/lib/shop/coupons";
import { createOrder } from "@/lib/shop/order-actions";
import {
  calcDeliveryFee,
  computeLineTotal,
  formatGrams,
  formatTL,
  haversineKm,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from "@/lib/shop/types";
import {
  ACCOMMODATIONS,
  accommodationLabel,
} from "@/lib/shop/accommodations";
import { BUSINESS } from "@/lib/business";
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
  /** Mesafe bazlı ücret: dahil km sonrası km başı ek ücret (0 = kapalı). */
  deliveryPerKm?: number;
  deliveryKmIncluded?: number;
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
  deliveryPerKm = 0,
  deliveryKmIncluded = 0,
  minOrderTotal,
  orderingOpen,
  closedMessage,
}: CheckoutFormProps) {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(methods[0] ?? null);

  // Konaklama: otel/apart/bungalov seçimi — adres tesisten oluşturulur.
  const [stay, setStay] = useState(false);
  const [stayName, setStayName] = useState("");
  const [stayRoom, setStayRoom] = useState("");

  // Konum (mesafe bazlı ücret): "Konumumu kullan" ile alınır, opsiyonel.
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locState, setLocState] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [locError, setLocError] = useState("");

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setLocState("error");
      setLocError("Bu cihaz konum desteklemiyor.");
      return;
    }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocState("ok");
        setLocError("");
      },
      (err) => {
        setLocState("error");
        setLocError(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni verilmedi."
            : "Konum alınamadı.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  const distanceKm = coords ? haversineKm(BUSINESS.geo, coords) : null;

  // Kupon: input + uygulanan kupon + hata durumu. Sunucu createOrder'da
  // kuponu YENİDEN doğrular; buradaki indirim yalnız gösterim içindir.
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponPending, startCouponTransition] = useTransition();

  // Teslimat ücreti — sunucuyla aynı saf hesap (mesafe dahil).
  const fee = calcDeliveryFee(
    {
      delivery_fee: deliveryFee,
      free_delivery_over: freeDeliveryOver,
      delivery_per_km: deliveryPerKm,
      delivery_km_included: deliveryKmIncluded,
    },
    subtotal,
    distanceKm,
  );
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
            <p>{linkifyPhone(closedMessage)}</p>
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
            <Link href="/urunler" className="btn btn--accent btn--lg">
              Alışverişe Başla
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
    // Konaklamada adres tesisten kurulur; ek tarif varsa sonuna eklenir.
    const rawAddress = String(form.get("addressLine") ?? "").trim();
    const addressLine =
      stay && stayName.trim()
        ? [
            stayName.trim(),
            stayRoom.trim() ? `Oda/Bungalov: ${stayRoom.trim()}` : "",
            rawAddress,
          ]
            .filter(Boolean)
            .join(" · ")
        : rawAddress;

    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      addressLine,
      addressNote: String(form.get("addressNote") ?? ""),
      note: String(form.get("note") ?? ""),
      paymentMethod: method,
      lines: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
      couponCode: coupon?.code,
      customerLat: coords?.lat,
      customerLng: coords?.lng,
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
                {/* Konaklama: otel/apart/bungalov — tesis seçilir, adres ondan kurulur */}
                <div className={styles.field}>
                  <label className={styles.stayToggle}>
                    <input
                      type="checkbox"
                      checked={stay}
                      onChange={(e) => setStay(e.target.checked)}
                    />
                    <BedDouble size={16} aria-hidden="true" />
                    Bir otel / apart / bungalovda konaklıyorum
                  </label>
                </div>
                {stay && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="stayName">Tesis adı *</label>
                      <input
                        id="stayName"
                        list="stay-list"
                        value={stayName}
                        onChange={(e) => setStayName(e.target.value)}
                        placeholder="Yazmaya başlayın, listeden seçin"
                        required={stay}
                      />
                      <datalist id="stay-list">
                        {ACCOMMODATIONS.map((a) => (
                          <option
                            key={accommodationLabel(a)}
                            value={accommodationLabel(a)}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="stayRoom">Oda / Bungalov no</label>
                      <input
                        id="stayRoom"
                        value={stayRoom}
                        onChange={(e) => setStayRoom(e.target.value)}
                        placeholder="Örn: 12 / Göl 3 (isteğe bağlı)"
                      />
                    </div>
                  </>
                )}
                <div className={styles.field}>
                  <label htmlFor="addressLine">
                    {stay ? "Ek tarif (isteğe bağlı)" : "Teslimat Adresi *"}
                  </label>
                  <textarea
                    id="addressLine"
                    name="addressLine"
                    required={!stay}
                    minLength={stay ? undefined : 10}
                    rows={3}
                    autoComplete="street-address"
                    defaultValue={defaults.address}
                    placeholder={
                      stay
                        ? "Resepsiyona bırakılabilir, giriş kapısı vb."
                        : "Mahalle, cadde/sokak, bina ve daire no · Sapanca"
                    }
                  />
                </div>
                {/* Mesafe bazlı ücret açıkken: konumla net ücret hesabı */}
                {deliveryPerKm > 0 && (
                  <div className={styles.field}>
                    <div className={styles.locRow}>
                      <button
                        type="button"
                        onClick={useMyLocation}
                        className={styles.locBtn}
                        disabled={locState === "loading"}
                      >
                        <LocateFixed size={15} aria-hidden="true" />
                        {locState === "loading"
                          ? "Konum alınıyor…"
                          : "Konumumu kullan"}
                      </button>
                      {locState === "ok" && distanceKm !== null && (
                        <span className={styles.locOk}>
                          <Check size={14} aria-hidden="true" /> Markete ~
                          {distanceKm} km
                        </span>
                      )}
                      {locState === "error" && (
                        <span className={styles.locErr}>{locError}</span>
                      )}
                    </div>
                    <p className={styles.locHint}>
                      Teslimat ücreti mesafeye göre hesaplanır; konum
                      paylaşmazsanız taban ücret uygulanır.
                    </p>
                  </div>
                )}
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
                    {line.soldByWeight
                      ? `${formatGrams(line.qty)} · ${line.name}`
                      : `${line.qty} × ${line.name}`}
                  </span>
                  <span className={styles.summaryLinePrice}>
                    {formatTL(
                      computeLineTotal(
                        line.price,
                        line.qty,
                        line.soldByWeight,
                        line.packPrices,
                      ),
                    )}
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
                <dt>
                  Teslimat Ücreti
                  {distanceKm !== null && fee > 0 && (
                    <span className={styles.feeKm}> (~{distanceKm} km)</span>
                  )}
                </dt>
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
              className={`btn btn--accent btn--lg ${styles.submitBtn}`}
              disabled={pending || belowMin || methods.length === 0}
            >
              {pending
                ? "Sipariş gönderiliyor…"
                : method === "iyzico"
                  ? "Ödemeye Geç"
                  : "Siparişi Gönder"}
            </button>

            {/* Güven satırı — dönüşüm için ikonlu üçlü */}
            <ul className={styles.trustRow} aria-label="Alışveriş güvenceleri">
              <li>
                <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
                Bilgilerin güvende
              </li>
              <li>
                <Truck size={16} strokeWidth={2} aria-hidden="true" />
                30 dakikada kapında
              </li>
              <li>
                <Banknote size={16} strokeWidth={2} aria-hidden="true" />
                Kapıda ödeme
              </li>
            </ul>

            <Link href="/sepet" className={styles.backLink}>
              Sepete geri dön
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
