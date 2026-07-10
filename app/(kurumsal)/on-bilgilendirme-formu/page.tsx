// Ön Bilgilendirme Formu (/on-bilgilendirme-formu) — Mesafeli Sözleşmeler
// Yönetmeliği md. 5 uyarınca sipariş öncesi tüketiciye sunulması zorunlu
// bilgiler. Ödeme sayfasındaki onay kutusu bu forma ve sözleşmeye bağlanır.

import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import styles from "../kurumsal.module.css";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description:
    "Yeni Mahalle Market ön bilgilendirme formu: satıcı bilgileri, ürün ve fiyat bilgisi, ödeme, teslimat ve cayma hakkı hakkında sipariş öncesi bilgilendirme.",
  alternates: { canonical: "/on-bilgilendirme-formu" },
};

export default function OnBilgilendirmePage() {
  const legal = BUSINESS.legal;
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>
            Ön Bilgilendirme{" "}
            <span className={styles.titleAccent}>Formu</span>
          </h1>
          <p className={styles.sub}>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
            Sözleşmeler Yönetmeliği md. 5 uyarınca, siparişinizi vermeden önce
            aşağıdaki hususlarda bilgilendirilirsiniz.
          </p>
          <span className={styles.updated}>Son güncelleme: 10 Temmuz 2026</span>
        </header>

        <div className={styles.body}>
          <h2>1. Satıcıya ilişkin bilgiler</h2>
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

          <h2>2. Ürünlere ve fiyata ilişkin bilgiler</h2>
          <p>
            Satışa sunulan ürünlerin temel nitelikleri (ad, marka, gramaj/adet)
            ürün sayfalarında; sipariş ettiğiniz ürünlerin miktarı, tüm
            vergiler dahil birim ve toplam fiyatı, teslimat ücreti ve varsa
            indirimler, sipariş onayından önce{" "}
            <strong>ödeme sayfasındaki sipariş özetinde</strong> TL cinsinden
            açıkça gösterilir. Gramajlı ürünlerde teslim edilen miktar makul
            ölçüde (±%5) farklılık gösterebilir.
          </p>

          <h2>3. Ödemeye ilişkin bilgiler</h2>
          <p>
            Ödemenizi kapıda nakit, kapıda banka/kredi kartı veya online
            (iyzico Ödeme Hizmetleri A.Ş. güvencesiyle kredi/banka kartı)
            yöntemlerinden biriyle yapabilirsiniz. Online ödemelerde kart
            bilgileriniz Satıcı tarafından görülmez ve saklanmaz.
          </p>

          <h2>4. Teslimata ilişkin bilgiler</h2>
          <p>
            Siparişiniz, Satıcının kendi kuryesi ile sipariş formunda
            bildirdiğiniz adrese teslim edilir. Teslimat yalnızca ilan edilen
            hizmet bölgesinde (Sapanca ve yakın çevresi) ve çalışma saatleri
            ({BUSINESS.hours.display}) içinde yapılır; siparişler genellikle
            30–60 dakika içinde teslim edilir. Teslimat ücreti ödeme
            sayfasında gösterilir. Ayrıntılar için{" "}
            <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>.
          </p>

          <h2>5. Cayma hakkına ilişkin bilgiler</h2>
          <p>
            Cayma hakkının kullanılabildiği ürünlerde, malı teslim aldığınız
            tarihten itibaren <strong>14 gün</strong> içinde gerekçe
            göstermeksizin cayma hakkınız vardır. Cayma bildirimini yukarıdaki
            telefon{legal.email ? ", e-posta" : ""} veya yazılı iletişim
            kanallarından yapabilirsiniz; ürün kuryemizce adresinizden
            ücretsiz teslim alınır ve bedeli 14 gün içinde iade edilir.
          </p>
          <p>
            <strong>Ancak</strong>, Mesafeli Sözleşmeler Yönetmeliği md. 15
            uyarınca <strong>çabuk bozulabilen veya son kullanma tarihi
            geçebilecek ürünlerde</strong> (taze meyve-sebze, et, şarküteri,
            süt ürünleri, fırın ürünleri vb.) ve{" "}
            <strong>ambalajı açıldıktan sonra iadesi sağlık ve hijyen
            açısından uygun olmayan ürünlerde</strong> cayma hakkı
            kullanılamaz. Bozuk, hasarlı veya yanlış çıkan ürünlere ilişkin
            yasal haklarınız (değişim, bedel iadesi) her durumda saklıdır.
          </p>

          <h2>6. Uyuşmazlıklara ilişkin bilgiler</h2>
          <p>
            Siparişinizle ilgili şikâyet ve itirazlarınızı öncelikle Satıcıya
            iletebilirsiniz. Ayrıca, Ticaret Bakanlığınca her yıl belirlenen
            parasal sınırlar dahilinde yerleşim yerinizin bulunduğu veya
            tüketici işleminin yapıldığı yerdeki{" "}
            <strong>Tüketici Hakem Heyetine</strong>, bu sınırların üzerindeki
            uyuşmazlıklarda <strong>Tüketici Mahkemesine</strong>{" "}
            başvurabilirsiniz.
          </p>

          <h2>7. Geçerlilik</h2>
          <p>
            Bu form, ödeme sayfasındaki onay kutusunu işaretlemenizle birlikte
            elektronik ortamda tarafınızca teyit edilmiş sayılır ve{" "}
            <Link href="/mesafeli-satis-sozlesmesi">
              Mesafeli Satış Sözleşmesi
            </Link>
            &apos;nin ayrılmaz parçasıdır. Sipariş kayıtları Satıcı tarafından
            3 yıl süreyle saklanır.
          </p>
        </div>
      </div>
    </main>
  );
}
