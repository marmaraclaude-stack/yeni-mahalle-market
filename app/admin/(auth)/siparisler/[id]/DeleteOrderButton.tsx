"use client";

// Sipariş detayında "Sil" butonu — confirm sonrası kalıcı silme + listeye dönüş.
// Server component olan detay sayfasında onay diyaloğu için ayrı client parça.

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteOrder } from "@/lib/shop/admin-actions";
import styles from "../../../admin.module.css";

export default function DeleteOrderButton({
  orderId,
  orderNo,
}: {
  orderId: string;
  orderNo: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (
      !window.confirm(
        `${orderNo} siparişi KALICI olarak silinsin mi? Bu işlem geri alınamaz.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteOrder(orderId);
      router.push("/admin/siparisler");
    });
  }

  return (
    <button
      type="button"
      className={`${styles.actionBtn} ${styles["actionBtn--delete"]}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      disabled={pending}
      onClick={onDelete}
    >
      <Trash2 size={14} aria-hidden />
      {pending ? "Siliniyor..." : "Siparişi Sil"}
    </button>
  );
}
