"use client";

// Kurye giriş formu — telefon + kod. Başarılı girişte sayfa yenilenir ve
// panel (CourierDashboard) gösterilir.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bike, LogIn } from "lucide-react";
import { loginCourier } from "@/lib/shop/courier-auth";
import styles from "./panel.module.css";

export default function CourierLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await loginCourier(phone, code);
      if (res.ok) {
        router.refresh();
      } else {
        setError(res.error ?? "Giriş yapılamadı.");
      }
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo} aria-hidden="true">
          <Bike />
        </span>
        <span className={styles.eyebrow}>Yeni Mahalle Market</span>
        <h1 className={styles.title}>Kurye Girişi</h1>
        <p className={styles.muted}>
          Telefonunuz ve size verilen kod ile giriş yapın.
        </p>
        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label} htmlFor="c-phone">
            Telefon
          </label>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.input}
            required
          />
          <label className={styles.label} htmlFor="c-code">
            Kod
          </label>
          <input
            id="c-code"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Giriş kodu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.primaryBtn} disabled={pending}>
            <LogIn size={18} aria-hidden="true" />
            {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
        <p className={styles.hint}>
          Kodunuz yoksa market yönetiminden isteyin.
        </p>
      </div>
    </main>
  );
}
