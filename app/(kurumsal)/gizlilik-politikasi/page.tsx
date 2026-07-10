// Gizlilik Politikası + KVKK Aydınlatma Metni (/gizlilik-politikasi) —
// iyzico satıcı kriteri. 6698 sayılı KVKK md. 10 (aydınlatma yükümlülüğü)
// yapısına göre: veri sorumlusu, işlenen veriler, amaçlar, hukuki sebep,
// aktarım, saklama, md. 11 hakları ve çerezler.

import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import styles from "../kurumsal.module.css";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
  description:
    "Yeni Mahalle Market gizlilik politikası ve 6698 sayılı KVKK kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function GizlilikPage() {
  const legal = BUSINESS.legal;
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>
            Gizlilik Politikası ve{" "}
            <span className={styles.titleAccent}>KVKK Aydınlatma Metni</span>
          </h1>
          <p className={styles.sub}>
            Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması
            Kanunu&apos;na (KVKK) uygun olarak aşağıda açıklanan kapsamda
            işlenir ve korunur.
          </p>
          <span className={styles.updated}>Son güncelleme: 10 Temmuz 2026</span>
        </header>

        <div className={styles.body}>
          <h2>1. Veri sorumlusu</h2>
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
          <p>
            Bu metinde &quot;Market&quot; olarak anılan{" "}
            <strong>{BUSINESS.legalName}</strong>, KVKK kapsamında veri
            sorumlusu sıfatıyla hareket eder.
          </p>

          <h2>2. İşlenen kişisel veriler</h2>
          <ul>
            <li>
              <strong>Kimlik bilgileri:</strong> ad, soyad.
            </li>
            <li>
              <strong>İletişim bilgileri:</strong> telefon numarası, e-posta
              adresi, teslimat adresi.
            </li>
            <li>
              <strong>Konum bilgisi:</strong> yalnızca sipariş sırasında{" "}
              <em>siz izin verirseniz</em>, teslimat mesafesinin ve ücretinin
              hesaplanması için yaklaşık konumunuz.
            </li>
            <li>
              <strong>Müşteri işlem bilgileri:</strong> sipariş geçmişi, sepet
              içeriği, sipariş notları, kullanılan kuponlar.
            </li>
            <li>
              <strong>İşlem güvenliği bilgileri:</strong> IP adresi, oturum ve
              giriş kayıtları.
            </li>
          </ul>
          <p>
            <strong>Kart bilgileriniz Market tarafından işlenmez ve
            saklanmaz.</strong> Online ödemeler, BDDK lisanslı ödeme kuruluşu{" "}
            <strong>iyzico Ödeme Hizmetleri A.Ş.</strong> altyapısında, SSL
            şifrelemesi ve 3D Secure doğrulamasıyla gerçekleştirilir.
          </p>

          <h2>3. İşleme amaçları</h2>
          <ul>
            <li>Siparişlerin alınması, hazırlanması ve adrese teslimi,</li>
            <li>Üyelik hesabının oluşturulması ve yönetilmesi,</li>
            <li>Ödeme işlemlerinin gerçekleştirilmesi ve iade süreçleri,</li>
            <li>
              Sipariş durumu hakkında bilgilendirme ve müşteri iletişimi,
            </li>
            <li>Fatura düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi,</li>
            <li>
              Açık rızanız olması halinde kampanya ve duyuru bildirimleri.
            </li>
          </ul>

          <h2>4. Hukuki sebepler ve toplama yöntemi</h2>
          <p>
            Kişisel verileriniz; web sitemizdeki üyelik, sipariş ve iletişim
            formları ile telefon/WhatsApp kanalları üzerinden, KVKK md. 5/2-c
            (sözleşmenin kurulması ve ifası), md. 5/2-ç (hukuki yükümlülüğün
            yerine getirilmesi) ve md. 5/2-f (meşru menfaat) hukuki
            sebeplerine; pazarlama iletileri bakımından ise açık rızanıza
            dayanılarak toplanır ve işlenir.
          </p>

          <h2>5. Verilerin aktarılması</h2>
          <ul>
            <li>
              <strong>iyzico Ödeme Hizmetleri A.Ş.</strong> — online ödemenin
              gerçekleştirilmesi amacıyla,
            </li>
            <li>
              <strong>Teslimat personelimiz (kurye)</strong> — siparişin
              adresinize ulaştırılması için ad, adres ve telefon bilgisi,
            </li>
            <li>
              <strong>Barındırma ve altyapı hizmet sağlayıcıları</strong> —
              web sitemizin ve veri tabanımızın çalıştığı sunucu hizmetleri
              (sunucular yurt dışında bulunabilir),
            </li>
            <li>
              <strong>Yetkili kamu kurum ve kuruluşları</strong> — yasal
              zorunluluk halinde.
            </li>
          </ul>

          <h2>6. Saklama süresi</h2>
          <p>
            Kişisel verileriniz, üyeliğiniz devam ettiği sürece ve ilgili
            mevzuatta öngörülen süreler boyunca saklanır (örn. elektronik
            ticaret kayıtları için 3 yıl, fatura ve muhasebe kayıtları için 10
            yıl). Sürelerin sonunda verileriniz silinir, yok edilir veya
            anonim hale getirilir.
          </p>

          <h2>7. KVKK md. 11 kapsamındaki haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca herkes, veri sorumlusuna başvurarak;</p>
          <ul>
            <li>Kişisel verisinin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>
              İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
              öğrenme,
            </li>
            <li>
              Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
            </li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>
              KVKK md. 7 çerçevesinde silinmesini veya yok edilmesini isteme,
            </li>
            <li>
              Düzeltme/silme işlemlerinin verilerin aktarıldığı üçüncü
              kişilere bildirilmesini isteme,
            </li>
            <li>
              Münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhe
              bir sonucun ortaya çıkmasına itiraz etme,
            </li>
            <li>
              Kanuna aykırı işleme nedeniyle zarara uğraması hâlinde zararın
              giderilmesini talep etme
            </li>
          </ul>
          <p>
            haklarına sahiptir. Başvurularınızı yukarıdaki adrese yazılı
            olarak{legal.email ? (
              <>
                {" "}
                veya{" "}
                <a href={`mailto:${legal.email}`}>{legal.email}</a> e-posta
                adresine
              </>
            ) : null}{" "}
            iletebilirsiniz. Başvurular en geç 30 gün içinde ücretsiz olarak
            sonuçlandırılır.
          </p>

          <h2>8. Çerezler</h2>
          <p>
            Sitemizde, oturumunuzun açık kalması, sepetinizin hatırlanması ve
            temel site işlevleri için <strong>zorunlu çerezler</strong>{" "}
            kullanılır. Reklam veya üçüncü taraf takip çerezi kullanılmaz.
            Tarayıcınızın ayarlarından çerezleri dilediğiniz zaman
            silebilirsiniz; zorunlu çerezler engellenirse sepet ve üyelik
            işlevleri çalışmayabilir.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu metin gerektiğinde güncellenebilir; güncel sürüm her zaman bu
            sayfada yayımlanır. Sorularınız için{" "}
            <Link href="/iletisim">iletişim sayfamızı</Link> kullanabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
