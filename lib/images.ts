/**
 * Pexels — agent tarafından her ID Google index'iyle doğrulandı.
 * URL deseni: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg
 */

const p = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  // Hero — meyve sebze çeşitliliği (Pixabay / Pexels 264537)
  hero: p(264537, 2400),

  // Kategori kartları
  produce: p(2095569, 1200), // yeşil yapraklı sebzeler — Stella Schafer
  charcuterie: p(28571022, 1200), // renkli peynir tezgâhı — Nino Matin
  bread: p(7541727, 1200), // rustik ekmek — Cats Coming
  delivery: p(9461451, 1200), // teslimat — Mike Jones

  // Galeri (yedek)
  gallery1: p(14650541, 1800), // pazar tezgâhı — Feyza Tugba
  gallery2: p(1287278, 1200), // taze ekmek — Andrew Schwark

  // Hikaye
  story: p(30848031, 1400), // küçük dükkan içi — Kalz Michael
} as const;
