/**
 * Mahalle müşterilerinden örnek yorumlar (Google Maps formatında).
 *
 * Bu dosya şimdilik placeholder veri içeriyor. Sahibi gerçek Google
 * Place ID verince (BUSINESS.googlePlaceId) ileride şu şekilde
 * değiştirilebilir:
 *
 *   1. /api/reviews route handler ekle, server-side Google Places API
 *      çağrısı yap (fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=...&fields=reviews&key=...'))
 *   2. Bu dosyanın `getReviews()` fonksiyonu fetch eder, cache eder
 *   3. ReviewsSection client component'i içinde render eder
 *
 * Yorumlar Google Maps üzerinden çekilse de manuel olarak da
 * güncellenebilir — sahip dilerse her hafta birkaç gerçek yorumu
 * buraya kopyalayabilir.
 */

export interface Review {
  /** Müşteri adı (ilk isim + soyadın baş harfi tipik Google formatı) */
  name: string;
  /** Avatar için harf (genelde ismin ilk harfi) */
  initial: string;
  /** Yıldız sayısı 1-5 */
  rating: number;
  /** Görece tarih ("3 hafta önce", "2 ay önce") */
  date: string;
  /** Yorum metni */
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Ayşe K.",
    initial: "A",
    rating: 5,
    date: "2 hafta önce",
    text: "Mahallenin en güzel bakkalı. Sebze meyveler çok taze, fiyatlar uygun. Akşam saatlerinde bile sıcak ekmek bulabiliyorum. Telefonla arayınca eve teslim de yapıyorlar, çok pratik.",
  },
  {
    name: "Mehmet Y.",
    initial: "M",
    rating: 5,
    date: "1 ay önce",
    text: "Yeni Mahalle'ye taşındığımızdan beri tek alışveriş yerimiz. Ne aradıysak buldular, olmadığında bir gün içinde getirttiler. İnsanlar sıcakkanlı, market temiz.",
  },
  {
    name: "Fatma D.",
    initial: "F",
    rating: 5,
    date: "3 hafta önce",
    text: "Kahvaltılık ürünleri çok kaliteli. Özellikle peynir çeşitleri ve zeytinleri. Sıcak ekmek sabah erken alındığında bir başka oluyor. Tavsiye ederim.",
  },
  {
    name: "Hasan T.",
    initial: "H",
    rating: 4,
    date: "2 ay önce",
    text: "Sapanca'da güvenip alışveriş yapacağınız bir mahalle bakkalı. Geniş çalışma saatleri çok iyi, ben genelde işten geç çıkıyorum, kapalı değiller. Adrese teslim hizmeti süper.",
  },
  {
    name: "Zeynep A.",
    initial: "Z",
    rating: 5,
    date: "1 hafta önce",
    text: "WhatsApp'tan sipariş veriyoruz, 5 dakikada kapıda. Bayram için bile aradık, açıklardı. Esnaflık bu olsa gerek — hizmet, samimiyet, kalite hepsi bir arada.",
  },
];
