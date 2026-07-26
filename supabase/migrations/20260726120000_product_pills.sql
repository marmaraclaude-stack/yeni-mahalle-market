-- Ürün pilleri (rozetler): "Laktozsuz", "Günlük Taze", "Probiyotik" gibi
-- ürün sayfasında ve kartta gösterilen etiketler. Yönetici üründe birden
-- fazla pil seçebilir; pil ZORUNLU DEĞİLDİR (çoğu üründe boş kalır).
-- Geçerli anahtarlar lib/shop/pills.ts içindeki katalogda tanımlıdır;
-- bilinmeyen anahtar arayüzde sessizce yok sayılır.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS pills text[] NOT NULL DEFAULT '{}';

-- Pile göre filtreleme/sayım için GIN indeksi (ör. "laktozsuz" ürünleri listele)
CREATE INDEX IF NOT EXISTS products_pills_idx ON products USING GIN (pills);

COMMENT ON COLUMN products.pills IS
  'Ürün rozet anahtarları (lib/shop/pills.ts kataloğu). Boş dizi = pil yok.';
