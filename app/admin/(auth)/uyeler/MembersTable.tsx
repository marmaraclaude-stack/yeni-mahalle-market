"use client";

// Üye tablosu — üstte "Yeni Üye" collapse formu (createMember),
// satırlarda confirm'li silme (deleteMember). Veri server component'ten gelir;
// işlem sonrası router.refresh() ile tazelenir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  createMember,
  deleteMember,
  type MemberRow,
} from "@/lib/shop/admin-actions";
import styles from "../../admin.module.css";

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

  function remove() {
    const label = member.full_name || member.email || "Bu üye";
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
    <tr>
      <td className={styles.prodName}>{member.full_name || "·"}</td>
      <td>{member.email || "·"}</td>
      <td>
        {member.phone ? (
          <a href={`tel:${member.phone}`} className={styles.telLink}>
            {member.phone}
          </a>
        ) : (
          "·"
        )}
      </td>
      <td className={styles.couponUses}>{member.order_count}</td>
      <td className={styles.timeCell}>{formatDate(member.created_at)}</td>
      <td>
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
            aria-label={`${member.full_name || member.email} üyesini sil`}
          >
            Sil
          </button>
        </div>
      </td>
    </tr>
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
