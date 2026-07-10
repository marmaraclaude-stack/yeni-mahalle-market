// Satıcı / veri sorumlusu bilgi kutusu — yasal sayfalarda ortak.
// lib/business.ts LEGAL_INFO'daki boş alanlar otomatik gizlenir.

import { BUSINESS } from "@/lib/business";
import styles from "./kurumsal.module.css";

export default function SellerInfoBox() {
  const legal = BUSINESS.legal;
  return (
    <div className={styles.infoBox}>
      <dl>
        <dt>Unvan</dt>
        <dd>{BUSINESS.legalName}</dd>
        {legal.ownerName && (
          <>
            <dt>İşletme sahibi</dt>
            <dd>{legal.ownerName}</dd>
          </>
        )}
        <dt>Adres</dt>
        <dd>{legal.address || BUSINESS.address.full}</dd>
        <dt>Telefon</dt>
        <dd>
          <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
        </dd>
        {legal.email && (
          <>
            <dt>E-posta</dt>
            <dd>
              <a href={`mailto:${legal.email}`}>{legal.email}</a>
            </dd>
          </>
        )}
        {legal.taxOffice && legal.taxNo && (
          <>
            <dt>Vergi dairesi / no</dt>
            <dd>
              {legal.taxOffice} / {legal.taxNo}
            </dd>
          </>
        )}
        {legal.mersis && (
          <>
            <dt>MERSİS</dt>
            <dd>{legal.mersis}</dd>
          </>
        )}
        {legal.kep && (
          <>
            <dt>KEP</dt>
            <dd>{legal.kep}</dd>
          </>
        )}
        <dt>Web</dt>
        <dd>{BUSINESS.domain}</dd>
      </dl>
    </div>
  );
}
