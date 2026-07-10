"use client";

// Adres yönetimi — kullanıcının kayıtlı teslimat adresleri.
// Server action'ları useTransition ile çağırır, başarı sonrası router.refresh()
// ile server component'i tazeler (revalidatePath ile de tutarlı). Boş durumda
// doğrudan ekleme formunu gösterir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  type AddressInput,
} from "@/lib/shop/account-actions";
import type { CustomerAddress } from "@/lib/shop/types";
import AccommodationPicker from "@/components/shop/AccommodationPicker";
import styles from "./hesap.module.css";

interface AddressManagerProps {
  addresses: CustomerAddress[];
}

/** Boş form değerleri — ilçe varsayılanı Sapanca. */
const EMPTY_FORM: AddressInput = {
  title: "Ev",
  line: "",
  district: "Sapanca",
  note: "",
};

export default function AddressManager({ addresses }: AddressManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // "new" = ekleme formu açık; adres id'si = o kartın düzenleme formu açık.
  const [openForm, setOpenForm] = useState<string | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  // Konaklama seçici girişi (yalnız yardımcı — asıl adres form.line'da).
  const [stayQuery, setStayQuery] = useState("");

  const isEmpty = addresses.length === 0;

  function openNew() {
    setError(null);
    setStayQuery("");
    setForm(EMPTY_FORM);
    setOpenForm("new");
  }

  function openEdit(address: CustomerAddress) {
    setError(null);
    setForm({
      title: address.title,
      line: address.line,
      district: address.district,
      note: address.note,
    });
    setStayQuery("");
    setOpenForm(address.id);
  }

  function closeForm() {
    setOpenForm(null);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.line.trim()) {
      setError("Açık adres boş olamaz.");
      return;
    }
    setError(null);
    const editingId = openForm;
    startTransition(async () => {
      const result =
        editingId && editingId !== "new"
          ? await updateAddress(editingId, form)
          : await addAddress(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpenForm(null);
      setForm(EMPTY_FORM);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function renderForm(mode: "new" | "edit") {
    return (
      <form className={styles.addressForm} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Başlık</span>
            <input
              type="text"
              className={styles.input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ev, İş, Bungalov..."
              maxLength={40}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>İlçe</span>
            <input
              type="text"
              className={styles.input}
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="Sapanca"
              maxLength={40}
            />
          </label>
        </div>
        {/* Otel/apart/bungalov/site: tesis seçilince açık adres tesisten doldurulur */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            Otel / bungalov / sitede mi kalıyorsunuz? (isteğe bağlı)
          </span>
          <AccommodationPicker
            value={stayQuery}
            onChange={setStayQuery}
            onSelect={(label) => {
              setStayQuery(label);
              setForm({ ...form, line: label });
            }}
            inputClassName={styles.input}
            placeholder="Tesis / site adını yazın, listeden seçin"
          />
        </div>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Açık adres</span>
          <textarea
            className={styles.textarea}
            value={form.line}
            onChange={(e) => setForm({ ...form, line: e.target.value })}
            placeholder="Mahalle, sokak, bina no, daire... (tesis seçtiyseniz oda/bungalov no ekleyin)"
            rows={3}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Adres tarifi / not</span>
          <input
            type="text"
            className={styles.input}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Kapı kodu, kat, yön tarifi..."
            maxLength={120}
          />
        </label>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.formActions}>
          <button
            type="submit"
            className="btn btn--accent"
            disabled={pending}
          >
            {pending
              ? "Kaydediliyor…"
              : mode === "edit"
                ? "Değişiklikleri kaydet"
                : "Adresi kaydet"}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={closeForm}
            disabled={pending}
          >
            Vazgeç
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={styles.addressWrap}>
      {isEmpty && openForm !== "new" ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <MapPin />
          </span>
          <p className={styles.emptyTitle}>Henüz adres eklemediniz</p>
          <p>
            Kayıtlı adreslerinizi buradan yönetin; sipariş verirken hızlıca
            seçebilirsiniz.
          </p>
          <button type="button" className="btn btn--accent" onClick={openNew}>
            <Plus aria-hidden="true" /> Yeni Adres Ekle
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.addressList}>
            {addresses.map((address) => (
              <li key={address.id} className={styles.addressCard}>
                {openForm === address.id ? (
                  renderForm("edit")
                ) : (
                  <>
                    <div className={styles.addressHead}>
                      <span className={styles.addressTitle}>
                        <MapPin aria-hidden="true" /> {address.title}
                      </span>
                      <div className={styles.addressBtns}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => openEdit(address)}
                          disabled={pending}
                          aria-label="Adresi düzenle"
                        >
                          <Pencil aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          onClick={() => handleDelete(address.id)}
                          disabled={pending}
                          aria-label="Adresi sil"
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <p className={styles.addressLine}>{address.line}</p>
                    <p className={styles.addressDistrict}>{address.district}</p>
                    {address.note && (
                      <p className={styles.addressNote}>{address.note}</p>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>

          {openForm === "new" ? (
            <div className={styles.newAddressBox}>
              <div className={styles.newAddressHead}>
                <span className={styles.newAddressTitle}>Yeni adres</span>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={closeForm}
                  disabled={pending}
                  aria-label="Formu kapat"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              {renderForm("new")}
            </div>
          ) : (
            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={openNew}
              disabled={pending}
            >
              <Plus aria-hidden="true" /> Yeni Adres Ekle
            </button>
          )}
        </>
      )}
    </div>
  );
}
