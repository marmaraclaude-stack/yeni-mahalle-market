// Admin kabuğu — masaüstünde sol sidebar (marka + ikonlu menü + alt aksiyonlar),
// mobilde üst bar + yatay kaydırılabilir sekmeler (admin.module.css medya sorgusu).
// Oturum yoksa /admin/login'e yönlendirir.

import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
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
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          {/* Düz img: logo ~28px. */}
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className={styles.brandLogo}
          />
          <span className={styles.brandName}>Yeni Mahalle Market</span>
        </Link>
        <AdminNav />
        <div className={styles.sidebarFoot}>
          <Link href="/" className={styles.footLink}>
            <ExternalLink size={15} aria-hidden />
            Siteyi Aç
          </Link>
          <form action={logoutAction} className={styles.footForm}>
            <button type="submit" className={styles.footLink}>
              <LogOut size={15} aria-hidden />
              Çıkış
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
