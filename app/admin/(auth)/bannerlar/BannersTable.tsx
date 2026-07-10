"use client";

// Banner yonetimi: ustte "Yeni Banner" collapse formu (createBanner),
// altta ic scroll'suz kart gridi. Her kart vitrindeki gorunume yakin bir
// mini onizleme tasir (tint zemin + ikon + baslik + alt baslik); altinda
// ikon secimi (updateBanner), sira duzenleme (updateBanner), aktif/pasif
// toggle (toggleBanner) ve confirm'li silme (deleteBanner) bulunur.

import type { CSSProperties } from "react";
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
import css from "./banners.module.css";

/** Banner ikon onizlemesi: secili icon yoksa baslik icerigine gore cozulur. */
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

/** CATEGORY_TINTS index'lerinin Turkce renk adlari (select ve onizleme icin). */
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

/** tint index'ini guvenle 0-7 araligina al (bozuk veri UI'i kirmasin). */
function safeTint(tint: number): number {
  return Number.isInteger(tint) && tint >= 0 && tint < CATEGORY_TINTS.length
    ? tint
    : 0;
}

/** Tint renk onizleme yuvarlagi: zemin + ortada koyu nokta. */
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

function BannerCard({ banner }: { banner: Banner }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [sortValue, setSortValue] = useState(String(banner.sort));
  const [icon, setIcon] = useState(banner.icon);
  const [title, setTitle] = useState(banner.title);
  const [subtitle, setSubtitle] = useState(banner.subtitle);
  const [, startTransition] = useTransition();

  const textDirty =
    title.trim() !== banner.title || subtitle.trim() !== banner.subtitle;

  function saveText() {
    if (!title.trim()) {
      window.alert("Başlık boş olamaz.");
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await updateBanner(banner.id, {
          title: title.trim(),
          subtitle: subtitle.trim(),
        });
        if (!result.ok) {
          window.alert(result.error ?? "Metin kaydedilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  const [bg, fg] = CATEGORY_TINTS[safeTint(banner.tint)];
  const PreviewIcon = resolveBannerIcon(icon, banner.title);

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
    <article
      className={`${css.card} ${banner.is_active ? "" : css["card--off"]}`}
    >
      {/* Vitrindeki slayta yakin mini onizleme: pasifse solgun gorunur */}
      <div
        className={css.preview}
        style={{ "--bnr-bg": bg, "--bnr-fg": fg } as CSSProperties}
      >
        {!banner.is_active && <span className={css.offTag}>Pasif</span>}
        <div className={css.previewCopy}>
          <div className={css.previewTitle}>{title}</div>
          {subtitle && <div className={css.previewSub}>{subtitle}</div>}
        </div>
        <div className={css.previewArt} aria-hidden="true">
          <span className={css.artCircleLg} />
          <span className={css.artCircleMd} />
          <span className={css.artIcon}>
            <PreviewIcon size={32} strokeWidth={1.6} />
          </span>
        </div>
      </div>

      {/* Kontroller: baslik/metin, ikon, renk, sira, durum, sil */}
      <div className={css.controls}>
        <div className={`${css.controlField} ${css["controlField--text"]}`}>
          <span className={css.controlLabel}>Başlık</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            disabled={busy}
            className={styles.inputSm}
            aria-label={`${banner.title} banner başlığı`}
          />
        </div>
        <div className={`${css.controlField} ${css["controlField--text"]}`}>
          <span className={css.controlLabel}>Alt metin</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            maxLength={160}
            disabled={busy}
            className={styles.inputSm}
            aria-label={`${banner.title} banner alt metni`}
          />
        </div>
        {textDirty && (
          <div className={css.controlField}>
            <span className={css.controlLabel}>&nbsp;</span>
            <button
              type="button"
              onClick={saveText}
              disabled={busy}
              className={`${styles.btnRow} ${styles["btnRow--primary"]}`}
            >
              {busy ? "Kaydediliyor…" : "Metni Kaydet"}
            </button>
          </div>
        )}
        <div className={`${css.controlField} ${css["controlField--icon"]}`}>
          <span className={css.controlLabel}>İkon</span>
          <select
            value={icon}
            onChange={(e) => saveIcon(e.target.value)}
            disabled={busy}
            className={styles.select}
            aria-label={`${banner.title} banner ikonu`}
          >
            <option value="">Otomatik</option>
            {BANNER_ICON_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={css.controlField}>
          <span className={css.controlLabel}>Renk</span>
          <span className={css.tintLine}>
            <TintDot tint={banner.tint} />
            {TINT_NAMES[safeTint(banner.tint)]}
          </span>
        </div>

        <div className={css.controlField}>
          <span className={css.controlLabel}>Sıra</span>
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
                className={styles.btnRow}
              >
                Kaydet
              </button>
            )}
          </div>
        </div>

        <div className={css.cardActions}>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`${styles.btnRow} ${banner.is_active ? styles["btnRow--on"] : ""}`}
            aria-label={`${banner.title} banner'ını ${banner.is_active ? "pasifleştir" : "aktifleştir"}`}
          >
            {banner.is_active ? "Aktif" : "Pasif"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.btnRow} ${styles["btnRow--danger"]}`}
            aria-label={`${banner.title} banner'ını sil`}
          >
            Sil
          </button>
        </div>
      </div>
    </article>
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

  const activeCount = banners.filter((b) => b.is_active).length;

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
      {/* Ust arac cubugu: solda sayim ozeti, sagda Yeni Banner butonu */}
      <div className={styles.toolbar}>
        <span className={css.countInfo}>
          {banners.length} banner ({activeCount} aktif)
        </span>
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

      {/* Kart gridi: tum bannerlar ayni anda gorunur, ic scroll yok */}
      {banners.length === 0 ? (
        <div className={styles.empty}>
          Henüz banner yok. &quot;Yeni Banner&quot; ile ilk banner&apos;ı oluşturun.
        </div>
      ) : (
        <div className={css.grid}>
          {banners.map((b) => (
            <BannerCard key={b.id} banner={b} />
          ))}
        </div>
      )}
    </>
  );
}
