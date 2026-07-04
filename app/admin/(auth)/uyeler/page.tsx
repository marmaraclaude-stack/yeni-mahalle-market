// Admin — üye (müşteri hesabı) yönetimi.
// Server component: üyeleri service-role ile çeker (auth.users + customer_profiles
// + sipariş sayısı), listeyi client MembersTable'a verir.
// Tablo/DB yoksa listMembers hata mesajıyla döner ve zarif gösterilir.

import { listMembers, type MemberRow } from "@/lib/shop/admin-actions";
import MembersTable from "./MembersTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Üyeler" };

export default async function AdminMembersPage() {
  let members: MemberRow[] = [];
  let loadError: string | null = null;

  try {
    const result = await listMembers();
    if (result.ok) {
      members = result.members;
    } else {
      loadError = result.error ?? "Üyeler yüklenemedi.";
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Üyeler</h1>
      <p className={styles.subtitle}>
        Müşteri hesapları: yeni üye ekleyin, mevcut üyeleri görün ve gerekirse silin.
      </p>

      {loadError ? (
        <div className={styles.empty}>
          Üyeler yüklenemedi.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <MembersTable members={members} />
      )}
    </>
  );
}
