"use client";

// Profil düzenleyici — avatar + ad + email/telefon gösterimi ve "Düzenle" ile
// açılan form. Ad soyad + telefon customer_profiles'a (server action, RLS) yazılır;
// e-posta değişimi browser client supabase.auth.updateUser ile yapılır ve onay
// durumu kullanıcıya bildirilir. Başarı sonrası router.refresh ile server tazelenir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Pencil, Phone, User } from "lucide-react";
import { updateProfile } from "@/lib/shop/account-actions";
import { createClient } from "@/lib/supabase/client";
import styles from "./hesap.module.css";

interface ProfileEditorProps {
  displayName: string;
  fullName: string;
  email: string;
  phone: string;
}

export default function ProfileEditor({
  displayName,
  fullName,
  email,
  phone,
}: ProfileEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [emailValue, setEmailValue] = useState(email);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function openEdit() {
    setName(fullName);
    setPhoneValue(phone);
    setEmailValue(email);
    setError(null);
    setNotice(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const nextEmail = emailValue.trim();
    const emailChanged = nextEmail !== email;

    if (emailChanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }

    startTransition(async () => {
      // Ad soyad + telefon: server action (RLS).
      const result = await updateProfile(name, phoneValue);
      if (result.error) {
        setError(result.error);
        return;
      }

      // E-posta degisimi: browser client ile auth.updateUser.
      let emailNotice: string | null = null;
      if (emailChanged) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.updateUser({
          email: nextEmail,
        });
        if (authError) {
          setError(
            "E-posta güncellenemedi: " +
              (authError.message || "Lütfen tekrar deneyin."),
          );
          return;
        }
        emailNotice =
          "E-posta değişikliği için " +
          nextEmail +
          " adresine bir onay bağlantısı gönderildi. Onayladığınızda yeni adresiniz geçerli olur.";
      }

      setEditing(false);
      setNotice(emailNotice ?? "Profil bilgileriniz güncellendi.");
      router.refresh();
    });
  }

  return (
    <div className={styles.profileEditor}>
      <div className={styles.profileTop}>
        <div className={styles.avatar} aria-hidden="true">
          <User />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{displayName}</h1>
        </div>
      </div>

      {editing ? (
        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Ad soyad</span>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız"
              maxLength={80}
              autoComplete="name"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Telefon</span>
            <input
              type="tel"
              className={styles.input}
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              placeholder="05xx xxx xx xx"
              maxLength={20}
              autoComplete="tel"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>E-posta</span>
            <input
              type="email"
              className={styles.input}
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="ornek@eposta.com"
              maxLength={120}
              autoComplete="email"
            />
          </label>

          {error && <p className={styles.formError}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" className="btn btn--accent" disabled={pending}>
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={cancelEdit}
              disabled={pending}
            >
              Vazgeç
            </button>
          </div>
        </form>
      ) : (
        <>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <Mail aria-hidden="true" />
              <span>{email}</span>
            </li>
            {phone && (
              <li className={styles.contactItem}>
                <Phone aria-hidden="true" />
                <span>{phone}</span>
              </li>
            )}
          </ul>

          {notice && <p className={styles.profileNotice}>{notice}</p>}

          <button
            type="button"
            className={styles.editBtn}
            onClick={openEdit}
          >
            <Pencil aria-hidden="true" /> Düzenle
          </button>
        </>
      )}
    </div>
  );
}
