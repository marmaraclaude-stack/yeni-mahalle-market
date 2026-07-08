"use client";

// Üye tablosu — üstte "Yeni Üye" collapse formu (createMember),
// satırlarda confirm'li silme (deleteMember). Veri server component'ten gelir;
// işlem sonrası router.refresh() ile tazelenir.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  adminSetMemberPassword,
  createMember,
  deleteMember,
  updateMemberProfile,
  type MemberRow,
} from "@/lib/shop/admin-actions";
import styles from "../../admin.module.css";
import local from "./members.module.css";

function formatDate(iso: string): string {
  if (!iso) return "·";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function MemberRowView({ member }: { member: MemberRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  // Ad/telefon satır içi düzenleme durumu.
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(member.full_name);
  const [editPhone, setEditPhone] = useState(member.phone);
  const [editError, setEditError] = useState<string | null>(null);

  // Parola sıfırlama mini formu durumu.
  const [showPass, setShowPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [passBusy, setPassBusy] = useState(false);
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const label = member.full_name || member.email || "Bu üye";

  function startEdit() {
    setEditName(member.full_name);
    setEditPhone(member.phone);
    setEditError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditError(null);
  }

  function saveEdit() {
    const fullName = editName.trim();
    const phone = editPhone.trim();
    if (fullName.length < 2 || fullName.length > 120) {
      setEditError("Ad soyad 2-120 karakter olmalı.");
      return;
    }
    if (phone.length > 40) {
      setEditError("Telefon en fazla 40 karakter olabilir.");
      return;
    }
    setEditError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await updateMemberProfile(member.id, {
          full_name: fullName,
          phone,
        });
        if (!result.ok) {
          setEditError(result.error ?? "Üye güncellenemedi.");
          return;
        }
        setEditing(false);
        router.refresh();
      } catch (err) {
        setEditError(err instanceof Error ? err.message : "Üye güncellenemedi.");
      } finally {
        setBusy(false);
      }
    });
  }

  function togglePassForm() {
    setShowPass((v) => !v);
    setNewPass("");
    setPassMsg(null);
  }

  function savePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMsg({ ok: false, text: "Yeni parola en az 6 karakter olmalı." });
      return;
    }
    setPassMsg(null);
    setPassBusy(true);
    startTransition(async () => {
      try {
        const result = await adminSetMemberPassword(member.id, newPass);
        if (!result.ok) {
          setPassMsg({
            ok: false,
            text: result.error ?? "Parola güncellenemedi.",
          });
          return;
        }
        setNewPass("");
        setPassMsg({ ok: true, text: "Parola güncellendi." });
      } catch (err) {
        setPassMsg({
          ok: false,
          text: err instanceof Error ? err.message : "Parola güncellenemedi.",
        });
      } finally {
        setPassBusy(false);
      }
    });
  }

  function remove() {
    const onay = window.confirm(
      `"${label}" üyesi kalıcı olarak silinecek. Emin misiniz?`,
    );
    if (!onay) return;
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await deleteMember(member.id);
        if (!result.ok) {
          window.alert(result.error ?? "Üye silinemedi.");
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      <tr>
        <td className={styles.prodName}>
          {editing ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={120}
                disabled={busy}
                className={local.inlineInput}
                aria-label={`${label} üyesinin adını düzenle`}
                placeholder="Ad Soyad"
              />
              {editError && (
                <span className={local.inlineError}>{editError}</span>
              )}
            </>
          ) : (
            member.full_name || "·"
          )}
        </td>
        <td>{member.email || "·"}</td>
        <td>
          {editing ? (
            <input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              maxLength={40}
              inputMode="tel"
              disabled={busy}
              className={local.inlineInput}
              aria-label={`${label} üyesinin telefonunu düzenle`}
              placeholder="05xx xxx xx xx"
            />
          ) : member.phone ? (
            <a href={`tel:${member.phone}`} className={styles.telLink}>
              {member.phone}
            </a>
          ) : (
            "·"
          )}
        </td>
        <td className={styles.couponUses}>
          <Link
            href={`/admin/siparisler?uye=${member.id}`}
            className={local.ordersLink}
            aria-label={`${label} üyesinin siparişlerini gör (${member.order_count} sipariş)`}
          >
            {member.order_count}
          </Link>
        </td>
        <td className={styles.timeCell}>{formatDate(member.created_at)}</td>
        <td>
          <div className={styles.cellActions}>
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={busy}
                  className={`${local.pillAction} ${local["pillAction--save"]}`}
                  aria-label={`${label} üyesindeki değişiklikleri kaydet`}
                >
                  {busy ? "Kaydediliyor…" : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={busy}
                  className={local.pillAction}
                  aria-label={`${label} üyesindeki düzenlemeyi iptal et`}
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
                  className={local.pillAction}
                  aria-label={`${label} üyesinin ad ve telefonunu düzenle`}
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={togglePassForm}
                  disabled={busy}
                  className={local.pillAction}
                  aria-expanded={showPass}
                  aria-label={`${label} üyesinin parolasını sıfırla`}
                >
                  Şifre
                </button>
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy}
                  className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
                  aria-label={`${label} üyesini sil`}
                >
                  Sil
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {showPass && (
        <tr className={local.passRow}>
          <td colSpan={6}>
            <form onSubmit={savePassword} className={local.passForm}>
              <span className={local.passLabel}>
                {label} için yeni parola:
              </span>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                minLength={6}
                required
                disabled={passBusy}
                className={local.inlineInput}
                placeholder="En az 6 karakter"
                autoComplete="new-password"
                aria-label={`${label} üyesi için yeni parola`}
              />
              <button
                type="submit"
                disabled={passBusy}
                className={`${local.pillAction} ${local["pillAction--save"]}`}
              >
                {passBusy ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={togglePassForm}
                disabled={passBusy}
                className={local.pillAction}
              >
                Kapat
              </button>
              {passMsg &&
                (passMsg.ok ? (
                  <span className={local.inlineOk} role="status">
                    {passMsg.text}
                  </span>
                ) : (
                  <span className={local.inlineError} role="alert">
                    {passMsg.text}
                  </span>
                ))}
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

export default function MembersTable({ members }: { members: MemberRow[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const fullName = String(fd.get("full_name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (fullName.length < 2 || !email || password.length < 6) {
      setFormError("Ad soyad, e-posta ve en az 6 karakterli parola zorunlu.");
      return;
    }

    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const result = await createMember({
          email,
          password,
          full_name: fullName,
          phone,
        });
        if (!result.ok) {
          setFormError(result.error ?? "Üye oluşturulamadı.");
          return;
        }
        form.reset();
        setShowForm(false);
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Üye oluşturulamadı.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Üst araç çubuğu: Yeni Üye accent butonu */}
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
          {showForm ? "Formu Kapat" : "Yeni Üye"}
        </button>
      </div>

      {/* Yeni üye formu (collapse) */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Üye Ekle</h2>
          <form onSubmit={handleCreate} className={styles.couponForm}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="uye-name">
                Ad Soyad *
              </label>
              <input
                id="uye-name"
                name="full_name"
                required
                placeholder="Ayşe Yılmaz"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="uye-phone">
                Telefon
              </label>
              <input
                id="uye-phone"
                name="phone"
                inputMode="tel"
                placeholder="05xx xxx xx xx"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="uye-email">
                E-posta *
              </label>
              <input
                id="uye-email"
                name="email"
                type="email"
                required
                placeholder="ornek@eposta.com"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="uye-pass">
                Parola *
              </label>
              <input
                id="uye-pass"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="En az 6 karakter"
                className={styles.input}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.couponFormSubmit}>
              <button type="submit" disabled={busy} className={styles.accentBtn}>
                {busy ? "Ekleniyor…" : "Üye Ekle"}
              </button>
            </div>
          </form>
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>
      )}

      {/* Üye tablosu */}
      {members.length === 0 ? (
        <div className={styles.empty}>
          Henüz üye yok. &quot;Yeni Üye&quot; ile ilk hesabı oluşturun.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Sipariş</th>
                  <th>Kayıt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <MemberRowView key={m.id} member={m} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
