// Teslimat ve İade Şartları (/teslimat-ve-iade): iyzico satıcı kriteri.
// Kendi kuryeyle yerel teslimata (kargo yok) ve gıda ürünlerinin cayma hakkı
// istisnasına göre yazılmıştır. İşletme bilgileri lib/business.ts'ten.

import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import LegalShell from "../LegalShell";
import styles from "../kurumsal.module.css";

export const metadata: Metadata = {
  title: "Teslimat ve İade Şartları",
  description:
    "Yeni Mahalle Market teslimat bölgesi, teslimat süresi ve ücretleri ile iade, değişim ve cayma hakkı koşulları.",
  alternates: { canonical: "/teslimat-ve-iade" },
};

const TOC = [
  { id: "bolge", label: "Teslimat bölgesi" },
  { id: "sure", label: "Teslimat süresi ve saatleri" },
  { id: "ucret", label: "Teslimat ücreti" },
  { id: "kontrol", label: "Teslimde kontrol" },
  { id: "cayma", label: "Cayma hakkı" },
  { id: "garanti", label: "Bozuk / hatalı ürün garantisi" },
  { id: "iade", label: "Ücret iadesi" },
  { id: "iletisim", label: "İletişim" },
];

export default function TeslimatVeIadePage() {
  const legal = BUSINESS.legal;
  return (
    <LegalShell
      title="Teslimat ve İade Şartları"
      sub="Siparişleriniz kargoya verilmez; kendi kuryemizle aynı gün adresinize teslim edilir. Aşağıda teslimat ve iade koşullarımızı bulabilirsiniz."
      updated="10 Temmuz 2026"
      current="/teslimat-ve-iade"
      toc={TOC}
    >
      <h2 id="bolge">1. Teslimat bölgesi</h2>
      <p>
        <strong>{BUSINESS.name}</strong> yalnızca Sapanca ve yakın çevresine
        (Yeni Mahalle başta olmak üzere Sapanca merkez, Kırkpınar, Mahmudiye,
        Kurtköy ve Maşukiye çevresi) teslimat yapar. Teslimat bölgesi,
        marketimize uzaklığa göre sınırlıdır; adresiniz bölge dışında
        kalıyorsa sipariş adımında bilgilendirilirsiniz. Bölge dışı talepler
        için bizi{" "}
        <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>{" "}
        numarasından arayabilirsiniz.
      </p>

      <h2 id="sure">2. Teslimat süresi ve saatleri</h2>
      <ul>
        <li>
          Siparişler <strong>haftanın 7 günü 07:30 - 02:00</strong> saatleri
          arasında alınır ve teslim edilir.
        </li>
        <li>
          Siparişiniz kendi kuryemizle, stok ve yoğunluk durumuna göre
          genellikle <strong>30-60 dakika içinde</strong>, her durumda aynı
          gün teslim edilir.
        </li>
        <li>
          Otel, apart, bungalov veya sitede konaklıyorsanız teslimat oda /
          bungalov kapınıza ya da tesisin resepsiyonuna yapılabilir.
        </li>
        <li>
          Adreste bulunamazsanız kuryemiz sizi telefonla arar; ulaşılamazsa
          sipariş markete geri getirilir ve sizinle yeniden iletişime geçilir.
        </li>
      </ul>

      <h2 id="ucret">3. Teslimat ücreti</h2>
      <p>
        Teslimat ücreti, sipariş tutarına ve adresinizin marketimize
        uzaklığına göre hesaplanır ve <strong>ödeme sayfasında sipariş
        onayından önce açıkça gösterilir</strong>. Belirli bir sepet tutarının
        üzerindeki siparişlerde teslimat ücretsizdir; güncel tutarlar sepet ve
        ödeme sayfasında yer alır.
      </p>

      <h2 id="kontrol">4. Teslimde kontrol</h2>
      <p>
        Lütfen siparişinizi teslim alırken kontrol edin. Eksik, hasarlı veya
        yanlış bir ürün varsa teslim anında kuryemize bildirebilir ya da aynı
        gün içinde bizi arayabilirsiniz; ürün derhal değiştirilir veya ücreti
        iade edilir.
      </p>

      <h2 id="cayma">5. Cayma hakkı</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği uyarınca, tüketici mesafeli sözleşmelerde malı
        teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong>{" "}
        içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir.
      </p>
      <p>
        Ancak Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca
        aşağıdaki ürünlerde cayma hakkı <strong>kullanılamaz</strong>:
      </p>
      <ul>
        <li>
          <strong>Çabuk bozulabilen veya son kullanma tarihi geçebilecek
          ürünler</strong> (taze meyve ve sebze, şarküteri, süt ürünleri,
          ekmek ve fırın ürünleri, dondurulmuş gıda vb.): md. 15/1-c,
        </li>
        <li>
          Teslimden sonra <strong>ambalajı açılmış</strong>, sağlık ve hijyen
          açısından iadeye uygun olmayan ürünler (gıda, kişisel bakım vb.):
          md. 15/1-ç.
        </li>
      </ul>
      <p>
        Cayma hakkı kapsamındaki (ambalajı açılmamış, bozulabilir nitelikte
        olmayan) ürünler için talebinizi{" "}
        <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a> numaralı
        telefondan{legal.email ? (
          <>
            , <a href={`mailto:${legal.email}`}>{legal.email}</a> adresinden
          </>
        ) : null}{" "}
        veya WhatsApp üzerinden iletmeniz yeterlidir. Ürün, kuryemizce
        adresinizden ücretsiz teslim alınır; ayrıca kargo masrafı doğmaz.
      </p>

      <h2 id="garanti">6. Bozuk, hatalı veya eksik ürün garantisi</h2>
      <p>
        Cayma hakkının istisnası olan gıda ürünlerinde dahi{" "}
        <strong>ayıplı mal sorumluluğumuz saklıdır</strong>: teslim edilen
        ürün bozuk, hasarlı, son kullanma tarihi geçmiş veya sipariş
        ettiğinizden farklıysa, bize bildirmeniz halinde ürün koşulsuz olarak
        değiştirilir veya bedeli iade edilir.
      </p>

      <h2 id="iade">7. Ücret iadesi</h2>
      <ul>
        <li>
          <strong>Kapıda nakit/kartla ödenen</strong> siparişlerde iade,
          teslim anında nakden veya kartınıza yapılır.
        </li>
        <li>
          <strong>Online (iyzico) ile ödenen</strong> siparişlerde iade,
          iyzico aracılığıyla ödeme yaptığınız karta yapılır. İade, Mesafeli
          Sözleşmeler Yönetmeliği md. 12 uyarınca cayma/iade bildiriminizden
          itibaren <strong>en geç 14 gün içinde</strong> gerçekleştirilir;
          tutarın kartınıza yansıması bankanıza bağlı olarak 2-10 iş günü
          sürebilir.
        </li>
        <li>
          Sipariş, hazırlanmaya başlanmadan önce iptal edilirse tutarın
          tamamı iade edilir. İptal için bizi arayabilirsiniz.
        </li>
      </ul>

      <h2 id="iletisim">8. İletişim</h2>
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
          <dt>Web</dt>
          <dd>{BUSINESS.domain}</dd>
        </dl>
      </div>
      <p>
        Detaylı sözleşme koşulları için{" "}
        <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>{" "}
        ve <Link href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</Link>{" "}
        sayfalarımıza bakabilirsiniz.
      </p>
    </LegalShell>
  );
}
