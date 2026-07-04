-- ============================================================
-- Yeni Mahalle Market — kampanya banner'ları v2
-- Eski seed'i temizler ve 10 anlamlı, çeşitli tint'li banner ekler.
-- tint: CATEGORY_TINTS index (0-7) — zemin/yazı rengi çifti.
-- cta_href: geçerli site yolları (/urunler, /firsatlar, /urunler?k=...).
-- cta_text boş ise buton çizilmez.
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard -> SQL Editor'e
-- yapıştırıp "Run" deyin.
-- ============================================================

delete from public.banners;

insert into public.banners (title, subtitle, cta_text, cta_href, tint, sort) values
  ('İlk siparişine 200 TL indirim',
   'HOSGELDIN200 koduyla ilk alışverişin 200 TL indirimli.',
   'Fırsatı Kullan', '/firsatlar', 1, 0),

  ('1500 TL üzeri ücretsiz teslimat',
   'Sepetin 1500 TL''yi geçsin, teslimat bizden olsun.',
   'Alışverişe Başla', '/urunler', 4, 1),

  ('Her hafta 20 üründe indirim',
   'Seçili 20 üründe her hafta yenilenen taze fırsatlar.',
   'Fırsatları Gör', '/firsatlar', 5, 2),

  ('30 dakikada kapında',
   'Sapanca içinde ortalama 30 dakikada teslimat.',
   'Sipariş Ver', '/urunler', 3, 3),

  ('Kapıda nakit veya kart',
   'Dilersen kapıda nakit, dilersen kartla rahatça öde.',
   '', '', 2, 4),

  ('Taze meyve sebze her gün',
   'Her sabah gelen taze meyve ve sebzeler reyonda.',
   'Reyona Git', '/urunler?k=meyve-sebze', 0, 5),

  ('Mangal keyfi burada',
   'Kömür, tüp ve tüm mangal gereçleri hazır.',
   'Mangallıkları Gör', '/urunler?k=mangal-komur', 2, 6),

  ('Kahvaltılıklar tam kadro',
   'Peynir, zeytin, bal ve daha fazlası bir arada.',
   'Kahvaltıya Bak', '/urunler?k=sut-kahvaltilik', 7, 7),

  ('Atıştırmalık reyonu',
   'Cips, çikolata ve kuruyemişte bol çeşit seni bekliyor.',
   'Atıştırmalıklar', '/urunler?k=atistirmalik', 6, 8),

  ('Temizlik ürünleri',
   'Evine ferahlık katacak temizlik ürünleri indirimde.',
   'Temizliğe Git', '/urunler?k=temizlik-deterjan', 3, 9);
