/**
 * Yeni Mahalle Market — gercek Google Maps yorumlari.
 * Sahibinin GBP sayfasindan derlendi.
 */

export interface Review {
  name: string;
  initial: string;
  rating: number;
  date: string;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Duha Enes",
    initial: "D",
    rating: 5,
    date: "4 ay önce",
    text: "Kaliteli hizmet. Reyonların düzeni, müşteri ilişkisi, özellikle manav reyonu taze olması beş yıldızı hak ediyor.",
  },
  {
    name: "Zeynep Zahide Arkan",
    initial: "Z",
    rating: 5,
    date: "4 ay önce",
    text: "Market yenilenmiş ve harika olmuş. Artık sadece bir mahalle marketi değil, büyük zincir marketlerde bulabileceğiniz her şey var. Mutlaka uğrayın.",
  },
  {
    name: "Uğur Acar",
    initial: "U",
    rating: 5,
    date: "11 ay önce",
    text: "Bir markette olması gereken neredeyse her şey var. Gecenin kaçında olursa olsun sipariş verdiğinizde evinize kadar getiriliyor. Eve teslim de var, manav reyonu, tavuk reyonu, dondurma reyonu... Kaliteli, güler yüzlü hizmet ön planda.",
  },
  {
    name: "Ömer Faruk Karaoğlu",
    initial: "Ö",
    rating: 5,
    date: "4 ay önce",
    text: "Temiz ve düzenli olması yetmiyormuş gibi bir de tatlı insanlar.",
  },
  {
    name: "Faruk Akbıyık",
    initial: "F",
    rating: 5,
    date: "5 ay önce",
    text: "Çok güzel, özellikle et ürünlerinin konumu ve duruşu, al benisi harika 😋👌",
  },
  {
    name: "Betül Benli",
    initial: "B",
    rating: 5,
    date: "4 ay önce",
    text: "Çok güzel, temiz bir market. Öneriyorum 👍",
  },
  {
    name: "Ömer Hyt",
    initial: "Ö",
    rating: 5,
    date: "4 ay önce",
    text: "Çok temiz, düzenli. Memnuniyetle alışveriş yapıyoruz.",
  },
  {
    name: "Ümit Güldemir",
    initial: "Ü",
    rating: 4,
    date: "10 ay önce",
    text: "Tatil alanlarına yakın olması ilçe merkezine inmemek için çok iyi. Piknik ve mangal malzemeleri mevcut.",
  },
  {
    name: "Fatih Topcu",
    initial: "F",
    rating: 5,
    date: "bir yıl önce",
    text: "Güleryüzlü hizmet, kaliteli, uygun fiyat.",
  },
  {
    name: "Ahmet Yağmur",
    initial: "A",
    rating: 5,
    date: "2 yıl önce",
    text: "4/4 hizmet ve kaliteli işletme.",
  },
];

// Gerçek Google Business Profile verisi; placeholder yorum listesinden TÜRETME.
export const REVIEW_STATS = {
  count: 86,
  average: 4.2,
};
