// Mesafeli Satış Sözleşmesi (/mesafeli-satis-sozlesmesi): iyzico satıcı
// kriteri. 6502 sayılı TKHK md. 48 + Mesafeli Sözleşmeler Yönetmeliği
// (RG 27.11.2014/29188) yapısına göre; sipariş bazlı alanlar (ürün, fiyat,
// alıcı) ödeme sayfasındaki sipariş özetinden gelir.

import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import LegalShell from "../LegalShell";
import SellerInfoBox from "../SellerInfoBox";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Yeni Mahalle Market mesafeli satış sözleşmesi: taraflar, teslimat, ödeme, cayma hakkı ve uyuşmazlık çözümü koşulları.",
  alternates: { canonical: "/mesafeli-satis-sozlesmesi" },
};

const TOC = [
  { id: "taraflar", label: "Madde 1: Taraflar" },
  { id: "konu", label: "Madde 2: Konu" },
  { id: "urun", label: "Madde 3: Ürün, fiyat, ödeme" },
  { id: "teslimat", label: "Madde 4: Teslimat" },
  { id: "hukumler", label: "Madde 5: Genel hükümler" },
  { id: "cayma", label: "Madde 6: Cayma hakkı" },
  { id: "istisna", label: "Madde 7: Cayma istisnaları" },
  { id: "uyusmazlik", label: "Madde 8: Uyuşmazlıklar" },
  { id: "yururluk", label: "Madde 9: Yürürlük" },
];

export default function MesafeliSatisPage() {
  const legal = BUSINESS.legal;
  return (
    <LegalShell
      title="Mesafeli Satış Sözleşmesi"
      sub="Bu sözleşme, sipariş verirken elektronik ortamda onayınıza sunulur ve onayınızla birlikte kurulmuş sayılır."
      updated="10 Temmuz 2026"
      current="/mesafeli-satis-sozlesmesi"
      toc={TOC}
    >
      <h2 id="taraflar">Madde 1: Taraflar</h2>
      <h3>1.1. Satıcı</h3>
      <SellerInfoBox />
      <h3>1.2. Alıcı</h3>
      <p>
        Sipariş formunda ad-soyad, telefon ve teslimat adresi bilgilerini
        veren, siparişi elektronik ortamda onaylayan tüketici
        (&quot;Alıcı&quot;). Alıcının sipariş sırasında bildirdiği bilgiler bu
        sözleşmenin ayrılmaz parçasıdır.
      </p>

      <h2 id="konu">Madde 2: Konu</h2>
      <p>
        İşbu sözleşmenin konusu; Alıcının, Satıcıya ait{" "}
        <strong>{BUSINESS.domain}</strong> internet sitesinden elektronik
        ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş
        özetinde belirtilen ürünlerin satışı ve teslimi ile ilgili olarak 6502
        sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>

      <h2 id="urun">Madde 3: Sözleşme konusu ürün, fiyat ve ödeme bilgileri</h2>
      <p>
        Ürünlerin cinsi, türü, miktarı (adet/gram), tüm vergiler dahil satış
        fiyatı, teslimat ücreti, varsa indirim/kupon tutarı ve seçilen ödeme
        şekli, sipariş onayından hemen önce{" "}
        <strong>ödeme sayfasındaki sipariş özetinde</strong> gösterilir ve
        Alıcı tarafından onaylanır. Sipariş onayı sonrasında bu bilgiler
        sipariş takip sayfasında görüntülenebilir.
      </p>
      <ul>
        <li>Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir.</li>
        <li>
          Ödeme; kapıda nakit, kapıda banka/kredi kartı veya online (iyzico
          güvencesiyle kredi/banka kartı) yöntemlerinden Alıcının seçtiğiyle
          yapılır.
        </li>
        <li>
          Gramajlı (tartılı) ürünlerde teslim edilen miktar, sipariş edilen
          miktardan makul ölçüde (±%5) farklılık gösterebilir; ücret, sipariş
          edilen miktar üzerinden alınır.
        </li>
      </ul>

      <h2 id="teslimat">Madde 4: Teslimat</h2>
      <p>
        Ürünler, Satıcının kendi kuryesi ile Alıcının sipariş formunda
        bildirdiği adrese teslim edilir. Teslimat yalnızca Satıcının ilan
        ettiği hizmet bölgesi (Sapanca ve yakın çevresi) içinde yapılır.
        Siparişler, çalışma saatleri içinde ve stok/yoğunluk durumuna göre
        genellikle 30-60 dakika içinde, her hâlde Yönetmelikte öngörülen azami
        süre olan 30 gün içinde teslim edilir. Detaylar{" "}
        <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>{" "}
        sayfasında yer alır.
      </p>
      <p>
        Alıcının adreste bulunamaması hâlinde kurye Alıcıyı telefonla arar;
        teslim edilemeyen sipariş için Alıcı ile yeniden iletişime geçilir.
        Alıcıdan kaynaklanan nedenlerle teslim edilemeyen ve bozulan gıda
        ürünlerinin sorumluluğu Alıcıya aittir.
      </p>

      <h2 id="hukumler">Madde 5: Genel hükümler</h2>
      <ul>
        <li>
          Alıcı, sipariş vermeden önce{" "}
          <Link href="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</Link>
          &apos;nu okuyup elektronik ortamda teyit ettiğini kabul eder.
        </li>
        <li>
          Alıcı, ürünleri teslim anında kontrol eder; açıkça görülebilen
          eksiklik, hasar veya yanlışlıkları teslim anında kuryeye veya aynı
          gün içinde Satıcıya bildirir.
        </li>
        <li>
          Satıcı, sözleşme konusu ürünleri sağlam, eksiksiz ve siparişte
          belirtilen niteliklere uygun teslim etmekle yükümlüdür.
        </li>
        <li>
          Stokta bulunmayan ürünler için Satıcı Alıcıyı bilgilendirir; ilgili
          ürün bedeli tahsil edilmişse iade edilir veya Alıcının onayıyla
          eşdeğer ürün teslim edilir.
        </li>
        <li>
          Mücbir sebepler (olumsuz hava koşulları, doğal afet, resmi
          kısıtlamalar vb.) nedeniyle teslimatın gecikmesi hâlinde Satıcı
          Alıcıyı bilgilendirir; Alıcı siparişi iptal etme hakkına sahiptir.
        </li>
      </ul>

      <h2 id="cayma">Madde 6: Cayma hakkı</h2>
      <p>
        Alıcı, cayma hakkının kullanılabildiği ürünlerde, ürünü teslim aldığı
        tarihten itibaren <strong>14 (on dört) gün</strong> içinde hiçbir
        gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma
        hakkına sahiptir. Cayma bildirimi, Madde 1.1&apos;deki telefon
        {legal.email ? ", e-posta" : ""} veya yazılı iletişim kanallarından
        yapılabilir. Satıcı, cayma bildiriminin kendisine ulaştığı tarihten
        itibaren <strong>14 gün içinde</strong> ürün bedelini ve varsa
        teslimat masraflarını Alıcıya iade eder. İade edilecek ürün, Satıcının
        kuryesi tarafından adresten ücretsiz teslim alınır; Alıcı ayrıca bir
        iade masrafı ödemez.
      </p>

      <h2 id="istisna">Madde 7: Cayma hakkının kullanılamayacağı hâller</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca
        aşağıdaki sözleşmelerde cayma hakkı kullanılamaz:
      </p>
      <ul>
        <li>
          <strong>&quot;Çabuk bozulabilen veya son kullanma tarihi geçebilecek
          malların teslimine ilişkin sözleşmeler&quot;</strong> (md. 15/1-c):
          taze meyve ve sebze, et ve şarküteri ürünleri, süt ürünleri, ekmek
          ve fırın ürünleri, dondurulmuş gıda vb.
        </li>
        <li>
          <strong>&quot;Tesliminden sonra ambalaj, bant, mühür, paket gibi
          koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen
          açısından uygun olmayanların teslimine ilişkin
          sözleşmeler&quot;</strong> (md. 15/1-ç): ambalajı açılmış gıda,
          kişisel bakım ve hijyen ürünleri vb.
        </li>
      </ul>
      <p>
        Cayma hakkının istisnası olan ürünlerde dahi, ayıplı (bozuk, hasarlı,
        son kullanma tarihi geçmiş veya siparişten farklı) çıkan ürünlere
        ilişkin Alıcının 6502 sayılı Kanun&apos;dan doğan seçimlik hakları
        (değişim, bedel iadesi vb.) saklıdır.
      </p>

      <h2 id="uyusmazlik">Madde 8: Uyuşmazlıkların çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca her yıl
        belirlenen parasal sınırlar dahilinde Alıcının yerleşim yerinin
        bulunduğu veya tüketici işleminin yapıldığı yerdeki{" "}
        <strong>Tüketici Hakem Heyetleri</strong>; bu sınırları aşan
        uyuşmazlıklarda <strong>Tüketici Mahkemeleri</strong> görevli ve
        yetkilidir.
      </p>

      <h2 id="yururluk">Madde 9: Yürürlük</h2>
      <p>
        Alıcı, sipariş verirken işbu sözleşmenin tüm koşullarını kabul etmiş
        sayılır. Sözleşme, siparişin elektronik ortamda onaylanmasıyla kurulur
        ve ürünlerin teslimiyle ifa edilir. Sözleşmenin dili Türkçedir.
        Satıcı, sözleşme ve sipariş kayıtlarını 3 yıl süreyle saklar; Alıcı bu
        süre içinde kayıtlara erişim talep edebilir.
      </p>
    </LegalShell>
  );
}
