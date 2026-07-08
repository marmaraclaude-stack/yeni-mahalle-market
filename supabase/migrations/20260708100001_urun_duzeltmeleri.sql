-- ============================================================
-- Urun metni duzeltmeleri (ad / size_text / description).
-- Onceki seed'lerde yesillik biriminde yanlislikla "baglama" (muzik
-- aleti) yazilmis; dogrusu "bag" (demet). Ayrica birkac ASCII/yazim
-- hatasi duzeltildi. Idempotent: yalniz eslesen slug'lari gunceller.
-- ============================================================

-- Yesillik birimi: "baglama" -> "bag"
update public.products set size_text = 'bağ'
 where size_text = 'bağlama';

-- Eski ASCII adli/aciklamali yesillik demeti kaydini duzelt
update public.products
   set name = 'Maydanoz Demeti',
       size_text = 'bağ',
       description = 'Salata ve çorbalık, taze kesim maydanoz demeti.'
 where slug = 'maydanoz-demet-adet';

-- "Kuru Sogan Fileli" -> dogru Turkce ve daha net ad
update public.products
   set name = 'Kuru Soğan (Fileli)'
 where slug = 'kuru-sogan-file-2-kg';
