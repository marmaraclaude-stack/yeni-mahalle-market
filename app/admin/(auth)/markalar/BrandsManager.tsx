"use client";

// Marka yönetimi istemci bileşeni: arama, yeni marka ekleme ve satır içi
// düzenleme (ad + üretici + kampanya pili). Kaydet yalnız değişiklik
// olduğunda görünür; başarılı işlem sonrası router.refresh ile liste ve
// sayaçlar tazelenir. Kampanya pili doluysa markanın tüm ürün kartlarında
// görsel üstünde gösterilir.

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgePercent, Building2, Plus, Search, Tags, Trash2 } from "lucide-react";
import { createBrand, deleteBrand, updateBrand } from "@/lib/shop/admin-actions";
import m from "./markalar.module.css";

export interface BrandItem {
  id: string;
  name: string;
  producer: string;
  campaign: string;
  count: number;
}

function trLower(s: string): string {
  return s.toLocaleLowerCase("tr-TR");
}

export default function BrandsManager({
  brands,
  unbranded,
}: {
  brands: BrandItem[];
  unbranded: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const producerCount = brands.filter((b) => b.producer.trim() !== "").length;
  const campaignCount = brands.filter((b) => b.campaign.trim() !== "").length;

  const visible = useMemo(() => {
    const q = trLower(query.trim());
    if (!q) return brands;
    return brands.filter(
      (b) =>
        trLower(b.name).includes(q) ||
        trLower(b.producer).includes(q) ||
        trLower(b.campaign).includes(q),
    );
  }, [brands, query]);

  return (
    <div className={m.wrap}>
      <div className={m.summary}>
        <span className={m.chip}>
          <Tags size={14} aria-hidden />
          {brands.length} marka
        </span>
        <span className={m.chip}>
          <Building2 size={14} aria-hidden />
          {producerCount} markanın üreticisi tanımlı
        </span>
        {campaignCount > 0 && (
          <span className={m.chip}>
            <BadgePercent size={14} aria-hidden />
            {campaignCount} markada kampanya pili
          </span>
        )}
        {unbranded > 0 && (
          <span className={`${m.chip} ${m.chipMuted}`}>
            {unbranded} ürün markasız
          </span>
        )}
      </div>

      {error && (
        <p className={m.error} role="alert">
          {error}
        </p>
      )}

      <AddBrandForm onError={setError} onDone={() => router.refresh()} />

      <div className={m.searchRow}>
        <div className={m.searchBox}>
          <Search size={15} aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marka veya üretici ara"
            aria-label="Marka ara"
          />
        </div>
        <span className={m.resultCount}>{visible.length} marka listeleniyor</span>
      </div>

      <div className={m.listHead} aria-hidden>
        <span>Marka</span>
        <span>Üretici / işletmeci</span>
        <span>Kampanya pili</span>
        <span className={m.listHeadRight}>Ürün</span>
        <span />
      </div>
      <ul className={m.list}>
        {visible.map((b) => (
          <BrandRow
            key={b.id}
            brand={b}
            onError={setError}
            onDone={() => router.refresh()}
          />
        ))}
        {visible.length === 0 && (
          <li className={m.emptyRow}>Aramayla eşleşen marka yok.</li>
        )}
      </ul>
    </div>
  );
}

function AddBrandForm({
  onError,
  onDone,
}: {
  onError: (msg: string | null) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [producer, setProducer] = useState("");
  const [campaign, setCampaign] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || pending) return;
    onError(null);
    startTransition(async () => {
      try {
        await createBrand(name.trim(), producer.trim(), campaign.trim());
        setName("");
        setProducer("");
        setCampaign("");
        onDone();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Marka eklenemedi.");
      }
    });
  }

  return (
    <div className={m.addCard}>
      <span className={m.addTitle}>Yeni marka</span>
      <div className={m.addFields}>
        <input
          className={m.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Marka adı (örn. Pınar)"
          aria-label="Yeni marka adı"
        />
        <input
          className={`${m.input} ${m.inputGrow}`}
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Üretici / işletmeci (boş bırakılabilir)"
          aria-label="Yeni markanın üreticisi"
        />
        <input
          className={m.input}
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Kampanya pili (örn. 2 Al 1 Öde)"
          aria-label="Yeni markanın kampanya pili"
        />
        <button
          type="button"
          className={m.addBtn}
          onClick={submit}
          disabled={pending || !name.trim()}
        >
          <Plus size={15} aria-hidden />
          {pending ? "Ekleniyor" : "Ekle"}
        </button>
      </div>
    </div>
  );
}

function BrandRow({
  brand,
  onError,
  onDone,
}: {
  brand: BrandItem;
  onError: (msg: string | null) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(brand.name);
  const [producer, setProducer] = useState(brand.producer);
  const [campaign, setCampaign] = useState(brand.campaign);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  // Kayıt/refresh sonrası sunucudan gelen güncel değerlerle eşitle
  // (aksi hâlde satır bayat değeri geri yazabilir).
  useEffect(() => {
    setName(brand.name);
  }, [brand.name]);
  useEffect(() => {
    setProducer(brand.producer);
  }, [brand.producer]);
  useEffect(() => {
    setCampaign(brand.campaign);
  }, [brand.campaign]);

  const dirty =
    name.trim() !== brand.name ||
    producer.trim() !== brand.producer ||
    campaign.trim() !== brand.campaign;

  function save() {
    if (!dirty || pending || !name.trim()) return;
    onError(null);
    startTransition(async () => {
      try {
        await updateBrand(brand.id, {
          name: name.trim(),
          producer: producer.trim(),
          campaign: campaign.trim(),
        });
        onDone();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Marka güncellenemedi.");
      }
    });
  }

  function remove() {
    if (deleting) return;
    const msg =
      brand.count > 0
        ? `"${brand.name}" listeden silinecek. ${brand.count} üründeki marka yazısı silinmez; yalnız listeden ve otomatik doldurmadan çıkar. Devam edilsin mi?`
        : `"${brand.name}" silinsin mi?`;
    if (!window.confirm(msg)) return;
    onError(null);
    startDelete(async () => {
      try {
        await deleteBrand(brand.id);
        onDone();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Marka silinemedi.");
      }
    });
  }

  return (
    <li className={m.row}>
      <input
        className={m.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        aria-label={`${brand.name} marka adı`}
      />
      <input
        className={m.input}
        value={producer}
        onChange={(e) => setProducer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        placeholder="Üretici / işletmeci"
        aria-label={`${brand.name} üreticisi`}
      />
      <input
        className={m.input}
        value={campaign}
        onChange={(e) => setCampaign(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        placeholder="Kampanya pili (boş = yok)"
        aria-label={`${brand.name} kampanya pili`}
      />
      <span className={m.count} title={`${brand.count} üründe kullanılıyor`}>
        {brand.count}
      </span>
      <div className={m.rowBtns}>
        {dirty && (
          <button
            type="button"
            className={m.saveBtn}
            onClick={save}
            disabled={pending || !name.trim()}
          >
            {pending ? "Kaydediliyor" : "Kaydet"}
          </button>
        )}
        <button
          type="button"
          className={m.delBtn}
          onClick={remove}
          disabled={deleting}
          aria-label={`${brand.name} markasını sil`}
        >
          <Trash2 size={15} aria-hidden />
        </button>
      </div>
    </li>
  );
}
