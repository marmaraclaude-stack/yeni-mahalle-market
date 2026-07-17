"use client";

// Kategori/alt kategori görünürlük yönetimi — istemci bileşeni.
// Vitrin tasarım dili: tint ikon karoları, accent switch'ler, hap çipler.
// Her anahtar iyimser (optimistic) güncellenir; sunucu aksiyonu başarısız
// olursa eski duruma döner ve uyarı gösterilir.

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  LayoutGrid,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createSubcat,
  deleteSubcat,
  moveSubcat,
  toggleCategoryActive,
  toggleSubcategoryHidden,
  updateSubcat,
} from "@/lib/shop/admin-actions";
import { CATEGORY_TINTS } from "@/lib/shop/categories";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "../../admin.module.css";
import kstyles from "./kategoriler.module.css";

interface SubDef {
  slug: string;
  name: string;
  /** Otomatik eşleme deseni (kelimeler | ile ayrılır). */
  pattern: string;
}

interface CatDef {
  slug: string;
  name: string;
  tint: number;
  icon: string;
  subs: SubDef[];
}

export default function CategoriesManager({
  categories,
  initialInactive,
  initialHidden,
}: {
  categories: CatDef[];
  initialInactive: string[];
  initialHidden: string[]; // "kategori/alt" anahtarları
}) {
  const [inactive, setInactive] = useState<Set<string>>(
    () => new Set(initialInactive),
  );
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(initialHidden));
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function flipCategory(slug: string) {
    const makeActive = inactive.has(slug); // pasifse aktifleştir
    setError(null);
    setInactive((prev) => {
      const next = new Set(prev);
      if (makeActive) next.delete(slug);
      else next.add(slug);
      return next;
    });
    startTransition(async () => {
      try {
        await toggleCategoryActive(slug, makeActive);
      } catch (e) {
        // geri al
        setInactive((prev) => {
          const next = new Set(prev);
          if (makeActive) next.add(slug);
          else next.delete(slug);
          return next;
        });
        setError(e instanceof Error ? e.message : "Kategori güncellenemedi.");
      }
    });
  }

  function flipSub(catSlug: string, subSlug: string) {
    const key = `${catSlug}/${subSlug}`;
    const makeHidden = !hidden.has(key);
    setError(null);
    setHidden((prev) => {
      const next = new Set(prev);
      if (makeHidden) next.add(key);
      else next.delete(key);
      return next;
    });
    startTransition(async () => {
      try {
        await toggleSubcategoryHidden(catSlug, subSlug, makeHidden);
      } catch (e) {
        setHidden((prev) => {
          const next = new Set(prev);
          if (makeHidden) next.delete(key);
          else next.add(key);
          return next;
        });
        setError(e instanceof Error ? e.message : "Alt kategori güncellenemedi.");
      }
    });
  }

  const totalSubs = categories.reduce((n, c) => n + c.subs.length, 0);

  return (
    <>
      {error && <p className={styles.formError}>{error}</p>}

      {/* Özet şeridi — canlı sayılar (anahtarlar değiştikçe güncellenir) */}
      <div className={kstyles.summary}>
        <span className={kstyles.summaryChip}>
          <LayoutGrid size={14} aria-hidden />
          {categories.length} kategori
        </span>
        <span
          className={`${kstyles.summaryChip}${inactive.size > 0 ? ` ${kstyles.summaryChipWarn}` : ""}`}
        >
          <EyeOff size={14} aria-hidden />
          {inactive.size} pasif kategori
        </span>
        <span
          className={`${kstyles.summaryChip}${hidden.size > 0 ? ` ${kstyles.summaryChipWarn}` : ""}`}
        >
          <EyeOff size={14} aria-hidden />
          {hidden.size} gizli alt kategori
          <span className={kstyles.summaryMuted}>/ {totalSubs}</span>
        </span>
      </div>

      <div className={kstyles.grid}>
        {categories.map((c) => {
          const [bg, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
          const Icon = iconFor(c.icon);
          const catOff = inactive.has(c.slug);
          const hiddenCount = c.subs.filter((s) =>
            hidden.has(`${c.slug}/${s.slug}`),
          ).length;
          return (
            <section
              key={c.slug}
              className={`${kstyles.card}${catOff ? ` ${kstyles.cardOff}` : ""}`}
            >
              <header className={kstyles.head}>
                <span
                  className={kstyles.icon}
                  style={{ background: bg, color: fg }}
                  aria-hidden="true"
                >
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <div className={kstyles.headText}>
                  <span className={kstyles.name}>{c.name}</span>
                  <span
                    className={`${kstyles.state}${catOff ? ` ${kstyles.stateOff}` : ""}`}
                  >
                    {catOff
                      ? "Vitrinde gizli"
                      : hiddenCount > 0
                        ? `Görünür · ${hiddenCount} alt kategori gizli`
                        : "Vitrinde görünür"}
                  </span>
                </div>
                {/* Accent switch — açık: vitrinde görünür */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={!catOff}
                  onClick={() => flipCategory(c.slug)}
                  className={`${kstyles.switch}${!catOff ? ` ${kstyles.switchOn}` : ""}`}
                  aria-label={`${c.name} kategorisini ${catOff ? "aktifleştir" : "pasifleştir"}`}
                >
                  <span className={kstyles.knob} aria-hidden="true" />
                </button>
              </header>

              {c.subs.length > 0 && (
                <div className={kstyles.subList}>
                  {c.subs.map((s) => {
                    const off = hidden.has(`${c.slug}/${s.slug}`);
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => flipSub(c.slug, s.slug)}
                        className={`${kstyles.subChip}${off ? ` ${kstyles.subChipOff}` : ""}`}
                        aria-pressed={!off}
                        title={
                          off
                            ? "Gizli. Vitrinde göstermek için tıkla"
                            : "Görünür. Vitrinden gizlemek için tıkla"
                        }
                      >
                        {off ? (
                          <EyeOff size={13} aria-hidden />
                        ) : (
                          <Eye size={13} aria-hidden />
                        )}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Alt kategori DÜZENLEYİCİ: ekle / yeniden adlandır / desen /
                  sırala / sil. Sıra otomatik eşlemede önceliktir (ilk kural
                  kazanır); en alttaki genellikle genel kuraldır. */}
              <details className={kstyles.editWrap}>
                <summary className={kstyles.editSummary}>
                  Alt kategorileri düzenle
                </summary>
                <p className={kstyles.editHint}>
                  Anahtar kelimeler ürün adıyla eşleşir; kelimeleri | ile ayır
                  (örn. tavuk|piliç). Boş bırakılırsa ürünler bu alta yalnız
                  elle atanır. Sıra önemlidir: ilk eşleşen kural kazanır.
                </p>
                <SubcatEditor
                  categorySlug={c.slug}
                  subs={c.subs}
                  onError={setError}
                />
              </details>
            </section>
          );
        })}
      </div>
    </>
  );
}


function SubcatEditor({
  categorySlug,
  subs,
  onError,
}: {
  categorySlug: string;
  subs: SubDef[];
  onError: (msg: string | null) => void;
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newPattern, setNewPattern] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    if (!newName.trim() || pending) return;
    onError(null);
    startTransition(async () => {
      try {
        await createSubcat(categorySlug, newName.trim(), newPattern.trim());
        setNewName("");
        setNewPattern("");
        router.refresh();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Alt kategori eklenemedi.");
      }
    });
  }

  return (
    <div className={kstyles.editRows}>
      {subs.map((s, i) => (
        <SubcatRow
          key={s.slug}
          categorySlug={categorySlug}
          sub={s}
          isFirst={i === 0}
          isLast={i === subs.length - 1}
          onError={onError}
        />
      ))}
      <div className={kstyles.editRow}>
        <input
          className={kstyles.editInput}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Yeni alt kategori adı"
          aria-label={`${categorySlug} için yeni alt kategori adı`}
        />
        <input
          className={kstyles.editInput}
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
          placeholder="Anahtar kelimeler (örn. tavuk|piliç)"
          aria-label="Yeni alt kategori anahtar kelimeleri"
        />
        <div className={kstyles.editBtns}>
          <button
            type="button"
            className={kstyles.editAddBtn}
            onClick={add}
            disabled={pending || !newName.trim()}
          >
            <Plus size={14} aria-hidden />
            {pending ? "Ekleniyor" : "Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubcatRow({
  categorySlug,
  sub,
  isFirst,
  isLast,
  onError,
}: {
  categorySlug: string;
  sub: SubDef;
  isFirst: boolean;
  isLast: boolean;
  onError: (msg: string | null) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(sub.name);
  const [pattern, setPattern] = useState(sub.pattern);
  const [pending, startTransition] = useTransition();

  // Kayıt/refresh sonrası sunucudan gelen güncel değerlerle eşitle.
  useEffect(() => {
    setName(sub.name);
  }, [sub.name]);
  useEffect(() => {
    setPattern(sub.pattern);
  }, [sub.pattern]);

  const dirty = name.trim() !== sub.name || pattern.trim() !== sub.pattern;

  function run(fn: () => Promise<void>, fallback: string) {
    onError(null);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        onError(e instanceof Error ? e.message : fallback);
      }
    });
  }

  return (
    <div className={kstyles.editRow}>
      <input
        className={kstyles.editInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label={`${sub.name} alt kategori adı`}
      />
      <input
        className={kstyles.editInput}
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        placeholder="Anahtar kelimeler"
        aria-label={`${sub.name} anahtar kelimeleri`}
      />
      <div className={kstyles.editBtns}>
        {dirty && (
          <button
            type="button"
            className={kstyles.editSaveBtn}
            disabled={pending || !name.trim()}
            onClick={() =>
              run(
                () =>
                  updateSubcat(categorySlug, sub.slug, {
                    name: name.trim(),
                    pattern: pattern.trim(),
                  }),
                "Alt kategori güncellenemedi.",
              )
            }
          >
            {pending ? "..." : "Kaydet"}
          </button>
        )}
        <button
          type="button"
          className={kstyles.editIconBtn}
          disabled={pending || isFirst}
          onClick={() =>
            run(
              () => moveSubcat(categorySlug, sub.slug, "up"),
              "Sıra güncellenemedi.",
            )
          }
          aria-label={`${sub.name} alt kategorisini yukarı taşı`}
        >
          <ArrowUp size={14} aria-hidden />
        </button>
        <button
          type="button"
          className={kstyles.editIconBtn}
          disabled={pending || isLast}
          onClick={() =>
            run(
              () => moveSubcat(categorySlug, sub.slug, "down"),
              "Sıra güncellenemedi.",
            )
          }
          aria-label={`${sub.name} alt kategorisini aşağı taşı`}
        >
          <ArrowDown size={14} aria-hidden />
        </button>
        <button
          type="button"
          className={`${kstyles.editIconBtn} ${kstyles.editDelBtn}`}
          disabled={pending}
          onClick={() => {
            if (
              !window.confirm(
                `"${sub.name}" alt kategorisi silinsin mi? Ürünler silinmez; elle bu alta atanmış ürünler otomatik kurala döner.`,
              )
            ) {
              return;
            }
            run(
              () => deleteSubcat(categorySlug, sub.slug),
              "Alt kategori silinemedi.",
            );
          }}
          aria-label={`${sub.name} alt kategorisini sil`}
        >
          <Trash2 size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
