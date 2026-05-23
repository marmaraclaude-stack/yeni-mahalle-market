import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { isAuthenticated } from "../actions";
import styles from "../admin.module.css";

export const metadata = {
  title: "Giriş · Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className={styles.loginShell}>
      <div className={styles.loginCard}>
        <span className={styles.loginEyebrow}>Yeni Mahalle Market</span>
        <h1 className={styles.loginTitle}>Yönetim girişi</h1>
        <p className={styles.loginSub}>Devam etmek için parolanızı girin.</p>
        <LoginForm />
      </div>
    </main>
  );
}
