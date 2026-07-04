// SSS accordion: erişilebilir <details>/<summary> (JS gerektirmez).
// Açık/kapalı durum chevron değil, CSS ile çizilen +/- işaretiyle gösterilir.
// İçerik BUSINESS kurallarıyla (Sapanca, 07:30 - 00:00, kapıda nakit/kart +
// online kart) tutarlı tutulur. Teslimat ücreti/eşiği mağaza ayarlarından
// (shop_settings) yönetilir; SSS'te sabit tutar VERİLMEZ, sepette gösterilir.

import { BUSINESS } from "@/lib/business";
import styles from "./iletisim.module.css";

const FAQ = [
  {
    q: "Nerelere teslimat yapıyorsunuz?",
    a: "Sapanca içindeki tüm mahallelere adrese teslim hizmet veriyoruz. Adresin teslimat bölgemizde mi diye emin değilsen, siparişini vermeden bizi arayabilir ya da canlı destekten yazabilirsin.",
  },
  {
    q: "Siparişim ne kadar sürede gelir?",
    a: "Sapanca içi siparişler genellikle 30 dakika içinde kapında olur. Yoğun saatlerde ya da hava koşullarına göre bu süre bir miktar uzayabilir; kuryemiz yola çıkmadan seni bilgilendiririz.",
  },
  {
    q: "Teslimat ücreti ne kadar? Minimum sepet tutarı var mı?",
    a: "Sapanca içi teslimatta amacımız komşuluk: çoğu siparişi ek ücret almadan kapına getiriyoruz. Geçerli teslimat ücretini, varsa ücretsiz teslimat eşiğini ve minimum sepet tutarını, siparişini tamamlamadan hemen önce sepette net olarak görürsün; sürpriz bir tutar çıkmaz.",
  },
  {
    q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    a: "Kapıda nakit veya kredi/banka kartıyla ödeyebilirsin. Dilersen online kartla da güvenle ödeme yapabilirsin. Hangi yöntemi seçersen seç, ödemen güvence altındadır.",
  },
  {
    q: "Nasıl sipariş verebilirim?",
    a: "Ürünler sayfasından beğendiklerini sepetine ekle, adres ve ödeme adımlarını tamamla; siparişin bize anında ulaşır. Online sipariş vermek istemezsen telefonla da sipariş geçebilirsin.",
  },
  {
    q: "Çalışma saatleriniz nedir?",
    a: "Haftanın 7 günü, 07:30 ile 00:00 arasında açığız. Bayramlar dahil her gün hizmet veriyoruz. Sayfanın üstündeki canlı durum göstergesinden şu an açık olup olmadığımızı görebilirsin.",
  },
  {
    q: "Siparişimi nasıl takip ederim?",
    a: "Sipariş verdikten sonra hesabındaki siparişlerim bölümünden durumunu adım adım takip edebilirsin. Ayrıca kuryemiz yola çıktığında seni bilgilendiririz.",
  },
  {
    q: "Ürünler taze mi? İade ve değişim mümkün mü?",
    a: "Meyve, sebze ve şarküteri ürünlerini tezgahtan özenle seçip yolluyoruz. Bir üründen memnun kalmazsan ya da eksik/hatalı bir şey olduysa kuryeye teslim anında söyle; ürünü değiştirir veya iade alırız. Aklında soru varsa bizi hemen ara.",
  },
  {
    q: "Siparişimde eksik ya da yanlış ürün olursa ne yapmalıyım?",
    a: "Böyle bir durumda bizi telefonla ara veya canlı destekten yaz; en kısa sürede çözüme kavuşturur, eksik ürünü ulaştırır ya da tutarını iade ederiz. Bizim için en önemlisi memnun kalman.",
  },
  {
    q: "Üyelik ve kuponlar nasıl çalışıyor?",
    a: "Üyelik ücretsiz ve birkaç adımda tamamlanır; üye olduğunda siparişlerin ve adreslerin kayıtlı kalır, bir sonraki alışverişin çok daha hızlı olur. Kampanya ve indirim kuponlarını ödeme adımında sepetine uygulayabilirsin.",
  },
  {
    q: "Sipariş verdikten sonra sepetime ekleme yapabilir miyim?",
    a: "Siparişin hazırlanmaya başlamadıysa küçük eklemeler yapabiliriz. Bir şey eklemek istersen hemen bizi ara; kuryemiz yola çıkmadan sepetine dahil etmeye çalışırız.",
  },
  {
    q: "Size nasıl ulaşabilirim?",
    a: `En hızlısı telefon: ${BUSINESS.phone.display}. Dilersen site içi canlı destekten ya da Instagram'dan da yazabilirsin. Çalışma saatleri içinde hepsine hızlıca dönüş yapıyoruz.`,
  },
] as const;

export default function Faq() {
  // İki bağımsız kolon: geniş ekranda tam genişliği doldurur, accordion
  // açılınca yalnız kendi kolonunu uzatır (yan kolonu zıplatmaz).
  const mid = Math.ceil(FAQ.length / 2);
  const columns = [FAQ.slice(0, mid), FAQ.slice(mid)];

  return (
    <div className={styles.faqList}>
      {columns.map((column, i) => (
        <div key={i} className={styles.faqCol}>
          {column.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <span className={styles.faqQText}>{item.q}</span>
                <span className={styles.faqMark} aria-hidden="true" />
              </summary>
              <div className={styles.faqA}>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
