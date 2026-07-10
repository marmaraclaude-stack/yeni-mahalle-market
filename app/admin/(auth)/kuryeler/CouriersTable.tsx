"use client";

// Kurye tablosu — üstte "Yeni Kurye" collapse formu (createCourier),
// satırlarda aktif/pasif toggle (toggleCourier) ve confirm'li silme
// (deleteCourier). Veri server component'ten gelir; işlem sonrası
// router.refresh() ile tazelenir.

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  createCourier,
  deleteCourier,
  removeCourierImage,
  toggleCourier,
  updateCourier,
  uploadCourierImage,
} from "@/lib/shop/admin-actions";
import type { Courier } from "@/lib/shop/types";
import styles from "../../admin.module.css";
import local from "./couriers.module.css";

/** Kurye avatarı: önizleme + yükle/değiştir (gizli file input) + kaldır. */
function CourierAvatar({ courier }: { courier: Courier }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const initial = courier.name.trim().charAt(0).toUpperCase() || "?";

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await uploadCourierImage(courier.id, fd);
        if (!result.ok) {
          window.alert(result.error ?? "Görsel yüklenemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function removeImage() {
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await removeCourierImage(courier.id);
        if (!result.ok) {
          window.alert(result.error ?? "Görsel kaldırılamadı.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <div className={styles.courierAvatarCell}>
      {courier.image_url ? (
        <img
          src={courier.image_url}
          alt={courier.name}
          className={styles.courierAvatar}
          loading="lazy"
        />
      ) : (
        <span className={styles.courierAvatarEmpty} aria-hidden>
          {initial}
        </span>
      )}
      <div className={styles.courierAvatarActions}>
        <label className={styles.courierAvatarBtn}>
          {busy ? "İşleniyor…" : courier.image_url ? "Değiştir" : "Görsel Yükle"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPick}
            disabled={busy}
            hidden
            aria-label={`${courier.name} kurye görseli yükle`}
          />
        </label>
        {courier.image_url && (
          <button
            type="button"
            onClick={removeImage}
            disabled={busy}
            className={styles.courierAvatarRemove}
            aria-label={`${courier.name} kurye görselini kaldır`}
          >
            Kaldır
          </button>
        )}
      </div>
    </div>
  );
}

function CourierRow({ courier }: { courier: Courier }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(courier.name);
  const [editPhone, setEditPhone] = useState(courier.phone);
  const [editCode, setEditCode] = useState(courier.login_code ?? "");
  const [editError, setEditError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function startEdit() {
    setEditName(courier.name);
    setEditPhone(courier.phone);
    setEditCode(courier.login_code ?? "");
    setEditError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditError(null);
  }

  function saveEdit() {
    const name = editName.trim();
    const phone = editPhone.trim();
    if (name.length < 1 || name.length > 60) {
      setEditError("Kurye adı 1-60 karakter olmalı.");
      return;
    }
    if (phone.length > 20) {
      setEditError("Telefon en fazla 20 karakter olabilir.");
      return;
    }
    setEditError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await updateCourier(courier.id, {
          name,
          phone,
          login_code: editCode.trim(),
        });
        if (!result.ok) {
          setEditError(result.error ?? "Kurye güncellenemedi.");
          return;
        }
        setEditing(false);
        router.refresh();
      } catch (err) {
        setEditError(
          err instanceof Error ? err.message : "Kurye güncellenemedi.",
        );
      } finally {
        setBusy(false);
      }
    });
  }

  function toggle() {
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await toggleCourier(courier.id, !courier.is_active);
        if (!result.ok) {
          window.alert(result.error ?? "Kurye durumu değiştirilemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function remove() {
    const onay = window.confirm(
      `"${courier.name}" kuryesi kalıcı olarak silinecek. Emin misiniz?`,
    );
    if (!onay) return;
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await deleteCourier(courier.id);
        if (!result.ok) {
          window.alert(result.error ?? "Kurye silinemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <tr className={courier.is_active ? "" : styles.rowInactive}>
      <td>
        <CourierAvatar courier={courier} />
      </td>
      <td className={styles.prodName}>
        {editing ? (
          <>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={60}
              disabled={busy}
              className={local.inlineInput}
              aria-label={`${courier.name} kuryesinin adını düzenle`}
              placeholder="Ad Soyad"
            />
            {editError && <span className={local.inlineError}>{editError}</span>}
          </>
        ) : (
          courier.name
        )}
      </td>
      <td>
        {editing ? (
          <input
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            maxLength={20}
            inputMode="tel"
            disabled={busy}
            className={local.inlineInput}
            aria-label={`${courier.name} kuryesinin telefonunu düzenle`}
            placeholder="05xx xxx xx xx"
          />
        ) : courier.phone ? (
          <a href={`tel:${courier.phone}`} className={styles.telLink}>
            {courier.phone}
          </a>
        ) : (
          "·"
        )}
      </td>
      <td>
        {editing ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              maxLength={20}
              inputMode="numeric"
              disabled={busy}
              className={local.inlineInput}
              style={{ width: 90 }}
              aria-label={`${courier.name} kuryesinin giriş kodu`}
              placeholder="kod"
            />
            <button
              type="button"
              onClick={() =>
                setEditCode(String(1000 + Math.floor(Math.random() * 9000)))
              }
              disabled={busy}
              className={styles.btnRow}
            >
              Üret
            </button>
          </div>
        ) : courier.login_code ? (
          <code className={local.codeChip}>{courier.login_code}</code>
        ) : (
          <span className={styles.telLink} style={{ opacity: 0.5 }}>
            yok
          </span>
        )}
      </td>
      <td>
        {courier.is_active ? (
          <span className={`${styles.badge} ${styles["badge--active"]}`}>Aktif</span>
        ) : (
          <span className={`${styles.badge} ${styles["badge--off"]}`}>Pasif</span>
        )}
      </td>
      <td>
        <div className={styles.cellActions}>
          {editing ? (
            <>
              <button
                type="button"
                onClick={saveEdit}
                disabled={busy}
                className={`${styles.btnRow} ${styles["btnRow--on"]}`}
                aria-label={`${courier.name} kuryesindeki değişiklikleri kaydet`}
              >
                {busy ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={busy}
                className={styles.btnRow}
                aria-label={`${courier.name} kuryesindeki düzenlemeyi iptal et`}
              >
                Vazgeç
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEdit}
                disabled={busy}
                className={styles.btnRow}
                aria-label={`${courier.name} kuryesinin ad ve telefonunu düzenle`}
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={toggle}
                disabled={busy}
                className={`${styles.btnRow} ${courier.is_active ? styles["btnRow--on"] : ""}`}
                aria-label={`${courier.name} kuryesini ${courier.is_active ? "pasifleştir" : "aktifleştir"}`}
              >
                {courier.is_active ? "Aktif" : "Pasif"}
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className={`${styles.btnRow} ${styles["btnRow--danger"]}`}
                aria-label={`${courier.name} kuryesini sil`}
              >
                Sil
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function CouriersTable({ couriers }: { couriers: Courier[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (name.length < 2) {
      setFormError("Kurye adı en az 2 karakter olmalı.");
      return;
    }

    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await createCourier(name, phone);
        if (!result.ok) {
          setFormError(result.error ?? "Kurye eklenemedi.");
          return;
        }
        form.reset();
        setShowForm(false);
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Kurye eklenemedi.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Üst araç çubuğu: Yeni Kurye accent butonu */}
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
          {showForm ? "Formu Kapat" : "Yeni Kurye"}
        </button>
      </div>

      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        Kuryeler <b>sapancayenimahallemarket.com/kurye</b> adresinden{" "}
        <b>telefon + giriş kodu</b> ile giriş yapar; tek girişle kendilerine
        atanmış tüm siparişleri görüp konumlarını paylaşır. Kodu &quot;Düzenle
        &rarr; Üret&quot; ile oluşturup kuryeye iletin.
      </p>

      {/* Yeni kurye formu (collapse) */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Kurye Ekle</h2>
          <form onSubmit={handleCreate} className={styles.couponForm}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kurye-name">
                Ad Soyad *
              </label>
              <input
                id="kurye-name"
                name="name"
                required
                placeholder="Ahmet Yılmaz"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="kurye-phone">
                Telefon
              </label>
              <input
                id="kurye-phone"
                name="phone"
                inputMode="tel"
                placeholder="05xx xxx xx xx"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.couponFormSubmit}>
              <button type="submit" disabled={busy} className={styles.accentBtn}>
                {busy ? "Ekleniyor…" : "Kurye Ekle"}
              </button>
            </div>
          </form>
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>
      )}

      {/* Kurye tablosu */}
      {couriers.length === 0 ? (
        <div className={styles.empty}>
          Henüz kurye yok. &quot;Yeni Kurye&quot; ile ilk kaydı oluşturun.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Ad Soyad</th>
                  <th>Telefon</th>
                  <th>Giriş Kodu</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((c) => (
                  <CourierRow key={c.id} courier={c} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
