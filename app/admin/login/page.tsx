import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { isAuthenticated } from "../actions";
import styles from "./login.module.css";

export const metadata = {
  title: "Giriş · Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className={styles.shell}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.brandRow}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span className={styles.brandName}>Yeni Mahalle Market</span>
          </div>
          <h1 className={styles.title}>Yönetim Paneli</h1>
          <p className={styles.sub}>
            Devam etmek için yönetici parolanızı girin.
          </p>
          <LoginForm />
        </div>
        <p className={styles.footnote}>Sadece yetkili kullanım içindir.</p>
      </div>
    </main>
  );
}
