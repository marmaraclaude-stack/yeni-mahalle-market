-- ============================================================
-- Yeni Mahalle Market: katalog genisletme (500+ urun)
-- Mevcut 20260703100001_eticaret_seed.sql (284 urun) UZERINE EK.
-- 29 siparis edilebilir kategoriye 8''er yeni gercek Turk market
-- urunu (toplam +232 => genel toplam 516). Sigara & Tutun HARIC
-- (4207/4733: online tutun satisi yasak).
--
-- Kolon sirasi seed ile AYNI:
--   (category_slug, name, slug, brand, size_text, description,
--    price, compare_at_price, unit, is_featured, sort)
-- image_url bilincli NULL (UI kategori renkli placeholder basar).
-- Yeni sort degerleri 20+''dan baslar (mevcut 0-11 ile cakismaz;
-- yeni urunler dogal olarak listenin sonuna eklenir).
-- Slug''lar mevcut seed''dekilerle CAKISMAZ (farkli marka/urun/gramaj).
-- Idempotent: on conflict (slug) do nothing.
--
-- KURULUM: 20260703100001_eticaret_seed.sql sonrasinda calistirin.
-- ============================================================

-- Meyve & Sebze
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('meyve-sebze', 'Portakal', 'portakal-kg', '', '1 kg', 'Bol sulu, sikmalik ve yemelik tatli kabuklu portakal.', 34.90, null, 'kg', true, 20),
  ('meyve-sebze', 'Mandalina', 'mandalina-kg', '', '1 kg', 'Kolay soyulan, tatli ve kokulu mevsim mandalinasi.', 39.90, null, 'kg', false, 21),
  ('meyve-sebze', 'Havuc', 'havuc-kg', '', '1 kg', 'Salata ve yemeklik, tatli ve gevrek taze havuc.', 27.90, null, 'kg', false, 22),
  ('meyve-sebze', 'Patlican', 'patlican-kg', '', '1 kg', 'Kizartma ve kebaplik ince kabuklu kemer patlican.', 44.90, null, 'kg', false, 23),
  ('meyve-sebze', 'Carliston Biber', 'carliston-biber-kg', '', '1 kg', 'Dolmalik ve kizartmalik tatli carliston biber.', 49.90, null, 'kg', false, 24),
  ('meyve-sebze', 'Sarimsak', 'sarimsak-kg', '', '1 kg', 'Yemeklere lezzet katan, kuru yerli sarimsak.', 129.90, null, 'kg', false, 25),
  ('meyve-sebze', 'Kivircik Marul', 'kivircik-marul-adet', '', 'adet', 'Sandvic ve salatalara citir citir taze kivircik marul.', 24.90, null, 'adet', false, 26),
  ('meyve-sebze', 'Sultani Uzum', 'sultani-uzum-kg', '', '1 kg', 'Cekirdeksiz, tatli ve taneli sultani cesme uzumu.', 59.90, null, 'kg', true, 27)
on conflict (slug) do nothing;

-- Sarkuteri & Et
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarkuteri-et', 'Banvit Pilic Gogus Fileto 1 kg', 'banvit-pilic-gogus-fileto-1-kg', 'Banvit', '1 kg', 'Yagsiz ve pratik, izgara ve sote icin pilic gogus fileto.', 189.90, null, 'adet', true, 20),
  ('sarkuteri-et', 'Dana Kusbasi 500 g', 'dana-kusbasi-500-g', '', '500 g', 'Guvec ve sote icin kasap isi taze dana kusbasi.', 329.90, null, 'paket', false, 21),
  ('sarkuteri-et', 'Apikoglu Kangal Sucuk 400 g', 'apikoglu-kangal-sucuk-400-g', 'Apikoglu', '400 g', 'Baharati yerinde, fermente geleneksel kangal sucuk.', 269.90, null, 'adet', true, 22),
  ('sarkuteri-et', 'Pinar Macar Salam 200 g', 'pinar-macar-salam-200-g', 'Pinar', '200 g', 'Tost ve sandvice yakisan dilimli Macar salam.', 99.90, null, 'adet', false, 23),
  ('sarkuteri-et', 'Namet Dana Jambon 65 g', 'namet-dana-jambon-65-g', 'Namet', '65 g', 'Ince dilimli, kahvaltilik hafif dana jambon.', 74.90, null, 'adet', false, 24),
  ('sarkuteri-et', 'Pinar Tavuk Gogus Fume 70 g', 'pinar-tavuk-gogus-fume-70-g', 'Pinar', '70 g', 'Dusuk yagli, salata ve tostluk dilimli tavuk fume.', 69.90, null, 'adet', false, 25),
  ('sarkuteri-et', 'Senpilic Pilic Kanat 1 kg', 'senpilic-pilic-kanat-1-kg', 'Senpilic', '1 kg', 'Mangal ve firin icin marine edilmeye hazir pilic kanat.', 119.90, null, 'adet', false, 26),
  ('sarkuteri-et', 'Maret Dana Bacon Dilim 150 g', 'maret-dana-bacon-dilim-150-g', 'Maret', '150 g', 'Kahvalti ve burger icin ince dilimli dana bacon.', 129.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Ekmek & Firin
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('ekmek-firin', 'Tam Bugday Ekmek 400 g', 'tam-bugday-ekmek-400-g', '', '400 g', 'Lif orani yuksek, uzun tok tutan tam bugday ekmegi.', 22.90, null, 'adet', true, 20),
  ('ekmek-firin', 'Uno Sandvic Ekmegi 6 li', 'uno-sandvic-ekmegi-6li', 'Uno', '6''li', 'Kahvaltilik ve ara ogunluk yumusak susamli sandvic ekmegi.', 34.90, null, 'paket', false, 21),
  ('ekmek-firin', 'Tereyagli Acma', 'tereyagli-acma-adet', '', 'adet', 'Sabah firinindan, katmer katmer tereyagli acma.', 16.50, null, 'adet', false, 22),
  ('ekmek-firin', 'Cikolatali Kruvasan', 'cikolatali-kruvasan-adet', '', 'adet', 'Ici bol cikolata dolgulu, tereyagli citir kruvasan.', 24.90, null, 'adet', true, 23),
  ('ekmek-firin', 'Tahinli Corek', 'tahinli-corek-adet', '', 'adet', 'Tahin ve pekmez dolgulu, geleneksel firin coregi.', 19.90, null, 'adet', false, 24),
  ('ekmek-firin', 'Kasarli Pogaca', 'kasarli-pogaca-adet', '', 'adet', 'Bol kasarli, agizda dagilan yumusak firin pogacasi.', 18.50, null, 'adet', false, 25),
  ('ekmek-firin', 'Kepekli Galeta 375 g', 'kepekli-galeta-375-g', '', '375 g', 'Corba ve kahvaltilik, citir kepekli dilim galeta.', 32.90, null, 'adet', false, 26),
  ('ekmek-firin', 'Vakfikebir Koy Ekmegi 1,5 kg', 'vakfikebir-koy-ekmegi-1-5-kg', '', '1,5 kg', 'Eksi mayali, kalin kabuklu Trabzon Vakfikebir ekmegi.', 74.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Sut & Kahvaltilik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sut-kahvaltilik', 'Sek Laktozsuz Sut 1 L', 'sek-laktozsuz-sut-1-l', 'Sek', '1 L', 'Sindirimi kolay, laktoz hassasiyeti olanlar icin tam yagli sut.', 62.90, null, 'adet', true, 20),
  ('sut-kahvaltilik', 'Danone Activia Yogurt 4x100 g', 'danone-activia-yogurt-4x100-g', 'Danone', '4x100 g', 'Probiyotik kulturlu, sindirimi destekleyen kase yogurt.', 64.90, null, 'paket', false, 21),
  ('sut-kahvaltilik', 'Pinar Kasar Peyniri 350 g', 'pinar-kasar-peyniri-350-g', 'Pinar', '350 g', 'Tost ve makarnalik, kolay eriyen taze kasar peyniri.', 164.90, null, 'adet', false, 22),
  ('sut-kahvaltilik', 'Sutas Suzme Peynir 750 g', 'sutas-suzme-peynir-750-g', 'Sutas', '750 g', 'Kremamsi ve az tuzlu, kahvaltilik suzme peynir.', 189.90, null, 'adet', false, 23),
  ('sut-kahvaltilik', 'Yorsan Ezine Beyaz Peynir 600 g', 'yorsan-ezine-beyaz-peynir-600-g', 'Yorsan', '600 g', 'Koyun ve keci sutu harmanli, olgunlasmis Ezine peyniri.', 249.90, null, 'adet', true, 24),
  ('sut-kahvaltilik', 'Nutella Kakaolu Findik Kremasi 400 g', 'nutella-kakaolu-findik-kremasi-400-g', 'Nutella', '400 g', 'Ekmek arasinin klasigi, findikli kakaolu surme krema.', 189.90, null, 'adet', false, 25),
  ('sut-kahvaltilik', 'Sutas Tereyagi 250 g', 'sutas-tereyagi-250-g', 'Sutas', '250 g', 'Kahvaltiya ve tarifelere, dogal kaymakli tereyagi.', 159.90, null, 'adet', false, 26),
  ('sut-kahvaltilik', 'Tikvesli Kefir 1 L', 'tikvesli-kefir-1-l', 'Tikvesli', '1 L', 'Bagisikligi destekleyen, dogal fermente sade kefir.', 74.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Icecek & Su
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('icecek-su', 'Pepsi 1 L', 'pepsi-1-l', 'Pepsi', '1 L', 'Buz gibi icimlik, gazi bol klasik kola.', 49.90, null, 'adet', true, 20),
  ('icecek-su', 'Sprite 1 L', 'sprite-1-l', 'Sprite', '1 L', 'Limon aromali, ferahlatan renksiz gazli icecek.', 49.90, null, 'adet', false, 21),
  ('icecek-su', 'Fuse Tea Seftali 1 L', 'fuse-tea-seftali-1-l', 'Fuse Tea', '1 L', 'Seftali aromali, bardaga buzla yakisan soguk cay.', 52.90, null, 'adet', false, 22),
  ('icecek-su', 'Cappy Karisik Meyve Suyu 1 L', 'cappy-karisik-meyve-suyu-1-l', 'Cappy', '1 L', 'Elma, seftali ve uzumlu dogal karisik meyve suyu.', 62.90, null, 'adet', false, 23),
  ('icecek-su', 'Damla Su 0,5 L 12 li', 'damla-su-0-5-l-12li', 'Damla', '12x0,5 L', 'Ev, ofis ve piknige pratik on ikili pet sise su.', 89.90, null, 'paket', true, 24),
  ('icecek-su', 'Sarikiz Maden Suyu Sade 6x200 ml', 'sarikiz-maden-suyu-sade-6x200-ml', 'Sarikiz', '6x200 ml', 'Dogal mineralli, sade icimli klasik maden suyu.', 54.90, null, 'paket', false, 25),
  ('icecek-su', 'Fruko Gazoz 1 L', 'fruko-gazoz-1-l', 'Fruko', '1 L', 'Nostaljik meyve aromali, bol gazli gazoz.', 42.90, null, 'adet', false, 26),
  ('icecek-su', 'Tropicana Portakal Suyu 1 L', 'tropicana-portakal-suyu-1-l', 'Tropicana', '1 L', 'Yuzde yuz meyveden, posali gercek portakal suyu.', 74.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Bakliyat & Makarna
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bakliyat-makarna', 'Barilla Spaghetti No5 500 g', 'barilla-spaghetti-no5-500-g', 'Barilla', '500 g', 'Al dente pisen, Italyan usulu duru bugday spaghetti.', 54.90, null, 'adet', true, 20),
  ('bakliyat-makarna', 'Nuhun Ankara Kelebek Makarna 500 g', 'nuhun-ankara-kelebek-makarna-500-g', 'Nuh''un Ankara', '500 g', 'Salata ve firin icin sevimli kelebek makarna.', 26.90, null, 'adet', false, 21),
  ('bakliyat-makarna', 'Piyale Arpa Sehriye 500 g', 'piyale-arpa-sehriye-500-g', 'Piyale', '500 g', 'Corba ve pilavlara lezzet katan klasik arpa sehriye.', 24.90, null, 'adet', false, 22),
  ('bakliyat-makarna', 'Duru Pilavlik Bulgur 1 kg', 'duru-pilavlik-bulgur-1-kg', 'Duru', '1 kg', 'Tane tane pisen, yemeklik iri pilavlik bulgur.', 54.90, null, 'adet', false, 23),
  ('bakliyat-makarna', 'Reis Barbunya 1 kg', 'reis-barbunya-1-kg', 'Reis', '1 kg', 'Zeytinyagli ve etli yemekler icin iri taneli barbunya.', 94.90, null, 'adet', false, 24),
  ('bakliyat-makarna', 'Yayla Asurelik Bugday 1 kg', 'yayla-asurelik-bugday-1-kg', 'Yayla', '1 kg', 'Asure ve corbalar icin ayiklanmis asurelik bugday.', 49.90, null, 'adet', false, 25),
  ('bakliyat-makarna', 'Nuhun Ankara Irmik 500 g', 'nuhun-ankara-irmik-500-g', 'Nuh''un Ankara', '500 g', 'Tatli ve tarifelik, ince cekim bugday irmigi.', 27.90, null, 'adet', false, 26),
  ('bakliyat-makarna', 'Soke Bugday Unu 2 kg', 'soke-bugday-unu-2-kg', 'Soke', '2 kg', 'Boregi ve hamur isleri icin cok amacli bugday unu.', 64.90, null, 'adet', true, 27)
on conflict (slug) do nothing;

-- Konserve & Hazir Yemek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('konserve-hazir-yemek', 'Tamek Domates Salcasi 700 g', 'tamek-domates-salcasi-700-g', 'Tamek', '700 g', 'Gunes tadinda, yogun kivamli klasik domates salcasi.', 89.90, null, 'adet', true, 20),
  ('konserve-hazir-yemek', 'Tat Ton Baligi 160 g', 'tat-ton-baligi-160-g', 'Tat', '160 g', 'Aycicek yaginda, salata ve sandvice buttun dilim ton.', 74.90, null, 'adet', false, 21),
  ('konserve-hazir-yemek', 'Tukas Kirmizi Fasulye Konservesi 800 g', 'tukas-kirmizi-fasulye-konservesi-800-g', 'Tukas', '800 g', 'Haslanmaya hazir, salata ve pilaki icin kirmizi fasulye.', 54.90, null, 'adet', false, 22),
  ('konserve-hazir-yemek', 'Yayla Hazir Mercimek Corbasi 500 g', 'yayla-hazir-mercimek-corbasi-500-g', 'Yayla', '500 g', 'Isitip servis edilen, ev tadinda hazir mercimek corbasi.', 44.90, null, 'adet', false, 23),
  ('konserve-hazir-yemek', 'Tamek Kozlenmis Patlican 550 g', 'tamek-kozlenmis-patlican-550-g', 'Tamek', '550 g', 'Salata ve begendi icin atese kozlenmis patlican.', 59.90, null, 'adet', false, 24),
  ('konserve-hazir-yemek', 'Tukas Barbunya Pilaki 800 g', 'tukas-barbunya-pilaki-800-g', 'Tukas', '800 g', 'Zeytinyagli, acip servis etmelik hazir barbunya pilaki.', 64.90, null, 'adet', true, 25),
  ('konserve-hazir-yemek', 'Knorr Domates Corbasi 65 g', 'knorr-domates-corbasi-65-g', 'Knorr', '65 g', 'Bes dakikada hazir, kremamsi hazir domates corbasi.', 24.90, null, 'adet', false, 26),
  ('konserve-hazir-yemek', 'Tamek Zeytinyagli Biber Dolma 400 g', 'tamek-zeytinyagli-biber-dolma-400-g', 'Tamek', '400 g', 'Soguk servislik, zeytinyagli hazir biber dolma.', 84.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Yag, Sos & Baharat
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('yag-sos-baharat', 'Komili Aycicek Yagi 2 L', 'komili-aycicek-yagi-2-l', 'Komili', '2 L', 'Kizartma ve yemeklik, berrak icimli aycicek yagi.', 189.90, null, 'adet', true, 20),
  ('yag-sos-baharat', 'Kirlangic Sizma Zeytinyagi 1 L', 'kirlangic-sizma-zeytinyagi-1-l', 'Kirlangic', '1 L', 'Soguk sikim, salatalara aromali erken hasat sizma yag.', 329.90, null, 'adet', true, 21),
  ('yag-sos-baharat', 'Heinz Ketcap 460 g', 'heinz-ketcap-460-g', 'Heinz', '460 g', 'Yogun domates tadinda, patates ve burgere klasik ketcap.', 64.90, null, 'adet', false, 22),
  ('yag-sos-baharat', 'Heinz Mayonez 400 g', 'heinz-mayonez-400-g', 'Heinz', '400 g', 'Kremamsi kivamda, salata ve sandvic mayonezi.', 69.90, null, 'adet', false, 23),
  ('yag-sos-baharat', 'Bizim Mutfak Kekik 40 g', 'bizim-mutfak-kekik-40-g', 'Bizim Mutfak', '40 g', 'Corba ve etlere aromali dokunus, kurutulmus kekik.', 29.90, null, 'adet', false, 24),
  ('yag-sos-baharat', 'Bagdat Toz Kirmizi Biber 65 g', 'bagdat-toz-kirmizi-biber-65-g', 'Bagdat', '65 g', 'Yemeklere renk ve tat veren tatli toz kirmizi biber.', 32.90, null, 'adet', false, 25),
  ('yag-sos-baharat', 'Bizim Mutfak Karabiber 50 g', 'bizim-mutfak-karabiber-50-g', 'Bizim Mutfak', '50 g', 'Ogutulmus, her yemege giren aromali karabiber.', 34.90, null, 'adet', false, 26),
  ('yag-sos-baharat', 'Dr. Oetker Kabartma Tozu 5 li', 'dr-oetker-kabartma-tozu-5li', 'Dr. Oetker', '5x10 g', 'Kek ve kurabiyeleri kabartan pratik poset kabartma tozu.', 22.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Atistirmalik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('atistirmalik', 'Eti Negro Kakaolu Kremali 100 g', 'eti-negro-kakaolu-kremali-100-g', 'Eti', '100 g', 'Kakaolu bisküvi arasinda beyaz krema, klasik atistirmalik.', 24.90, null, 'adet', true, 20),
  ('atistirmalik', 'Ulker Cikolatali Gofret 4 lu', 'ulker-cikolatali-gofret-4lu', 'Ulker', '4x35 g', 'Cikolata kapli, citir katmanli klasik gofret.', 39.90, null, 'paket', false, 21),
  ('atistirmalik', 'Eti Wanted Sandvic Biskuvi 100 g', 'eti-wanted-sandvic-biskuvi-100-g', 'Eti', '100 g', 'Cikolata kremali dolgulu, doyurucu sandvic biskuvi.', 22.90, null, 'adet', false, 22),
  ('atistirmalik', 'Ulker Biskrem 205 g', 'ulker-biskrem-205-g', 'Ulker', '205 g', 'Ici akiskan cikolata dolgulu yumusak biskuvi.', 34.90, null, 'adet', true, 23),
  ('atistirmalik', 'Eti Petit Beurre 175 g', 'eti-petit-beurre-175-g', 'Eti', '175 g', 'Tereyagli, caya banilan ince klasik pötibör biskuvi.', 27.90, null, 'adet', false, 24),
  ('atistirmalik', 'Ulker Halley 8 li', 'ulker-halley-8li', 'Ulker', '8''li', 'Marshmallow dolgulu, cikolata kapli klasik Halley.', 44.90, null, 'paket', false, 25),
  ('atistirmalik', 'Eti Browni Intense 160 g', 'eti-browni-intense-160-g', 'Eti', '160 g', 'Yogun cikolatali, islak dokulu browni kek.', 39.90, null, 'adet', false, 26),
  ('atistirmalik', 'Ulker Alpella Trio Kek 3 lu', 'ulker-alpella-trio-kek-3lu', 'Ulker', '3x30 g', 'Kakao ve sut kremali, uc katli pratik baton kek.', 29.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Cips & Kuruyemis
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cips-kuruyemis', 'Lays Firindan Sirke ve Deniz Tuzu 107 g', 'lays-firindan-sirke-deniz-tuzu-107-g', 'Lay''s', '107 g', 'Sirke ve deniz tuzu aromali, citir firinda patates cipsi.', 49.90, null, 'adet', true, 20),
  ('cips-kuruyemis', 'Cheetos Peynirli 90 g', 'cheetos-peynirli-90-g', 'Cheetos', '90 g', 'Peynir aromali, agizda dagilan citir misir cerezi.', 34.90, null, 'adet', false, 21),
  ('cips-kuruyemis', 'Doritos Nacho Peynir 113 g', 'doritos-nacho-peynir-113-g', 'Doritos', '113 g', 'Nacho peynir aromali, soslara dayanikli ucgen misir cipsi.', 52.50, null, 'adet', false, 22),
  ('cips-kuruyemis', 'Tadim Antep Fistigi Kavrulmus 150 g', 'tadim-antep-fistigi-kavrulmus-150-g', 'Tadim', '150 g', 'Gaziantep''ten kavrulmus, tuzlu boz ic Antep fistigi.', 189.90, null, 'adet', false, 23),
  ('cips-kuruyemis', 'Tadim Findik Ici 150 g', 'tadim-findik-ici-150-g', 'Tadim', '150 g', 'Giresun findigi, kavrulmus tuzlu ic findik.', 129.90, null, 'adet', false, 24),
  ('cips-kuruyemis', 'Tadim Cig Badem 150 g', 'tadim-cig-badem-150-g', 'Tadim', '150 g', 'Ara ogunlere saglikli, kabuksuz cig badem ici.', 99.90, null, 'adet', false, 25),
  ('cips-kuruyemis', 'Peyman Yer Fistigi Kavrulmus 140 g', 'peyman-yer-fistigi-kavrulmus-140-g', 'Peyman', '140 g', 'Tuzu ayarinda, kolay citlenen kavrulmus yer fistigi.', 44.90, null, 'adet', false, 26),
  ('cips-kuruyemis', 'Tadim Kuru Uzum 200 g', 'tadim-kuru-uzum-200-g', 'Tadim', '200 g', 'Cekirdeksiz, dogal tatli sultani kuru uzum.', 49.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Cikolata & Sekerleme
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cikolata-sekerleme', 'Milka Oreo 92 g', 'milka-oreo-92-g', 'Milka', '92 g', 'Oreo parcaciklari dolgulu, Alp sutlu tablet cikolata.', 64.90, null, 'adet', true, 20),
  ('cikolata-sekerleme', 'Toblerone Sutlu 100 g', 'toblerone-sutlu-100-g', 'Toblerone', '100 g', 'Ballı badem nugali, ucgen dilimli Isvicre cikolatasi.', 89.90, null, 'adet', false, 21),
  ('cikolata-sekerleme', 'Nestle Damak Baton 40 g', 'nestle-damak-baton-40-g', 'Nestle', '40 g', 'Antep fistikli, tek elde tuketilen baton cikolata.', 24.90, null, 'adet', false, 22),
  ('cikolata-sekerleme', 'Mars 51 g', 'mars-51-g', 'Mars', '51 g', 'Karamel ve nugali, doyurucu sutlu cikolata bar.', 29.90, null, 'adet', false, 23),
  ('cikolata-sekerleme', 'Twix 50 g', 'twix-50-g', 'Twix', '50 g', 'Karamel kapli, citir biskuvili ikili cikolata bar.', 29.90, null, 'adet', false, 24),
  ('cikolata-sekerleme', 'Kinder Surpriz Yumurta 20 g', 'kinder-surpriz-yumurta-20-g', 'Kinder', '20 g', 'Ici oyuncak surprizli, sutlu cikolata yumurta.', 39.90, null, 'adet', true, 25),
  ('cikolata-sekerleme', 'Vivident Sakiz Nane 27 g', 'vivident-sakiz-nane-27-g', 'Vivident', '27 g', 'Sekersiz, uzun sure ferahlik veren naneli sakiz.', 24.90, null, 'adet', false, 26),
  ('cikolata-sekerleme', 'Mabel Badem Sekeri 350 g', 'mabel-badem-sekeri-350-g', 'Mabel', '350 g', 'Ic bademli, sert kabuklu geleneksel badem sekeri.', 59.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Kahve & Cay
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kahve-cay', 'Nescafe Gold 100 g', 'nescafe-gold-100-g', 'Nescafe', '100 g', 'Yumusak icimli, aromasi yogun cozunebilir gold kahve.', 189.90, null, 'adet', true, 20),
  ('kahve-cay', 'Caykur Tiryaki Cay 1 kg', 'caykur-tiryaki-cay-1-kg', 'Caykur', '1 kg', 'Koyu ve demli, tiryakilere gore harman siyah cay.', 209.90, null, 'adet', false, 21),
  ('kahve-cay', 'Dogus Filiz Cay 1 kg', 'dogus-filiz-cay-1-kg', 'Dogus', '1 kg', 'Ilk suren filiz yapraklarindan ince harman cay.', 199.90, null, 'adet', false, 22),
  ('kahve-cay', 'Tchibo Gold Selection 100 g', 'tchibo-gold-selection-100-g', 'Tchibo', '100 g', 'Dengeli kavrulmus, aromatik cozunebilir kahve.', 199.90, null, 'adet', true, 23),
  ('kahve-cay', 'Jacobs 3u1 Arada 18 li', 'jacobs-3u1-arada-18li', 'Jacobs', '18x15,8 g', 'Sut tozu ve sekeriyle pratik tek icimlik kahve poseti.', 109.90, null, 'paket', false, 24),
  ('kahve-cay', 'Mahmood Ceylon Cayi 400 g', 'mahmood-ceylon-cayi-400-g', 'Mahmood', '400 g', 'Berrak rengiyle ithal Seylan siyah cayi.', 149.90, null, 'adet', false, 25),
  ('kahve-cay', 'Kurukahveci Mehmet Efendi Turk Kahvesi 100 g', 'kurukahveci-mehmet-efendi-turk-kahvesi-100-g', 'Kurukahveci Mehmet Efendi', '100 g', 'Taze ogutulmus, bol kopuklu geleneksel Turk kahvesi.', 74.90, null, 'adet', false, 26),
  ('kahve-cay', 'Dogadan Adacayi 20 li', 'dogadan-adacayi-20li', 'Dogadan', '20''li', 'Bogaz dostu, rahatlatan suzen poset adacayi.', 49.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Dondurma
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('dondurma', 'Magnum Klasik 100 ml', 'magnum-klasik-100-ml', 'Algida', '100 ml', 'Belcika cikolatasi kapli, vanilyali klasik Magnum.', 64.90, null, 'adet', true, 20),
  ('dondurma', 'Cornetto Cilek 120 ml', 'cornetto-cilek-120-ml', 'Algida', '120 ml', 'Cilek soslu, citir kulahli klasik Cornetto.', 44.90, null, 'adet', false, 21),
  ('dondurma', 'Algida Maras Usulu Kesme 500 g', 'algida-maras-usulu-kesme-500-g', 'Algida', '500 g', 'Sakizli dokulu, kesme Maras usulu sade dondurma.', 99.90, null, 'adet', false, 22),
  ('dondurma', 'Carte d Or Vanilya 900 ml', 'carte-dor-vanilya-900-ml', 'Carte d''Or', '900 ml', 'Aile boyu, hakiki vanilyali kremamsi kap dondurma.', 179.90, null, 'adet', true, 23),
  ('dondurma', 'Golf Kulah Findikli 120 ml', 'golf-kulah-findikli-120-ml', 'Golf', '120 ml', 'Findik soslu, citir kulahli ekonomik dondurma.', 32.90, null, 'adet', false, 24),
  ('dondurma', 'Panda Citir Badem 100 ml', 'panda-citir-badem-100-ml', 'Panda', '100 ml', 'Cikolata kapli, citir bademli cubuk dondurma.', 44.90, null, 'adet', false, 25),
  ('dondurma', 'Algida Cornetto Disc Cikolata 90 ml', 'algida-cornetto-disc-cikolata-90-ml', 'Algida', '90 ml', 'Bisküvi arasinda cikolatali kremali disk dondurma.', 54.90, null, 'adet', false, 26),
  ('dondurma', 'Ben Jerrys Cookie Dough 465 ml', 'ben-jerrys-cookie-dough-465-ml', 'Ben & Jerry''s', '465 ml', 'Kurabiye hamuru ve cikolata parcali premium kap dondurma.', 259.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Donuk Gida
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('donuk-gida', 'Dr. Oetker Pizza Salamli 350 g', 'dr-oetker-pizza-salamli-350-g', 'Dr. Oetker', '350 g', 'Firinda on dakikada hazir, bol salamli ince hamur pizza.', 119.90, null, 'adet', true, 20),
  ('donuk-gida', 'Superfresh Citir Tavuk 500 g', 'superfresh-citir-tavuk-500-g', 'Superfresh', '500 g', 'Firinda kizaran, baharatli kaplamali citir tavuk.', 134.90, null, 'adet', false, 21),
  ('donuk-gida', 'Reis Donuk Bamya 450 g', 'reis-donuk-bamya-450-g', 'Reis', '450 g', 'Sok dondurulmus, kucuk boy ayiklanmis donuk bamya.', 79.90, null, 'adet', false, 22),
  ('donuk-gida', 'Superfresh Donuk Karisik Sebze 450 g', 'superfresh-donuk-karisik-sebze-450-g', 'Superfresh', '450 g', 'Bezelye, havuc ve misirli pratik donuk karisik sebze.', 59.90, null, 'adet', false, 23),
  ('donuk-gida', 'Banvit Pilic Sinitzel 400 g', 'banvit-pilic-sinitzel-400-g', 'Banvit', '400 g', 'Galeta ununa bulanmis, kizartmaya hazir pilic sinitzel.', 129.90, null, 'adet', true, 24),
  ('donuk-gida', 'Superfresh Su Boregi 800 g', 'superfresh-su-boregi-800-g', 'Superfresh', '800 g', 'Peynirli, firina hazir katmanli donuk su boregi.', 129.90, null, 'adet', false, 25),
  ('donuk-gida', 'Dr. Oetker Cheddar Pizza 400 g', 'dr-oetker-cheddar-pizza-400-g', 'Dr. Oetker', '400 g', 'Bol cheddarli, citir hamurlu firin pizzasi.', 124.90, null, 'adet', false, 26),
  ('donuk-gida', 'Kuzey Donuk Karides 400 g', 'kuzey-donuk-karides-400-g', 'Kuzey', '400 g', 'Temizlenmis, sote ve guvece hazir donuk karides.', 199.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Zeytin & Tursu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('zeytin-tursu', 'Marmarabirlik Gemlik Az Tuzlu Siyah Zeytin 800 g', 'marmarabirlik-gemlik-az-tuzlu-siyah-zeytin-800-g', 'Marmarabirlik', '800 g', 'Az tuzlu, yagli sele Gemlik siyah zeytin aile boyu.', 219.90, null, 'adet', true, 20),
  ('zeytin-tursu', 'Taris Yesil Kirma Zeytin 400 g', 'taris-yesil-kirma-zeytin-400-g', 'Taris', '400 g', 'Sarimsak ve kekik aromali, catlatilmis yesil kirma zeytin.', 109.90, null, 'adet', false, 21),
  ('zeytin-tursu', 'Fersan Kornison Tursu 1500 g', 'fersan-kornison-tursu-1500-g', 'Fersan', '1500 g', 'Minik boy, ekstra citir kornison salatalik tursu.', 129.90, null, 'adet', false, 22),
  ('zeytin-tursu', 'Oncu Yaprak Salamura 720 ml', 'oncu-yaprak-salamura-720-ml', 'Oncu', '720 ml', 'Sarma icin ayiklanmis, tuzlu salamura asma yapragi.', 89.90, null, 'adet', false, 23),
  ('zeytin-tursu', 'Marmarabirlik Yesil Zeytin Ezmesi 350 g', 'marmarabirlik-yesil-zeytin-ezmesi-350-g', 'Marmarabirlik', '350 g', 'Kahvaltilik, surulebilir kivamda yesil zeytin ezmesi.', 89.90, null, 'adet', false, 24),
  ('zeytin-tursu', 'Doganay Salgam Suyu Acili 1 L', 'doganay-salgam-suyu-acili-1-l', 'Doganay', '1 L', 'Kebap yaninin klasigi, fermente acili salgam suyu.', 39.90, null, 'adet', true, 25),
  ('zeytin-tursu', 'Fersan Lahana Tursusu 680 g', 'fersan-lahana-tursusu-680-g', 'Fersan', '680 g', 'Citir citir, dogranmis beyaz lahana tursusu.', 64.90, null, 'adet', false, 26),
  ('zeytin-tursu', 'Taris Domat Zeytin 400 g', 'taris-domat-zeytin-400-g', 'Taris', '400 g', 'Iri taneli, etli ve tok dokulu domat siyah zeytin.', 119.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Temizlik & Deterjan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('temizlik-deterjan', 'Persil Toz Deterjan 6 kg', 'persil-toz-deterjan-6-kg', 'Persil', '6 kg', 'Zorlu lekelere karsi etkili, ekonomik boy toz deterjan.', 349.90, null, 'adet', true, 20),
  ('temizlik-deterjan', 'Ariel Sivi Deterjan Dag Esintisi 33 Yikama', 'ariel-sivi-deterjan-dag-esintisi-33-yikama', 'Ariel', '1,815 L', 'Ferah kokulu, 33 yikamalik konsantre sivi deterjan.', 259.90, null, 'adet', false, 21),
  ('temizlik-deterjan', 'Bingo Sardunya Yumusatici 2560 ml', 'bingo-sardunya-yumusatici-2560-ml', 'Bingo', '2560 ml', 'Sardunya kokulu, camasira uzun sureli yumusaklik.', 119.90, null, 'adet', false, 22),
  ('temizlik-deterjan', 'Pril Elde Bulasik Deterjani 750 ml', 'pril-elde-bulasik-deterjani-750-ml', 'Pril', '750 ml', 'Yagi hizli cozen, bol kopuklu elde bulasik deterjani.', 74.90, null, 'adet', false, 23),
  ('temizlik-deterjan', 'Finish Parlatici 500 ml', 'finish-parlatici-500-ml', 'Finish', '500 ml', 'Makinede leke ve su izini onleyen bulasik parlaticisi.', 99.90, null, 'adet', false, 24),
  ('temizlik-deterjan', 'ACE Camasir Suyu Limon 1 L', 'ace-camasir-suyu-limon-1-l', 'ACE', '1 L', 'Limon kokulu, hijyen saglayan klasik camasir suyu.', 44.90, null, 'adet', false, 25),
  ('temizlik-deterjan', 'Marc Cam Temizleyici 750 ml', 'marc-cam-temizleyici-750-ml', 'Marc', '750 ml', 'Iz birakmadan parlatan sprey cam ve yuzey temizleyici.', 54.90, null, 'adet', false, 26),
  ('temizlik-deterjan', 'Mr. Muscle Yag Cozucu 750 ml', 'mr-muscle-yag-cozucu-750-ml', 'Mr. Muscle', '750 ml', 'Mutfak yuzeylerindeki yanmis yagi cozen guclu sprey.', 79.90, null, 'adet', true, 27)
on conflict (slug) do nothing;

-- Kagit Urunleri
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kagit-urunleri', 'Solo Kagit Havlu 12 li', 'solo-kagit-havlu-12li', 'Solo', '12''li', 'Mutfakta yuksek emici, ekonomik boy kagit havlu.', 219.90, null, 'paket', true, 20),
  ('kagit-urunleri', 'Servis Peceresi 30x30 100 lu', 'servis-pecetesi-30x30-100lu', '', '100''lu', 'Davet ve sofralik, buyuk boy cift katli servis peceresi.', 54.90, null, 'paket', false, 21),
  ('kagit-urunleri', 'Selpak Mutfak Havlusu Maxi 4 lu', 'selpak-mutfak-havlusu-maxi-4lu', 'Selpak', '4''lu', 'Uzun rulo, ekstra emici maxi mutfak havlusu.', 149.90, null, 'paket', false, 22),
  ('kagit-urunleri', 'Papia Kagit Havlu 8 li', 'papia-kagit-havlu-8li', 'Papia', '8''li', 'Desenli ve dayanikli, gunluk kullanim kagit havlu.', 169.90, null, 'paket', false, 23),
  ('kagit-urunleri', 'Familia Kutu Mendil 100 lu', 'familia-kutu-mendil-100lu', 'Familia', '100''lu', 'Ev ve arac icin pratik kutuda yumusak mendil.', 39.90, null, 'adet', false, 24),
  ('kagit-urunleri', 'Bella Tuvalet Kagidi 24 lu', 'bella-tuvalet-kagidi-24lu', 'Bella', '24''lu', 'Uzun sure yeten jumbo paket, cift katli tuvalet kagidi.', 269.90, null, 'paket', true, 25),
  ('kagit-urunleri', 'Ipek Tuvalet Kagidi 4 lu', 'ipek-tuvalet-kagidi-4lu', 'Ipek', '4''lu', 'Yumusak dokulu, kucuk paket pratik tuvalet kagidi.', 59.90, null, 'paket', false, 26),
  ('kagit-urunleri', 'Sofia Islak Havlu 15 li', 'sofia-islak-havlu-15li', 'Sofia', '15''li', 'Cepte tasinabilir, ferah kokulu islak havlu.', 29.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Kisisel Bakim
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kisisel-bakim', 'Pantene Sampuan Dokulme Karsiti 400 ml', 'pantene-sampuan-dokulme-karsiti-400-ml', 'Pantene', '400 ml', 'Saci guclendiren, dokulmeye karsi bakim sampuani.', 149.90, null, 'adet', true, 20),
  ('kisisel-bakim', 'Sensodyne Dis Macunu 75 ml', 'sensodyne-dis-macunu-75-ml', 'Sensodyne', '75 ml', 'Hassas disler icin gunluk koruma saglayan dis macunu.', 99.90, null, 'adet', false, 21),
  ('kisisel-bakim', 'Signal Dis Fircasi Yumusak', 'signal-dis-fircasi-yumusak', 'Signal', 'adet', 'Dis etlerine nazik, yumusak killi gunluk dis fircasi.', 44.90, null, 'adet', false, 22),
  ('kisisel-bakim', 'Rexona Kadin Roll-on 50 ml', 'rexona-kadin-roll-on-50-ml', 'Rexona', '50 ml', 'Gun boyu kuruluk hissi veren kadin roll-on deodorant.', 89.90, null, 'adet', false, 23),
  ('kisisel-bakim', 'Axe Deo Sprey Dark Temptation 150 ml', 'axe-deo-sprey-dark-temptation-150-ml', 'Axe', '150 ml', 'Cikolatamsi kokulu, gun boyu ferahlik veren erkek deodorant.', 129.90, null, 'adet', false, 24),
  ('kisisel-bakim', 'Fa Dus Jeli Yoga 500 ml', 'fa-dus-jeli-yoga-500-ml', 'Fa', '500 ml', 'Rahatlatan yoga kokulu, cilde nazik bol kopuklu dus jeli.', 84.90, null, 'adet', false, 25),
  ('kisisel-bakim', 'Dove Kalip Sabun 4x100 g', 'dove-kalip-sabun-4x100-g', 'Dove', '4x100 g', 'Nemlendirici formullu, cilde yumusaklik veren kalip sabun.', 99.90, null, 'paket', true, 26),
  ('kisisel-bakim', 'Gillette Fusion5 Yedek Baslik 4 lu', 'gillette-fusion5-yedek-baslik-4lu', 'Gillette', '4''lu', 'Bes bicakli, konforlu tiras icin yedek tiras basligi.', 349.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Vitamin & Ilk Yardim
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('vitamin-ilk-yardim', 'Supradyn Enerji Multivitamin 30 Tablet', 'supradyn-enerji-multivitamin-30-tablet', 'Supradyn', '30 tablet', 'Gunluk enerji ve bagisiklik icin multivitamin tableti.', 199.90, null, 'adet', true, 20),
  ('vitamin-ilk-yardim', 'Omega 3 Balik Yagi 60 Kapsul', 'omega-3-balik-yagi-60-kapsul', '', '60 kapsul', 'Kalp ve beyin sagligini destekleyen omega 3 balik yagi.', 179.90, null, 'adet', false, 21),
  ('vitamin-ilk-yardim', 'Antiseptik Sprey 100 ml', 'antiseptik-sprey-100-ml', '', '100 ml', 'Kesik ve siyriklarda kullanilan yatistirici antiseptik sprey.', 54.90, null, 'adet', false, 22),
  ('vitamin-ilk-yardim', 'C Vitamini ve Cinko Efervesan 20 Tablet', 'c-vitamini-cinko-efervesan-20-tablet', '', '20 tablet', 'Bagisikligi destekleyen C vitamini ve cinkolu efervesan.', 89.90, null, 'adet', true, 23),
  ('vitamin-ilk-yardim', 'B12 Vitamini Sprey', 'b12-vitamini-sprey', '', '25 ml', 'Enerji ve sinir sistemine destek dil alti B12 spreyi.', 129.90, null, 'adet', false, 24),
  ('vitamin-ilk-yardim', 'Magnezyum Efervesan 20 Tablet', 'magnezyum-efervesan-20-tablet', '', '20 tablet', 'Kas ve kemik sagligina destek magnezyum efervesan tablet.', 99.90, null, 'adet', false, 25),
  ('vitamin-ilk-yardim', 'Oksijenli Su 50 ml', 'oksijenli-su-50-ml', '', '50 ml', 'Yara temizligi icin klasik oksijenli su.', 22.90, null, 'adet', false, 26),
  ('vitamin-ilk-yardim', 'Cerrahi Maske 10 lu', 'cerrahi-maske-10lu', '', '10''lu', 'Uc katli, tek kullanimlik telli cerrahi maske.', 29.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Tek Kullanimlik & Piknik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('tek-kullanimlik-piknik', 'Karton Bardak 250 ml 50 li', 'karton-bardak-250-ml-50li', '', '50''li', 'Sicak ve soguk icecekler icin buyuk boy karton bardak.', 59.90, null, 'paket', true, 20),
  ('tek-kullanimlik-piknik', 'Plastik Bardak 200 ml 50 li', 'plastik-bardak-200-ml-50li', '', '50''li', 'Davet ve piknige pratik seffaf plastik bardak.', 34.90, null, 'paket', false, 21),
  ('tek-kullanimlik-piknik', 'Kopuk Tabak 22 cm 25 li', 'kopuk-tabak-22-cm-25li', '', '25''li', 'Hafif ve dayanikli, sicak yemege uygun kopuk tabak.', 44.90, null, 'paket', false, 22),
  ('tek-kullanimlik-piknik', 'Koroplast Pisirme Kagidi 8 m', 'koroplast-pisirme-kagidi-8-m', 'Koroplast', '8 m', 'Firinda yapismayi onleyen, yag gecirmeyen pisirme kagidi.', 54.90, null, 'adet', false, 23),
  ('tek-kullanimlik-piknik', 'Koroplast Kilitli Poset Buyuk Boy 15 li', 'koroplast-kilitli-poset-buyuk-boy-15li', 'Koroplast', '15''li', 'Gidalari taze saklayan kilitli buyuk boy saklama poseti.', 49.90, null, 'paket', false, 24),
  ('tek-kullanimlik-piknik', 'Koroplast Cop Torbasi Orta Boy 30 lu', 'koroplast-cop-torbasi-orta-boy-30lu', 'Koroplast', '30''lu', 'Mutfak icin dayanikli, buzgulu orta boy cop torbasi.', 44.90, null, 'paket', true, 25),
  ('tek-kullanimlik-piknik', 'Bambu Cubuk Karistirici 100 lu', 'bambu-cubuk-karistirici-100lu', '', '100''lu', 'Sicak icecekler icin dogal bambu karistirici cubuk.', 24.90, null, 'paket', false, 26),
  ('tek-kullanimlik-piknik', 'Piknik Sofra Seti 6 Kisilik', 'piknik-sofra-seti-6-kisilik', '', '6 kisilik', 'Tabak, bardak ve catal kasik iceren tek kullanimlik set.', 79.90, null, 'set', false, 27)
on conflict (slug) do nothing;

-- Bebek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bebek', 'Prima Bebek Bezi 3 Numara 68 li', 'prima-bebek-bezi-3-numara-68li', 'Prima', '68''li', 'On iki saate kadar kuruluk saglayan midi boy bebek bezi.', 429.90, null, 'paket', true, 20),
  ('bebek', 'Molfix Kulot Bez 5 Numara 34 lu', 'molfix-kulot-bez-5-numara-34lu', 'Molfix', '34''lu', 'Kolay giydirilen, esnek belli junior kulot bez.', 349.90, null, 'paket', false, 21),
  ('bebek', 'Prima Kulot Bez 6 Numara 30 lu', 'prima-kulot-bez-6-numara-30lu', 'Prima', '30''lu', 'Hareketli bebekler icin extra large kulot bez.', 379.90, null, 'paket', false, 22),
  ('bebek', 'Huggies Bebek Bezi 4 Numara 52 li', 'huggies-bebek-bezi-4-numara-52li', 'Huggies', '52''li', 'Yumusak yuzeyli, sizdirmaz maxi boy bebek bezi.', 399.90, null, 'paket', true, 23),
  ('bebek', 'Sleepy Natural Islak Mendil 3x40 li', 'sleepy-natural-islak-mendil-3x40li', 'Sleepy', '3x40''li', 'Pamuk ozlu, parfumsuz hassas cilt islak mendili.', 79.90, null, 'paket', false, 24),
  ('bebek', 'Bebelac 2 Devam Sutu 350 g', 'bebelac-2-devam-sutu-350-g', 'Bebelac', '350 g', 'Alti ay ve uzeri bebekler icin devam donemi sutu.', 189.90, null, 'adet', false, 25),
  ('bebek', 'Aptamil 1 Bebek Sutu 400 g', 'aptamil-1-bebek-sutu-400-g', 'Aptamil', '400 g', 'Yenidogan donemi icin ilk devre bebek maması.', 269.90, null, 'adet', false, 26),
  ('bebek', 'Johnsons Baby Yagi 200 ml', 'johnsons-baby-yagi-200-ml', 'Johnson''s Baby', '200 ml', 'Bebek cildini nemlendiren, hafif dokulu bebek yagi.', 119.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Evcil Hayvan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('evcil-hayvan', 'Royal Canin Kedi Mamasi 2 kg', 'royal-canin-kedi-mamasi-2-kg', 'Royal Canin', '2 kg', 'Yetiskin kediler icin dengeli formullu premium kuru mama.', 549.90, null, 'adet', true, 20),
  ('evcil-hayvan', 'Pro Plan Kisirlastirilmis Kedi Mamasi 1,5 kg', 'proplan-kisirlastirilmis-kedi-mamasi-1-5-kg', 'Pro Plan', '1,5 kg', 'Kisir kediler icin kilo kontrollu tavuklu kuru mama.', 399.90, null, 'adet', false, 21),
  ('evcil-hayvan', 'Whiskas Yavru Kedi Mamasi 1,4 kg', 'whiskas-yavru-kedi-mamasi-1-4-kg', 'Whiskas', '1,4 kg', 'Yavru kediler icin sutlu, gelisim destekli kuru mama.', 259.90, null, 'adet', false, 22),
  ('evcil-hayvan', 'Felix Fantastic Tavuklu 85 g', 'felix-fantastic-tavuklu-85-g', 'Felix', '85 g', 'Jole icinde tavuklu, istah acici tekli yas kedi mamasi.', 24.90, null, 'adet', false, 23),
  ('evcil-hayvan', 'Pro Plan Kopek Mamasi 3 kg', 'proplan-kopek-mamasi-3-kg', 'Pro Plan', '3 kg', 'Orta irk yetiskin kopekler icin tavuklu kuru mama.', 499.90, null, 'adet', true, 24),
  ('evcil-hayvan', 'Chappi Kopek Mamasi 2,7 kg', 'chappi-kopek-mamasi-2-7-kg', 'Chappi', '2,7 kg', 'Ekonomik ve dengeli, etli ve tahilli kuru kopek mamasi.', 229.90, null, 'adet', false, 25),
  ('evcil-hayvan', 'Pedigree Dentastix 7 li', 'pedigree-dentastix-7li', 'Pedigree', '7''li', 'Dis tasi olusumunu azaltan gunluk cignemelik odul cubuk.', 89.90, null, 'paket', false, 26),
  ('evcil-hayvan', 'Ince Topaklanan Kedi Kumu 10 L', 'ince-topaklanan-kedi-kumu-10-l', '', '10 L', 'Guclu topaklanan, koku hapseden ince bentonit kedi kumu.', 189.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Sigara & Tutun: URUN YOK (4207/4733 sayili kanunlar geregi online satis yasak).

-- Mangal & Komur
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('mangal-komur', 'Mese Mangal Komuru 5 kg', 'mese-mangal-komuru-5-kg', '', '5 kg', 'Uzun sure koz tutan, elenmis buyuk boy mese mangal komuru.', 199.90, null, 'adet', true, 20),
  ('mangal-komur', 'Briket Mangal Komuru 2,5 kg', 'briket-mangal-komuru-2-5-kg', '', '2,5 kg', 'Yavas yanan, kul birakmayan sikistirilmis briket komur.', 129.90, null, 'adet', false, 21),
  ('mangal-komur', 'Mangal Yakma Jeli 500 ml', 'mangal-yakma-jeli-500-ml', '', '500 ml', 'Komuru guvenli ve hizli tutusturan yakma jeli.', 54.90, null, 'adet', false, 22),
  ('mangal-komur', 'Dokme Mese Odunu 10 kg', 'dokme-mese-odunu-10-kg', '', '10 kg', 'Sominel ve mangal icin kurutulmus dokme mese odunu.', 149.90, null, 'adet', false, 23),
  ('mangal-komur', 'Katlanir Kamp Mangali', 'katlanir-kamp-mangali', '', 'adet', 'Cantada tasinabilen, kolay kurulan katlanir kamp mangali.', 349.90, null, 'adet', true, 24),
  ('mangal-komur', 'Izgara Temizleme Fircasi (Metal)', 'izgara-temizleme-fircasi-metal', '', 'adet', 'Sert telli, izgara tellerini kolay temizleyen firca.', 59.90, null, 'adet', false, 25),
  ('mangal-komur', 'Yassi Kofte Sisi 12 li', 'yassi-kofte-sisi-12li', '', '12''li', 'Kofte ve sebzeler icin paslanmaz yassi sis seti.', 129.90, null, 'paket', false, 26),
  ('mangal-komur', 'Mangal Korugu', 'mangal-korugu', '', 'adet', 'Kozu hizli canlandiran korukle atesi kolayca yakar.', 79.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Cakmak, Kibrit & Tup
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cakmak-kibrit-tup', 'Tokai Cakmak', 'tokai-cakmak', 'Tokai', 'adet', 'Guvenilir tutusma saglayan klasik cep cakmagi.', 24.90, null, 'adet', true, 20),
  ('cakmak-kibrit-tup', 'Cricket Cakmak', 'cricket-cakmak', 'Cricket', 'adet', 'Ayarli alevli, uzun omurlu renkli cep cakmagi.', 29.90, null, 'adet', false, 21),
  ('cakmak-kibrit-tup', 'Somine Kibriti Uzun 45 li', 'somine-kibriti-uzun-45li', '', '45''li', 'Somine ve mangal icin uzun coplu guvenli kibrit.', 34.90, null, 'paket', false, 22),
  ('cakmak-kibrit-tup', 'Aygaz Kartus Tup 450 g', 'aygaz-kartus-tup-450-g', 'Aygaz', '450 g', 'Kamp ocaklari icin delme tip butan gaz kartusu.', 79.90, null, 'adet', false, 23),
  ('cakmak-kibrit-tup', 'Pinni Kamp Tupu 190 g', 'pinni-kamp-tupu-190-g', 'Pinni', '190 g', 'Portatif ocaklar icin vidali butan gaz tupu.', 89.90, null, 'adet', false, 24),
  ('cakmak-kibrit-tup', 'Elektrikli USB Cakmak', 'elektrikli-usb-cakmak', '', 'adet', 'Alevsiz, sarj edilebilir ruzgara dayanikli USB cakmak.', 149.90, null, 'adet', true, 25),
  ('cakmak-kibrit-tup', 'Zippo Cakmak Benzini 125 ml', 'zippo-cakmak-benzini-125-ml', 'Zippo', '125 ml', 'Benzinli cakmaklar icin klasik dolum sivisi.', 99.90, null, 'adet', false, 26),
  ('cakmak-kibrit-tup', 'Mutfak Ocak Kibriti Uzun', 'mutfak-ocak-kibriti-uzun', '', 'adet', 'Ocak ve firin icin uzun namlulu tekrar dolan cakmak.', 59.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Sarj Aleti & Pil
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarj-aleti-pil', 'Duracell 9V Pil', 'duracell-9v-pil', 'Duracell', 'adet', 'Duman dedektoru ve oyuncaklar icin uzun omurlu 9V pil.', 89.90, null, 'adet', true, 20),
  ('sarj-aleti-pil', 'Panasonic AA Pil 4 lu', 'panasonic-aa-pil-4lu', 'Panasonic', '4''lu', 'Gunluk cihazlar icin dayanikli AA alkalin pil.', 99.90, null, 'paket', false, 21),
  ('sarj-aleti-pil', 'Varta AAA Pil 4 lu', 'varta-aaa-pil-4lu', 'Varta', '4''lu', 'Kumanda ve kucuk cihazlar icin ince AAA alkalin pil.', 99.90, null, 'paket', false, 22),
  ('sarj-aleti-pil', 'Sarj Edilebilir AA Pil 2100 mAh 2 li', 'sarj-edilebilir-aa-pil-2100-mah-2li', '', '2''li', 'Yuzlerce kez sarj edilebilen 2100 mAh AA pil.', 149.90, null, 'paket', false, 23),
  ('sarj-aleti-pil', 'USB-C to USB-C Kablo 2 m', 'usb-c-to-usb-c-kablo-2-m', '', '2 m', 'Hizli sarj ve veri aktarimi icin orgulu USB-C kablo.', 119.90, null, 'adet', false, 24),
  ('sarj-aleti-pil', '3 u 1 Arada Sarj Kablosu', 'uclu-arada-sarj-kablosu', '', 'adet', 'USB-C, Lightning ve micro uclu cok amacli sarj kablosu.', 99.90, null, 'adet', false, 25),
  ('sarj-aleti-pil', 'Arac Sarj Adaptoru Cift USB', 'arac-sarj-adaptoru-cift-usb', '', 'adet', 'Cakmakliktan iki cihazi ayni anda dolduran arac sarji.', 129.90, null, 'adet', true, 26),
  ('sarj-aleti-pil', 'Powerbank 20000 mAh', 'powerbank-20000-mah', '', '20000 mAh', 'Yuksek kapasiteli, birkac tam sarj veren tasinabilir batarya.', 649.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Plaj, Mayo & Terlik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('plaj-mayo-terlik', 'Kadin Bikini', 'kadin-bikini', '', 'cesitli beden', 'Cabuk kuruyan kumasli, rahat kesim kadin bikini.', 349.90, null, 'adet', true, 20),
  ('plaj-mayo-terlik', 'Kadin Tek Parca Mayo', 'kadin-tek-parca-mayo', '', 'cesitli beden', 'Vucudu saran, konforlu tek parca kadin mayosu.', 399.90, null, 'adet', false, 21),
  ('plaj-mayo-terlik', 'Erkek Slip Mayo', 'erkek-slip-mayo', '', 'cesitli beden', 'Yuzucu kesim, cabuk kuruyan erkek slip mayo.', 199.90, null, 'adet', false, 22),
  ('plaj-mayo-terlik', 'Cocuk Deniz Terligi', 'cocuk-deniz-terligi', '', 'cesitli numara', 'Kaymaz tabanli, renkli cocuk parmak arasi terligi.', 79.90, null, 'adet', false, 23),
  ('plaj-mayo-terlik', 'Plaj Havlusu 90x170 cm', 'plaj-havlusu-90x170-cm', '', '90x170 cm', 'Genis ve emici, hizli kuruyan desenli plaj havlusu.', 299.90, null, 'adet', false, 24),
  ('plaj-mayo-terlik', 'Su Gecirmez Telefon Kilifi', 'su-gecirmez-telefon-kilifi', '', 'adet', 'Deniz ve havuzda telefonu koruyan boyunluk askili kilif.', 89.90, null, 'adet', true, 25),
  ('plaj-mayo-terlik', 'Plaj Voleybol Topu', 'plaj-voleybol-topu', '', 'adet', 'Hafif ve dayanikli, plaj oyunlari icin voleybol topu.', 99.90, null, 'adet', false, 26),
  ('plaj-mayo-terlik', 'Cocuk Kum Kova Seti', 'cocuk-kum-kova-seti', '', 'set', 'Kova, kurek ve kaliplarla kumda oyun seti.', 119.90, null, 'set', false, 27)
on conflict (slug) do nothing;

-- Gunes Kremi & Plaj
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('gunes-kremi-plaj', 'La Roche-Posay Anthelios SPF 50+ 50 ml', 'la-roche-posay-anthelios-spf-50-50-ml', 'La Roche-Posay', '50 ml', 'Hassas ciltler icin yuksek koruma saglayan yuz gunes kremi.', 649.90, null, 'adet', true, 20),
  ('gunes-kremi-plaj', 'Bioderma Photoderm SPF 50+ 40 ml', 'bioderma-photoderm-spf-50-40-ml', 'Bioderma', '40 ml', 'Hafif dokulu, gunluk kullanima uygun yuksek korumali krem.', 549.90, null, 'adet', false, 21),
  ('gunes-kremi-plaj', 'Sebamed Gunes Spreyi SPF 30 150 ml', 'sebamed-gunes-spreyi-spf-30-150-ml', 'Sebamed', '150 ml', 'Kolay uygulanan, cilde nazik orta korumali gunes spreyi.', 379.90, null, 'adet', false, 22),
  ('gunes-kremi-plaj', 'Nivea Sun After Sun Nemlendirici 200 ml', 'nivea-sun-after-sun-nemlendirici-200-ml', 'Nivea', '200 ml', 'Gunes sonrasi cildi yatistiran ve nemlendiren losyon.', 189.90, null, 'adet', false, 23),
  ('gunes-kremi-plaj', 'Eucerin Sun Yuz Jeli SPF 50 50 ml', 'eucerin-sun-yuz-jeli-spf-50-50-ml', 'Eucerin', '50 ml', 'Yagli ciltler icin matlastiran yuksek korumali yuz jeli.', 599.90, null, 'adet', true, 24),
  ('gunes-kremi-plaj', 'Carroten Cocuk Gunes Kremi SPF 50 150 ml', 'carroten-cocuk-gunes-kremi-spf-50-150-ml', 'Carroten', '150 ml', 'Cocuk cildine ozel, suya dayanikli yuksek gunes korumasi.', 299.90, null, 'adet', false, 25),
  ('gunes-kremi-plaj', 'Bronzlastirici Sprey SPF 15 150 ml', 'bronzlastirici-sprey-spf-15-150-ml', '', '150 ml', 'Bronzlugu hizlandiran, dusuk korumali gunes spreyi.', 199.90, null, 'adet', false, 26),
  ('gunes-kremi-plaj', 'Gunes Gozlugu UV400', 'gunes-gozlugu-uv400', '', 'adet', 'UV400 korumali, zararli isinlari suzen gunes gozlugu.', 249.90, null, 'adet', false, 27)
on conflict (slug) do nothing;

-- Sisme Bot & Havuz
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sisme-bot-havuz', 'Intex Sisme Koltuk', 'intex-sisme-koltuk', 'Intex', '99x76 cm', 'Bahce ve havuz kenarina rahat sisme tekli koltuk.', 349.90, null, 'adet', true, 20),
  ('sisme-bot-havuz', 'Intex Deniz Yatagi Cift Kisilik', 'intex-deniz-yatagi-cift-kisilik', 'Intex', '203x152 cm', 'Yastikli ve genis, cift kisilik sisme deniz yatagi.', 449.90, null, 'adet', false, 21),
  ('sisme-bot-havuz', 'Bestway Unicorn Binici', 'bestway-unicorn-binici', 'Bestway', '224x164 cm', 'Cocuklarin favorisi, tutamacli dev unicorn deniz binici.', 399.90, null, 'adet', false, 22),
  ('sisme-bot-havuz', 'Intex Kaydirakli Cocuk Havuzu', 'intex-kaydirakli-cocuk-havuzu', 'Intex', '333x216 cm', 'Kaydirak ve fiskiyeli, bahce icin buyuk cocuk havuzu.', 899.90, null, 'adet', true, 23),
  ('sisme-bot-havuz', 'Ayak Pompasi', 'ayak-pompasi', '', 'adet', 'Sisme urunleri elini yormadan dolduran ayak pompasi.', 129.90, null, 'adet', false, 24),
  ('sisme-bot-havuz', 'Elektrikli Sisme Pompasi 12V', 'elektrikli-sisme-pompasi-12v', '', '12 V', 'Arac cakmakligindan calisan hizli elektrikli sisme pompasi.', 249.90, null, 'adet', false, 25),
  ('sisme-bot-havuz', 'Intex Deniz Simidi 91 cm', 'intex-deniz-simidi-91-cm', 'Intex', '91 cm', 'Yetiskin boy, cift hava odacikli renkli deniz simidi.', 129.90, null, 'adet', false, 26),
  ('sisme-bot-havuz', 'Sisme Bardaklik 4 lu', 'sisme-bardaklik-4lu', '', '4''lu', 'Havuzda icecekleri suda tutan sisme bardaklik seti.', 59.90, null, 'paket', false, 27)
on conflict (slug) do nothing;

-- Sinek & Bocek Kovucu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sinek-bocek-kovucu', 'Baygon Ucan Bocek Spreyi 400 ml', 'baygon-ucan-bocek-spreyi-400-ml', 'Baygon', '400 ml', 'Sinek ve sivrisinege karsi hizli etkili aerosol sprey.', 139.90, null, 'adet', true, 20),
  ('sinek-bocek-kovucu', 'OFF! Fam Sivrisinek Kovucu Losyon 100 ml', 'off-fam-sivrisinek-kovucu-losyon-100-ml', 'OFF!', '100 ml', 'Cilde surulen, saatlerce koruyan sivrisinek kovucu losyon.', 169.90, null, 'adet', false, 21),
  ('sinek-bocek-kovucu', 'Raid Sinek Kagidi Askili 4 lu', 'raid-sinek-kagidi-askili-4lu', 'Raid', '4''lu', 'Asilarak kullanilan, zehirsiz yapiskan sinek kagidi.', 39.90, null, 'paket', false, 22),
  ('sinek-bocek-kovucu', 'Sivrisinek Kovucu Sarmal Tutsu 10 lu', 'sivrisinek-kovucu-sarmal-tutsu-10lu', '', '10''lu', 'Acik alanda yakilan, sivrisinek uzaklastiran sarmal tutsu.', 49.90, null, 'paket', false, 23),
  ('sinek-bocek-kovucu', 'Baygon Karinca ve Hamambocegi Spreyi 400 ml', 'baygon-karinca-hamambocegi-spreyi-400-ml', 'Baygon', '400 ml', 'Yuruyucu haserelere karsi kalici etkili bocek spreyi.', 149.90, null, 'adet', true, 24),
  ('sinek-bocek-kovucu', 'Pella Guve Kovucu Aski 3 lu', 'pella-guve-kovucu-aski-3lu', 'Pella', '3''lu', 'Dolapta giysileri guveden koruyan lavanta kokulu aski.', 59.90, null, 'paket', false, 25),
  ('sinek-bocek-kovucu', 'Vape Elektrikli Sivili Yedek', 'vape-elektrikli-sivili-yedek', 'Vape', '45 gece', 'Elektrikli makineler icin 45 gecelik yedek sivi.', 79.90, null, 'adet', false, 26),
  ('sinek-bocek-kovucu', 'Sivrisinek Cibinligi Tekli', 'sivrisinek-cibinligi-tekli', '', 'adet', 'Tek kisilik yataga gecmeli, sivrisinek onleyen cibinlik.', 149.90, null, 'adet', false, 27)
on conflict (slug) do nothing;
