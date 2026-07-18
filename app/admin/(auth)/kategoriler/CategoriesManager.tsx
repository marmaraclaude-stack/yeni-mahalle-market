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
  createCategory,
  deleteCategory,
  updateCategory,
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
  /** Panelden eklenen özel kategori mi? (silinebilir) */
  isCustom?: boolean;
}

/** Yeni kategori formundaki ikon seçenekleri (iconFor anahtarları). */
const ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "shopping-basket", label: "Sepet" },
  { key: "carrot", label: "Havuç" },
  { key: "beef", label: "Et" },
  { key: "fish", label: "Balık" },
  { key: "croissant", label: "Kruvasan" },
  { key: "milk", label: "Süt" },
  { key: "cup-soda", label: "İçecek" },
  { key: "wheat", label: "Buğday" },
  { key: "soup", label: "Çorba" },
  { key: "cookie", label: "Kurabiye" },
  { key: "candy", label: "Şeker" },
  { key: "coffee", label: "Kahve" },
  { key: "ice-cream-cone", label: "Dondurma Külah" },
  { key: "snowflake", label: "Kar Tanesi" },
  { key: "citrus", label: "Narenciye" },
  { key: "spray-can", label: "Sprey" },
  { key: "scroll-text", label: "Kağıt Rulo" },
  { key: "sparkles", label: "Işıltı" },
  { key: "pill", label: "İlaç" },
  { key: "utensils", label: "Çatal Kaşık" },
  { key: "baby", label: "Bebek" },
  { key: "paw-print", label: "Pati" },
  { key: "lamp", label: "Lamba" },
  { key: "flame", label: "Alev" },
  { key: "flame-kindling", label: "Mangal" },
  { key: "battery-charging", label: "Şarj" },
  { key: "umbrella", label: "Şemsiye" },
  { key: "sun", label: "Güneş" },
  { key: "life-buoy", label: "Simit Can" },
  { key: "bug", label: "Böcek" },
  { key: "droplets", label: "Damla" },
  { key: "nut", label: "Kuruyemiş" },
  { key: "apple", label: "Elma" },
  { key: "banana", label: "Muz" },
  { key: "cherry", label: "Kiraz" },
  { key: "grape", label: "Üzüm" },
  { key: "salad", label: "Salata" },
  { key: "sandwich", label: "Sandviç" },
  { key: "pizza", label: "Pizza" },
  { key: "cake-slice", label: "Pasta Dilimi" },
  { key: "donut", label: "Tatlı Çörek" },
  { key: "egg", label: "Yumurta" },
  { key: "egg-fried", label: "Sahanda Yumurta" },
  { key: "ham", label: "Jambon" },
  { key: "drumstick", label: "Tavuk But" },
  { key: "popcorn", label: "Patlamış Mısır" },
  { key: "lollipop", label: "Lolipop" },
  { key: "ice-cream-bowl", label: "Dondurma Kase" },
  { key: "glass-water", label: "Su Bardağı" },
  { key: "wine", label: "Şarap Kadehi" },
  { key: "beer", label: "Bira" },
  { key: "martini", label: "Kokteyl" },
  { key: "utensils-crossed", label: "Restoran" },
  { key: "chef-hat", label: "Şef" },
  { key: "cooking-pot", label: "Tencere" },
  { key: "microwave", label: "Mikrodalga" },
  { key: "refrigerator", label: "Buzdolabı" },
  { key: "home", label: "Ev" },
  { key: "lightbulb", label: "Ampul" },
  { key: "plug", label: "Priz" },
  { key: "battery", label: "Pil" },
  { key: "wrench", label: "İngiliz Anahtarı" },
  { key: "hammer", label: "Çekiç" },
  { key: "scissors", label: "Makas" },
  { key: "paintbrush", label: "Boya Fırçası" },
  { key: "washing-machine", label: "Çamaşır Makinesi" },
  { key: "shirt", label: "Giyim" },
  { key: "bone", label: "Kemik" },
  { key: "cat", label: "Kedi" },
  { key: "dog", label: "Köpek" },
  { key: "bird", label: "Kuş" },
  { key: "rabbit", label: "Tavşan" },
  { key: "squirrel", label: "Sincap" },
  { key: "flower-2", label: "Çiçek" },
  { key: "leaf", label: "Yaprak" },
  { key: "sprout", label: "Fide" },
  { key: "tree-pine", label: "Çam" },
  { key: "tent", label: "Kamp" },
  { key: "gift", label: "Hediye" },
  { key: "heart", label: "Kalp" },
  { key: "star", label: "Yıldız" },
  { key: "package", label: "Paket" },
  { key: "shopping-bag", label: "Alışveriş Çantası" },
  { key: "shopping-cart", label: "Market Arabası" },
  { key: "store", label: "Mağaza" },
  { key: "truck", label: "Kamyon" },
  { key: "bike", label: "Bisiklet" },
  { key: "car", label: "Araba" },
  { key: "fuel", label: "Yakıt" },
  { key: "stethoscope", label: "Sağlık" },
  { key: "bandage", label: "Yara Bandı" },
  { key: "thermometer", label: "Termometre" },
  { key: "waves", label: "Deniz" },
  { key: "sailboat", label: "Tekne" },
  { key: "gamepad-2", label: "Oyun" },
  { key: "music", label: "Müzik" },
  { key: "book-open", label: "Kitap" },
  { key: "newspaper", label: "Gazete" },
  { key: "pencil", label: "Kalem" },
  { key: "brush", label: "Fırça" },
  { key: "smartphone", label: "Telefon" },
  { key: "tv", label: "Televizyon" },
  { key: "headphones", label: "Kulaklık" },
  { key: "camera", label: "Kamera" },
  { key: "watch", label: "Saat" },
  { key: "key", label: "Anahtar" },
  { key: "lock", label: "Kilit" },
  { key: "map-pin", label: "Konum" },
  { key: "globe", label: "Dünya" },
  { key: "recycle", label: "Geri Dönüşüm" },
  { key: "cigarette", label: "Sigara" },
];

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
  // Düzenleyicisi açık kartlar tam satır genişliğine yayılır (dar kartta
  // ad + anahtar kelime kutuları sıkışıyordu).
  const [openEditors, setOpenEditors] = useState<Set<string>>(() => new Set());
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

      {/* Yeni kategori: ad + ikon + renk. Slug addan üretilir; yeni kategori
         vitrinde ve ürün formundaki kategori listesinde hemen görünür. */}
      <NewCategoryForm onError={setError} />

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
              className={`${kstyles.card}${catOff ? ` ${kstyles.cardOff}` : ""}${openEditors.has(c.slug) ? ` ${kstyles.cardWide}` : ""}`}
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
                {c.isCustom && (
                  <button
                    type="button"
                    className={kstyles.editIconBtn + " " + kstyles.editDelBtn}
                    onClick={() => {
                      if (!window.confirm(`"${c.name}" kategorisi silinsin mi? İçinde ürün varsa silinmez.`)) return;
                      setError(null);
                      startTransition(async () => {
                        try {
                          await deleteCategory(c.slug);
                          window.location.reload();
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Kategori silinemedi.");
                        }
                      });
                    }}
                    aria-label={`${c.name} kategorisini sil`}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                )}
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
              <details
                className={kstyles.editWrap}
                onToggle={(e) => {
                  const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                  setOpenEditors((prev) => {
                    const next = new Set(prev);
                    if (isOpen) next.add(c.slug);
                    else next.delete(c.slug);
                    return next;
                  });
                }}
              >
                <summary className={kstyles.editSummary}>
                  Alt kategorileri düzenle
                </summary>
                {/* Kategorinin kendisi: ad + ikon + renk (slug/URL sabit) */}
                <CategoryEditRow cat={c} onError={setError} />
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




/* Anahtar kelime <-> desen çevirisi. Kelimeler | ile birleşir; Türkçe
   harfler her iki yazımı da yakalayan sınıfa açılır (ş -> [şs]). Karmaşık
   (elle yazılmış) desenler çözülemezse ham desen kutusu gösterilir. */
const TR_CLASS: Record<string, string> = {
  "ç": "[çc]", "ğ": "[ğg]", "ı": "[ıi]", "ö": "[öo]", "ş": "[şs]", "ü": "[üu]",
};
function encodeKeywords(words: string[]): string {
  return words
    .map((w) =>
      w
        .trim()
        .toLocaleLowerCase("tr-TR")
        .replace(/[.*+?^${}()|[\]\\]/g, "")
        .replace(/[çğıöşü]/g, (m) => TR_CLASS[m]),
    )
    .filter(Boolean)
    .join("|");
}
function decodePattern(pattern: string): string[] | null {
  if (!pattern || pattern === "." || pattern === "(?!)") return null;
  const out: string[] = [];
  for (const part of pattern.split("|")) {
    if (
      !/^[a-z0-9çğıöşü\s&'-]*(\[[a-zçğıöşü]{2,3}\][a-z0-9çğıöşü\s&'-]*)*$/.test(
        part,
      )
    ) {
      return null;
    }
    const word = part.replace(/\[(.)[^\]]*\]/g, "$1").trim();
    if (!word) return null;
    out.push(word);
  }
  return out;
}

function KeywordsEditor({
  pattern,
  onChange,
  label,
}: {
  pattern: string;
  onChange: (p: string) => void;
  label: string;
}) {
  const words = decodePattern(pattern);
  const [draft, setDraft] = useState("");
  if (words === null) {
    // Çözülemeyen (gelişmiş) desen: ham kutu
    return (
      <input
        className={kstyles.editInput}
        value={pattern}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Anahtar kelimeler"
        aria-label={label}
        title="Gelişmiş desen (elle yazılmış)"
      />
    );
  }
  function commitDraft() {
    const parts = draft.split(",").map((x) => x.trim()).filter(Boolean);
    if (parts.length === 0) return;
    onChange(encodeKeywords([...words!, ...parts]));
    setDraft("");
  }
  return (
    <div className={kstyles.kwWrap} aria-label={label}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={kstyles.kwChip}>
          {w}
          <button
            type="button"
            className={kstyles.kwX}
            onClick={() => onChange(encodeKeywords(words.filter((_, j) => j !== i)))}
            aria-label={`${w} kelimesini kaldır`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className={kstyles.kwInput}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitDraft();
          } else if (e.key === "Backspace" && draft === "" && words.length > 0) {
            onChange(encodeKeywords(words.slice(0, -1)));
          }
        }}
        onBlur={commitDraft}
        placeholder={words.length === 0 ? "kelime yaz, Enter'a bas" : "+ kelime"}
        aria-label={`${label} için yeni kelime`}
      />
    </div>
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
      <div className={kstyles.editHead} aria-hidden>
        <span>Ad</span>
        <span>Anahtar kelimeler</span>
        <span />
      </div>
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
        <KeywordsEditor
          pattern={newPattern}
          onChange={setNewPattern}
          label="Yeni alt kategori anahtar kelimeleri"
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
      {sub.pattern === "." ? (
        /* Genel kural: eşleşmeyen her ürün buraya düşer; desen düzenlenmez */
        <span className={kstyles.editGeneral} title="Üstteki kurallara uymayan tüm ürünler bu alta düşer">
          Kalanların tümü
        </span>
      ) : (
        <KeywordsEditor
          pattern={pattern}
          onChange={setPattern}
          label={`${sub.name} anahtar kelimeleri`}
        />
      )}
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


function NewCategoryForm({ onError }: { onError: (m: string | null) => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("shopping-basket");
  const [tint, setTint] = useState(0);
  const [pending, startTransition] = useTransition();

  function add() {
    if (!name.trim() || pending) return;
    onError(null);
    startTransition(async () => {
      try {
        await createCategory(name.trim(), icon, tint);
        setName("");
        router.refresh();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Kategori eklenemedi.");
      }
    });
  }

  const Icon = iconFor(icon);
  const [bg, fg] = CATEGORY_TINTS[tint] ?? CATEGORY_TINTS[0];

  return (
    <div className={kstyles.newCat}>
      <span
        className={kstyles.icon}
        style={{ background: bg, color: fg }}
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={1.9} />
      </span>
      <input
        className={kstyles.editInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") add();
        }}
        placeholder="Yeni kategori adı (örn. Organik Ürünler)"
        aria-label="Yeni kategori adı"
      />
      <select
        className={kstyles.editInput}
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        aria-label="Kategori ikonu"
      >
        {ICON_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      <div className={kstyles.tintRow} role="radiogroup" aria-label="Kategori rengi">
        {CATEGORY_TINTS.map(([b, f], i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={tint === i}
            className={`${kstyles.tintDot}${tint === i ? ` ${kstyles.tintDotOn}` : ""}`}
            style={{ background: b, color: f }}
            onClick={() => setTint(i)}
            aria-label={`Renk ${i + 1}`}
          >
            ●
          </button>
        ))}
      </div>
      <button
        type="button"
        className={kstyles.editAddBtn}
        onClick={add}
        disabled={pending || !name.trim()}
      >
        <Plus size={15} aria-hidden />
        {pending ? "Ekleniyor" : "Kategori Ekle"}
      </button>
    </div>
  );
}


function CategoryEditRow({
  cat,
  onError,
}: {
  cat: CatDef;
  onError: (m: string | null) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(cat.name);
  const [icon, setIcon] = useState(cat.icon);
  const [tint, setTint] = useState(cat.tint);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setName(cat.name);
    setIcon(cat.icon);
    setTint(cat.tint);
  }, [cat.name, cat.icon, cat.tint]);

  const dirty =
    name.trim() !== cat.name || icon !== cat.icon || tint !== cat.tint;

  function save() {
    if (!dirty || pending || !name.trim()) return;
    onError(null);
    startTransition(async () => {
      try {
        await updateCategory(cat.slug, { name: name.trim(), icon, tint });
        router.refresh();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Kategori güncellenemedi.");
      }
    });
  }

  return (
    <div className={kstyles.catEditRow}>
      <input
        className={kstyles.editInput}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        aria-label={`${cat.name} kategori adı`}
      />
      <select
        className={kstyles.editInput}
        value={ICON_OPTIONS.some((o) => o.key === icon) ? icon : "shopping-basket"}
        onChange={(e) => setIcon(e.target.value)}
        aria-label={`${cat.name} ikonu`}
      >
        {ICON_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      <div className={kstyles.tintRow} role="radiogroup" aria-label="Renk">
        {CATEGORY_TINTS.map(([b], i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={tint === i}
            className={`${kstyles.tintDot}${tint === i ? ` ${kstyles.tintDotOn}` : ""}`}
            style={{ background: b }}
            onClick={() => setTint(i)}
            aria-label={`Renk ${i + 1}`}
          />
        ))}
      </div>
      {dirty && (
        <button
          type="button"
          className={kstyles.editSaveBtn}
          onClick={save}
          disabled={pending || !name.trim()}
        >
          {pending ? "..." : "Kaydet"}
        </button>
      )}
    </div>
  );
}
