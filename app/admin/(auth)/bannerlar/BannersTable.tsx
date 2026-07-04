"use client";

// Banner tablosu — üstte "Yeni Banner" collapse formu (createBanner),
// satırlarda tint renk önizlemesi, sıra düzenleme (updateBanner),
// aktif/pasif toggle (toggleBanner) ve confirm'li silme (deleteBanner).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  createBanner,
  deleteBanner,
  toggleBanner,
  updateBanner,
} from "@/lib/shop/admin-actions";
import type { Banner } from "@/lib/shop/types";
import { CATEGORY_TINTS } from "@/lib/shop/categories";
import { BANNER_ICON_OPTIONS, resolveBannerIcon } from "@/lib/shop/icons";
import styles from "../../admin.module.css";

/** Banner ikon önizlemesi — seçili icon yoksa başlık içeriğine göre çözülür. */
function BannerIconPreview({
  icon,
  title,
  tint,
}: {
  icon: string;
  title: string;
  tint: number;
}) {
  const Icon = resolveBannerIcon(icon, title);
  const [bg, fg] = CATEGORY_TINTS[safeTint(tint)];
  return (
    <span className={styles.bannerIcon} style={{ background: bg, color: fg }} aria-hidden>
      <Icon size={18} strokeWidth={2} />
    </span>
  );
}

/** CATEGORY_TINTS index'lerinin Türkçe renk adları (select ve önizleme için). */
const TINT_NAMES = [
  "Yeşil",
  "Mercan",
  "Amber",
  "Mavi",
  "Camgöbeği",
  "Mor",
  "Pembe",
  "Deniz",
];

/** tint index'ini güvenle 0-7 aralığına al (bozuk veri UI'ı kırmasın). */
function safeTint(tint: number): number {
  return Number.isInteger(tint) && tint >= 0 && tint < CATEGORY_TINTS.length
    ? tint
    : 0;
}

/** Tint renk önizleme yuvarlağı: zemin + ortada koyu nokta. */
function TintDot({ tint }: { tint: number }) {
  const [bg, fg] = CATEGORY_TINTS[safeTint(tint)];
  return (
    <span
      className={styles.tintDot}
      style={{ background: bg, color: fg }}
      title={TINT_NAMES[safeTint(tint)]}
      aria-label={`Renk: ${TINT_NAMES[safeTint(tint)]}`}
    />
  );
}

function BannerRow({ banner }: { banner: Banner }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [sortValue, setSortValue] = useState(String(banner.sort));
  const [icon, setIcon] = useState(banner.icon);
  const [, startTransition] = useTransition();

  function saveIcon(next: string) {
    setIcon(next);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await updateBanner(banner.id, { icon: next });
        if (!result.ok) {
          window.alert(result.error ?? "İkon kaydedilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function toggle() {
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await toggleBanner(banner.id, !banner.is_active);
        if (!result.ok) {
          window.alert(result.error ?? "Banner durumu değiştirilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function saveSort() {
    const sort = Number.parseInt(sortValue, 10);
    if (!Number.isInteger(sort)) {
      window.alert("Sıra tam sayı olmalı.");
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await updateBanner(banner.id, { sort });
        if (!result.ok) {
          window.alert(result.error ?? "Sıra kaydedilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function remove() {
    const onay = window.confirm(
      `"${banner.title}" banner'ı kalıcı olarak silinecek. Emin misiniz?`,
    );
    if (!onay) return;
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await deleteBanner(banner.id);
        if (!result.ok) {
          window.alert(result.error ?? "Banner silinemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <tr className={banner.is_active ? "" : styles.rowInactive}>
      <td>
        <div className={styles.bannerCell}>
          <BannerIconPreview icon={icon} title={banner.title} tint={banner.tint} />
          <div>
            <div className={styles.prodName}>{banner.title}</div>
            {banner.subtitle && (
              <div className={styles.prodMeta}>{banner.subtitle}</div>
            )}
          </div>
        </div>
      </td>
      <td>
        <select
          value={icon}
          onChange={(e) => saveIcon(e.target.value)}
          disabled={busy}
          className={styles.select}
          style={{ minWidth: 160 }}
          aria-label={`${banner.title} banner ikonu`}
        >
          <option value="">Otomatik</option>
          {BANNER_ICON_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td>{TINT_NAMES[safeTint(banner.tint)]}</td>
      <td>
        <div className={styles.sortForm}>
          <input
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            inputMode="numeric"
            className={styles.inputSm}
            aria-label={`${banner.title} banner sırası`}
          />
          {sortValue !== String(banner.sort) && (
            <button
              type="button"
              onClick={saveSort}
              disabled={busy}
              className={styles.actionBtn}
            >
              Kaydet
            </button>
          )}
        </div>
      </td>
      <td>
        {banner.is_active ? (
          <span className={`${styles.badge} ${styles["badge--active"]}`}>Aktif</span>
        ) : (
          <span className={`${styles.badge} ${styles["badge--off"]}`}>Pasif</span>
        )}
      </td>
      <td>
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`${styles.pillBtn} ${banner.is_active ? styles["pillBtn--on"] : ""}`}
            aria-label={`${banner.title} banner'ını ${banner.is_active ? "pasifleştir" : "aktifleştir"}`}
          >
            {banner.is_active ? "Aktif" : "Pasif"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
            aria-label={`${banner.title} banner'ını sil`}
          >
            Sil
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function BannersTable({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formTint, setFormTint] = useState(0);
  const [formIcon, setFormIcon] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const title = String(fd.get("title") ?? "").trim();
    if (!title) {
      setFormError("Banner başlığı zorunlu.");
      return;
    }
    const tint = Number.parseInt(String(fd.get("tint") ?? "0"), 10);
    const sortRaw = String(fd.get("sort") ?? "").trim();
    const sort = sortRaw === "" ? 0 : Number.parseInt(sortRaw, 10);
    if (!Number.isInteger(sort)) {
      setFormError("Sıra tam sayı olmalı.");
      return;
    }

    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await createBanner({
          title,
          subtitle: String(fd.get("subtitle") ?? ""),
          icon: String(fd.get("icon") ?? ""),
          tint,
          sort,
        });
        if (!result.ok) {
          setFormError(result.error ?? "Banner eklenemedi.");
          return;
        }
        form.reset();
        setFormTint(0);
        setFormIcon("");
        setFormTitle("");
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Banner eklenemedi.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Üst araç çubuğu: Yeni Banner accent butonu */}
      <div className={styles.toolbar}>
        <div />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={styles.accentBtn}
          aria-expanded={showForm}
        >
          {showForm ? (
            <X size={15} strokeWidth={2.4} aria-hidden />
          ) : (
            <Plus size={15} strokeWidth={2.4} aria-hidden />
          )}
          {showForm ? "Formu Kapat" : "Yeni Banner"}
        </button>
      </div>

      {/* Yeni banner formu (collapse) */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Banner Ekle</h2>
          <form onSubmit={handleCreate} className={styles.couponForm}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="banner-title">
                Başlık *
              </label>
              <input
                id="banner-title"
                name="title"
                required
                maxLength={80}
                placeholder="Fırsat ürünleri burada"
                className={styles.input}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="banner-subtitle">
                Alt başlık
              </label>
              <input
                id="banner-subtitle"
                name="subtitle"
                maxLength={120}
                placeholder="İndirimli ürünleri kaçırma"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="banner-icon">
                İkon
              </label>
              <div className={styles.iconSelectWrap}>
                <BannerIconPreview
                  icon={formIcon}
                  title={formTitle}
                  tint={formTint}
                />
                <select
                  id="banner-icon"
                  name="icon"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Otomatik (başlığa göre)</option>
                  {BANNER_ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="banner-tint">
                Renk
              </label>
              <div className={styles.tintSelectWrap}>
                <TintDot tint={formTint} />
                <select
                  id="banner-tint"
                  name="tint"
                  value={formTint}
                  onChange={(e) => setFormTint(Number(e.target.value))}
                  className={styles.select}
                >
                  {TINT_NAMES.map((name, i) => (
                    <option key={name} value={i}>
                      {i} · {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="banner-sort">
                Sıra
              </label>
              <input
                id="banner-sort"
                name="sort"
                inputMode="numeric"
                placeholder="0"
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

      {/* Banner tablosu */}
      {banners.length === 0 ? (
        <div className={styles.empty}>
          Henüz banner yok. &quot;Yeni Banner&quot; ile ilk banner&apos;ı oluşturun.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>İkon</th>
                  <th>Renk</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <BannerRow key={b.id} banner={b} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
