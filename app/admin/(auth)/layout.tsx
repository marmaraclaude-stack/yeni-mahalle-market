import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, logoutAction } from "../actions";
import AdminNav from "./AdminNav";
import styles from "../admin.module.css";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <span className={styles.bar__brand}>Yeni Mahalle</span>
          <span className={styles.bar__brandSub}>Admin · Panel</span>
        </Link>
        <div className={styles.bar__actions}>
          <Link href="/" className={styles.btnLink}>
            Siteyi aç
          </Link>
          <form action={logoutAction}>
            <button type="submit" className={styles.btnLink}>
              Çıkış
            </button>
          </form>
        </div>
      </header>
      <AdminNav />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
