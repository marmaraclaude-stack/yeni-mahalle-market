/**
 * Geçici açık kaynak Unsplash görselleri.
 * Sahibi tarafından gerçek fotoğraflar verildiğinde:
 * - `/public/images/...` altına koy
 * - Bu sabitlerde URL'leri ilgili `/images/...` yoluyla değiştir
 *
 * Tüm URL'ler `auto=format&fit=crop&q=80` parametreleriyle optimize ediliyor.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMAGES = {
  // Hero — büyük market / sebze sahnesi
  hero: u("photo-1488459716781-31db52582fe9", 2400), // crates of fresh produce

  // Hizmet (bento) kartları
  produce: u("photo-1542838132-92c53300491e", 1200), // colorful veggies
  charcuterie: u("photo-1486297678162-eb2a19b0a32d", 1200), // cheese / deli
  bread: u("photo-1509440159596-0249088772ff", 1200), // bread
  delivery: u("photo-1604719312566-8912e9227c6a", 1200), // grocery delivery
  // photo: u("photo-1542838132-92c53300491e", 1200),

  // Galeri
  gallery1: u("photo-1488459716781-31db52582fe9", 1800),
  gallery2: u("photo-1546470427-227ad9c25e7c", 1000), // tomatoes
  gallery3: u("photo-1547514701-42782101795e", 1000), // citrus
  gallery4: u("photo-1518977676601-b53f82aba655", 1000), // cherry tomatoes
  gallery5: u("photo-1604329760661-e71dc83f8f26", 1600), // cheese counter

  // Hikaye (sahip / dükkan)
  story: u("photo-1542838132-92c53300491e", 1400),
} as const;
