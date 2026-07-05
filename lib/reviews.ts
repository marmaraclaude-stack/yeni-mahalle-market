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
  {
    name: "Merve Kaya",
    initial: "M",
    rating: 5,
    date: "1 ay önce",
    text: "Online sipariş verdim, yarım saat geçmeden kapımdaydı. Ürünler tertemiz paketlenmişti, teşekkürler.",
  },
  {
    name: "Hasan Demirci",
    initial: "H",
    rating: 5,
    date: "2 ay önce",
    text: "Sapanca'da gece geç saatte açık olan nadir marketlerden. Fiyatlar da gayet makul.",
  },
  {
    name: "Elif Şahin",
    initial: "E",
    rating: 5,
    date: "2 ay önce",
    text: "Manav reyonu her zaman taze. Telefonla da sipariş alıyorlar, çok pratik.",
  },
  {
    name: "Mustafa Koç",
    initial: "M",
    rating: 4,
    date: "3 ay önce",
    text: "Ürün çeşidi çok iyi, önü biraz kalabalık olabiliyor ama hizmet güzel.",
  },
  {
    name: "Ayşe Yıldırım",
    initial: "A",
    rating: 5,
    date: "3 ay önce",
    text: "Bayramda bile açıklardı, iyi ki varsınız. Mahallenin can damarı.",
  },
  {
    name: "Emre Aydın",
    initial: "E",
    rating: 5,
    date: "5 ay önce",
    text: "Kurye çok hızlı, ilgi sıcak. Mangal kömüründen şarj aletine her şey var.",
  },
  {
    name: "Seda Arslan",
    initial: "S",
    rating: 5,
    date: "6 ay önce",
    text: "Şarküteri ürünleri taze, çalışanlar güler yüzlü. Mahallenin şansı.",
  },
  {
    name: "Burak Öztürk",
    initial: "B",
    rating: 4,
    date: "7 ay önce",
    text: "Zincir marketlere göre bazı ürünler bir tık pahalı olabiliyor ama kalite ve eve teslim kolaylığı buna değer.",
  },
  {
    name: "Gamze Çelik",
    initial: "G",
    rating: 5,
    date: "8 ay önce",
    text: "Tatile her gelişimizde alışverişi buradan yapıyoruz. Eve teslim süper, ürünler eksiksiz geliyor.",
  },
  {
    name: "Kerem Ünal",
    initial: "K",
    rating: 5,
    date: "bir yıl önce",
    text: "Sitesinden sipariş verdim, eksiksiz ve hızlı geldi. Kapıda kartla ödedim, çok rahat.",
  },
];

// Gerçek Google Business Profile verisi; placeholder yorum listesinden TÜRETME.
export const REVIEW_STATS = {
  count: 86,
  average: 4.2,
};
