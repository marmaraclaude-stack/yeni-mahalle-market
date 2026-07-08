"use client";

// Kupon tablosu — üstte "Yeni Kupon" collapse formu (createCoupon),
// satırlarda aktif/pasif toggle (toggleCoupon) ve confirm'li silme (deleteCoupon).
// Durum rozeti: süresi dolmuş > pasif > aktif önceliğiyle gösterilir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  createCoupon,
  deleteCoupon,
  toggleCoupon,
  type Coupon,
} from "@/lib/shop/admin-actions";
import { formatTL } from "@/lib/shop/types";
import styles from "../../admin.module.css";

/** "12,50" / "12.50" → 12.5; geçersizse null. */
function parseNum(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Kuponun süresi geçmiş mi? (expires_at gün sonuna kadar geçerli tutulur) */
function isExpired(coupon: Coupon): boolean {
  return (
    coupon.expires_at !== null &&
    new Date(coupon.expires_at).getTime() < Date.now()
  );
}

/** İndirimi kısa yaz: percent → "%10", fixed → "₺25,00". */
function formatDiscount(coupon: Coupon): string {
  return coupon.discount_type === "percent"
    ? `%${Number(coupon.value)}`
    : formatTL(Number(coupon.value));
}

function StatusBadge({ coupon }: { coupon: Coupon }) {
  if (isExpired(coupon)) {
    return <span className={`${styles.badge} ${styles["badge--expired"]}`}>Süresi doldu</span>;
  }
  if (!coupon.is_active) {
    return <span className={`${styles.badge} ${styles["badge--off"]}`}>Pasif</span>;
  }
  return <span className={`${styles.badge} ${styles["badge--active"]}`}>Aktif</span>;
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  function toggle() {
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await toggleCoupon(coupon.code, !coupon.is_active);
        if (!result.ok) {
          window.alert(result.error ?? "Kupon durumu değiştirilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function remove() {
    const onay = window.confirm(
      `"${coupon.code}" kuponu kalıcı olarak silinecek. Emin misiniz?`,
    );
    if (!onay) return;
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await deleteCoupon(coupon.code);
        if (!result.ok) {
          window.alert(result.error ?? "Kupon silinemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <tr className={coupon.is_active && !isExpired(coupon) ? "" : styles.rowInactive}>
      <td>
        <span className={styles.couponCode}>{coupon.code}</span>
      </td>
      <td>{coupon.description || "·"}</td>
      <td>{formatDiscount(coupon)}</td>
      <td>
        {Number(coupon.min_order_total) > 0
          ? formatTL(Number(coupon.min_order_total))
          : "·"}
      </td>
      <td className={styles.couponUses}>
        {coupon.used_count}/{coupon.max_uses ?? "∞"}
      </td>
      <td className={styles.couponUses}>
        {Number(coupon.per_user_limit) === 0 ? "∞" : coupon.per_user_limit}
      </td>
      <td>
        <StatusBadge coupon={coupon} />
      </td>
      <td className={styles.timeCell}>
        {coupon.expires_at
          ? new Date(coupon.expires_at).toLocaleDateString("tr-TR")
          : "Süresiz"}
      </td>
      <td>
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`${styles.btnRow} ${coupon.is_active ? styles["btnRow--on"] : ""}`}
            aria-label={`${coupon.code} kuponunu ${coupon.is_active ? "pasifleştir" : "aktifleştir"}`}
          >
            {coupon.is_active ? "Aktif" : "Pasif"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.btnRow} ${styles["btnRow--danger"]}`}
            aria-label={`${coupon.code} kuponunu sil`}
          >
            Sil
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const code = String(fd.get("code") ?? "").trim();
    const discountType = String(fd.get("discount_type") ?? "percent") as
      | "percent"
      | "fixed";
    const value = parseNum(String(fd.get("value") ?? ""));
    if (!code || value === null || value <= 0) {
      setFormError("Kupon kodu ve sıfırdan büyük bir indirim değeri zorunlu.");
      return;
    }
    const minOrder = parseNum(String(fd.get("min_order_total") ?? "")) ?? 0;
    const maxUsesRaw = String(fd.get("max_uses") ?? "").trim();
    const maxUses = maxUsesRaw === "" ? null : Number.parseInt(maxUsesRaw, 10);
    const perUserRaw = String(fd.get("per_user_limit") ?? "").trim();
    const perUserLimit = perUserRaw === "" ? 1 : Number.parseInt(perUserRaw, 10);
    const expiresAt = String(fd.get("expires_at") ?? "").trim() || null;

    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await createCoupon({
          code,
          description: String(fd.get("description") ?? ""),
          discount_type: discountType,
          value,
          min_order_total: minOrder,
          max_uses: maxUses,
          per_user_limit: Number.isNaN(perUserLimit) ? 1 : perUserLimit,
          expires_at: expiresAt,
        });
        if (!result.ok) {
          setFormError(result.error ?? "Kupon eklenemedi.");
          return;
        }
        form.reset();
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Kupon eklenemedi.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Üst araç çubuğu: Yeni Kupon accent butonu */}
      <div className={styles.toolbar}>
        <div />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={styles.btnLg}
          aria-expanded={showForm}
        >
          {showForm ? (
            <X size={15} strokeWidth={2.4} aria-hidden />
          ) : (
            <Plus size={15} strokeWidth={2.4} aria-hidden />
          )}
          {showForm ? "Formu Kapat" : "Yeni Kupon"}
        </button>
      </div>

      {/* Yeni kupon formu (collapse) */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Kupon Ekle</h2>
          <form onSubmit={handleCreate} className={styles.couponForm}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-code">
                Kod *
              </label>
              <input
                id="kupon-code"
                name="code"
                required
                maxLength={20}
                placeholder="HOSGELDIN20"
                className={`${styles.input} ${styles.couponCodeInput}`}
                autoCapitalize="characters"
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-desc">
                Açıklama
              </label>
              <input
                id="kupon-desc"
                name="description"
                placeholder="Hoş geldin indirimi"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-type">
                İndirim tipi
              </label>
              <select
                id="kupon-type"
                name="discount_type"
                defaultValue="percent"
                className={styles.select}
              >
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit tutar (TL)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-value">
                Değer *
              </label>
              <input
                id="kupon-value"
                name="value"
                required
                inputMode="decimal"
                placeholder="10"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-min">
                Min. sepet (TL)
              </label>
              <input
                id="kupon-min"
                name="min_order_total"
                inputMode="decimal"
                placeholder="0"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-max">
                Max kullanım
              </label>
              <input
                id="kupon-max"
                name="max_uses"
                inputMode="numeric"
                placeholder="Boş = sınırsız"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-peruser">
                Üye başına kullanım
              </label>
              <input
                id="kupon-peruser"
                name="per_user_limit"
                inputMode="numeric"
                defaultValue="1"
                placeholder="0 = sınırsız"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kupon-expires">
                Son tarih
              </label>
              <input
                id="kupon-expires"
                name="expires_at"
                type="date"
                className={styles.input}
              />
            </div>
            <div className={styles.couponFormSubmit}>
              <button type="submit" disabled={busy} className={styles.accentBtn}>
                {busy ? "Ekleniyor…" : "Ekle"}
              </button>
            </div>
          </form>
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>
      )}

      {/* Kupon tablosu */}
      {coupons.length === 0 ? (
        <div className={styles.empty}>
          Henüz kupon yok. &quot;Yeni Kupon&quot; ile ilk kuponu oluşturun.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Açıklama</th>
                  <th>İndirim</th>
                  <th>Min. Sepet</th>
                  <th>Kullanım</th>
                  <th>Üye Başına</th>
                  <th>Durum</th>
                  <th>Son Tarih</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <CouponRow key={c.code} coupon={c} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
