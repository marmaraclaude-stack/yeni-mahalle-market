-- ============================================================
-- Yeni Mahalle Market — e-ticaret seed verisi
-- 30 kategori (lib/shop/categories.ts ile birebir) + ~285 ürün.
-- Sigara & Tütün kategorisine ürün EKLENMEZ (4207/4733: online
-- tütün satışı yasak) — kategori satırı var, ürünü yok.
-- Idempotent: on conflict (slug) do nothing.
--
-- KURULUM: Önce 20260703100000_eticaret_schema.sql çalıştırılmış
-- olmalı; ardından bu dosyayı Supabase SQL Editor'de çalıştırın.
-- ============================================================

-- ------------------------------------------------------------
-- Kategoriler — lib/shop/categories.ts SHOP_CATEGORIES ile aynı sıra
-- ------------------------------------------------------------
insert into public.shop_categories (slug, name, tint, icon, sort, is_orderable) values
  ('meyve-sebze',            'Meyve & Sebze',            0, 'carrot',           0,  true),
  ('sarkuteri-et',           'Şarküteri & Et',           1, 'beef',             1,  true),
  ('ekmek-firin',            'Ekmek & Fırın',            2, 'croissant',        2,  true),
  ('sut-kahvaltilik',        'Süt & Kahvaltılık',        3, 'milk',             3,  true),
  ('icecek-su',              'İçecek & Su',              4, 'cup-soda',         4,  true),
  ('bakliyat-makarna',       'Bakliyat & Makarna',       2, 'wheat',            5,  true),
  ('konserve-hazir-yemek',   'Konserve & Hazır Yemek',   1, 'soup',             6,  true),
  ('yag-sos-baharat',        'Yağ, Sos & Baharat',       7, 'droplets',         7,  true),
  ('atistirmalik',           'Atıştırmalık',             5, 'cookie',           8,  true),
  ('cips-kuruyemis',         'Cips & Kuruyemiş',         2, 'nut',              9,  true),
  ('cikolata-sekerleme',     'Çikolata & Şekerleme',     6, 'candy',            10, true),
  ('kahve-cay',              'Kahve & Çay',              1, 'coffee',           11, true),
  ('dondurma',               'Dondurma',                 4, 'ice-cream-cone',   12, true),
  ('donuk-gida',             'Donuk Gıda',               3, 'snowflake',        13, true),
  ('zeytin-tursu',           'Zeytin & Turşu',           0, 'citrus',           14, true),
  ('temizlik-deterjan',      'Temizlik & Deterjan',      7, 'spray-can',        15, true),
  ('kagit-urunleri',         'Kağıt Ürünleri',           3, 'scroll-text',      16, true),
  ('kisisel-bakim',          'Kişisel Bakım',            6, 'sparkles',         17, true),
  ('vitamin-ilk-yardim',     'Vitamin & İlk Yardım',     0, 'pill',             18, true),
  ('tek-kullanimlik-piknik', 'Tek Kullanımlık & Piknik', 2, 'utensils',         19, true),
  ('bebek',                  'Bebek',                    6, 'baby',             20, true),
  ('evcil-hayvan',           'Evcil Hayvan',             5, 'paw-print',        21, true),
  ('sigara-tutun',           'Sigara & Tütün',           1, 'cigarette',        22, false),
  ('mangal-komur',           'Mangal & Kömür',           2, 'flame',            23, true),
  ('cakmak-kibrit-tup',      'Çakmak, Kibrit & Tüp',     1, 'flame-kindling',   24, true),
  ('sarj-aleti-pil',         'Şarj Aleti & Pil',         3, 'battery-charging', 25, true),
  ('plaj-mayo-terlik',       'Plaj, Mayo & Terlik',      4, 'umbrella',         26, true),
  ('gunes-kremi-plaj',       'Güneş Kremi & Plaj',       2, 'sun',              27, true),
  ('sisme-bot-havuz',        'Şişme Bot & Havuz',        4, 'life-buoy',        28, true),
  ('sinek-bocek-kovucu',     'Sinek & Böcek Kovucu',     0, 'bug',              29, true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Ürünler — kategori başına 8-14, gerçekçi 2026 TL fiyatları.
-- image_url bilinçli NULL (UI kategori renkli placeholder basar).
-- ------------------------------------------------------------

-- Meyve & Sebze (kg bazlı)
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('meyve-sebze', 'Domates', 'domates-kg', '', '1 kg', 'Salatalık ve yemeklik olarak günlük gelen taze salkım domates.', 39.90, null, 'kg', true, 0),
  ('meyve-sebze', 'Salatalık', 'salatalik-kg', '', '1 kg', 'Çıtır çıtır, kahvaltı ve salataların vazgeçilmezi taze salatalık.', 29.90, null, 'kg', false, 1),
  ('meyve-sebze', 'Sivri Biber', 'sivri-biber-kg', '', '1 kg', 'Közlemelik ve kahvaltılık ince taze sivri biber.', 54.90, null, 'kg', false, 2),
  ('meyve-sebze', 'Patates', 'patates-kg', '', '1 kg', 'Kızartmalık ve yemeklik iri boy yerli patates.', 24.90, null, 'kg', false, 3),
  ('meyve-sebze', 'Kuru Soğan', 'kuru-sogan-kg', '', '1 kg', 'Her yemeğin temeli, dayanıklı yerli kuru soğan.', 22.90, null, 'kg', false, 4),
  ('meyve-sebze', 'Limon', 'limon-kg', '', '1 kg', 'Bol sulu, salata ve içeceklere ferahlık katan limon.', 44.90, null, 'kg', false, 5),
  ('meyve-sebze', 'Muz (İthal)', 'muz-ithal-kg', '', '1 kg', 'Tatlı ve doyurucu, günlük tazelikte ithal muz.', 89.90, null, 'kg', true, 6),
  ('meyve-sebze', 'Elma (Starking)', 'elma-starking-kg', '', '1 kg', 'Kırmızı kabuklu, sulu ve tatlı Starking elma.', 49.90, null, 'kg', false, 7),
  ('meyve-sebze', 'Karpuz', 'karpuz-kg', '', '1 kg', 'Yaz sıcağının kurtarıcısı, tarladan gelen tatlı karpuz.', 19.90, null, 'kg', false, 8),
  ('meyve-sebze', 'Çilek', 'cilek-kg', '', '1 kg', 'Mis kokulu, tatlı ve taze yerli çilek.', 99.90, null, 'kg', false, 9),
  ('meyve-sebze', 'Şeftali', 'seftali-kg', '', '1 kg', 'Bursa usulü iri, sulu ve hoş kokulu şeftali.', 69.90, null, 'kg', false, 10),
  ('meyve-sebze', 'Kabak', 'kabak-kg', '', '1 kg', 'Mücver ve yemeklik için ince taze kabak.', 34.90, null, 'kg', false, 11)
on conflict (slug) do nothing;

-- Şarküteri & Et
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarkuteri-et', 'Banvit Piliç But 1 kg', 'banvit-pilic-but-1-kg', 'Banvit', '1 kg', 'Izgara ve fırın için günlük kesim taze piliç but.', 149.90, null, 'adet', true, 0),
  ('sarkuteri-et', 'Beypiliç Bütün Piliç 1,8 kg', 'beypilic-butun-pilic-1-8-kg', 'Beypiliç', '1,8 kg', 'Fırında kızartmalık bütün piliç, aile boyu.', 219.90, null, 'adet', false, 1),
  ('sarkuteri-et', 'Dana Kıyma 500 g', 'dana-kiyma-500-g', '', '500 g', 'Günlük çekilmiş, orta yağlı dana kıyma.', 279.90, null, 'paket', false, 2),
  ('sarkuteri-et', 'Kuzu Pirzola 500 g', 'kuzu-pirzola-500-g', '', '500 g', 'Mangallık, kasap işi taze kuzu pirzola.', 449.90, null, 'paket', false, 3),
  ('sarkuteri-et', 'Maret Dana Sucuk 250 g', 'maret-dana-sucuk-250-g', 'Maret', '250 g', 'Kahvaltıların yıldızı, baharatı dengeli dana sucuk.', 189.90, null, 'adet', true, 4),
  ('sarkuteri-et', 'Pınar Sosis 320 g', 'pinar-sosis-320-g', 'Pınar', '320 g', 'Pratik ve lezzetli klasik piliç sosis.', 89.90, null, 'adet', false, 5),
  ('sarkuteri-et', 'Polonez Macar Salam 300 g', 'polonez-macar-salam-300-g', 'Polonez', '300 g', 'Sandviç ve tostlara yakışan dilimli Macar salam.', 119.90, null, 'adet', false, 6),
  ('sarkuteri-et', 'Namet Hindi Füme 60 g', 'namet-hindi-fume-60-g', 'Namet', '60 g', 'Hafif ve düşük yağlı dilimli hindi füme.', 79.90, null, 'adet', false, 7),
  ('sarkuteri-et', 'Pınar Kavurma 250 g', 'pinar-kavurma-250-g', 'Pınar', '250 g', 'Kavanozda geleneksel lezzet, katkısız dana kavurma.', 259.90, null, 'adet', false, 8),
  ('sarkuteri-et', 'Aytaç Piliç Salam 200 g', 'aytac-pilic-salam-200-g', 'Aytaç', '200 g', 'Ekonomik ve lezzetli dilimli piliç salam.', 59.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Ekmek & Fırın
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('ekmek-firin', 'Somun Ekmek 250 g', 'somun-ekmek-250-g', '', '250 g', 'Günlük fırından, dışı çıtır içi yumuşak taze somun.', 12.50, null, 'adet', true, 0),
  ('ekmek-firin', 'Simit (Günlük)', 'simit-gunluk', '', 'adet', 'Susamı bol, sabah fırınından sıcak İstanbul simidi.', 15.00, null, 'adet', true, 1),
  ('ekmek-firin', 'Uno Tost Ekmeği 700 g', 'uno-tost-ekmegi-700-g', 'Uno', '700 g', 'Bol dilimli, yumuşacık klasik tost ekmeği.', 44.90, null, 'adet', false, 2),
  ('ekmek-firin', 'Uno Kepekli Tost Ekmeği 450 g', 'uno-kepekli-tost-ekmegi-450-g', 'Uno', '450 g', 'Lif oranı yüksek, kepekli dilimli tost ekmeği.', 39.90, null, 'adet', false, 3),
  ('ekmek-firin', 'Uno Çavdarlı Ekmek 450 g', 'uno-cavdarli-ekmek-450-g', 'Uno', '450 g', 'Ekşi mayalı, doyurucu çavdarlı dilimli ekmek.', 42.90, null, 'adet', false, 4),
  ('ekmek-firin', 'Uno Hamburger Ekmeği 4''lü', 'uno-hamburger-ekmegi-4lu', 'Uno', '4''lü', 'Ev yapımı hamburgerler için susamlı yumuşak ekmek.', 39.90, null, 'paket', false, 5),
  ('ekmek-firin', 'Lavaş 5''li', 'lavas-5li', '', '5''li', 'Dürüm ve kebap sofraları için ince taze lavaş.', 29.90, null, 'paket', false, 6),
  ('ekmek-firin', 'Bazlama 2''li', 'bazlama-2li', '', '2''li', 'Köy usulü, kalın ve yumuşak taş fırın bazlaması.', 34.90, null, 'paket', false, 7),
  ('ekmek-firin', 'Peynirli Poğaça (Adet)', 'peynirli-pogaca-adet', '', 'adet', 'Sabah fırınından, bol peynirli el açması poğaça.', 17.50, null, 'adet', false, 8),
  ('ekmek-firin', 'Köy Ekmeği 1 kg', 'koy-ekmegi-1-kg', '', '1 kg', 'Odun ateşinde pişmiş, uzun bayatlamayan köy ekmeği.', 49.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Süt & Kahvaltılık
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sut-kahvaltilik', 'Sütaş Yarım Yağlı Süt 1 L', 'sutas-yarim-yagli-sut-1-l', 'Sütaş', '1 L', 'Günlük tüketim için hafif ve dengeli yarım yağlı süt.', 54.90, null, 'adet', true, 0),
  ('sut-kahvaltilik', 'Pınar Tam Yağlı Süt 1 L', 'pinar-tam-yagli-sut-1-l', 'Pınar', '1 L', 'Kahvaltı ve tariflerin klasiği tam yağlı UHT süt.', 57.90, null, 'adet', false, 1),
  ('sut-kahvaltilik', 'Sütaş Kaymaklı Yoğurt 1 kg', 'sutas-kaymakli-yogurt-1-kg', 'Sütaş', '1 kg', 'Üzeri kaymak bağlayan geleneksel kıvamda yoğurt.', 94.90, null, 'adet', false, 2),
  ('sut-kahvaltilik', 'İçim Ayran 1 L', 'icim-ayran-1-l', 'İçim', '1 L', 'Tuzu dengeli, bol köpüklü serinletici ayran.', 39.90, null, 'adet', false, 3),
  ('sut-kahvaltilik', 'Pınar Beyaz Peynir 500 g', 'pinar-beyaz-peynir-500-g', 'Pınar', '500 g', 'Kahvaltının baş tacı, tam yağlı klasik beyaz peynir.', 169.90, null, 'adet', true, 4),
  ('sut-kahvaltilik', 'Muratbey Kaşar Peyniri 400 g', 'muratbey-kasar-peyniri-400-g', 'Muratbey', '400 g', 'Tost ve makarnaya yakışan, kolay eriyen taze kaşar.', 179.90, null, 'adet', false, 5),
  ('sut-kahvaltilik', 'Yumurta 15''li (L Boy)', 'yumurta-15li-l-boy', '', '15''li', 'Günlük toplanan L boy taze yumurta kolisi.', 119.90, null, 'paket', false, 6),
  ('sut-kahvaltilik', 'İçim Tereyağı 500 g', 'icim-tereyagi-500-g', 'İçim', '500 g', 'Kahvaltıya ve yemeğe, tuzsuz gerçek tereyağı.', 289.90, null, 'adet', false, 7),
  ('sut-kahvaltilik', 'Balparmak Çiçek Balı 460 g', 'balparmak-cicek-bali-460-g', 'Balparmak', '460 g', 'Anadolu yaylalarından süzme çiçek balı.', 219.90, null, 'adet', false, 8),
  ('sut-kahvaltilik', 'Sana Kase Margarin 250 g', 'sana-kase-margarin-250-g', 'Sana', '250 g', 'Kahvaltılık kıvamda, sürülebilir kase margarin.', 44.90, null, 'adet', false, 9),
  ('sut-kahvaltilik', 'Pınar Labne 3x180 g', 'pinar-labne-3x180-g', 'Pınar', '3x180 g', 'Krem kıvamında, kahvaltı ve tatlıların labne peyniri.', 79.90, null, 'paket', false, 10),
  ('sut-kahvaltilik', 'Oba Çilek Reçeli 380 g', 'oba-cilek-receli-380-g', 'Oba', '380 g', 'Parça çilekli, kıvamı yoğun ev usulü reçel.', 69.90, null, 'adet', false, 11)
on conflict (slug) do nothing;

-- İçecek & Su
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('icecek-su', 'Coca-Cola 1 L', 'coca-cola-1-l', 'Coca-Cola', '1 L', 'Sofraların klasiği, buz gibi içimlik kola.', 54.90, null, 'adet', true, 0),
  ('icecek-su', 'Coca-Cola Şekersiz Kutu 330 ml', 'coca-cola-sekersiz-kutu-330-ml', 'Coca-Cola', '330 ml', 'Şekersiz ferahlık, pratik kutu boy.', 27.50, null, 'adet', false, 1),
  ('icecek-su', 'Fanta Portakal 1 L', 'fanta-portakal-1-l', 'Fanta', '1 L', 'Portakal aromalı, bol gazlı klasik içecek.', 49.90, null, 'adet', false, 2),
  ('icecek-su', 'Uludağ Gazoz 1 L', 'uludag-gazoz-1-l', 'Uludağ', '1 L', 'Nostaljik lezzet, doğal aromalı efsane gazoz.', 44.90, null, 'adet', false, 3),
  ('icecek-su', 'Erikli Su 5 L', 'erikli-su-5-l', 'Erikli', '5 L', 'Evin su ihtiyacı için ekonomik 5 litrelik doğal kaynak suyu.', 44.90, null, 'adet', true, 4),
  ('icecek-su', 'Erikli Su 0,5 L 6''lı', 'erikli-su-0-5-l-6li', 'Erikli', '6x0,5 L', 'Plaja ve yola pratik, altılı pet şişe su.', 54.90, null, 'paket', false, 5),
  ('icecek-su', 'Sırma Maden Suyu Sade 6x200 ml', 'sirma-maden-suyu-sade-6x200-ml', 'Sırma', '6x200 ml', 'Doğal mineralli, sade klasik maden suyu.', 59.90, null, 'paket', false, 6),
  ('icecek-su', 'Beypazarı Maden Suyu C Plus 200 ml', 'beypazari-maden-suyu-c-plus-200-ml', 'Beypazarı', '200 ml', 'C vitamini katkılı ferahlatıcı maden suyu.', 14.90, null, 'adet', false, 7),
  ('icecek-su', 'Cappy Vişne Nektarı 1 L', 'cappy-visne-nektari-1-l', 'Cappy', '1 L', 'Yoğun vişne tadında serinletici meyve nektarı.', 64.90, null, 'adet', false, 8),
  ('icecek-su', 'Lipton Ice Tea Şeftali 1 L', 'lipton-ice-tea-seftali-1-l', 'Lipton', '1 L', 'Şeftali aromalı, buz gibi içilen soğuk çay.', 52.90, null, 'adet', false, 9),
  ('icecek-su', 'Çaykur Didi Limon 500 ml', 'caykur-didi-limon-500-ml', 'Çaykur', '500 ml', 'Gerçek çaydan üretilen limonlu soğuk çay.', 32.50, null, 'adet', false, 10),
  ('icecek-su', 'Red Bull Enerji İçeceği 250 ml', 'red-bull-enerji-icecegi-250-ml', 'Red Bull', '250 ml', 'Uzun yolculuklar için kanat takan enerji içeceği.', 69.90, null, 'adet', false, 11)
on conflict (slug) do nothing;

-- Bakliyat & Makarna
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bakliyat-makarna', 'Filiz Spaghetti 500 g', 'filiz-spaghetti-500-g', 'Filiz', '500 g', 'Al dente pişen, sofraların klasiği spaghetti.', 27.50, null, 'adet', true, 0),
  ('bakliyat-makarna', 'Nuh''un Ankara Burgu Makarna 500 g', 'nuhun-ankara-burgu-makarna-500-g', 'Nuh''un Ankara', '500 g', 'Sos tutan kıvrımlı yapısıyla pratik burgu makarna.', 26.90, null, 'adet', false, 1),
  ('bakliyat-makarna', 'Arbella Fiyonk Makarna 500 g', 'arbella-fiyonk-makarna-500-g', 'Arbella', '500 g', 'Salata ve yemeklik sevimli fiyonk makarna.', 24.90, null, 'adet', false, 2),
  ('bakliyat-makarna', 'Barilla Penne Rigate 500 g', 'barilla-penne-rigate-500-g', 'Barilla', '500 g', 'İtalyan usulü, çizgili yüzeyiyle sos tutan penne.', 54.90, null, 'adet', false, 3),
  ('bakliyat-makarna', 'Duru Baldo Pirinç 1 kg', 'duru-baldo-pirinc-1-kg', 'Duru', '1 kg', 'Tane tane pilavların vazgeçilmezi baldo pirinç.', 89.90, null, 'adet', true, 4),
  ('bakliyat-makarna', 'Yayla Osmancık Pirinç 1 kg', 'yayla-osmancik-pirinc-1-kg', 'Yayla', '1 kg', 'Günlük pilavlar için ekonomik Osmancık pirinç.', 74.90, null, 'adet', false, 5),
  ('bakliyat-makarna', 'Duru Yeşil Mercimek 1 kg', 'duru-yesil-mercimek-1-kg', 'Duru', '1 kg', 'Yemeklik ve salatalık, iri taneli yeşil mercimek.', 79.90, null, 'adet', false, 6),
  ('bakliyat-makarna', 'Reis Kırmızı Mercimek 1 kg', 'reis-kirmizi-mercimek-1-kg', 'Reis', '1 kg', 'Çorbaların baş malzemesi, çabuk pişen kırmızı mercimek.', 69.90, null, 'adet', false, 7),
  ('bakliyat-makarna', 'Duru Nohut 1 kg', 'duru-nohut-1-kg', 'Duru', '1 kg', 'İri kalibre, kolay pişen leblebilik nohut.', 84.90, null, 'adet', false, 8),
  ('bakliyat-makarna', 'Yayla Dermason Kuru Fasulye 1 kg', 'yayla-dermason-kuru-fasulye-1-kg', 'Yayla', '1 kg', 'Kremamsı dokusuyla klasik dermason kuru fasulye.', 99.90, null, 'adet', false, 9),
  ('bakliyat-makarna', 'Duru Köftelik İnce Bulgur 1 kg', 'duru-koftelik-ince-bulgur-1-kg', 'Duru', '1 kg', 'Çiğ köfte ve mercimek köftesi için ince bulgur.', 49.90, null, 'adet', false, 10)
on conflict (slug) do nothing;

-- Konserve & Hazır Yemek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('konserve-hazir-yemek', 'Tat Domates Salçası 830 g', 'tat-domates-salcasi-830-g', 'Tat', '830 g', 'Güneşte olgunlaşmış domateslerden yoğun kıvamlı salça.', 99.90, null, 'adet', true, 0),
  ('konserve-hazir-yemek', 'Tukaş Biber Salçası 650 g', 'tukas-biber-salcasi-650-g', 'Tukaş', '650 g', 'Tatlı biberden, yemeklere renk veren biber salçası.', 89.90, null, 'adet', false, 1),
  ('konserve-hazir-yemek', 'Superfresh Ton Balığı 2x160 g', 'superfresh-ton-baligi-2x160-g', 'Superfresh', '2x160 g', 'Salata ve sandviçler için bütün dilim ton balığı.', 129.90, null, 'paket', true, 2),
  ('konserve-hazir-yemek', 'Dardanel Ton Balığı 185 g', 'dardanel-ton-baligi-185-g', 'Dardanel', '185 g', 'Ayçiçek yağında klasik tekli ton balığı konservesi.', 84.90, null, 'adet', false, 3),
  ('konserve-hazir-yemek', 'Tukaş Bezelye Konservesi 550 g', 'tukas-bezelye-konservesi-550-g', 'Tukaş', '550 g', 'Haşlanmaya hazır, taze toplanmış iç bezelye.', 44.90, null, 'adet', false, 4),
  ('konserve-hazir-yemek', 'Bonduelle Tatlı Mısır 340 g', 'bonduelle-tatli-misir-340-g', 'Bonduelle', '340 g', 'Salata ve pilavlara tatlı dokunuş, süper tatlı mısır.', 54.90, null, 'adet', false, 5),
  ('konserve-hazir-yemek', 'Tamek Garnitür 550 g', 'tamek-garnitur-550-g', 'Tamek', '550 g', 'Pratik yemekler için hazır doğranmış sebze garnitürü.', 49.90, null, 'adet', false, 6),
  ('konserve-hazir-yemek', 'Tamek Hazır Yaprak Sarma 300 g', 'tamek-hazir-yaprak-sarma-300-g', 'Tamek', '300 g', 'Zeytinyağlı, açıp servis etmelik yaprak sarma.', 74.90, null, 'adet', false, 7),
  ('konserve-hazir-yemek', 'Knorr Yükselen Mercimek Çorbası 76 g', 'knorr-yukselen-mercimek-corbasi-76-g', 'Knorr', '76 g', 'Beş dakikada hazır, ev tadında mercimek çorbası.', 24.90, null, 'adet', false, 8),
  ('konserve-hazir-yemek', 'Indomie Sebzeli Noodle 75 g', 'indomie-sebzeli-noodle-75-g', 'Indomie', '75 g', 'Üç dakikada hazır, baharat soslu pratik noodle.', 14.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Yağ, Sos & Baharat
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('yag-sos-baharat', 'Yudum Ayçiçek Yağı 5 L', 'yudum-aycicek-yagi-5-l', 'Yudum', '5 L', 'Kızartma ve yemeklerin ekonomik boy ayçiçek yağı.', 449.90, 479.90, 'adet', true, 0),
  ('yag-sos-baharat', 'Orkide Ayçiçek Yağı 1 L', 'orkide-aycicek-yagi-1-l', 'Orkide', '1 L', 'Günlük kullanım için pratik boy ayçiçek yağı.', 99.90, null, 'adet', false, 1),
  ('yag-sos-baharat', 'Komili Riviera Zeytinyağı 1 L', 'komili-riviera-zeytinyagi-1-l', 'Komili', '1 L', 'Yemeklik hafif içimli Riviera zeytinyağı.', 289.90, null, 'adet', true, 2),
  ('yag-sos-baharat', 'Kristal Sızma Zeytinyağı 500 ml', 'kristal-sizma-zeytinyagi-500-ml', 'Kristal', '500 ml', 'Salatalara soğuk sıkım, erken hasat sızma zeytinyağı.', 199.90, null, 'adet', false, 3),
  ('yag-sos-baharat', 'Calve Ketçap 400 g', 'calve-ketcap-400-g', 'Calve', '400 g', 'Tatlı dengeli, çocukların sevdiği klasik ketçap.', 54.90, null, 'adet', false, 4),
  ('yag-sos-baharat', 'Calve Mayonez 350 g', 'calve-mayonez-350-g', 'Calve', '350 g', 'Kremamsı kıvamda, sandviçlerin klasiği mayonez.', 59.90, null, 'adet', false, 5),
  ('yag-sos-baharat', 'Öncü Acı Biber Sosu 260 g', 'oncu-aci-biber-sosu-260-g', 'Öncü', '260 g', 'Kebap ve dürümlere ateşli dokunuş, acı biber sosu.', 39.90, null, 'adet', false, 6),
  ('yag-sos-baharat', 'Bağdat Pul Biber 65 g', 'bagdat-pul-biber-65-g', 'Bağdat', '65 g', 'Maraş usulü, yağlı ve aromalı pul biber.', 34.90, null, 'adet', false, 7),
  ('yag-sos-baharat', 'Knorr Tavuk Bulyon 8''li', 'knorr-tavuk-bulyon-8li', 'Knorr', '8x10 g', 'Çorba ve pilavlara lezzet katan tavuk bulyon.', 42.50, null, 'paket', false, 8),
  ('yag-sos-baharat', 'Billur Tuz 750 g', 'billur-tuz-750-g', 'Billur', '750 g', 'Sofra ve yemeklik ince rafine tuz.', 19.90, null, 'adet', false, 9),
  ('yag-sos-baharat', 'Kemal Kükrer Üzüm Sirkesi 1 L', 'kemal-kukrer-uzum-sirkesi-1-l', 'Kemal Kükrer', '1 L', 'Salata ve turşuların doğal fermente üzüm sirkesi.', 34.90, null, 'adet', false, 10)
on conflict (slug) do nothing;

-- Atıştırmalık
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('atistirmalik', 'Eti Cin 300 g', 'eti-cin-300-g', 'Eti', '300 g', 'Portakal jöleli, çay saatlerinin klasik bisküvisi.', 44.90, null, 'adet', true, 0),
  ('atistirmalik', 'Ülker Çokoprens 240 g', 'ulker-cokoprens-240-g', 'Ülker', '240 g', 'Çikolata kremalı, nesillerin sevdiği sandviç bisküvi.', 49.90, null, 'adet', true, 1),
  ('atistirmalik', 'Eti Burçak 393 g', 'eti-burcak-393-g', 'Eti', '393 g', 'Tam buğdaylı, çaya en çok yakışan klasik bisküvi.', 54.90, null, 'adet', false, 2),
  ('atistirmalik', 'Ülker Hanımeller Fındıklı 200 g', 'ulker-hanimeller-findikli-200-g', 'Ülker', '200 g', 'Ev kurabiyesi tadında bol fındıklı kurabiye.', 39.90, null, 'adet', false, 3),
  ('atistirmalik', 'Eti Crax Baharatlı Çubuk Kraker 123 g', 'eti-crax-baharatli-cubuk-kraker-123-g', 'Eti', '123 g', 'Çıtır çıtır, baharat kaplı çubuk kraker.', 22.50, null, 'adet', false, 4),
  ('atistirmalik', 'Ülker Krispi Peynirli Kraker 106 g', 'ulker-krispi-peynirli-kraker-106-g', 'Ülker', '106 g', 'Peynir aromalı, acıktıran mini kraker.', 24.90, null, 'adet', false, 5),
  ('atistirmalik', 'Eti Popkek Kakaolu 60 g', 'eti-popkek-kakaolu-60-g', 'Eti', '60 g', 'Yumuşacık dokulu, kakao dolgulu pratik kek.', 17.50, null, 'adet', false, 6),
  ('atistirmalik', 'Ülker Dankek Baton Kek 175 g', 'ulker-dankek-baton-kek-175-g', 'Ülker', '175 g', 'Kakao damarlı, dilimlik klasik baton kek.', 39.90, null, 'adet', false, 7),
  ('atistirmalik', 'Ülker Rondo Klasik 100 g', 'ulker-rondo-klasik-100-g', 'Ülker', '100 g', 'Krema dolgulu, kahve yanına klasik bisküvi.', 16.50, null, 'adet', false, 8),
  ('atistirmalik', 'Eti Form Kepekli Bisküvi 45 g', 'eti-form-kepekli-biskuvi-45-g', 'Eti', '45 g', 'Ara öğünlere hafif, lif kaynağı kepekli bisküvi.', 14.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Cips & Kuruyemiş
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cips-kuruyemis', 'Lay''s Klasik 107 g', 'lays-klasik-107-g', 'Lay''s', '107 g', 'İnce dilim, tuzu dengeli klasik patates cipsi.', 49.90, null, 'adet', true, 0),
  ('cips-kuruyemis', 'Ruffles Originals 104 g', 'ruffles-originals-104-g', 'Ruffles', '104 g', 'Tırtıklı kesim, sosa dayanıklı doyurucu cips.', 52.50, null, 'adet', false, 1),
  ('cips-kuruyemis', 'Doritos Taco 113 g', 'doritos-taco-113-g', 'Doritos', '113 g', 'Taco baharatlı, maç akşamlarının mısır cipsi.', 52.50, null, 'adet', false, 2),
  ('cips-kuruyemis', 'Çerezza Mısır Cipsi 95 g', 'cerezza-misir-cipsi-95-g', 'Çerezza', '95 g', 'Fırınlanmış, çıtır mısır cipsi.', 39.90, null, 'adet', false, 3),
  ('cips-kuruyemis', 'Patos Baharatlı Mısır Cipsi 110 g', 'patos-baharatli-misir-cipsi-110-g', 'Patos', '110 g', 'Baharatı bol, ekonomik boy mısır cipsi.', 34.90, null, 'adet', false, 4),
  ('cips-kuruyemis', 'Tadım Kavrulmuş Ayçekirdeği 200 g', 'tadim-kavrulmus-aycekirdegi-200-g', 'Tadım', '200 g', 'Akşam keyfinin vazgeçilmezi, iri taneli ay çekirdeği.', 54.90, null, 'adet', true, 5),
  ('cips-kuruyemis', 'Peyman Çitliyo Kabak Çekirdeği 180 g', 'peyman-citliyo-kabak-cekirdegi-180-g', 'Peyman', '180 g', 'Tuzu ayarında, kolay çitlenen kabak çekirdeği.', 69.90, null, 'adet', false, 6),
  ('cips-kuruyemis', 'Tadım Karışık Kuruyemiş 170 g', 'tadim-karisik-kuruyemis-170-g', 'Tadım', '170 g', 'Fındık, badem ve fıstıkla zengin karışık kuruyemiş.', 119.90, null, 'adet', false, 7),
  ('cips-kuruyemis', 'Peyman Antep Fıstığı 170 g', 'peyman-antep-fistigi-170-g', 'Peyman', '170 g', 'Gaziantep''ten kavrulmuş, boz iç Antep fıstığı.', 199.90, null, 'adet', false, 8),
  ('cips-kuruyemis', 'Tadım Beyaz Leblebi 200 g', 'tadim-beyaz-leblebi-200-g', 'Tadım', '200 g', 'Çay yanına hafif, geleneksel beyaz leblebi.', 44.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Çikolata & Şekerleme
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cikolata-sekerleme', 'Ülker Kare Sütlü Çikolata 60 g', 'ulker-kare-sutlu-cikolata-60-g', 'Ülker', '60 g', 'Bol sütlü, klasik kare tablet çikolata.', 34.90, null, 'adet', true, 0),
  ('cikolata-sekerleme', 'Nestle Damak 60 g', 'nestle-damak-60-g', 'Nestle', '60 g', 'Antep fıstıklı, damaklarda iz bırakan tablet çikolata.', 49.90, null, 'adet', true, 1),
  ('cikolata-sekerleme', 'Eti Karam %54 Bitter 60 g', 'eti-karam-54-bitter-60-g', 'Eti', '60 g', 'Yoğun kakaolu, hafif buruk bitter çikolata.', 39.90, null, 'adet', false, 2),
  ('cikolata-sekerleme', 'Milka Sütlü Çikolata 80 g', 'milka-sutlu-cikolata-80-g', 'Milka', '80 g', 'Alp sütüyle üretilen yumuşak içimli sütlü çikolata.', 59.90, null, 'adet', false, 3),
  ('cikolata-sekerleme', 'Snickers 50 g', 'snickers-50-g', 'Snickers', '50 g', 'Yer fıstıklı ve karamelli doyurucu çikolata bar.', 29.90, null, 'adet', false, 4),
  ('cikolata-sekerleme', 'Ülker Albeni 40 g', 'ulker-albeni-40-g', 'Ülker', '40 g', 'Karamel kaplı bisküvili klasik çikolata bar.', 17.50, null, 'adet', false, 5),
  ('cikolata-sekerleme', 'Ülker Metro 36 g', 'ulker-metro-36-g', 'Ülker', '36 g', 'Karamel ve nugalı, enerji veren çikolata bar.', 15.90, null, 'adet', false, 6),
  ('cikolata-sekerleme', 'Kinder Bueno 43 g', 'kinder-bueno-43-g', 'Kinder', '43 g', 'Fındık kremalı, ince gofretli sütlü çikolata.', 34.90, null, 'adet', false, 7),
  ('cikolata-sekerleme', 'Haribo Altın Ayıcık 80 g', 'haribo-altin-ayicik-80-g', 'Haribo', '80 g', 'Meyve aromalı, yumuşak klasik jelibon.', 34.90, null, 'adet', false, 8),
  ('cikolata-sekerleme', 'Falım Naneli Sakız 5''li', 'falim-naneli-sakiz-5li', 'Falım', '5''li', 'Şekersiz, uzun süre tat veren naneli sakız.', 12.50, null, 'paket', false, 9),
  ('cikolata-sekerleme', 'Tofita Karpuz 47 g', 'tofita-karpuz-47-g', 'Tofita', '47 g', 'Karpuz aromalı, meyve dolgulu yumuşak şeker.', 14.90, null, 'adet', false, 10)
on conflict (slug) do nothing;

-- Kahve & Çay
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kahve-cay', 'Çaykur Rize Turist Çayı 1 kg', 'caykur-rize-turist-cayi-1-kg', 'Çaykur', '1 kg', 'Rize''nin yamaçlarından, demi bol klasik siyah çay.', 219.90, null, 'adet', true, 0),
  ('kahve-cay', 'Doğuş Karadeniz Çayı 500 g', 'dogus-karadeniz-cayi-500-g', 'Doğuş', '500 g', 'Tavşan kanı demlenen, dengeli harman Karadeniz çayı.', 119.90, null, 'adet', false, 1),
  ('kahve-cay', 'Lipton Yellow Label Demlik Poşet 100''lü', 'lipton-yellow-label-demlik-poset-100lu', 'Lipton', '100''lü', 'Pratik demlik poşetiyle her demlikte aynı lezzet.', 179.90, null, 'adet', false, 2),
  ('kahve-cay', 'Kurukahveci Mehmet Efendi Türk Kahvesi 250 g', 'kurukahveci-mehmet-efendi-turk-kahvesi-250-g', 'Kurukahveci Mehmet Efendi', '250 g', 'Taze öğütülmüş, bol köpüklü geleneksel Türk kahvesi.', 149.90, null, 'adet', true, 3),
  ('kahve-cay', 'Nescafe Classic 100 g', 'nescafe-classic-100-g', 'Nescafe', '100 g', 'Cam kavanozda yoğun aromalı klasik hazır kahve.', 149.90, null, 'adet', false, 4),
  ('kahve-cay', 'Nescafe 3ü1 Arada 10''lu', 'nescafe-3u1-arada-10lu', 'Nescafe', '10x17,5 g', 'Süt tozu ve şekeriyle pratik tek içimlik kahve.', 64.90, null, 'paket', false, 5),
  ('kahve-cay', 'Jacobs Monarch Gold 100 g', 'jacobs-monarch-gold-100-g', 'Jacobs', '100 g', 'Yumuşak içimli, aroması yoğun granül kahve.', 189.90, null, 'adet', false, 6),
  ('kahve-cay', 'Doğadan Ihlamur 20''li', 'dogadan-ihlamur-20li', 'Doğadan', '20''li', 'Kış akşamlarının şifalı içeceği süzen poşet ıhlamur.', 54.90, null, 'adet', false, 7),
  ('kahve-cay', 'Doğadan Yeşil Çay Limonlu 20''li', 'dogadan-yesil-cay-limonlu-20li', 'Doğadan', '20''li', 'Limon aromalı, günü dengeleyen yeşil çay.', 49.90, null, 'adet', false, 8),
  ('kahve-cay', 'Café Crown Sütlü Köpüklü 10''lu', 'cafe-crown-sutlu-kopuklu-10lu', 'Café Crown', '10x14 g', 'Bol köpüklü, sütlü hazır kahve keyfi.', 59.90, null, 'paket', false, 9)
on conflict (slug) do nothing;

-- Dondurma
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('dondurma', 'Algida Klasik Maraş Usulü 750 ml', 'algida-klasik-maras-usulu-750-ml', 'Algida', '750 ml', 'Aile boyu, sakızlı Maraş usulü sade dondurma.', 129.90, null, 'adet', true, 0),
  ('dondurma', 'Magnum Badem 100 ml', 'magnum-badem-100-ml', 'Algida', '100 ml', 'Çıtır bademli çikolata kaplı klasik Magnum.', 64.90, null, 'adet', false, 1),
  ('dondurma', 'Magnum Double Karamel 95 ml', 'magnum-double-karamel-95-ml', 'Algida', '95 ml', 'Çift kat çikolata ve akışkan karamel dolgu.', 69.90, null, 'adet', true, 2),
  ('dondurma', 'Cornetto Klasik 120 ml', 'cornetto-klasik-120-ml', 'Algida', '120 ml', 'Çıtır külahlı, çikolata uçlu klasik Cornetto.', 44.90, null, 'adet', false, 3),
  ('dondurma', 'Algida Max Twister 80 ml', 'algida-max-twister-80-ml', 'Algida', '80 ml', 'Meyveli katmanlarıyla çocukların favorisi çubuk dondurma.', 32.50, null, 'adet', false, 4),
  ('dondurma', 'Algida Alaska Frigo 60 ml', 'algida-alaska-frigo-60-ml', 'Algida', '60 ml', 'Nostaljik çikolata kaplı sade çubuk dondurma.', 24.90, null, 'adet', false, 5),
  ('dondurma', 'Golf Bravo Çikolatalı 280 ml', 'golf-bravo-cikolatali-280-ml', 'Golf', '280 ml', 'Kaşıklamalık, bol çikolatalı ekonomik kap dondurma.', 54.90, null, 'adet', false, 6),
  ('dondurma', 'Panda Maraş Usulü Kakaolu 1 L', 'panda-maras-usulu-kakaolu-1-l', 'Panda', '1 L', 'Aile boyu kakaolu Maraş usulü dondurma.', 109.90, null, 'adet', false, 7),
  ('dondurma', 'Panda Sandviç Dondurma 130 ml', 'panda-sandvic-dondurma-130-ml', 'Panda', '130 ml', 'İki bisküvi arasında vanilyalı nostaljik sandviç dondurma.', 29.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Donuk Gıda
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('donuk-gida', 'Superfresh Karışık Pizza 435 g', 'superfresh-karisik-pizza-435-g', 'Superfresh', '435 g', 'Fırında 15 dakikada hazır, bol malzemeli karışık pizza.', 109.90, null, 'adet', true, 0),
  ('donuk-gida', 'Superfresh Donuk Patates 2,5 kg', 'superfresh-donuk-patates-2-5-kg', 'Superfresh', '2,5 kg', 'Çıtır kızaran, ekonomik aile boyu donuk parmak patates.', 149.90, null, 'adet', true, 1),
  ('donuk-gida', 'Banvit Piliç Nugget 480 g', 'banvit-pilic-nugget-480-g', 'Banvit', '480 g', 'Çocukların bayıldığı çıtır kaplamalı piliç nugget.', 129.90, null, 'adet', false, 2),
  ('donuk-gida', 'Pınar Donuk İnegöl Köfte 450 g', 'pinar-donuk-inegol-kofte-450-g', 'Pınar', '450 g', 'Izgaraya hazır, baharatı dengeli İnegöl köfte.', 159.90, null, 'adet', false, 3),
  ('donuk-gida', 'Superfresh Sigara Böreği 500 g', 'superfresh-sigara-boregi-500-g', 'Superfresh', '500 g', 'Peynirli, kızartmaya hazır çıtır sigara böreği.', 99.90, null, 'adet', false, 4),
  ('donuk-gida', 'Superfresh Milföy Hamuru 1 kg', 'superfresh-milfoy-hamuru-1-kg', 'Superfresh', '1 kg', 'Tatlı ve tuzlu tarifler için açılmış hazır milföy.', 89.90, null, 'adet', false, 5),
  ('donuk-gida', 'Superfresh Donuk Bezelye 450 g', 'superfresh-donuk-bezelye-450-g', 'Superfresh', '450 g', 'Şok dondurulmuş, taze toplanmış iç bezelye.', 49.90, null, 'adet', false, 6),
  ('donuk-gida', 'Superfresh Donuk Ispanak 450 g', 'superfresh-donuk-ispanak-450-g', 'Superfresh', '450 g', 'Ayıklanmış ve yıkanmış, pişirmeye hazır donuk ıspanak.', 54.90, null, 'adet', false, 7),
  ('donuk-gida', 'Feast Çıtır Kalamar 400 g', 'feast-citir-kalamar-400-g', 'Feast', '400 g', 'Kızartmaya hazır, çıtır kaplamalı kalamar halkası.', 189.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Zeytin & Turşu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('zeytin-tursu', 'Marmarabirlik Gemlik Siyah Zeytin 400 g', 'marmarabirlik-gemlik-siyah-zeytin-400-g', 'Marmarabirlik', '400 g', 'Gemlik yöresinden, yağlı sele klasik siyah zeytin.', 129.90, null, 'adet', true, 0),
  ('zeytin-tursu', 'Tariş Yeşil Çizik Zeytin 400 g', 'taris-yesil-cizik-zeytin-400-g', 'Tariş', '400 g', 'Ege usulü, kekik aromalı çizik yeşil zeytin.', 119.90, null, 'adet', false, 1),
  ('zeytin-tursu', 'Tariş Sele Zeytin 500 g', 'taris-sele-zeytin-500-g', 'Tariş', '500 g', 'Az tuzlu, kahvaltılık doğal sele zeytin.', 139.90, null, 'adet', false, 2),
  ('zeytin-tursu', 'Marmarabirlik Biber Dolgulu Yeşil Zeytin 350 g', 'marmarabirlik-biber-dolgulu-yesil-zeytin-350-g', 'Marmarabirlik', '350 g', 'Kırmızı biber dolgulu, aperatif yeşil zeytin.', 99.90, null, 'adet', false, 3),
  ('zeytin-tursu', 'Marmarabirlik Zeytin Ezmesi 350 g', 'marmarabirlik-zeytin-ezmesi-350-g', 'Marmarabirlik', '350 g', 'Kahvaltılık, sürülebilir kıvamda siyah zeytin ezmesi.', 89.90, null, 'adet', false, 4),
  ('zeytin-tursu', 'Fersan Karışık Turşu 680 g', 'fersan-karisik-tursu-680-g', 'Fersan', '680 g', 'Geleneksel salamura, çeşit çeşit sebzeli karışık turşu.', 69.90, null, 'adet', false, 5),
  ('zeytin-tursu', 'Fersan Salatalık Turşusu 680 g', 'fersan-salatalik-tursusu-680-g', 'Fersan', '680 g', 'Kıtır kıtır, sofraların klasiği salatalık turşusu.', 74.90, null, 'adet', false, 6),
  ('zeytin-tursu', 'Penguen Kornişon Turşu 720 ml', 'penguen-kornison-tursu-720-ml', 'Penguen', '720 ml', 'Minik boy, ekstra çıtır kornişon salatalık turşusu.', 89.90, null, 'adet', false, 7),
  ('zeytin-tursu', 'Öncü Acı Biber Turşusu 660 g', 'oncu-aci-biber-tursusu-660-g', 'Öncü', '660 g', 'Sofralara ateşli lezzet katan acı biber turşusu.', 79.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Temizlik & Deterjan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('temizlik-deterjan', 'Omo Active Toz Deterjan 4 kg', 'omo-active-toz-deterjan-4-kg', 'Omo', '4 kg', 'Zorlu lekelere karşı etkili, ekonomik boy toz deterjan.', 249.90, null, 'adet', true, 0),
  ('temizlik-deterjan', 'Ariel Sıvı Deterjan 26 Yıkama 1,69 L', 'ariel-sivi-deterjan-26-yikama-1-69-l', 'Ariel', '1,69 L', 'Renk koruyucu formüllü, 26 yıkamalık sıvı deterjan.', 219.90, null, 'adet', false, 1),
  ('temizlik-deterjan', 'Yumoş Extra Yumuşatıcı 1440 ml', 'yumos-extra-yumusatici-1440-ml', 'Yumoş', '1440 ml', 'Kalıcı kokusuyla çamaşırlara ayıcık yumuşaklığı.', 129.90, null, 'adet', false, 2),
  ('temizlik-deterjan', 'Fairy Limon Bulaşık Deterjanı 650 ml', 'fairy-limon-bulasik-deterjani-650-ml', 'Fairy', '650 ml', 'Bir damlası dağ gibi bulaşığa yeten limonlu deterjan.', 79.90, null, 'adet', true, 3),
  ('temizlik-deterjan', 'Finish Quantum Bulaşık Tableti 36''lı', 'finish-quantum-bulasik-tableti-36li', 'Finish', '36''lı', 'Makinede parlak sonuç veren hepsi bir arada tablet.', 269.90, 299.90, 'adet', false, 4),
  ('temizlik-deterjan', 'Domestos Çamaşır Suyu Dağ Esintisi 750 ml', 'domestos-camasir-suyu-dag-esintisi-750-ml', 'Domestos', '750 ml', 'Kıvamlı formülüyle derinlemesine hijyen sağlayan çamaşır suyu.', 54.90, null, 'adet', false, 5),
  ('temizlik-deterjan', 'Cif Krem Amonyaklı 750 ml', 'cif-krem-amonyakli-750-ml', 'Cif', '750 ml', 'Mutfak ve banyo yüzeylerinde etkili krem temizleyici.', 69.90, null, 'adet', false, 6),
  ('temizlik-deterjan', 'Cillit Bang Kireç Sökücü 750 ml', 'cillit-bang-kirec-sokucu-750-ml', 'Cillit Bang', '750 ml', 'Armatür ve fayanslardaki kireci söken güçlü sprey.', 99.90, null, 'adet', false, 7),
  ('temizlik-deterjan', 'Bingo Fresh Yüzey Temizleyici 2,5 L', 'bingo-fresh-yuzey-temizleyici-2-5-l', 'Bingo', '2,5 L', 'Ferah kokulu, tüm yüzeylere uygun ekonomik temizleyici.', 89.90, null, 'adet', false, 8),
  ('temizlik-deterjan', 'Scotch-Brite Bulaşık Süngeri 3''lü', 'scotch-brite-bulasik-sungeri-3lu', 'Scotch-Brite', '3''lü', 'Çizmeyen yeşil telli, dayanıklı bulaşık süngeri.', 39.90, null, 'paket', false, 9),
  ('temizlik-deterjan', 'Vileda Temizlik Bezi 3''lü', 'vileda-temizlik-bezi-3lu', 'Vileda', '3''lü', 'Yüksek emici, yıkanıp tekrar kullanılabilen temizlik bezi.', 49.90, null, 'paket', false, 10)
on conflict (slug) do nothing;

-- Kağıt Ürünleri
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kagit-urunleri', 'Solo Tuvalet Kağıdı 8''li', 'solo-tuvalet-kagidi-8li', 'Solo', '8''li', 'Günlük kullanım için yumuşak dokulu ekonomik tuvalet kağıdı.', 109.90, null, 'paket', true, 0),
  ('kagit-urunleri', 'Selpak Tuvalet Kağıdı 12''li', 'selpak-tuvalet-kagidi-12li', 'Selpak', '12''li', 'Üç katlı, ekstra yumuşak premium tuvalet kağıdı.', 219.90, null, 'paket', true, 1),
  ('kagit-urunleri', 'Familia Plus Tuvalet Kağıdı 16''lı', 'familia-plus-tuvalet-kagidi-16li', 'Familia', '16''lı', 'Aile boyu avantajlı paket, çift katlı tuvalet kağıdı.', 199.90, null, 'paket', false, 2),
  ('kagit-urunleri', 'Papia Tuvalet Kağıdı 32''li', 'papia-tuvalet-kagidi-32li', 'Papia', '32''li', 'Uzun süre yetecek jumbo paket, üç katlı kağıt.', 379.90, 419.90, 'paket', false, 3),
  ('kagit-urunleri', 'Selpak Kağıt Havlu 8''li', 'selpak-kagit-havlu-8li', 'Selpak', '8''li', 'Mutfakta yüksek emici, dayanıklı kağıt havlu.', 179.90, null, 'paket', false, 4),
  ('kagit-urunleri', 'Solo Kağıt Havlu 6''lı', 'solo-kagit-havlu-6li', 'Solo', '6''lı', 'Günlük mutfak işleri için ekonomik kağıt havlu.', 119.90, null, 'paket', false, 5),
  ('kagit-urunleri', 'Selpak Kutu Mendil 150''li', 'selpak-kutu-mendil-150li', 'Selpak', '150''li', 'Ev ve ofis için pratik kutuda yumuşak mendil.', 49.90, null, 'adet', false, 6),
  ('kagit-urunleri', 'Selpak Cep Mendili 10x10', 'selpak-cep-mendili-10x10', 'Selpak', '10x10''lu', 'Çantada ve cepte taşınan pratik paket mendil.', 44.90, null, 'paket', false, 7),
  ('kagit-urunleri', 'Sofia Peçete 100''lü', 'sofia-pecete-100lu', 'Sofia', '100''lü', 'Sofralık, çift katlı beyaz kağıt peçete.', 34.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Kişisel Bakım
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kisisel-bakim', 'Elidor Güçlü ve Parlak Şampuan 500 ml', 'elidor-guclu-ve-parlak-sampuan-500-ml', 'Elidor', '500 ml', 'Saçlara güç ve parlaklık veren bakım şampuanı.', 129.90, null, 'adet', true, 0),
  ('kisisel-bakim', 'Head & Shoulders Şampuan 400 ml', 'head-shoulders-sampuan-400-ml', 'Head & Shoulders', '400 ml', 'Kepeğe karşı etkili, ferahlatıcı günlük şampuan.', 149.90, null, 'adet', false, 1),
  ('kisisel-bakim', 'Clear Men Şampuan 350 ml', 'clear-men-sampuan-350-ml', 'Clear', '350 ml', 'Erkek saç derisine özel kepek karşıtı şampuan.', 119.90, null, 'adet', false, 2),
  ('kisisel-bakim', 'Colgate Total Diş Macunu 75 ml', 'colgate-total-dis-macunu-75-ml', 'Colgate', '75 ml', 'On iki saat koruma sağlayan komple bakım diş macunu.', 79.90, null, 'adet', false, 3),
  ('kisisel-bakim', 'Oral-B Diş Fırçası (Orta)', 'oral-b-dis-fircasi-orta', 'Oral-B', 'adet', 'Orta sert kıllı, diş etlerine nazik günlük diş fırçası.', 49.90, null, 'adet', false, 4),
  ('kisisel-bakim', 'Rexona Men Roll-on 50 ml', 'rexona-men-roll-on-50-ml', 'Rexona', '50 ml', 'Gün boyu kuruluk hissi veren erkek roll-on.', 89.90, null, 'adet', false, 5),
  ('kisisel-bakim', 'Nivea Deo Sprey Fresh 150 ml', 'nivea-deo-sprey-fresh-150-ml', 'Nivea', '150 ml', 'Ferah kokulu, cilde nazik günlük deodorant.', 119.90, null, 'adet', false, 6),
  ('kisisel-bakim', 'Duru Fresh Duş Jeli 500 ml', 'duru-fresh-dus-jeli-500-ml', 'Duru', '500 ml', 'Okyanus ferahlığında bol köpüklü duş jeli.', 89.90, null, 'adet', false, 7),
  ('kisisel-bakim', 'Hacı Şakir Kalıp Sabun 4x150 g', 'haci-sakir-kalip-sabun-4x150-g', 'Hacı Şakir', '4x150 g', 'Yüz yıllık formülüyle doğal kalıp banyo sabunu.', 79.90, null, 'paket', false, 8),
  ('kisisel-bakim', 'Gillette Blue3 Tıraş Bıçağı 3''lü', 'gillette-blue3-tiras-bicagi-3lu', 'Gillette', '3''lü', 'Üç bıçaklı, konforlu tıraş için kullan-at bıçak.', 99.90, null, 'paket', false, 9),
  ('kisisel-bakim', 'Arko Men Tıraş Kremi 100 g', 'arko-men-tiras-kremi-100-g', 'Arko', '100 g', 'Bol köpüğüyle klasikleşmiş tıraş kremi.', 54.90, null, 'adet', false, 10),
  ('kisisel-bakim', 'Selin Limon Kolonyası 400 ml', 'selin-limon-kolonyasi-400-ml', 'Selin', '400 ml', '80 derece, misafire ikramlık ferah limon kolonyası.', 79.90, null, 'adet', true, 11)
on conflict (slug) do nothing;

-- Vitamin & İlk Yardım
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('vitamin-ilk-yardim', 'Canped Yara Bandı 20''li', 'canped-yara-bandi-20li', 'Canped', '20''li', 'Su geçirmez, farklı boylarda pratik yara bandı.', 34.90, null, 'paket', true, 0),
  ('vitamin-ilk-yardim', 'Steril Gazlı Bez 10''lu', 'steril-gazli-bez-10lu', '', '10''lu', 'İlk yardım dolabının olmazsa olmazı steril gazlı bez.', 29.90, null, 'paket', false, 1),
  ('vitamin-ilk-yardim', 'Hidrofil Pamuk 100 g', 'hidrofil-pamuk-100-g', '', '100 g', 'Çok amaçlı kullanım için yumuşak hidrofil pamuk.', 24.90, null, 'adet', false, 2),
  ('vitamin-ilk-yardim', 'Medikal Flaster 5 m', 'medikal-flaster-5-m', '', '5 m x 2,5 cm', 'Cilde uyumlu, kolay kesilen sargı flasteri.', 22.50, null, 'adet', false, 3),
  ('vitamin-ilk-yardim', 'Elastik Bandaj 8 cm', 'elastik-bandaj-8-cm', '', '8 cm x 1,5 m', 'Burkulmalarda destek sağlayan esnek sargı bandajı.', 39.90, null, 'adet', false, 4),
  ('vitamin-ilk-yardim', 'Dijital Ateş Ölçer', 'dijital-ates-olcer', '', 'adet', 'Hızlı ve güvenilir ölçüm yapan dijital termometre.', 149.90, null, 'adet', false, 5),
  ('vitamin-ilk-yardim', 'El Dezenfektanı 100 ml', 'el-dezenfektani-100-ml', '', '100 ml', 'Çantada taşınabilir, alkol bazlı el dezenfektanı.', 44.90, null, 'adet', false, 6),
  ('vitamin-ilk-yardim', 'Vitamin C Efervesan 1000 mg 20 Tablet', 'vitamin-c-efervesan-1000-mg-20-tablet', '', '20 tablet', 'Bağışıklık desteği için portakal aromalı efervesan tablet.', 129.90, null, 'adet', true, 7)
on conflict (slug) do nothing;

-- Tek Kullanımlık & Piknik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('tek-kullanimlik-piknik', 'Karton Bardak 180 ml 50''li', 'karton-bardak-180-ml-50li', '', '50''li', 'Sıcak ve soğuk içecekler için dayanıklı karton bardak.', 49.90, null, 'paket', true, 0),
  ('tek-kullanimlik-piknik', 'Karton Tabak 22 cm 25''li', 'karton-tabak-22-cm-25li', '', '25''li', 'Piknik sofraları için sağlam karton tabak.', 39.90, null, 'paket', false, 1),
  ('tek-kullanimlik-piknik', 'Plastik Çatal 25''li', 'plastik-catal-25li', '', '25''li', 'Piknik ve davetler için pratik tek kullanımlık çatal.', 24.90, null, 'paket', false, 2),
  ('tek-kullanimlik-piknik', 'Plastik Kaşık 25''li', 'plastik-kasik-25li', '', '25''li', 'Tatlı ve yemek servisi için tek kullanımlık kaşık.', 24.90, null, 'paket', false, 3),
  ('tek-kullanimlik-piknik', 'Piknik Masa Örtüsü 120x180 cm', 'piknik-masa-ortusu-120x180-cm', '', '120x180 cm', 'Tek kullanımlık, desenli pratik piknik örtüsü.', 29.90, null, 'adet', false, 4),
  ('tek-kullanimlik-piknik', 'Koroplast Buzdolabı Poşeti Orta Boy 50''li', 'koroplast-buzdolabi-poseti-orta-boy-50li', 'Koroplast', '50''li', 'Gıdaları taze tutan kilitsiz buzdolabı poşeti.', 44.90, null, 'paket', false, 5),
  ('tek-kullanimlik-piknik', 'Koroplast Streç Film 30 m', 'koroplast-strec-film-30-m', 'Koroplast', '30 m', 'Kaplara tam yapışan, kolay kesilen streç film.', 49.90, null, 'adet', false, 6),
  ('tek-kullanimlik-piknik', 'Koroplast Alüminyum Folyo 10 m', 'koroplast-aluminyum-folyo-10-m', 'Koroplast', '10 m', 'Fırın ve mangalda çok amaçlı alüminyum folyo.', 54.90, null, 'adet', false, 7),
  ('tek-kullanimlik-piknik', 'Koroplast Çöp Torbası Battal Boy 10''lu', 'koroplast-cop-torbasi-battal-boy-10lu', 'Koroplast', '10''lu', 'Yırtılmaya dayanıklı, büzgülü battal boy çöp torbası.', 42.50, null, 'paket', true, 8),
  ('tek-kullanimlik-piknik', 'Buz Poşeti 10''lu', 'buz-poseti-10lu', '', '10''lu', 'İçecekleri serinletmek için pratik buz küpü poşeti.', 19.90, null, 'paket', false, 9)
on conflict (slug) do nothing;

-- Bebek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bebek', 'Prima Bebek Bezi 4 Numara 60''lı', 'prima-bebek-bezi-4-numara-60li', 'Prima', '60''lı', 'On iki saate kadar kuruluk sağlayan aylık avantaj paketi.', 449.90, 489.90, 'paket', true, 0),
  ('bebek', 'Molfix Bebek Bezi 5 Numara 52''li', 'molfix-bebek-bezi-5-numara-52li', 'Molfix', '52''li', 'Esnek yapısıyla rahat hareket sağlayan bebek bezi.', 379.90, null, 'paket', false, 1),
  ('bebek', 'Sleepy Islak Mendil 90''lı', 'sleepy-islak-mendil-90li', 'Sleepy', '90''lı', 'Hassas ciltlere uygun, bol dokulu ıslak mendil.', 49.90, null, 'adet', false, 2),
  ('bebek', 'Uni Baby Islak Mendil 3x52''li', 'uni-baby-islak-mendil-3x52li', 'Uni Baby', '3x52''li', 'Yenidoğan onaylı, parfümsüz ıslak mendil ekonomik paket.', 89.90, null, 'paket', false, 3),
  ('bebek', 'Dalin Bebek Şampuanı 500 ml', 'dalin-bebek-sampuani-500-ml', 'Dalin', '500 ml', 'Göz yakmayan formülüyle klasik bebek şampuanı.', 149.90, null, 'adet', false, 4),
  ('bebek', 'Hero Baby Kavanoz Maması Elmalı 125 g', 'hero-baby-kavanoz-mamasi-elmali-125-g', 'Hero Baby', '125 g', 'Ek gıda dönemi için şeker ilavesiz elma püresi.', 49.90, null, 'adet', false, 5),
  ('bebek', 'Hero Baby Sütlü 8 Tahıllı Kaşık Maması 200 g', 'hero-baby-sutlu-8-tahilli-kasik-mamasi-200-g', 'Hero Baby', '200 g', 'Sekiz tahıllı, demir katkılı besleyici kaşık maması.', 89.90, null, 'adet', false, 6),
  ('bebek', 'Sudocrem Pişik Kremi 60 g', 'sudocrem-pisik-kremi-60-g', 'Sudocrem', '60 g', 'Pişiğe karşı koruyucu bariyer oluşturan bakım kremi.', 149.90, null, 'adet', false, 7),
  ('bebek', 'Philips Avent Emzik 6-18 Ay', 'philips-avent-emzik-6-18-ay', 'Philips Avent', 'adet', 'Ortodontik yapılı, damağa uyumlu silikon emzik.', 129.90, null, 'adet', false, 8),
  ('bebek', 'Bebek Biberonu 250 ml', 'bebek-biberonu-250-ml', '', '250 ml', 'Geniş ağızlı, kolay temizlenen BPA içermeyen biberon.', 99.90, null, 'adet', false, 9)
on conflict (slug) do nothing;

-- Evcil Hayvan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('evcil-hayvan', 'Whiskas Kuru Kedi Maması Tavuklu 1,4 kg', 'whiskas-kuru-kedi-mamasi-tavuklu-1-4-kg', 'Whiskas', '1,4 kg', 'Yetişkin kediler için tavuklu tam besleyici kuru mama.', 249.90, null, 'adet', true, 0),
  ('evcil-hayvan', 'Friskies Kuru Kedi Maması 1 kg', 'friskies-kuru-kedi-mamasi-1-kg', 'Friskies', '1 kg', 'Ekonomik ve dengeli, karışık etli kuru kedi maması.', 169.90, null, 'adet', false, 1),
  ('evcil-hayvan', 'Whiskas Pouch Somonlu 85 g', 'whiskas-pouch-somonlu-85-g', 'Whiskas', '85 g', 'Sos içinde somonlu tek öğünlük yaş kedi maması.', 22.50, null, 'adet', false, 2),
  ('evcil-hayvan', 'Felix Pouch Sığır Etli 85 g', 'felix-pouch-sigir-etli-85-g', 'Felix', '85 g', 'Jöle içinde sığır etli iştah açıcı yaş mama.', 24.90, null, 'adet', false, 3),
  ('evcil-hayvan', 'Dreamies Kedi Ödülü Tavuklu 60 g', 'dreamies-kedi-odulu-tavuklu-60-g', 'Dreamies', '60 g', 'Dışı çıtır içi yumuşak tavuklu kedi ödül maması.', 49.90, null, 'adet', false, 4),
  ('evcil-hayvan', 'Pedigree Kuru Köpek Maması 1,5 kg', 'pedigree-kuru-kopek-mamasi-1-5-kg', 'Pedigree', '1,5 kg', 'Yetişkin köpekler için etli, vitamin katkılı kuru mama.', 229.90, null, 'adet', false, 5),
  ('evcil-hayvan', 'Köpek Ödül Kemiği 2''li', 'kopek-odul-kemigi-2li', '', '2''li', 'Diş sağlığını destekleyen çiğneme ödül kemiği.', 59.90, null, 'paket', false, 6),
  ('evcil-hayvan', 'Bentonit Kedi Kumu 5 L', 'bentonit-kedi-kumu-5-l', '', '5 L', 'Yüksek topaklanan, koku hapseden doğal kedi kumu.', 129.90, null, 'adet', true, 7),
  ('evcil-hayvan', 'Muhabbet Kuşu Yemi 400 g', 'muhabbet-kusu-yemi-400-g', '', '400 g', 'Vitamin katkılı, karışık tohumlu muhabbet kuşu yemi.', 44.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Sigara & Tütün: ÜRÜN YOK — 4207/4733 sayılı kanunlar gereği
-- tütün ürünlerinin online satışı yasaktır. Kategori yalnızca
-- "mağazadan alınır" bilgilendirmesi için katalogda yer alır.

-- Mangal & Kömür
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('mangal-komur', 'Meşe Mangal Kömürü 3 kg', 'mese-mangal-komuru-3-kg', '', '3 kg', 'Uzun süre köz tutan, elenmiş meşe mangal kömürü.', 129.90, null, 'adet', true, 0),
  ('mangal-komur', 'Çıra 500 g', 'cira-500-g', '', '500 g', 'Mangalı kolay tutuşturan doğal reçineli çam çırası.', 44.90, null, 'adet', false, 1),
  ('mangal-komur', 'Mangal Tutuşturucu Küp 32''li', 'mangal-tutusturucu-kup-32li', '', '32''li', 'Tek küple hızlı tutuşturma sağlayan pratik yakıt küpü.', 49.90, null, 'paket', false, 2),
  ('mangal-komur', 'Tek Kullanımlık Mangal', 'tek-kullanimlik-mangal', '', 'adet', 'Kömürü hazır, plaj ve piknikte pratik tek kullanımlık mangal.', 89.90, null, 'adet', true, 3),
  ('mangal-komur', 'Mangal Maşası (Metal)', 'mangal-masasi-metal', '', 'adet', 'Uzun saplı, eli yakmayan paslanmaz mangal maşası.', 79.90, null, 'adet', false, 4),
  ('mangal-komur', 'Çift Katlı Izgara Teli 40 cm', 'cift-katli-izgara-teli-40-cm', '', '40 cm', 'Et ve sebzeleri çevirmeyi kolaylaştıran çift katlı ızgara.', 149.90, null, 'adet', false, 5),
  ('mangal-komur', 'Mangal Yelpazesi', 'mangal-yelpazesi', '', 'adet', 'Közü hızlı canlandıran hasır mangal yelpazesi.', 24.90, null, 'adet', false, 6),
  ('mangal-komur', 'Kebap Şişi 6''lı', 'kebap-sisi-6li', '', '6''lı', 'Paslanmaz çelik, yassı uçlu şiş kebap şişi seti.', 99.90, null, 'paket', false, 7)
on conflict (slug) do nothing;

-- Çakmak, Kibrit & Tüp
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cakmak-kibrit-tup', 'Clipper Çakmak', 'clipper-cakmak', 'Clipper', 'adet', 'Doldurulabilir, uzun ömürlü klasik Clipper çakmak.', 34.90, null, 'adet', true, 0),
  ('cakmak-kibrit-tup', 'BIC Maxi Çakmak', 'bic-maxi-cakmak', 'BIC', 'adet', 'Üç bine kadar yakım yapan güvenilir cep çakmağı.', 44.90, null, 'adet', false, 1),
  ('cakmak-kibrit-tup', 'Kav Kibrit 10''lu', 'kav-kibrit-10lu', 'Kav', '10''lu', 'Ev tipi, uzun çöplü klasik kibrit ekonomik paketi.', 24.90, null, 'paket', false, 2),
  ('cakmak-kibrit-tup', 'Ocak Çakmağı (Mutfak)', 'ocak-cakmagi-mutfak', '', 'adet', 'Ocak ve fırın için uzun ömürlü mutfak çakmağı.', 59.90, null, 'adet', false, 3),
  ('cakmak-kibrit-tup', 'Uzun Barbekü Çakmağı', 'uzun-barbeku-cakmagi', '', 'adet', 'Mangal ve şömine için uzun namlulu emniyetli çakmak.', 69.90, null, 'adet', false, 4),
  ('cakmak-kibrit-tup', 'Çakmak Gazı 250 ml', 'cakmak-gazi-250-ml', '', '250 ml', 'Doldurulabilir çakmaklar için saf bütan gaz.', 49.90, null, 'adet', false, 5),
  ('cakmak-kibrit-tup', 'Kamp Tüpü Kartuşu 220 g', 'kamp-tupu-kartusu-220-g', '', '220 g', 'Kamp ocakları için vidalı tip bütan gaz kartuşu.', 89.90, null, 'adet', false, 6),
  ('cakmak-kibrit-tup', 'Aygaz Piknik Tüpü Dolumu 2 kg', 'aygaz-piknik-tupu-dolumu-2-kg', 'Aygaz', '2 kg', 'Piknik ocakları için 2 kg tüp dolum hizmeti.', 249.90, null, 'adet', true, 7)
on conflict (slug) do nothing;

-- Şarj Aleti & Pil
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarj-aleti-pil', 'Duracell Alkalin AA Pil 4''lü', 'duracell-alkalin-aa-pil-4lu', 'Duracell', '4''lü', 'On kata kadar uzun ömürlü klasik AA alkalin pil.', 129.90, null, 'paket', true, 0),
  ('sarj-aleti-pil', 'Duracell Alkalin AAA Pil 4''lü', 'duracell-alkalin-aaa-pil-4lu', 'Duracell', '4''lü', 'Kumanda ve küçük cihazlar için ince AAA alkalin pil.', 129.90, null, 'paket', false, 1),
  ('sarj-aleti-pil', 'Varta AA Pil 6''lı', 'varta-aa-pil-6li', 'Varta', '6''lı', 'Avantajlı altılı paket, dayanıklı AA alkalin pil.', 149.90, null, 'paket', false, 2),
  ('sarj-aleti-pil', 'Energizer Düğme Pil CR2032', 'energizer-dugme-pil-cr2032', 'Energizer', 'adet', 'Araç anahtarı ve tartılar için lityum düğme pil.', 59.90, null, 'adet', false, 3),
  ('sarj-aleti-pil', 'USB-C Şarj Kablosu 1 m', 'usb-c-sarj-kablosu-1-m', '', '1 m', 'Hızlı şarj destekli örgülü USB-C kablo.', 89.90, null, 'adet', false, 4),
  ('sarj-aleti-pil', 'iPhone Uyumlu Şarj Kablosu 1 m', 'iphone-uyumlu-sarj-kablosu-1-m', '', '1 m', 'Apple cihazlarla uyumlu dayanıklı şarj kablosu.', 99.90, null, 'adet', false, 5),
  ('sarj-aleti-pil', '20W USB-C Şarj Adaptörü', '20w-usb-c-sarj-adaptoru', '', '20 W', 'Telefonu hızla dolduran kompakt hızlı şarj adaptörü.', 199.90, null, 'adet', true, 6),
  ('sarj-aleti-pil', 'Powerbank 10000 mAh', 'powerbank-10000-mah', '', '10000 mAh', 'Plajda ve yolda iki tam şarj sağlayan taşınabilir batarya.', 449.90, null, 'adet', false, 7),
  ('sarj-aleti-pil', 'Micro USB Şarj Kablosu 1 m', 'micro-usb-sarj-kablosu-1-m', '', '1 m', 'Eski tip cihazlar için yedek micro USB kablo.', 49.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Plaj, Mayo & Terlik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('plaj-mayo-terlik', 'Parmak Arası Plaj Terliği', 'parmak-arasi-plaj-terligi', '', 'çeşitli numara', 'Yumuşak tabanlı, kaymaz parmak arası plaj terliği.', 99.90, null, 'adet', true, 0),
  ('plaj-mayo-terlik', 'Deniz Ayakkabısı', 'deniz-ayakkabisi', '', 'çeşitli numara', 'Çakıl ve kayalıklardan koruyan esnek deniz ayakkabısı.', 179.90, null, 'adet', false, 1),
  ('plaj-mayo-terlik', 'Yüzücü Deniz Gözlüğü', 'yuzucu-deniz-gozlugu', '', 'adet', 'Buğu yapmayan, UV korumalı silikon deniz gözlüğü.', 149.90, null, 'adet', false, 2),
  ('plaj-mayo-terlik', 'Şnorkel Maske Seti', 'snorkel-maske-seti', '', 'set', 'Göl keşfi için maske ve şnorkelden oluşan set.', 299.90, null, 'adet', false, 3),
  ('plaj-mayo-terlik', 'Plaj Havlusu 70x140 cm', 'plaj-havlusu-70x140-cm', '', '70x140 cm', 'Hızlı kuruyan, renkli desenli pamuklu plaj havlusu.', 249.90, null, 'adet', false, 4),
  ('plaj-mayo-terlik', 'Erkek Deniz Şortu', 'erkek-deniz-sortu', '', 'çeşitli beden', 'Çabuk kuruyan kumaşıyla konforlu erkek deniz şortu.', 299.90, null, 'adet', false, 5),
  ('plaj-mayo-terlik', 'Çocuk Mayosu', 'cocuk-mayosu', '', 'çeşitli beden', 'Neşeli desenli, çabuk kuruyan çocuk mayosu.', 199.90, null, 'adet', false, 6),
  ('plaj-mayo-terlik', 'Hasır Plaj Şapkası', 'hasir-plaj-sapkasi', '', 'adet', 'Geniş siperli, güneşten koruyan hasır şapka.', 149.90, null, 'adet', false, 7),
  ('plaj-mayo-terlik', 'Hasır Plaj Çantası', 'hasir-plaj-cantasi', '', 'adet', 'Havlu ve plaj eşyalarını alan geniş hasır çanta.', 199.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Güneş Kremi & Plaj
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('gunes-kremi-plaj', 'Nivea Sun SPF 50+ Güneş Losyonu 200 ml', 'nivea-sun-spf-50-gunes-losyonu-200-ml', 'Nivea', '200 ml', 'Yüksek koruma sağlayan, suya dayanıklı güneş losyonu.', 349.90, null, 'adet', true, 0),
  ('gunes-kremi-plaj', 'Nivea Sun SPF 30 Güneş Losyonu 200 ml', 'nivea-sun-spf-30-gunes-losyonu-200-ml', 'Nivea', '200 ml', 'Günlük kullanım için orta koruma güneş losyonu.', 299.90, null, 'adet', false, 1),
  ('gunes-kremi-plaj', 'Nivea Sun Kids SPF 50+ 200 ml', 'nivea-sun-kids-spf-50-200-ml', 'Nivea', '200 ml', 'Çocuk cildine özel ekstra su dirençli güneş koruması.', 379.90, null, 'adet', false, 2),
  ('gunes-kremi-plaj', 'Nivea Sun Sprey SPF 50 200 ml', 'nivea-sun-sprey-spf-50-200-ml', 'Nivea', '200 ml', 'Kolay uygulanan sprey formunda yüksek güneş koruması.', 369.90, null, 'adet', false, 3),
  ('gunes-kremi-plaj', 'Carroten Bronzlaştırıcı Yağ 200 ml', 'carroten-bronzlastirici-yag-200-ml', 'Carroten', '200 ml', 'Havuç özlü, hızlı bronzluk veren güneş yağı.', 249.90, null, 'adet', false, 4),
  ('gunes-kremi-plaj', 'Güneş Sonrası Aloe Vera Jel 200 ml', 'gunes-sonrasi-aloe-vera-jel-200-ml', '', '200 ml', 'Güneş sonrası cildi yatıştıran ferahlatıcı aloe vera jeli.', 149.90, null, 'adet', false, 5),
  ('gunes-kremi-plaj', 'SPF 30 Dudak Koruyucu Stick', 'spf-30-dudak-koruyucu-stick', '', 'adet', 'Dudakları güneşten koruyan nemlendiricili stick.', 79.90, null, 'adet', false, 6),
  ('gunes-kremi-plaj', 'Plaj Şemsiyesi 180 cm', 'plaj-semsiyesi-180-cm', '', '180 cm', 'Eğilebilir başlıklı, taşıma çantalı geniş plaj şemsiyesi.', 349.90, null, 'adet', true, 7)
on conflict (slug) do nothing;

-- Şişme Bot & Havuz
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sisme-bot-havuz', 'Intex Şişme Deniz Yatağı', 'intex-sisme-deniz-yatagi', 'Intex', '183x69 cm', 'Göl keyfi için dayanıklı, yastıklı şişme deniz yatağı.', 249.90, null, 'adet', true, 0),
  ('sisme-bot-havuz', 'Intex Deniz Simidi 76 cm', 'intex-deniz-simidi-76-cm', 'Intex', '76 cm', 'Canlı renkli, çift hava odacıklı klasik deniz simidi.', 99.90, null, 'adet', false, 1),
  ('sisme-bot-havuz', 'Bestway Bebek Simidi (Oturaklı)', 'bestway-bebek-simidi-oturakli', 'Bestway', '69 cm', 'Bacak geçmeli oturağıyla güvenli bebek deniz simidi.', 149.90, null, 'adet', false, 2),
  ('sisme-bot-havuz', 'Bestway Çocuk Kolluğu (Çift)', 'bestway-cocuk-kollugu-cift', 'Bestway', 'çift', 'Yüzme öğrenen çocuklar için çift hazneli kolluk.', 69.90, null, 'paket', false, 3),
  ('sisme-bot-havuz', 'Intex Şişme Havuz 152 cm', 'intex-sisme-havuz-152-cm', 'Intex', '152x38 cm', 'Bahçede serinlemek için kolay kurulan şişme havuz.', 599.90, null, 'adet', false, 4),
  ('sisme-bot-havuz', 'Bestway Şişme Bot 2 Kişilik', 'bestway-sisme-bot-2-kisilik', 'Bestway', '2 kişilik', 'Kürekleriyle birlikte göl gezintisi için şişme bot.', 1299.90, null, 'adet', true, 5),
  ('sisme-bot-havuz', 'Deniz Topu 51 cm', 'deniz-topu-51-cm', '', '51 cm', 'Plaj oyunlarının vazgeçilmezi renkli şişme top.', 59.90, null, 'adet', false, 6),
  ('sisme-bot-havuz', 'El Pompası', 'el-pompasi', '', 'adet', 'Şişme ürünleri hızla dolduran çift yönlü el pompası.', 149.90, null, 'adet', false, 7),
  ('sisme-bot-havuz', 'Şişme Ürün Tamir Kiti (Yama)', 'sisme-urun-tamir-kiti-yama', '', 'set', 'Delinen bot ve simitler için yapıştırıcılı yama seti.', 39.90, null, 'adet', false, 8)
on conflict (slug) do nothing;

-- Sinek & Böcek Kovucu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sinek-bocek-kovucu', 'Raid Sinek ve Sivrisinek Spreyi 400 ml', 'raid-sinek-ve-sivrisinek-spreyi-400-ml', 'Raid', '400 ml', 'Uçan haşerelere karşı hızlı etkili aerosol sprey.', 149.90, null, 'adet', true, 0),
  ('sinek-bocek-kovucu', 'OFF! Sivrisinek Kovucu Sprey 100 ml', 'off-sivrisinek-kovucu-sprey-100-ml', 'OFF!', '100 ml', 'Cilde uygulanan, saatlerce koruyan sivrisinek kovucu.', 179.90, null, 'adet', false, 1),
  ('sinek-bocek-kovucu', 'Raid Elektrikli Sıvı Makine + Yedek', 'raid-elektrikli-sivi-makine-yedek', 'Raid', '45 gece', 'Prize takılan, 45 gece koruyan sıvı sivrisinek makinesi.', 189.90, null, 'adet', false, 2),
  ('sinek-bocek-kovucu', 'Vape Mat Elektrikli Makine + 30 Tablet', 'vape-mat-elektrikli-makine-30-tablet', 'Vape', '30 tablet', 'Tabletli sistemle gece boyu sivrisinek koruması.', 129.90, null, 'adet', false, 3),
  ('sinek-bocek-kovucu', 'Elektrikli Sinek Raketi', 'elektrikli-sinek-raketi', '', 'adet', 'Şarjlı, tek hamlede etkili elektrikli sinek raketi.', 199.90, null, 'adet', true, 4),
  ('sinek-bocek-kovucu', 'Sivrisinek Kovucu Bileklik', 'sivrisinek-kovucu-bileklik', '', 'adet', 'Çocuklara uygun, sitronella özlü kovucu bileklik.', 49.90, null, 'adet', false, 5),
  ('sinek-bocek-kovucu', 'Yapışkanlı Sinek Tuzağı 4''lü', 'yapiskanli-sinek-tuzagi-4lu', '', '4''lü', 'Asılarak kullanılan zehirsiz yapışkan sinek tuzağı.', 39.90, null, 'paket', false, 6),
  ('sinek-bocek-kovucu', 'Karınca Yemi Kutusu 2''li', 'karinca-yemi-kutusu-2li', '', '2''li', 'Yuvaya taşınan jel yemle karınca sorununu bitiren kutu.', 69.90, null, 'paket', false, 7)
on conflict (slug) do nothing;
