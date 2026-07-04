-- ============================================================
-- Yeni Mahalle Market: katalog 1000+ urun genisletme
-- Ajan F (Spec v17). Mevcut 516 urun UZERINE EK 503 gercek
-- Turk market urunu => genel toplam 1019.
-- 29 siparis edilebilir kategoriye dengeli dagitildi.
-- Sigara & Tutun HARIC (4207/4733: online tutun satisi yasak).
--
-- Kolon sirasi mevcut seed ile BIREBIR AYNI:
--   (category_slug, name, slug, brand, size_text, description,
--    price, compare_at_price, unit, is_featured, sort)
-- image_url bilincli NULL (UI kategori renkli placeholder basar).
-- is_best_seller insert listesine EKLENMEDI (kolon uyumu icin);
-- best-seller secimi orkestrator tarafindan ayrica yapilir.
-- Yeni sort degerleri 40+dan baslar (mevcut 0-27 ile cakismaz).
-- Slug'lar mevcut 516 urun ile CAKISMAZ (farkli marka/gramaj/varyant).
-- Idempotent: on conflict (slug) do nothing.
--
-- KURULUM: 20260703700000_products_500.sql sonrasinda calistirin.
-- ============================================================

-- Meyve & Sebze
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('meyve-sebze', 'Yesil Elma', 'yesil-elma-kg', '', '1 kg', 'Eksimsi ve gevrek, salata ve tatliya uygun yesil Granny elma.', 44.90, null, 'kg', true, 40),
  ('meyve-sebze', 'Yerli Muz', 'yerli-muz-kg', '', '1 kg', 'Olgun, tatli ve enerji dolu Anamur yerli muzu.', 49.90, null, 'kg', false, 41),
  ('meyve-sebze', 'Misket Limon', 'misket-limon-kg', '', '1 kg', 'Bol sulu, kabugu ince, salata ve yemeklik mayer limon.', 44.90, null, 'kg', false, 42),
  ('meyve-sebze', 'Kirmizi Sogan', 'kirmizi-sogan-kg', '', '1 kg', 'Salata ve kebaplik, tatli ve sulu kirmizi sogan.', 29.90, null, 'kg', false, 43),
  ('meyve-sebze', 'Patates File', 'patates-file-2-5-kg', '', '2,5 kg', 'Kizartma ve haslamalik, un orani dengeli taze patates.', 59.90, null, 'kg', false, 44),
  ('meyve-sebze', 'Kuru Sogan', 'kuru-sogan-file-kg', '', '1 kg', 'Yemeklerin vazgecilmezi, uzun omurlu file kuru sogan.', 22.90, null, 'kg', false, 45),
  ('meyve-sebze', 'Kornison Salatalik', 'kornison-salatalik-kg', '', '1 kg', 'Citir citir, cekirdegi az, salata ve mezelik silor salatalik.', 39.90, null, 'kg', false, 46),
  ('meyve-sebze', 'Aci Sivri Biber', 'aci-sivri-biber-kg', '', '1 kg', 'Aci-tatli arasi, kizartmalik ince kabuklu sivri biber.', 54.90, null, 'kg', false, 47),
  ('meyve-sebze', 'Ispanak', 'ispanak-kg', '', '1 kg', 'Demir deposu, borani ve kavurmalik taze ispanak.', 34.90, null, 'kg', false, 48),
  ('meyve-sebze', 'Pirasa', 'pirasa-kg', '', '1 kg', 'Zeytinyagli ve etli yemeklik, taze bagli pirasa.', 27.90, null, 'kg', false, 49),
  ('meyve-sebze', 'Karnabahar', 'karnabahar-adet', '', 'adet', 'Firin ve haslamalik, sik topakli beyaz karnabahar.', 49.90, null, 'adet', false, 50),
  ('meyve-sebze', 'Brokoli', 'brokoli-adet', '', 'adet', 'Buharda ve sotelik, C vitamini deposu taze brokoli.', 44.90, null, 'adet', true, 51),
  ('meyve-sebze', 'Cilek Paket', 'cilek-500-g-paket', '', '500 g', 'Kokulu ve tatli, receli ve yemelik mevsim cilegi.', 49.90, 69.90, 'paket', true, 52),
  ('meyve-sebze', 'Kivi', 'kivi-kg', '', '1 kg', 'C vitamini yuklu, mayhos ve taneli ithal kivi.', 69.90, null, 'kg', false, 53),
  ('meyve-sebze', 'Nar', 'nar-kg', '', '1 kg', 'Tanesi iri, eksi-tatli, nar eksisi ve yemelik nar.', 49.90, null, 'kg', false, 54),
  ('meyve-sebze', 'Yesillik Demeti', 'maydanoz-demet-adet', '', 'demet', 'Salata ve corbalik, taze kesim maydanoz demeti.', 9.90, null, 'adet', false, 55),
  ('meyve-sebze', 'Mantar Kultur', 'kultur-mantari-250-g', '', '250 g', 'Sote ve pizzalik, temizlenmis kapali sapka kultur mantari.', 39.90, null, 'paket', false, 56),
  ('meyve-sebze', 'Avokado', 'avokado-adet', '', 'adet', 'Kremamsi ve olgun, kahvaltilik ve salatalik hass avokado.', 29.90, null, 'adet', false, 57)
on conflict (slug) do nothing;

-- Sarkuteri & Et
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarkuteri-et', 'Namet Hindi Fume 80 g', 'namet-hindi-fume-80-g', 'Namet', '80 g', 'Dusuk yagli, sandvic ve salatalik dilimli hindi fume.', 79.90, null, 'adet', false, 40),
  ('sarkuteri-et', 'Pinar Sosis Kokteyl 300 g', 'pinar-kokteyl-sosis-300-g', 'Pinar', '300 g', 'Kahvaltilik ve mangallik, ince kokteyl dana sosis.', 89.90, null, 'adet', true, 41),
  ('sarkuteri-et', 'Maret Dana Salam 200 g', 'maret-dana-salam-200-g', 'Maret', '200 g', 'Tost ve sandvice yakisan dilimli dana salam.', 94.90, null, 'adet', false, 42),
  ('sarkuteri-et', 'Aytac Macar Sucuk 250 g', 'aytac-macar-sucuk-250-g', 'Aytac', '250 g', 'Kahvaltilik, baharatli fermente Macar sucuk.', 149.90, null, 'adet', false, 43),
  ('sarkuteri-et', 'Dana Kiyma 1 kg', 'dana-kiyma-1-kg', '', '1 kg', 'Kofte ve makarnalik, gunluk cekim taze dana kiyma.', 479.90, null, 'paket', true, 44),
  ('sarkuteri-et', 'Kuzu Pirzola 1 kg', 'kuzu-pirzola-1-kg', '', '1 kg', 'Mangal ve tavalik, taze kesim kuzu pirzola.', 649.90, null, 'kg', false, 45),
  ('sarkuteri-et', 'Senpilic But 1 kg', 'senpilic-pilic-but-1-kg', 'Senpilic', '1 kg', 'Firin ve haslamalik, sulu ve lezzetli pilic but.', 109.90, null, 'adet', false, 46),
  ('sarkuteri-et', 'Banvit Pilic Baget 1 kg', 'banvit-pilic-baget-1-kg', 'Banvit', '1 kg', 'Firin ve kizartmalik, cocuklarin sevdigi pilic baget.', 99.90, null, 'adet', false, 47),
  ('sarkuteri-et', 'Apikoglu Pastirma 100 g', 'apikoglu-pastirma-100-g', 'Apikoglu', '100 g', 'Cemenli, ince dilimli geleneksel Kayseri pastirmasi.', 189.90, 229.90, 'adet', true, 48),
  ('sarkuteri-et', 'Polonez Salam Dana 150 g', 'polonez-dana-salam-150-g', 'Polonez', '150 g', 'Ince dilimli, kahvaltilik butik dana salam.', 119.90, null, 'adet', false, 49),
  ('sarkuteri-et', 'Namet Sosis Dana 340 g', 'namet-dana-sosis-340-g', 'Namet', '340 g', 'Sandvic ve kahvaltilik klasik dana sosis.', 94.90, null, 'adet', false, 50),
  ('sarkuteri-et', 'Maret Sucuklu Hamburger 4 lu', 'maret-hamburger-kofte-4lu', 'Maret', '4x110 g', 'Tavada pratik pisen, baharatli hamburger koftesi.', 134.90, null, 'paket', false, 51),
  ('sarkuteri-et', 'Pinar Kavurma 200 g', 'pinar-kavurma-200-g', 'Pinar', '200 g', 'Kahvaltilik ve yumurtalik, hazir dana kavurma.', 159.90, null, 'adet', false, 52),
  ('sarkuteri-et', 'Tavuk Kanat Baget 1 kg', 'tavuk-kanat-baget-marine-1-kg', '', '1 kg', 'Mangal icin baharatli marine tavuk kanat baget.', 129.90, null, 'kg', false, 53),
  ('sarkuteri-et', 'Dana Antrikot 1 kg', 'dana-antrikot-1-kg', '', '1 kg', 'Izgaralik, yagli ve lezzetli olgunlastirilmis dana antrikot.', 749.90, null, 'kg', true, 54),
  ('sarkuteri-et', 'Kuzu Kusbasi 500 g', 'kuzu-kusbasi-500-g', '', '500 g', 'Guvec ve sote icin taze kuzu kusbasi.', 379.90, null, 'paket', false, 55),
  ('sarkuteri-et', 'Hindi Baget 1 kg', 'hindi-baget-1-kg', '', '1 kg', 'Firin ve haslamalik, yagsiz hindi baget.', 139.90, null, 'kg', false, 56)
on conflict (slug) do nothing;

-- Ekmek & Firin
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('ekmek-firin', 'Cavdarli Ekmek 350 g', 'cavdarli-ekmek-350-g', '', '350 g', 'Lifli ve doyurucu, ekşi mayali cavdarli somun.', 26.90, null, 'adet', true, 40),
  ('ekmek-firin', 'Balon Lavas 3 lu', 'balon-lavas-3lu', '', '3lu', 'Durum ve durumluk, yumusak balon lavas ekmegi.', 29.90, null, 'paket', false, 41),
  ('ekmek-firin', 'Tam Bugday Tost Ekmegi 500 g', 'tam-bugday-tost-ekmegi-500-g', '', '500 g', 'Lifli ve dilimli, tost ve sandvice tam bugday ekmegi.', 36.90, null, 'adet', false, 42),
  ('ekmek-firin', 'Simit', 'simit-susamli-adet', '', 'adet', 'Bol susamli, citir kabuklu geleneksel firin simidi.', 12.50, null, 'adet', true, 43),
  ('ekmek-firin', 'Zeytinli Poace', 'zeytinli-pogaca-adet', '', 'adet', 'Ici bol zeytinli, agizda dagilan yumusak pogaca.', 18.50, null, 'adet', false, 44),
  ('ekmek-firin', 'Koy Bazlamasi 3 lu', 'koy-bazlamasi-3lu', '', '3lu', 'Sac uzeri pisen, yumusacik koy bazlamasi.', 34.90, null, 'paket', false, 45),
  ('ekmek-firin', 'Gozleme Patatesli', 'gozleme-patatesli-adet', '', 'adet', 'El acmasi hamur, patates dolgulu taze gozleme.', 34.90, null, 'adet', false, 46),
  ('ekmek-firin', 'Kremali Milfoy 4 lu', 'kremali-milfoy-4lu', '', '4lu', 'Ince katmerli, kremali citir milfoy dilimi.', 49.90, null, 'paket', false, 47),
  ('ekmek-firin', 'Yumurtali Ekmek 300 g', 'yumurtali-corek-ekmek-300-g', '', '300 g', 'Yumusak icli, kahvaltilik yumurtali corek ekmek.', 32.90, null, 'adet', false, 48),
  ('ekmek-firin', 'Kepekli Ekmek 400 g', 'kepekli-ekmek-400-g', '', '400 g', 'Kepek katkili, tok tutan gunluk kepekli somun.', 24.90, null, 'adet', false, 49),
  ('ekmek-firin', 'Tortilla Wrap 6 li', 'tortilla-wrap-6li', '', '6li', 'Durum ve wraplik, yumusak un tortillasi.', 44.90, null, 'paket', false, 50),
  ('ekmek-firin', 'Findikli Kurabiye 250 g', 'findikli-kurabiye-250-g', '', '250 g', 'Cay yanina, agizda dagilan findikli un kurabiyesi.', 54.90, 69.90, 'paket', true, 51),
  ('ekmek-firin', 'Ay Corek 4 lu', 'ay-corek-4lu', '', '4lu', 'Tarcin ve cevizli, tatli firin ay coregi.', 44.90, null, 'paket', false, 52),
  ('ekmek-firin', 'Taze Baget 250 g', 'taze-baget-250-g', '', '250 g', 'Ince uzun, citir kabuklu Fransiz usulu baget.', 18.90, null, 'adet', false, 53),
  ('ekmek-firin', 'Grissini Cubuk 125 g', 'grissini-cubuk-125-g', '', '125 g', 'Ince ve citir, atistirmalik susamli grissini cubugu.', 34.90, null, 'paket', false, 54),
  ('ekmek-firin', 'Ramazan Pidesi', 'ramazan-pidesi-adet', '', 'adet', 'Susamli ve carpma, sicacik firin Ramazan pidesi.', 29.90, null, 'adet', false, 55),
  ('ekmek-firin', 'Kruvasan Sade 4 lu', 'kruvasan-sade-4lu', '', '4lu', 'Tereyagli katmer, kahvaltilik sade kruvasan.', 54.90, null, 'paket', false, 56)
on conflict (slug) do nothing;

-- Sut & Kahvaltilik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sut-kahvaltilik', 'Icim Tam Yagli Sut 1 L', 'icim-tam-yagli-sut-1-l', 'Icim', '1 L', 'Kahvaltilik ve tatlilik, gunluk tam yagli UHT sut.', 48.90, null, 'adet', true, 40),
  ('sut-kahvaltilik', 'Pinar Kaymak 150 g', 'pinar-kaymak-150-g', 'Pinar', '150 g', 'Bal ve ekmek yanina, kremamsi kahvaltilik kaymak.', 89.90, null, 'adet', false, 41),
  ('sut-kahvaltilik', 'Sutas Suzme Peynir 500 g', 'sutas-suzme-peynir-500-g', 'Sutas', '500 g', 'Kahvaltilik ve boreklik, hafif tuzlu suzme peynir.', 124.90, null, 'adet', false, 42),
  ('sut-kahvaltilik', 'Tahsildaroglu Ezine Beyaz Peynir 600 g', 'tahsildaroglu-ezine-peynir-600-g', 'Tahsildaroglu', '600 g', 'Tam yagli, olgun ve tuzlu geleneksel Ezine peyniri.', 219.90, 259.90, 'adet', true, 43),
  ('sut-kahvaltilik', 'Icim Labne 200 g', 'icim-labne-200-g', 'Icim', '200 g', 'Surulebilir, kremamsi kahvaltilik labne peyniri.', 54.90, null, 'adet', false, 44),
  ('sut-kahvaltilik', 'Danone Kids Icilebilir Yogurt 4x100 g', 'danone-kids-yogurt-4x100-g', 'Danone', '4x100 g', 'Cocuklar icin meyveli, icilebilir kase yogurt.', 59.90, null, 'paket', false, 45),
  ('sut-kahvaltilik', 'Pinar Beyaz Peynir Klasik 500 g', 'pinar-beyaz-peynir-klasik-500-g', 'Pinar', '500 g', 'Kahvaltilik, dengeli tuzlu tam yagli beyaz peynir.', 159.90, null, 'adet', false, 46),
  ('sut-kahvaltilik', 'Sek Ayran 1 L', 'sek-ayran-1-l', 'Sek', '1 L', 'Yayik kivaminda, serinletici gunluk ayran.', 34.90, null, 'adet', false, 47),
  ('sut-kahvaltilik', 'Yorukoglu Kasar 400 g', 'yorukoglu-kasar-400-g', 'Yorukoglu', '400 g', 'Tost ve makarnalik, kolay eriyen taze kasar.', 179.90, null, 'adet', false, 48),
  ('sut-kahvaltilik', 'Balparmak Suzme Bal 850 g', 'balparmak-suzme-bal-850-g', 'Balparmak', '850 g', 'Suzme, kivamli ve aromatik kahvaltilik cicek bali.', 369.90, null, 'adet', true, 49),
  ('sut-kahvaltilik', 'Sarelle Findik Ezmesi 350 g', 'sarelle-findik-ezmesi-350-g', 'Sarelle', '350 g', 'Kakaolu ve findikli, ekmege surulebilir kahvaltilik krema.', 89.90, null, 'adet', false, 50),
  ('sut-kahvaltilik', 'Pinar Tereyag 250 g', 'pinar-tereyag-250-g', 'Pinar', '250 g', 'Tuzsuz, kahvaltilik ve yemeklik gercek tereyag.', 129.90, null, 'adet', false, 51),
  ('sut-kahvaltilik', 'Muratbey Cecil Peynir 200 g', 'muratbey-cecil-peynir-200-g', 'Muratbey', '200 g', 'Lif lif acilan, tuzu dengeli tel cecil peyniri.', 89.90, null, 'adet', false, 52),
  ('sut-kahvaltilik', 'Nutella Kahvaltilik Krema 400 g', 'nutella-krema-400-g', 'Nutella', '400 g', 'Findikli ve kakaolu, cocuklarin sevdigi kahvaltilik krema.', 134.90, null, 'adet', false, 53),
  ('sut-kahvaltilik', 'Coalar Recel Visne 380 g', 'ciloglu-visne-recel-380-g', 'Ciloglu', '380 g', 'Tane visneli, yogun meyveli kahvaltilik recel.', 64.90, null, 'adet', false, 54),
  ('sut-kahvaltilik', 'Sutas Kaymakli Yogurt 900 g', 'sutas-kaymakli-yogurt-900-g', 'Sutas', '900 g', 'Uzeri kaymakli, tas kase kivaminda tam yagli yogurt.', 79.90, null, 'adet', false, 55),
  ('sut-kahvaltilik', 'Torku Bal Petek 500 g', 'torku-petek-bal-500-g', 'Torku', '500 g', 'Dogal petekli, saf ve aromatik kahvaltilik bal.', 329.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Icecek & Su
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('icecek-su', 'Coca-Cola 2,5 L', 'coca-cola-2-5-l', 'Coca-Cola', '2,5 L', 'Buz gibi icilen, klasik kola aromali gazli icecek.', 54.90, null, 'adet', true, 40),
  ('icecek-su', 'Fanta Portakal 330 ml', 'fanta-portakal-330-ml', 'Fanta', '330 ml', 'Portakal aromali, gazli ve serinletici mesrubat.', 22.90, null, 'adet', false, 41),
  ('icecek-su', 'Sprite 330 ml', 'sprite-330-ml', 'Sprite', '330 ml', 'Limon aromali, ferahlatici gazli icecek.', 22.90, null, 'adet', false, 42),
  ('icecek-su', 'Lipton Ice Tea Seftali 330 ml', 'lipton-ice-tea-seftali-330-ml', 'Lipton', '330 ml', 'Seftali aromali, buz gibi icilen soguk cay.', 22.90, null, 'adet', false, 43),
  ('icecek-su', 'Cappy Visne Nektari 200 ml', 'cappy-visne-nektari-200-ml', 'Cappy', '200 ml', 'Yogun visneli, katkisiz meyve nektari.', 18.90, null, 'adet', false, 44),
  ('icecek-su', 'Erikli Damacana 19 L', 'erikli-damacana-19-l', 'Erikli', '19 L', 'Dogal kaynak suyu, evde pratik kullanimlik 5 litre.', 89.90, null, 'adet', true, 45),
  ('icecek-su', 'Hayat Su 0,5 L 12 li', 'hayat-su-05-l-12li', 'Hayat', '12x0,5 L', 'Yanda tasimalik, pratik pet sise 12 li dogal su.', 59.90, null, 'koli', false, 46),
  ('icecek-su', 'Redbull Enerji Icecegi 250 ml', 'redbull-enerji-250-ml', 'Red Bull', '250 ml', 'Kafein ve taurinli, enerji veren gazli icecek.', 49.90, null, 'adet', false, 47),
  ('icecek-su', 'Uludag Gazoz 250 ml', 'uludag-gazoz-250-ml', 'Uludag', '250 ml', 'Geleneksel limonlu, hafif gazli klasik gazoz.', 18.90, null, 'adet', false, 48),
  ('icecek-su', 'Dogadan Ihlamur Bardak 1 L', 'dogus-soguk-cay-limon-1-l', 'Dogus', '1 L', 'Limon aromali, sekeri azaltilmis soguk cay.', 32.90, null, 'adet', false, 49),
  ('icecek-su', 'Cappy Pulpy Portakal 1 L', 'cappy-pulpy-portakal-1-l', 'Cappy', '1 L', 'Portakal parcacikli, tane tane meyve suyu.', 44.90, null, 'adet', false, 50),
  ('icecek-su', 'Sirma Maden Suyu Sade 6 li', 'sirma-maden-suyu-sade-6li', 'Sirma', '6x200 ml', 'Dogal mineralli, sade cam sise maden suyu.', 54.90, null, 'paket', false, 51),
  ('icecek-su', 'Pepsi 2,5 L', 'pepsi-2-5-l', 'Pepsi', '2,5 L', 'Yogun kola aromali, gazli serinletici mesrubat.', 54.90, 64.90, 'adet', true, 52),
  ('icecek-su', 'Beypazari Maden Suyu Limon 6 li', 'beypazari-maden-suyu-limon-6li', 'Beypazari', '6x200 ml', 'Limon aromali, ferah dogal mineralli maden suyu.', 49.90, null, 'paket', false, 53),
  ('icecek-su', 'Fuse Tea Yesil Cay 1 L', 'fuse-tea-yesil-1-l', 'Fuse Tea', '1 L', 'Yesil cay ve limon aromali soguk cay.', 34.90, null, 'adet', false, 54),
  ('icecek-su', 'Tamek Vishne Suyu 200 ml 6 li', 'tamek-visne-suyu-200ml-6li', 'Tamek', '6x200 ml', 'Cocuk beslenmesine uygun, pipetli visne suyu.', 49.90, null, 'paket', false, 55),
  ('icecek-su', 'Pinar Su 0,33 L 6 li', 'pinar-su-033-l-6li', 'Pinar', '6x0,33 L', 'Cantada tasinabilir, kucuk boy dogal kaynak suyu.', 34.90, null, 'paket', false, 56),
  ('icecek-su', 'Schweppes Tonik 1 L', 'schweppes-tonik-1-l', 'Schweppes', '1 L', 'Kinin aromali, kokteyllik gazli tonik.', 39.90, null, 'adet', false, 57),
  ('icecek-su', 'Burcak Malt Icecek 500 ml', 'burcak-malt-icecegi-500-ml', 'Burcak', '500 ml', 'Alkolsuz, arpali malt aromali serinletici icecek.', 24.90, null, 'adet', false, 58),
  ('icecek-su', 'Cristaline Soda Sade 200 ml 6 li', 'kizilay-soda-sade-6li', 'Kizilay', '6x200 ml', 'Sade soda, sindirime iyi gelen dogal maden sodasi.', 44.90, null, 'paket', false, 59)
on conflict (slug) do nothing;

-- Bakliyat & Makarna
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bakliyat-makarna', 'Yayla Yesil Mercimek 1 kg', 'yayla-yesil-mercimek-1-kg', 'Yayla', '1 kg', 'Salata ve yemeklik, tane tane yesil mercimek.', 74.90, null, 'adet', true, 40),
  ('bakliyat-makarna', 'Reis Barbunya 2,5 kg', 'reis-barbunya-2-5-kg', 'Reis', '2,5 kg', 'Zeytinyagli ve etli yemeklik, kaliteli kuru barbunya.', 209.90, null, 'adet', false, 41),
  ('bakliyat-makarna', 'Filiz Burgu Makarna 500 g', 'filiz-burgu-makarna-500-g', 'Filiz', '500 g', 'Sosla iyi tutan, irmikli burgu makarna.', 22.90, null, 'adet', false, 42),
  ('bakliyat-makarna', 'Barilla Spagetti 500 g', 'barilla-spagetti-500-g', 'Barilla', '500 g', 'Al dente pisen, durum bugdayindan spagetti.', 44.90, null, 'adet', true, 43),
  ('bakliyat-makarna', 'Nuh Un Pirinc Baldo 1 kg', 'nuhun-un-baldo-pirinc-1-kg', 'Nuhun Ankara', '1 kg', 'Pilavlik, tane tane iri baldo pirinc.', 89.90, null, 'adet', false, 44),
  ('bakliyat-makarna', 'Yayla Nohut 1 kg', 'yayla-nohut-1-kg', 'Yayla', '1 kg', 'Iri taneli, haslamasi kolay nohut.', 79.90, null, 'adet', false, 45),
  ('bakliyat-makarna', 'Piyale Sehriye Tel 500 g', 'piyale-tel-sehriye-500-g', 'Piyale', '500 g', 'Pilav ve corbalik, ince tel sehriye.', 22.90, null, 'adet', false, 46),
  ('bakliyat-makarna', 'Reis Kirmizi Mercimek 2,5 kg', 'reis-kirmizi-mercimek-2-5-kg', 'Reis', '2,5 kg', 'Corba ve koftelik, kabuksuz kirmizi mercimek.', 164.90, null, 'adet', false, 47),
  ('bakliyat-makarna', 'Filiz Kelebek Makarna 500 g', 'filiz-kelebek-makarna-500-g', 'Filiz', '500 g', 'Salata ve firinlik, sevimli kelebek makarna.', 22.90, null, 'adet', false, 48),
  ('bakliyat-makarna', 'Duru Pilavlik Bulgur 2,5 kg', 'duru-pilavlik-bulgur-2-5-kg', 'Duru', '2,5 kg', 'Pilav ve dolmalik, iri taneli pilavlik bulgur.', 129.90, null, 'adet', false, 49),
  ('bakliyat-makarna', 'Duru Kofte Bulguru 1 kg', 'duru-kofte-bulguru-1-kg', 'Duru', '1 kg', 'Cig kofte ve salatalik, ince kofte bulguru.', 54.90, null, 'adet', false, 50),
  ('bakliyat-makarna', 'Yayla Kuru Fasulye Dermason 1 kg', 'yayla-dermason-fasulye-1-kg', 'Yayla', '1 kg', 'Etli ve zeytinyagli yemeklik, iri dermason fasulye.', 109.90, null, 'adet', false, 51),
  ('bakliyat-makarna', 'Osmanci Baldo Pirinc 2,5 kg', 'osmanci-baldo-pirinc-2-5-kg', 'Osmanci', '2,5 kg', 'Aile boyu, pilavlik iri baldo pirinc.', 199.90, 239.90, 'adet', true, 52),
  ('bakliyat-makarna', 'Barilla Penne 500 g', 'barilla-penne-500-g', 'Barilla', '500 g', 'Firin ve sosluk, ic ic kalem penne makarna.', 44.90, null, 'adet', false, 53),
  ('bakliyat-makarna', 'Piyale Manti 500 g', 'piyale-hazir-manti-500-g', 'Piyale', '500 g', 'Yogurtlu ve sarimsakli, hazir kuru manti.', 44.90, null, 'adet', false, 54),
  ('bakliyat-makarna', 'Yayla Kuru Bezelye 1 kg', 'yayla-kuru-bezelye-1-kg', 'Yayla', '1 kg', 'Yemeklik, protein deposu kuru yesil bezelye.', 89.90, null, 'adet', false, 55),
  ('bakliyat-makarna', 'Selva Eriste 500 g', 'selva-eriste-500-g', 'Selva', '500 g', 'El acmasi tadinda, yumurtali kuru erste.', 49.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Konserve & Hazir Yemek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('konserve-hazir-yemek', 'Tamek Barbunya Konserve 800 g', 'tamek-barbunya-konserve-800-g', 'Tamek', '800 g', 'Zeytinyagli, hazir servislik pismis barbunya.', 49.90, null, 'adet', true, 40),
  ('konserve-hazir-yemek', 'Tat Kuru Fasulye Konserve 800 g', 'tat-kuru-fasulye-konserve-800-g', 'Tat', '800 g', 'Domates sosunda pismis, pratik hazir kuru fasulye.', 54.90, null, 'adet', false, 41),
  ('konserve-hazir-yemek', 'Bonduelle Misir Tane 300 g', 'bonduelle-misir-tane-300-g', 'Bonduelle', '300 g', 'Salata ve pizzalik, tatli tane misir konservesi.', 44.90, null, 'adet', false, 42),
  ('konserve-hazir-yemek', 'Yayla Corba Mercimek 65 g', 'yayla-hazir-mercimek-corba-65-g', 'Yayla', '65 g', 'Sicak suyla hazir, klasik ezogelin mercimek corbasi.', 18.90, null, 'adet', false, 43),
  ('konserve-hazir-yemek', 'Tat Bezelye Konserve 800 g', 'tat-bezelye-konserve-800-g', 'Tat', '800 g', 'Etli ve zeytinyagli yemeklik hazir bezelye.', 49.90, null, 'adet', false, 44),
  ('konserve-hazir-yemek', 'Knorr Tavuk Corba 65 g', 'knorr-tavuk-corba-65-g', 'Knorr', '65 g', 'Sicak suyla dakikada hazir, kremali tavuk corbasi.', 18.90, null, 'adet', false, 45),
  ('konserve-hazir-yemek', 'Superfresh Ic Bezelye 450 g', 'superfresh-ic-bezelye-450-g', 'Superfresh', '450 g', 'Yemek ve garniturluk, dondurulmus ic bezelye.', 54.90, null, 'adet', false, 46),
  ('konserve-hazir-yemek', 'Tamek Dolma Biber Konserve 400 g', 'tamek-dolma-biber-konserve-400-g', 'Tamek', '400 g', 'Zeytinyagli, hazir servislik biber dolmasi.', 89.90, null, 'adet', true, 47),
  ('konserve-hazir-yemek', 'Reis Haslanmis Nohut 800 g', 'reis-haslanmis-nohut-konserve-800-g', 'Reis', '800 g', 'Salata ve humus icin haslanmis hazir nohut.', 49.90, null, 'adet', false, 48),
  ('konserve-hazir-yemek', 'Tat Ton Baligi 3x80 g', 'tat-ton-baligi-3x80-g', 'Tat', '3x80 g', 'Salata ve makarnalik, bitkisel yagda ton baligi.', 129.90, 159.90, 'paket', true, 49),
  ('konserve-hazir-yemek', 'Dardanel Ton Klasik 160 g', 'dardanel-ton-klasik-160-g', 'Dardanel', '160 g', 'Sandvic ve salatalik, yagda ton baligi.', 79.90, null, 'adet', false, 50),
  ('konserve-hazir-yemek', 'Knorr Domates Corba 68 g', 'knorr-domates-corba-68-g', 'Knorr', '68 g', 'Kremali ve kokulu, dakikada hazir domates corbasi.', 18.90, null, 'adet', false, 51),
  ('konserve-hazir-yemek', 'Tat Kapya Biber Kizarmis 720 g', 'tat-kizarmis-kapya-biber-720-g', 'Tat', '720 g', 'Mezelik ve garniturluk, kizarmis kapya biber.', 69.90, null, 'adet', false, 52),
  ('konserve-hazir-yemek', 'Superfresh Patates Kizartmasi 1 kg', 'superfresh-patates-kizartma-1-kg', 'Superfresh', '1 kg', 'Firinda citir, dondurulmus parmak patates.', 74.90, null, 'adet', false, 53),
  ('konserve-hazir-yemek', 'Penguen Zeytinyagli Yaprak Sarma 400 g', 'penguen-yaprak-sarma-400-g', 'Penguen', '400 g', 'Limonlu ve zeytinyagli, hazir yaprak sarma.', 79.90, null, 'adet', false, 54),
  ('konserve-hazir-yemek', 'Tamek Kajun Domates 830 g', 'tamek-dogranmis-domates-830-g', 'Tamek', '830 g', 'Yemek ve sosluk, dograman soyulmus domates konservesi.', 44.90, null, 'adet', false, 55),
  ('konserve-hazir-yemek', 'Yayla Ezogelin Corba 74 g', 'yayla-ezogelin-corba-74-g', 'Yayla', '74 g', 'Baharatli ve doyurucu, hazir ezogelin corbasi.', 18.90, null, 'adet', false, 56),
  ('konserve-hazir-yemek', 'Filiz Hazir Makarna Peynirli 90 g', 'filiz-hazir-peynirli-makarna-90-g', 'Filiz', '90 g', 'Sicak suyla hazir, kremali peynirli bardak makarna.', 24.90, null, 'adet', false, 57)
on conflict (slug) do nothing;

-- Yag, Sos & Baharat
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('yag-sos-baharat', 'Komili Riviera Zeytinyagi 2 L', 'komili-riviera-zeytinyagi-2-l', 'Komili', '2 L', 'Yemek ve kizartmalik, dengeli asitli riviera zeytinyagi.', 629.90, 749.90, 'adet', true, 40),
  ('yag-sos-baharat', 'Yudum Aycicek Yagi 2 L', 'yudum-aycicek-yagi-2-l', 'Yudum', '2 L', 'Kizartma ve yemeklik, hafif aycicek yagi.', 149.90, null, 'adet', false, 41),
  ('yag-sos-baharat', 'Calve Ketcap 700 g', 'calve-ketcap-700-g', 'Calve', '700 g', 'Tatli ve yogun, patates ve makarnalik ketcap.', 59.90, null, 'adet', false, 42),
  ('yag-sos-baharat', 'Calve Mayonez 600 g', 'calve-mayonez-600-g', 'Calve', '600 g', 'Kremamsi ve dolgun, salata ve sandvic mayonezi.', 64.90, null, 'adet', false, 43),
  ('yag-sos-baharat', 'Tat Salca Domates 700 g', 'tat-domates-salca-700-g', 'Tat', '700 g', 'Yogun ve dogal, yemeklik cift kaynatilmis domates salcasi.', 79.90, null, 'adet', false, 44),
  ('yag-sos-baharat', 'Tat Biber Salcasi Aci 700 g', 'tat-biber-salca-aci-700-g', 'Tat', '700 g', 'Aci ve aromali, yemeklik kirmizi biber salcasi.', 84.90, null, 'adet', false, 45),
  ('yag-sos-baharat', 'Kuhne Elma Sirkesi 500 ml', 'kuhne-elma-sirkesi-500-ml', 'Kuhne', '500 ml', 'Salata ve turşuluk, dogal fermente elma sirkesi.', 44.90, null, 'adet', false, 46),
  ('yag-sos-baharat', 'Bizim Misir Yagi 1,8 L', 'bizim-misir-yagi-1-8-l', 'Bizim', '1,8 L', 'Kizartma ve yemeklik, hafif misirozu yagi.', 159.90, null, 'adet', false, 47),
  ('yag-sos-baharat', 'Bagdat Baharat Kimyon 65 g', 'bagdat-kimyon-65-g', 'Bagdat', '65 g', 'Kofte ve corbalik, kokulu ogutulmus kimyon.', 34.90, null, 'adet', false, 48),
  ('yag-sos-baharat', 'Bagdat Pul Biber 500 g', 'bagdat-pul-biber-500-g', 'Bagdat', '500 g', 'Yemeklere renk ve aci katan, kirmizi pul biber.', 149.90, null, 'adet', false, 49),
  ('yag-sos-baharat', 'Knorr Aroma 130 g', 'knorr-aroma-130-g', 'Knorr', '130 g', 'Corba ve yemeklere lezzet veren cesni sivi baharat.', 49.90, null, 'adet', false, 50),
  ('yag-sos-baharat', 'Marmarabirlik Tahini 300 g', 'marmarabirlik-tahin-300-g', 'Marmarabirlik', '300 g', 'Tatlilik ve kahvaltilik, susamdan gercek tahin.', 94.90, null, 'adet', true, 51),
  ('yag-sos-baharat', 'Cukurova Naturel Zeytinyagi 500 ml', 'cukurova-naturel-zeytinyagi-500-ml', 'Cukurova', '500 ml', 'Salata ve mezelik, soguk sikim naturel sizma zeytinyagi.', 219.90, null, 'adet', false, 52),
  ('yag-sos-baharat', 'Heinz Barbeku Sos 480 g', 'heinz-barbeku-sos-480-g', 'Heinz', '480 g', 'Mangal ve tavuklik, tatli-ekşi barbekü sos.', 79.90, null, 'adet', false, 53),
  ('yag-sos-baharat', 'Bagdat Karabiber Ogutulmus 65 g', 'bagdat-karabiber-65-g', 'Bagdat', '65 g', 'Corba ve yemeklik, taze ogutulmus karabiber.', 39.90, null, 'adet', false, 54),
  ('yag-sos-baharat', 'Ustagida Nar Eksisi 350 ml', 'ustagida-nar-eksisi-350-ml', 'Usta', '350 ml', 'Salata ve mezelik, yogun kivamli nar eksisi sosu.', 49.90, null, 'adet', false, 55),
  ('yag-sos-baharat', 'Sera Toz Biber Tatli 500 g', 'sera-tatli-toz-biber-500-g', 'Sera', '500 g', 'Yemeklere renk katan, tatli ogutulmus kirmizi biber.', 89.90, null, 'adet', false, 56),
  ('yag-sos-baharat', 'Orkide Findik Yagi 900 ml', 'orkide-findik-yagi-900-ml', 'Orkide', '900 ml', 'Salata ve yemeklik, aromatik findik yagi.', 179.90, null, 'adet', false, 57),
  ('yag-sos-baharat', 'Reis Hindistan Cevizi Yagi 400 ml', 'reis-hindistan-cevizi-yagi-400-ml', 'Reis', '400 ml', 'Tatli ve yemeklik, dogal hindistan cevizi yagi.', 149.90, null, 'adet', false, 58)
on conflict (slug) do nothing;

-- Atistirmalik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('atistirmalik', 'Eti Cin Cin 3 lu', 'eti-cin-cin-3lu', 'Eti', '3lu', 'Cikolata kremali, kek tabanli klasik atistirmalik.', 34.90, null, 'paket', true, 40),
  ('atistirmalik', 'Ulker Cikolatali Gofret 8 li', 'ulker-cikolatali-gofret-8li', 'Ulker', '8li', 'Citir gofret, bol cikolata kaplamali ara ogun.', 74.90, null, 'paket', false, 41),
  ('atistirmalik', 'Eti Popkek Kakaolu 8 li', 'eti-popkek-kakaolu-8li', 'Eti', '8li', 'Yumusak kek, kakao dolgulu tek yudumluk popkek.', 49.90, null, 'paket', false, 42),
  ('atistirmalik', 'Ulker Halley 24 lu', 'ulker-halley-24lu', 'Ulker', '24lü', 'Marshmallow dolgulu, cikolata kapli bisküvi.', 129.90, null, 'paket', false, 43),
  ('atistirmalik', 'Eti Browni Intense 8 li', 'eti-browni-intense-8li', 'Eti', '8li', 'Yogun cikolatali, islak kek dokulu browni.', 54.90, 69.90, 'paket', true, 44),
  ('atistirmalik', 'Eti Karam Gofret 4 lu', 'eti-karam-gofret-4lu', 'Eti', '4lu', 'Bol cikolatali, citir gofret cok katmanli.', 44.90, null, 'paket', false, 45),
  ('atistirmalik', 'Ulker Cikolatali Kek 10 lu', 'ulker-cikolatali-kek-10lu', 'Ulker', '10lu', 'Cikolata soslu, yumusak porsiyonluk kek.', 54.90, null, 'paket', false, 46),
  ('atistirmalik', 'Eti Canga 45 g', 'eti-canga-45-g', 'Eti', '45 g', 'Findikli ve karamelli, doyurucu cikolata bar.', 24.90, null, 'adet', false, 47),
  ('atistirmalik', 'Ulker Alpella Sut Gofret 12 li', 'ulker-alpella-sut-gofret-12li', 'Alpella', '12li', 'Sutlu krema dolgulu, ekonomik gofret paketi.', 44.90, null, 'paket', false, 48),
  ('atistirmalik', 'Eti Wanted Karamel 40 g', 'eti-wanted-karamel-40-g', 'Eti', '40 g', 'Karamel ve findikli, cikolata kapli sekerleme bar.', 24.90, null, 'adet', false, 49),
  ('atistirmalik', 'Eti Puf Kakaolu 6 li', 'eti-puf-kakaolu-6li', 'Eti', '6li', 'Yumusak marshmallow, kakao kapli bisküvi.', 44.90, null, 'paket', false, 50),
  ('atistirmalik', 'Ulker Rondo Cifte Kakao 250 g', 'ulker-rondo-cifte-kakao-250-g', 'Ulker', '250 g', 'Kakao kremali, ikiz sandvic bisküvi.', 34.90, null, 'adet', false, 51),
  ('atistirmalik', 'Eti Form Bar 5 li', 'eti-form-bar-5li', 'Eti', '5li', 'Yulafli ve lifli, hafif ara ogun bari.', 49.90, null, 'paket', true, 52),
  ('atistirmalik', 'Ulker Probis Sutlu 24 g 5 li', 'ulker-probis-sutlu-5li', 'Ulker', '5li', 'Sutlu bisküvi bar, cocuklara pratik atistirmalik.', 44.90, null, 'paket', false, 53),
  ('atistirmalik', 'Eti Benimo Sandvic Bisküvi 8 li', 'eti-benimo-sandvic-8li', 'Eti', '8li', 'Sutlu krema dolgulu, cocuk dostu sandvic bisküvi.', 49.90, null, 'paket', false, 54),
  ('atistirmalik', 'Solen Ozmo Hoppo 12 li', 'solen-ozmo-hoppo-12li', 'Solen', '12li', 'Cikolata kapli, dolgu kremali cocuk bisküvisi.', 49.90, null, 'paket', false, 55),
  ('atistirmalik', 'Eti Gong Findikli Kek 4 lu', 'eti-gong-findikli-kek-4lu', 'Eti', '4lu', 'Findik parcacikli, yumusak porsiyon kek.', 44.90, null, 'paket', false, 56)
on conflict (slug) do nothing;

-- Cips & Kuruyemis
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cips-kuruyemis', 'Lays Klasik 40 g', 'lays-klasik-40-g', 'Lays', '40 g', 'Citir ve tuzlu, klasik patates cipsi aile boy.', 19.90, null, 'adet', true, 40),
  ('cips-kuruyemis', 'Ruffles Original 116 g', 'ruffles-original-116-g', 'Ruffles', '116 g', 'Kalin dilim, tirtikli citir patates cipsi.', 49.90, null, 'adet', false, 41),
  ('cips-kuruyemis', 'Doritos Nacho 118 g', 'doritos-nacho-118-g', 'Doritos', '118 g', 'Baharatli ve citir, misir bazli nacho cipsi.', 49.90, null, 'adet', false, 42),
  ('cips-kuruyemis', 'Cheetos Peynirli 100 g', 'cheetos-peynirli-100-g', 'Cheetos', '100 g', 'Peynir aromali, kabarik misir cipsi.', 39.90, null, 'adet', false, 43),
  ('cips-kuruyemis', 'Tadim Karisik Kuruyemis 180 g', 'tadim-karisik-kuruyemis-180-g', 'Tadim', '180 g', 'Findik, badem ve fistik, kavrulmus karisik kuruyemis.', 119.90, 149.90, 'adet', true, 44),
  ('cips-kuruyemis', 'Tadim Antep Fistigi 150 g', 'tadim-antep-fistigi-150-g', 'Tadim', '150 g', 'Kavrulmus ve tuzlu, ic dolgun Antep fistigi.', 179.90, null, 'adet', false, 45),
  ('cips-kuruyemis', 'Tadim Cig Badem 200 g', 'tadim-cig-badem-200-g', 'Tadim', '200 g', 'Katkisiz ve saglikli, cig ic badem.', 149.90, null, 'adet', false, 46),
  ('cips-kuruyemis', 'Peyman Cifte Kavrulmus Leblebi 140 g', 'peyman-cifte-leblebi-140-g', 'Peyman', '140 g', 'Cifte kavrulmus, tuzsuz sari leblebi.', 44.90, null, 'adet', false, 47),
  ('cips-kuruyemis', 'Tadim Findik Ic 150 g', 'tadim-findik-ic-150-g', 'Tadim', '150 g', 'Kavrulmus, tam ic Giresun findigi.', 159.90, null, 'adet', false, 48),
  ('cips-kuruyemis', 'Cerezza Cekirdek Ay Cekirdegi 200 g', 'cerezza-ay-cekirdegi-200-g', 'Cerezza', '200 g', 'Bol tuzlu, kavrulmus cok tane ay cekirdegi.', 54.90, null, 'adet', false, 49),
  ('cips-kuruyemis', 'Pringles Original 165 g', 'pringles-original-165-g', 'Pringles', '165 g', 'Tup icinde, ince ve citir patates cipsi.', 59.90, null, 'adet', false, 50),
  ('cips-kuruyemis', 'Lays Kapari Firindan 107 g', 'lays-firindan-baharatli-107-g', 'Lays', '107 g', 'Az yagli firin usulu, baharatli patates cipsi.', 44.90, null, 'adet', false, 51),
  ('cips-kuruyemis', 'Tadim Kaju 150 g', 'tadim-kaju-150-g', 'Tadim', '150 g', 'Kavrulmus ve tuzlu, kremamsi ic kaju.', 189.90, null, 'adet', false, 52),
  ('cips-kuruyemis', 'Peyman Nutzz Cekirdek 40 g', 'peyman-nutzz-cekirdek-40-g', 'Peyman Nutzz', '40 g', 'Cepte tasinabilir, kavrulmus cekirdek paketi.', 22.90, null, 'adet', false, 53),
  ('cips-kuruyemis', 'Doritos Aci 118 g', 'doritos-aci-tex-mex-118-g', 'Doritos', '118 g', 'Aci baharatli, tex-mex misir cipsi.', 49.90, null, 'adet', false, 54),
  ('cips-kuruyemis', 'Tadim Kuru Uzum 400 g', 'tadim-kuru-uzum-400-g', 'Tadim', '400 g', 'Cekirdeksiz ve tatli, kuru sultani uzum.', 94.90, null, 'adet', false, 55),
  ('cips-kuruyemis', 'Tadim Kuru Kayisi 200 g', 'tadim-kuru-kayisi-200-g', 'Tadim', '200 g', 'Kukurtsuz, tatli ve lifli kuru Malatya kayisi.', 94.90, null, 'adet', false, 56),
  ('cips-kuruyemis', 'Ohh Patlamis Misir Tereyagli 100 g', 'ohh-patlamis-misir-tereyagli-100-g', 'Ohh', '100 g', 'Tereyag aromali, hazir patlamis misir.', 34.90, null, 'adet', false, 57)
on conflict (slug) do nothing;

-- Cikolata & Sekerleme
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cikolata-sekerleme', 'Milka Sutlu Tablet 80 g', 'milka-sutlu-tablet-80-g', 'Milka', '80 g', 'Alpine sutlu, agizda eriyen sutlu tablet cikolata.', 44.90, null, 'adet', true, 40),
  ('cikolata-sekerleme', 'Nestle Damak Findikli 60 g', 'nestle-damak-findikli-60-g', 'Nestle', '60 g', 'Antep fistikli, klasik sutlu tablet cikolata.', 39.90, null, 'adet', false, 41),
  ('cikolata-sekerleme', 'Ulker Cikolatali Madlen 500 g', 'ulker-madlen-500-g', 'Ulker', '500 g', 'Findik dolgulu, ikram boy madlen cikolata.', 179.90, 219.90, 'adet', true, 42),
  ('cikolata-sekerleme', 'Toblerone Sutlu 200 g', 'toblerone-sutlu-200-g', 'Toblerone', '200 g', 'Ballı bademli nugat, uclu prizma sutlu cikolata.', 159.90, null, 'adet', false, 43),
  ('cikolata-sekerleme', 'Haribo Altin Ayicik 160 g', 'haribo-altin-ayicik-160-g', 'Haribo', '160 g', 'Meyve aromali, yumusak jelibon ayiciklar.', 39.90, null, 'adet', false, 44),
  ('cikolata-sekerleme', 'Kinder Bueno White 39 g', 'kinder-bueno-white-39-g', 'Kinder', '39 g', 'Findik kremali, citir gofret sutlu cikolata bar.', 34.90, null, 'adet', false, 45),
  ('cikolata-sekerleme', 'Ferrero Rocher 16 li', 'ferrero-rocher-16li', 'Ferrero', '16lı', 'Findikli ve gofretli, ikramlik top cikolata.', 219.90, 269.90, 'adet', true, 46),
  ('cikolata-sekerleme', 'Nestle Crunch 80 g', 'nestle-crunch-80-g', 'Nestle', '80 g', 'Pirinc patlakli, citir sutlu tablet cikolata.', 44.90, null, 'adet', false, 47),
  ('cikolata-sekerleme', 'Ulker Laviva 35 g', 'ulker-laviva-35-g', 'Ulker', '35 g', 'Karamel ve bisküvili, sutlu cikolata bar.', 24.90, null, 'adet', false, 48),
  ('cikolata-sekerleme', 'Milka Oreo 300 g', 'milka-oreo-300-g', 'Milka', '300 g', 'Oreo parcali, sutlu tablet cikolata.', 129.90, null, 'adet', false, 49),
  ('cikolata-sekerleme', 'Snickers Super 80 g', 'snickers-super-80-g', 'Snickers', '80 g', 'Findik ve karamelli, doyurucu cikolata bar.', 34.90, null, 'adet', false, 50),
  ('cikolata-sekerleme', 'Mars Super 70 g', 'mars-super-70-g', 'Mars', '70 g', 'Karamel ve nugatli, sutlu cikolata bar.', 34.90, null, 'adet', false, 51),
  ('cikolata-sekerleme', 'Solen Nutymax 44 g', 'solen-nutymax-44-g', 'Solen', '44 g', 'Fistikli ve bisküvili, bol dolgulu cikolata bar.', 24.90, null, 'adet', false, 52),
  ('cikolata-sekerleme', 'Haci Seker Akide Sekeri 350 g', 'haci-sekar-akide-350-g', 'Hacı Bekir', '350 g', 'Naneli ve meyveli, geleneksel akide sekeri.', 89.90, null, 'adet', false, 53),
  ('cikolata-sekerleme', 'Mabel Damla Sakizi 20 li', 'mabel-damla-sakizi-20li', 'Mabel', '20li', 'Damla sakizi aromali, ekonomik paket sakiz.', 29.90, null, 'paket', false, 54),
  ('cikolata-sekerleme', 'Ulker Cocostar 25 g 6 li', 'ulker-cocostar-6li', 'Ulker', '6lı', 'Karamelli ve bisküvili, cocuk boy cikolata bar.', 44.90, null, 'paket', false, 55),
  ('cikolata-sekerleme', 'Tofita Karisik 47 g 12 li', 'tofita-karisik-12li', 'Tofita', '12li', 'Meyveli ve yumusak, cignemelik sekerleme.', 44.90, null, 'paket', false, 56),
  ('cikolata-sekerleme', 'Falim Sakiz Naneli 5 li 20 paket', 'falim-naneli-100lu', 'Falim', '100lü', 'Sekersiz naneli, uzun soluklu cignemelik sakiz.', 59.90, null, 'paket', false, 57),
  ('cikolata-sekerleme', 'Milka Bonibon 24,3 g 12 li', 'milka-bonibon-12li', 'Milka', '12li', 'Renkli seker kapli, mini sutlu cikolata draje.', 54.90, null, 'paket', false, 58)
on conflict (slug) do nothing;

-- Kahve & Cay
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kahve-cay', 'Nescafe Gold 200 g', 'nescafe-gold-200-g', 'Nescafe', '200 g', 'Yogun aromali, cozunebilir gold granul kahve.', 289.90, null, 'adet', true, 40),
  ('kahve-cay', 'Jacobs Monarch 200 g', 'jacobs-monarch-200-g', 'Jacobs', '200 g', 'Zengin aromali, cozunebilir granul kahve.', 219.90, 269.90, 'adet', true, 41),
  ('kahve-cay', 'Kurukahveci Mehmet Efendi Turk Kahvesi 250 g', 'mehmet-efendi-turk-kahvesi-250-g', 'Mehmet Efendi', '250 g', 'Taze kavrulmus, koklu Turk kahvesi.', 94.90, null, 'adet', false, 42),
  ('kahve-cay', 'Caykur Rize Turist 1 kg', 'caykur-rize-turist-1-kg', 'Caykur', '1 kg', 'Demi koyu, harmanlanmis siyah dokme cay.', 134.90, null, 'adet', true, 43),
  ('kahve-cay', 'Lipton Yellow Label 500 g', 'lipton-yellow-label-500-g', 'Lipton', '500 g', 'Gunluk demlik, dengeli harman siyah cay.', 149.90, null, 'adet', false, 44),
  ('kahve-cay', 'Nescafe 3u1 Arada 40 li', 'nescafe-3u1-arada-40li', 'Nescafe', '40lı', 'Kahve, krema ve sekerli, pratik hazir kahve.', 119.90, null, 'paket', false, 45),
  ('kahve-cay', 'Dogadan Ihlamur 40 li', 'dogadan-ihlamur-40li', 'Dogadan', '40li', 'Bogaz rahatlatan, aromatik ihlamur bitki cayi.', 94.90, null, 'paket', false, 46),
  ('kahve-cay', 'Dogus Adacayi 20 li', 'dogus-adacayi-20li', 'Dogus', '20li', 'Sindirime iyi gelen, taze adacayi bitki cayi.', 49.90, null, 'paket', false, 47),
  ('kahve-cay', 'Nescafe Classic Kavanoz 200 g', 'nescafe-classic-200-g', 'Nescafe', '200 g', 'Klasik yogun aromali, cozunebilir kavanoz kahve.', 219.90, null, 'adet', false, 48),
  ('kahve-cay', 'Caykur Filiz 500 g', 'caykur-filiz-500-g', 'Caykur', '500 g', 'Ince kalite, acik ve berrak demli siyah cay.', 89.90, null, 'adet', false, 49),
  ('kahve-cay', 'Kahve Dunyasi Cekirdek Kahve 250 g', 'kahve-dunyasi-cekirdek-250-g', 'Kahve Dunyasi', '250 g', 'Espresso icin ogutulmemis, taze kavrulmus cekirdek kahve.', 179.90, null, 'adet', false, 50),
  ('kahve-cay', 'Nestle Nescafe Dolce Gusto Kapsul 16 li', 'dolce-gusto-espresso-kapsul-16li', 'Dolce Gusto', '16li', 'Yogun espresso, tek dokunusluk kapsul kahve.', 159.90, null, 'paket', false, 51),
  ('kahve-cay', 'Lipton Demlik Poset 100 lu', 'lipton-demlik-poset-100lu', 'Lipton', '100lü', 'Pratik demlik poseti, gunluk demlik siyah cay.', 134.90, null, 'paket', false, 52),
  ('kahve-cay', 'Dogadan Yesil Cay Limon 20 li', 'dogadan-yesil-cay-limon-20li', 'Dogadan', '20li', 'Limon aromali, hafif yesil cay poseti.', 54.90, null, 'paket', false, 53),
  ('kahve-cay', 'Caykur Altinbas Bergamot 400 g', 'caykur-altinbas-bergamot-400-g', 'Caykur', '400 g', 'Bergamot aromali, kokulu Earl Grey siyah cay.', 119.90, null, 'adet', false, 54),
  ('kahve-cay', 'Mahmood Coffee Menengic Kahvesi 200 g', 'mahmood-menengic-kahve-200-g', 'Mahmood', '200 g', 'Sutle icilen, aromatik menengic kahvesi.', 129.90, null, 'adet', false, 55),
  ('kahve-cay', 'Dogus Kis Cayi 40 li', 'dogus-kis-cayi-40li', 'Dogus', '40li', 'Tarcin, zencefil ve karanfilli, isitan kis cayi.', 69.90, null, 'paket', false, 56)
on conflict (slug) do nothing;

-- Dondurma
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('dondurma', 'Algida Cornetto Klasik 4 lu', 'algida-cornetto-klasik-4lu', 'Algida', '4lu', 'Cikolata kremali, findikli klasik külah dondurma.', 89.90, null, 'paket', true, 40),
  ('dondurma', 'Algida Magnum Classic 4 lu', 'algida-magnum-classic-4lu', 'Magnum', '4lu', 'Bol cikolata kaplamali, kremali fistik cubuk dondurma.', 129.90, 159.90, 'paket', true, 41),
  ('dondurma', 'Algida Max Bomba 8 li', 'algida-max-bomba-8li', 'Algida', '8li', 'Cocuk boy, renkli aromalı su bazli dondurma.', 94.90, null, 'paket', false, 42),
  ('dondurma', 'Golf Karamelli Kutu 900 ml', 'golf-karamelli-kutu-900-ml', 'Golf', '900 ml', 'Karamel soslu, aile boy kase kutu dondurma.', 119.90, null, 'adet', false, 43),
  ('dondurma', 'Algida Twister 6 li', 'algida-twister-6li', 'Algida', '6li', 'Meyve aromali, burgu su bazli cocuk dondurmasi.', 89.90, null, 'paket', false, 44),
  ('dondurma', 'Panda Sandvic Dondurma 6 li', 'panda-sandvic-dondurma-6li', 'Panda', '6li', 'Bisküvi arasi, sutlu klasik sandvic dondurma.', 94.90, null, 'paket', false, 45),
  ('dondurma', 'Mado Kesme Dondurma 500 g', 'mado-kesme-dondurma-500-g', 'Mado', '500 g', 'Salepli ve sakizli, geleneksel Maras kesme dondurma.', 159.90, null, 'adet', true, 46),
  ('dondurma', 'Algida Cornetto Disc Cikolata 4 lu', 'algida-cornetto-disc-cikolata-4lu', 'Cornetto', '4lu', 'Kapak diskli, bol cikolatali külah dondurma.', 99.90, null, 'paket', false, 47),
  ('dondurma', 'Ben Jerry Cookie Dough 465 ml', 'ben-jerry-cookie-dough-465-ml', 'Ben & Jerry', '465 ml', 'Kurabiye hamurlu, yogun kremali kutu dondurma.', 189.90, null, 'adet', false, 48),
  ('dondurma', 'Golf Trio Kutu 900 ml', 'golf-trio-kutu-900-ml', 'Golf', '900 ml', 'Cilek, vanilya ve kakao, uc renkli aile boy dondurma.', 114.90, null, 'adet', false, 49),
  ('dondurma', 'Algida Karadut Kutu 850 ml', 'algida-karadut-kutu-850-ml', 'Algida', '850 ml', 'Karadut aromali, meyveli aile boy kase dondurma.', 109.90, null, 'adet', false, 50),
  ('dondurma', 'Panda Maxi Cubuk 6 li', 'panda-maxi-cubuk-6li', 'Panda', '6li', 'Cikolata kaplamali, kremali cubuk dondurma.', 99.90, null, 'paket', false, 51),
  ('dondurma', 'Algida Magnum Almond 4 lu', 'algida-magnum-almond-4lu', 'Magnum', '4lu', 'Badem parcacikli cikolata kaplamali cubuk dondurma.', 134.90, null, 'paket', false, 52),
  ('dondurma', 'Golf Sandwich Cift Kat 8 li', 'golf-sandwich-cift-kat-8li', 'Golf', '8li', 'Bisküvi arasi cift kremali sandvic dondurma.', 129.90, null, 'paket', false, 53),
  ('dondurma', 'Mikado Krem Karamel Cubuk 4 lu', 'mikado-krem-karamel-cubuk-4lu', 'Mikado', '4lu', 'Karamelli krem, cikolata kaplamali cubuk dondurma.', 99.90, null, 'paket', false, 54),
  ('dondurma', 'Algida Ali Baba Kalippo 6 li', 'algida-ali-baba-kalippo-6li', 'Algida', '6li', 'Portakal aromali, sikma su bazli dondurma.', 89.90, null, 'paket', false, 55),
  ('dondurma', 'Ozsut Vanilyali Kutu 750 ml', 'ozsut-vanilyali-kutu-750-ml', 'Ozsut', '750 ml', 'Sade vanilyali, kremamsi aile boy kutu dondurma.', 99.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Donuk Gida
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('donuk-gida', 'Superfresh Milfoy Hamuru 500 g', 'superfresh-milfoy-hamuru-500-g', 'Superfresh', '500 g', 'Boreklik ve tatlilik, ince kat dondurulmus milfoy hamuru.', 64.90, null, 'adet', true, 40),
  ('donuk-gida', 'Superfresh Baklava Yufkasi 500 g', 'superfresh-baklava-yufkasi-500-g', 'Superfresh', '500 g', 'Baklava ve boreklik, ince acilmis dondurulmus yufka.', 59.90, null, 'adet', false, 41),
  ('donuk-gida', 'Reis Ic Bezelye 450 g', 'reis-donuk-ic-bezelye-450-g', 'Reis', '450 g', 'Yemek ve garniturluk, dondurulmus taze ic bezelye.', 54.90, null, 'adet', false, 42),
  ('donuk-gida', 'Superfresh Karisik Sebze 450 g', 'superfresh-karisik-sebze-450-g', 'Superfresh', '450 g', 'Sote ve garniturluk, dondurulmus karisik sebze.', 54.90, null, 'adet', false, 43),
  ('donuk-gida', 'Dr Oetker Napoli Pizza 400 g', 'droetker-napoli-pizza-400-g', 'Dr. Oetker', '400 g', 'Mozarellali ve sucuklu, firinda hazir donuk pizza.', 89.90, 109.90, 'adet', true, 44),
  ('donuk-gida', 'Superfresh Patates Kroket 450 g', 'superfresh-patates-kroket-450-g', 'Superfresh', '450 g', 'Firinda citir, dondurulmus patates kroket.', 64.90, null, 'adet', false, 45),
  ('donuk-gida', 'Ekol Levrek Fileto 400 g', 'ekol-levrek-fileto-400-g', 'Ekol', '400 g', 'Kilciksiz, firin ve tavalik dondurulmus levrek fileto.', 149.90, null, 'adet', false, 46),
  ('donuk-gida', 'Superfresh Icli Kofte 500 g', 'superfresh-icli-kofte-500-g', 'Superfresh', '500 g', 'Bulgur kabuklu, kiymali dondurulmus icli kofte.', 94.90, null, 'adet', false, 47),
  ('donuk-gida', 'Superfresh Sigara Boregi 1 kg', 'superfresh-sigara-boregi-1-kg', 'Superfresh', '1 kg', 'Peynirli, kizartmalik dondurulmus sigara boregi.', 129.90, null, 'adet', false, 48),
  ('donuk-gida', 'Pinar Tavuk Nugget 450 g', 'pinar-tavuk-nugget-450-g', 'Pinar', '450 g', 'Cocuklarin sevdigi, citir kaplamali tavuk nugget.', 89.90, null, 'adet', true, 49),
  ('donuk-gida', 'Ekol Karides Ayiklanmis 400 g', 'ekol-ayiklanmis-karides-400-g', 'Ekol', '400 g', 'Sote ve makarnalik, temizlenmis dondurulmus karides.', 219.90, null, 'adet', false, 50),
  ('donuk-gida', 'Superfresh Firin Patates Dilim 1 kg', 'superfresh-firin-patates-dilim-1-kg', 'Superfresh', '1 kg', 'Kalin dilim, firinda citir dondurulmus patates.', 79.90, null, 'adet', false, 51),
  ('donuk-gida', 'Dr Oetker Kolay Pizza Karisik 355 g', 'droetker-kolay-pizza-karisik-355-g', 'Dr. Oetker', '355 g', 'Ince hamurlu, karisik malzemeli donuk pizza.', 84.90, null, 'adet', false, 52),
  ('donuk-gida', 'Superfresh Manti 500 g', 'superfresh-donuk-manti-500-g', 'Superfresh', '500 g', 'Yogurtlu servislik, kiymali dondurulmus manti.', 79.90, null, 'adet', false, 53),
  ('donuk-gida', 'Ekol Somon Fileto 400 g', 'ekol-somon-fileto-400-g', 'Ekol', '400 g', 'Omega deposu, firin ve izgaralik dondurulmus somon fileto.', 249.90, null, 'adet', false, 54),
  ('donuk-gida', 'Superfresh Musir Tane Donuk 450 g', 'superfresh-donuk-misir-450-g', 'Superfresh', '450 g', 'Salata ve yemeklik, dondurulmus tatli tane misir.', 49.90, null, 'adet', false, 55),
  ('donuk-gida', 'Pinar Pizza Rulo 400 g', 'pinar-pizza-rulo-400-g', 'Pinar', '400 g', 'Kasarli ve sucuklu, atistirmalik dondurulmus pizza rulo.', 84.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Zeytin & Tursu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('zeytin-tursu', 'Marmarabirlik Siyah Zeytin M 800 g', 'marmarabirlik-siyah-zeytin-m-800-g', 'Marmarabirlik', '800 g', 'Dogal salamura, kahvaltilik orta boy siyah zeytin.', 149.90, 179.90, 'adet', true, 40),
  ('zeytin-tursu', 'Marmarabirlik Yesil Kirma Zeytin 700 g', 'marmarabirlik-yesil-kirma-zeytin-700-g', 'Marmarabirlik', '700 g', 'Sarimsakli ve baharatli, kahvaltilik yesil kirma zeytin.', 139.90, null, 'adet', false, 41),
  ('zeytin-tursu', 'Tariş Yesil Cizik Zeytin 800 g', 'taris-yesil-cizik-zeytin-800-g', 'Tariş', '800 g', 'Limonlu salamura, kahvaltilik cizik yesil zeytin.', 134.90, null, 'adet', false, 42),
  ('zeytin-tursu', 'Yesil Cift Kavanoz Karisik Tursu 1 kg', 'ciftlik-karisik-tursu-1-kg', 'Ciftlik', '1 kg', 'Salatalik, biber ve havuc, evde usulu karisik tursu.', 79.90, null, 'adet', true, 43),
  ('zeytin-tursu', 'Ozgazi Kornison Tursu 720 g', 'ozgazi-kornison-tursu-720-g', 'Ozgazi', '720 g', 'Kucuk boy, citir kornison salatalik tursusu.', 74.90, null, 'adet', false, 44),
  ('zeytin-tursu', 'Marmarabirlik Sele Zeytin 800 g', 'marmarabirlik-sele-zeytin-800-g', 'Marmarabirlik', '800 g', 'Az tuzlu, buruşuk sele siyah kahvaltilik zeytin.', 144.90, null, 'adet', false, 45),
  ('zeytin-tursu', 'Taris Domat Yesil Zeytin 800 g', 'taris-domat-yesil-zeytin-800-g', 'Tariş', '800 g', 'Iri taneli, etli domat yesil kahvaltilik zeytin.', 149.90, null, 'adet', false, 46),
  ('zeytin-tursu', 'Sera Aci Biber Tursu 680 g', 'sera-aci-biber-tursu-680-g', 'Sera', '680 g', 'Yemek yanina, aci yesil biber tursusu.', 59.90, null, 'adet', false, 47),
  ('zeytin-tursu', 'Ciftlik Lahana Tursu 1 kg', 'ciftlik-lahana-tursu-1-kg', 'Ciftlik', '1 kg', 'Sirkeli salamura, citir beyaz lahana tursusu.', 64.90, null, 'adet', false, 48),
  ('zeytin-tursu', 'Marmarabirlik Yesil Yag Zeytin 400 g', 'marmarabirlik-yesil-yag-zeytin-400-g', 'Marmarabirlik', '400 g', 'Zeytinyagli, mezelik olgun yesil zeytin.', 119.90, null, 'adet', false, 49),
  ('zeytin-tursu', 'Ozgazi Sarimsak Tursu 370 g', 'ozgazi-sarimsak-tursu-370-g', 'Ozgazi', '370 g', 'Salamura, yemek yanina bekletilmis sarimsak tursusu.', 54.90, null, 'adet', false, 50),
  ('zeytin-tursu', 'Ciftlik Salatalik Tursu 1 kg', 'ciftlik-salatalik-tursu-1-kg', 'Ciftlik', '1 kg', 'Citir ve mayhos, klasik salatalik tursusu.', 69.90, null, 'adet', false, 51),
  ('zeytin-tursu', 'Taris Kalamata Zeytin 400 g', 'taris-kalamata-zeytin-400-g', 'Tariş', '400 g', 'Badem sekilli, aromatik siyah Kalamata zeytini.', 129.90, null, 'adet', false, 52),
  ('zeytin-tursu', 'Sera Kapya Biber Tursu 680 g', 'sera-kapya-biber-tursu-680-g', 'Sera', '680 g', 'Tatli ve citir, kirmizi kapya biber tursusu.', 64.90, null, 'adet', false, 53),
  ('zeytin-tursu', 'Marmarabirlik Dilim Zeytin 400 g', 'marmarabirlik-dilim-zeytin-400-g', 'Marmarabirlik', '400 g', 'Pizza ve salatalik, dilimlenmis siyah zeytin.', 94.90, null, 'adet', false, 54),
  ('zeytin-tursu', 'Ozgazi Turp Tursu 720 g', 'ozgazi-turp-tursu-720-g', 'Ozgazi', '720 g', 'Salgam yanina, citir kirmizi turp tursusu.', 59.90, null, 'adet', false, 55),
  ('zeytin-tursu', 'Ciftlik Biber Dolma Tursu 1 kg', 'ciftlik-biber-dolma-tursu-1-kg', 'Ciftlik', '1 kg', 'Lahana dolgulu, mezelik biber dolma tursusu.', 89.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Temizlik & Deterjan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('temizlik-deterjan', 'Omo Toz Camasir Deterjani 6 kg', 'omo-toz-deterjan-6-kg', 'Omo', '6 kg', 'Renkli ve beyaz camasirlar icin, guclu toz deterjan.', 329.90, 399.90, 'adet', true, 40),
  ('temizlik-deterjan', 'Ariel Sivi Deterjan 2145 ml', 'ariel-sivi-deterjan-2145-ml', 'Ariel', '2145 ml', 'Lekelere karsi etkili, 33 yikamalik sivi jel deterjan.', 329.90, null, 'adet', false, 41),
  ('temizlik-deterjan', 'Yumos Yumusatici Bahar 1440 ml', 'yumos-yumusatici-bahar-1440-ml', 'Yumos', '1440 ml', 'Uzun sureli ferah kokulu, camasir yumusaticisi.', 119.90, null, 'adet', false, 42),
  ('temizlik-deterjan', 'Finish Bulasik Makinesi Tablet 60 li', 'finish-bulasik-tablet-60li', 'Finish', '60lı', 'Powerball, parlaklik ve tuz etkili bulasik tableti.', 329.90, 389.90, 'adet', true, 43),
  ('temizlik-deterjan', 'Cif Krem Beyaz 750 ml', 'cif-krem-beyaz-750-ml', 'Cif', '750 ml', 'Yuzeyleri cizmeden temizleyen, asindirici krem.', 59.90, null, 'adet', false, 44),
  ('temizlik-deterjan', 'Domestos Corf Cikartici 750 ml', 'domestos-corf-cikartici-750-ml', 'Domestos', '750 ml', 'Kirec ve mikroplara karsi, yogun cif temizleyici.', 64.90, null, 'adet', false, 45),
  ('temizlik-deterjan', 'Fairy Sivi Bulasik 650 ml', 'fairy-sivi-bulasik-650-ml', 'Fairy', '650 ml', 'Yagli bulasiklara karsi, guclu limon aromali sivi.', 54.90, null, 'adet', false, 46),
  ('temizlik-deterjan', 'Pril Sivi Bulasik 750 ml', 'pril-sivi-bulasik-750-ml', 'Pril', '750 ml', 'Bol kopuklu, elde bulasik yikama sivisi.', 54.90, null, 'adet', false, 47),
  ('temizlik-deterjan', 'Marc Yuzey Temizleyici 750 ml', 'marc-yuzey-temizleyici-750-ml', 'Marc', '750 ml', 'Cok amacli, ferah kokulu yuzey temizleyici sprey.', 44.90, null, 'adet', false, 48),
  ('temizlik-deterjan', 'Bingo Camasir Suyu 4 L', 'bingo-camasir-suyu-4-l', 'Bingo', '4 L', 'Beyazlatici ve hijyenik, klasik camasir suyu.', 49.90, null, 'adet', false, 49),
  ('temizlik-deterjan', 'Vim Ovma Tozu 500 g', 'vim-ovma-tozu-500-g', 'Vim', '500 g', 'Yanik ve inatci kirlere karsi, asindirici ovma tozu.', 34.90, null, 'adet', false, 50),
  ('temizlik-deterjan', 'Cif Banyo Sprey 750 ml', 'cif-banyo-sprey-750-ml', 'Cif', '750 ml', 'Kirec ve sabun kalintisina karsi, banyo temizleyici.', 64.90, null, 'adet', false, 51),
  ('temizlik-deterjan', 'Ariel Toz Deterjan Dag Esintisi 6 kg', 'ariel-toz-deterjan-dag-esintisi-6-kg', 'Ariel', '6 kg', 'Ferah kokulu, renkliler icin guclu toz deterjan.', 359.90, null, 'adet', false, 52),
  ('temizlik-deterjan', 'Yumos Konsantre Yumusatici 1200 ml', 'yumos-konsantre-yumusatici-1200-ml', 'Yumos', '1200 ml', '48 yikamalik, yogun formul camasir yumusaticisi.', 149.90, null, 'adet', false, 53),
  ('temizlik-deterjan', 'Glade Otomatik Sprey Yedek 269 ml', 'glade-otomatik-sprey-yedek-269-ml', 'Glade', '269 ml', 'Ortam kokusu, otomatik sprey yedek kartus.', 89.90, null, 'adet', false, 54),
  ('temizlik-deterjan', 'Sarma Bulasik Sabunu 400 g', 'sarma-bulasik-sabunu-400-g', 'Sarma', '400 g', 'Elde bulasik yikamaya uygun, arap sabunu kokulu kalip.', 34.90, null, 'adet', false, 55),
  ('temizlik-deterjan', 'Hijyenpol Genel Temizlik 1 L', 'hijyenpol-genel-temizlik-1-l', 'Hijyenpol', '1 L', 'Zemin ve yuzeyler icin, ferah kokulu genel temizlik.', 44.90, null, 'adet', false, 56),
  ('temizlik-deterjan', 'Domestos Wc Blok 3 lu', 'domestos-wc-blok-3lu', 'Domestos', '3lu', 'Klozet ici, her sifonda ferah koku birakan wc blogu.', 54.90, null, 'paket', false, 57),
  ('temizlik-deterjan', 'Finish Parlatici 400 ml', 'finish-parlatici-400-ml', 'Finish', '400 ml', 'Su lekesine karsi, bardaklara parlaklik veren parlatici.', 89.90, null, 'adet', false, 58)
on conflict (slug) do nothing;

-- Kagit Urunleri
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kagit-urunleri', 'Selpak Tuvalet Kagidi 32 li', 'selpak-tuvalet-kagidi-32li', 'Selpak', '32li', '3 katli, yumusak ve dayanikli tuvalet kagidi.', 219.90, 269.90, 'adet', true, 40),
  ('kagit-urunleri', 'Solo Kagit Havlu 24 lu', 'solo-kagit-havlu-24lu', 'Solo', '24lü', 'Emici ve dayanikli, mutfak icin kagit havlu.', 289.90, null, 'adet', false, 41),
  ('kagit-urunleri', 'Selpak Pecete 100 lu', 'selpak-pecete-100lu', 'Selpak', '100lü', 'Sofra ve mutfak icin, yumusak beyaz pecete.', 34.90, null, 'adet', false, 42),
  ('kagit-urunleri', 'Servis Kagit Havlu Z Katlama 200 lu', 'servis-z-katlama-havlu-200lu', 'Servis', '200lü', 'Lavabo icin, z katlamali dispenser kagit havlu.', 59.90, null, 'adet', false, 43),
  ('kagit-urunleri', 'Selpak Mendil 10 lu', 'selpak-cep-mendil-10lu', 'Selpak', '10lu', 'Cepte tasinabilir, yumusak paket cep mendil.', 49.90, null, 'paket', false, 44),
  ('kagit-urunleri', 'Papia Tuvalet Kagidi 24 lu', 'papia-tuvalet-kagidi-24lu', 'Papia', '24lu', '3 katli, uzun rulo ekonomik tuvalet kagidi.', 179.90, null, 'adet', true, 45),
  ('kagit-urunleri', 'Familia Kagit Havlu 8 li', 'familia-kagit-havlu-8li', 'Familia', '8li', 'Cok amacli, kalin ve emici mutfak havlusu.', 119.90, null, 'adet', false, 46),
  ('kagit-urunleri', 'Peros Islak Mendil 120 li', 'peros-islak-mendil-120li', 'Peros', '120li', 'Kapakli, pratik cok amacli islak mendil.', 44.90, null, 'adet', false, 47),
  ('kagit-urunleri', 'Selpak Islak Havlu Antibakteriyel 3x15', 'selpak-islak-havlu-3x15', 'Selpak', '3x15', 'Cepte tasinabilir, antibakteriyel islak havlu.', 49.90, null, 'paket', false, 48),
  ('kagit-urunleri', 'Solo Extra Kagit Havlu 6 li', 'solo-extra-kagit-havlu-6li', 'Solo', '6li', 'Ekstra emici, cok katli mutfak kagit havlusu.', 94.90, null, 'adet', false, 49),
  ('kagit-urunleri', 'Papia Pecete 150 li', 'papia-pecete-150li', 'Papia', '150li', 'Yumusak ve dayanikli, sofra pecetesi.', 44.90, null, 'adet', false, 50),
  ('kagit-urunleri', 'Sleepy Islak Tuvalet Kagidi 60 li', 'sleepy-islak-tuvalet-kagidi-60li', 'Sleepy', '60li', 'Klozete atilabilir, ferah islak tuvalet kagidi.', 49.90, null, 'adet', false, 51),
  ('kagit-urunleri', 'Familia Tuvalet Kagidi 16 li', 'familia-tuvalet-kagidi-16li', 'Familia', '16lı', 'Ekonomik, gunluk kullanim tuvalet kagidi.', 129.90, null, 'adet', false, 52),
  ('kagit-urunleri', 'Selpak Maxi Kagit Havlu 8 li', 'selpak-maxi-kagit-havlu-8li', 'Selpak', '8li', 'Uzun rulo, ekstra emici maxi kagit havlu.', 134.90, null, 'adet', false, 53),
  ('kagit-urunleri', 'Peros Pecete Kraft 200 lu', 'peros-kraft-pecete-200lu', 'Peros', '200lü', 'Dogal kraft renk, cevre dostu sofra pecetesi.', 39.90, null, 'adet', false, 54),
  ('kagit-urunleri', 'Sleepy Kutu Mendil 100 lu', 'sleepy-kutu-mendil-100lu', 'Sleepy', '100lü', 'Masa ustu kutu, yumusak yuz mendili.', 29.90, null, 'adet', false, 55),
  ('kagit-urunleri', 'Solo Peluş Tuvalet Kagidi 16 li', 'solo-pelus-tuvalet-kagidi-16li', 'Solo', '16lı', '4 katli, pamuksu yumusak tuvalet kagidi.', 159.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Kisisel Bakim
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('kisisel-bakim', 'Head Shoulders Sampuan 550 ml', 'head-shoulders-sampuan-550-ml', 'Head & Shoulders', '550 ml', 'Kepege karsi etkili, menthol ferahligi sampuan.', 129.90, 159.90, 'adet', true, 40),
  ('kisisel-bakim', 'Elidor Bakim Sampuani 650 ml', 'elidor-bakim-sampuani-650-ml', 'Elidor', '650 ml', 'Yipranmis saclar icin, bakim yapan onarici sampuan.', 94.90, null, 'adet', false, 41),
  ('kisisel-bakim', 'Signal Dis Macunu Beyazlatici 100 ml', 'signal-dis-macunu-beyazlatici-100-ml', 'Signal', '100 ml', 'Beyazlatici formul, gunluk agiz bakim dis macunu.', 49.90, null, 'adet', false, 42),
  ('kisisel-bakim', 'Colgate Dis Fircasi Orta 2 li', 'colgate-dis-fircasi-orta-2li', 'Colgate', '2li', 'Orta sertlikte, dislere nazik temizlik dis fircasi.', 54.90, null, 'paket', false, 43),
  ('kisisel-bakim', 'Duru Sivi Sabun Zeytinyagli 1,5 L', 'duru-sivi-sabun-zeytinyagli-1-5-l', 'Duru', '1,5 L', 'Nemlendirici zeytinyagli, yedek boy sivi sabun.', 89.90, null, 'adet', false, 44),
  ('kisisel-bakim', 'Rexona Roll On Cotton 50 ml', 'rexona-roll-on-cotton-50-ml', 'Rexona', '50 ml', '48 saat koruma, pamuk ferahliginda roll-on deodorant.', 54.90, null, 'adet', false, 45),
  ('kisisel-bakim', 'Nivea Erkek Tras Kopugu 200 ml', 'nivea-erkek-tras-kopugu-200-ml', 'Nivea', '200 ml', 'Cilt dostu, kayganlik veren erkek tras kopugu.', 89.90, null, 'adet', false, 46),
  ('kisisel-bakim', 'Gillette Blue3 Tras Bicagi 6 li', 'gillette-blue3-tras-bicagi-6li', 'Gillette', '6lı', 'Uc bicakli, tek kullanimlik pratik tras bicagi.', 179.90, null, 'paket', true, 47),
  ('kisisel-bakim', 'Dove Dus Jeli Nemlendirici 500 ml', 'dove-dus-jeli-nemlendirici-500-ml', 'Dove', '500 ml', '1/4 nemlendirici kremli, yumusak dus jeli.', 94.90, null, 'adet', false, 48),
  ('kisisel-bakim', 'Ipana Dis Macunu Komple 3 lu', 'ipana-dis-macunu-komple-3lu', 'Ipana', '3lu', 'Cürüge karsi, komple koruma dis macunu.', 89.90, null, 'paket', false, 49),
  ('kisisel-bakim', 'Blendax Sac Kremi Onarici 550 ml', 'blendax-sac-kremi-onarici-550-ml', 'Blendax', '550 ml', 'Kolay taranma saglayan, onarici sac bakim kremi.', 69.90, null, 'adet', false, 50),
  ('kisisel-bakim', 'Old Spice Deodorant Sprey 150 ml', 'old-spice-deodorant-sprey-150-ml', 'Old Spice', '150 ml', 'Uzun sureli erkek kokusu, sprey deodorant.', 89.90, null, 'adet', false, 51),
  ('kisisel-bakim', 'Nivea Nemlendirici Krem 150 ml', 'nivea-nemlendirici-krem-150-ml', 'Nivea', '150 ml', 'El, yuz ve vucut icin cok amacli nemlendirici krem.', 119.90, null, 'adet', false, 52),
  ('kisisel-bakim', 'Sensodyne Dis Macunu Hassas 75 ml', 'sensodyne-dis-macunu-hassas-75-ml', 'Sensodyne', '75 ml', 'Hassas disler icin, agri onleyici dis macunu.', 89.90, null, 'adet', false, 53),
  ('kisisel-bakim', 'Clear Men Sampuan 485 ml', 'clear-men-sampuan-485-ml', 'Clear', '485 ml', 'Erkeklere ozel, kepege karsi guclendiren sampuan.', 114.90, null, 'adet', false, 54),
  ('kisisel-bakim', 'Fructis Sac Kremi Sika Vitamin 200 ml', 'fructis-sac-kremi-200-ml', 'Fructis', '200 ml', 'Bakim yapan, parlaklik veren durulanan sac kremi.', 74.90, null, 'adet', false, 55),
  ('kisisel-bakim', 'Arko Nem Krem 250 ml', 'arko-nem-krem-250-ml', 'Arko', '250 ml', 'Klasik yesil, yogun nemlendirici bakim kremi.', 44.90, null, 'adet', false, 56),
  ('kisisel-bakim', 'Wet Wipes El Dezenfektani 200 ml', 'wet-wipes-el-dezenfektani-200-ml', 'Wet Wipes', '200 ml', 'Alkol bazli, cepte tasinabilir el dezenfektani jeli.', 44.90, null, 'adet', false, 57),
  ('kisisel-bakim', 'Orkid Gunluk Ped 40 li', 'orkid-gunluk-ped-40li', 'Orkid', '40lı', 'Nefes alan, ince gunluk hijyenik ped.', 54.90, null, 'adet', false, 58),
  ('kisisel-bakim', 'Molfix Islak Havlu 3 lu', 'molfix-islak-havlu-3lu', 'Molfix', '3x60', 'Bebek dostu, hassas ciltler icin islak havlu.', 59.90, null, 'paket', false, 59)
on conflict (slug) do nothing;

-- Vitamin & Ilk Yardim
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('vitamin-ilk-yardim', 'Supradyn Enerji Multivitamin 30 Tablet', 'supradyn-enerji-30-tablet', 'Supradyn', '30 tablet', 'Gunluk enerji ve bagisiklik icin multivitamin mineral.', 249.90, 299.90, 'adet', true, 40),
  ('vitamin-ilk-yardim', 'Redoxon C Vitamini 1000 mg 15 li', 'redoxon-c-vitamini-1000-mg-15li', 'Redoxon', '15li', 'Bagisiklik destekleyen, suda eriyen C vitamini.', 94.90, null, 'adet', false, 41),
  ('vitamin-ilk-yardim', 'Solgar D3 Vitamini 1000 IU 100 Kapsul', 'solgar-d3-1000-iu-100-kapsul', 'Solgar', '100 kapsul', 'Kemik ve bagisiklik saglgi icin D3 vitamini.', 219.90, null, 'adet', false, 42),
  ('vitamin-ilk-yardim', 'Aspirin 500 mg 20 Tablet', 'aspirin-500-mg-20-tablet', 'Aspirin', '20 tablet', 'Agri ve ateşe karsi, klasik agri kesici tablet.', 49.90, null, 'adet', false, 43),
  ('vitamin-ilk-yardim', 'Parol 500 mg 20 Tablet', 'parol-500-mg-20-tablet', 'Parol', '20 tablet', 'Ates ve agriya karsi, parasetamol tablet.', 34.90, null, 'adet', false, 44),
  ('vitamin-ilk-yardim', 'Hansaplast Yara Bandi 20 li', 'hansaplast-yara-bandi-20li', 'Hansaplast', '20li', 'Su gecirmez, cesitli boyda yara bandi.', 49.90, null, 'paket', false, 45),
  ('vitamin-ilk-yardim', 'Vicks Vaporub Merhem 50 ml', 'vicks-vaporub-merhem-50-ml', 'Vicks', '50 ml', 'Bogaz ve gogus icin, mentollu buhar merhemi.', 89.90, null, 'adet', false, 46),
  ('vitamin-ilk-yardim', 'Batticon Antiseptik Solusyon 100 ml', 'batticon-antiseptik-100-ml', 'Batticon', '100 ml', 'Yara temizligi icin, povidon iyot antiseptik.', 54.90, null, 'adet', false, 47),
  ('vitamin-ilk-yardim', 'Nurofen Cold Flu 24 Tablet', 'nurofen-cold-flu-24-tablet', 'Nurofen', '24 tablet', 'Grip ve nezle belirtilerine karsi, kombine tablet.', 79.90, null, 'adet', false, 48),
  ('vitamin-ilk-yardim', 'Solgar Omega 3 60 Softgel', 'solgar-omega-3-60-softgel', 'Solgar', '60 softgel', 'Kalp ve beyin saglgi icin, balik yagi omega 3.', 299.90, null, 'adet', true, 49),
  ('vitamin-ilk-yardim', 'Voltaren Emulgel 50 g', 'voltaren-emulgel-50-g', 'Voltaren', '50 g', 'Kas ve eklem agrilarina karsi, jel formulasyon.', 119.90, null, 'adet', false, 50),
  ('vitamin-ilk-yardim', 'Bepanthol Merhem 30 g', 'bepanthol-merhem-30-g', 'Bepanthol', '30 g', 'Tahris ve pisige karsi, cilt onarici merhem.', 94.90, null, 'adet', false, 51),
  ('vitamin-ilk-yardim', 'Centrum Multivitamin 30 Tablet', 'centrum-multivitamin-30-tablet', 'Centrum', '30 tablet', 'A dan Z ye, komple multivitamin mineral destek.', 269.90, null, 'adet', false, 52),
  ('vitamin-ilk-yardim', 'Vermolix Magnezyum 30 Tablet', 'vermolix-magnezyum-30-tablet', 'Vermolix', '30 tablet', 'Kas ve sinir saglgi icin, magnezyum takviyesi.', 129.90, null, 'adet', false, 53),
  ('vitamin-ilk-yardim', 'Termometre Dijital 1 Adet', 'dijital-termometre-1-adet', 'Dr. Frei', '1 adet', 'Hizli olcum, cocuk ve yetiskin dijital ates olcer.', 89.90, null, 'adet', false, 54),
  ('vitamin-ilk-yardim', 'Steril Gazli Bez 20 li', 'steril-gazli-bez-20li', 'Beromed', '20li', 'Yara pansumani icin, tekli paket steril gazli bez.', 54.90, null, 'paket', false, 55)
on conflict (slug) do nothing;

-- Tek Kullanimlik & Piknik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('tek-kullanimlik-piknik', 'Roll-up Kagit Tabak 22 cm 25 li', 'rollup-kagit-tabak-22cm-25li', 'Roll-up', '25li', 'Piknik ve parti icin, dayanikli beyaz kagit tabak.', 44.90, null, 'paket', true, 40),
  ('tek-kullanimlik-piknik', 'Battal Plastik Bardak 180 ml 50 li', 'plastik-bardak-180ml-50li', 'Roll-up', '50li', 'Su ve mesrubat icin, seffaf tek kullanimlik bardak.', 34.90, null, 'paket', false, 41),
  ('tek-kullanimlik-piknik', 'Plastik Catal Bicak Kasik Set 60 li', 'plastik-catal-kasik-set-60li', 'Roll-up', '60lı', 'Piknik icin, karisik plastik catal bicak kasik seti.', 49.90, null, 'paket', false, 42),
  ('tek-kullanimlik-piknik', 'Alfem Streci Folyo 30 m', 'alfem-streci-folyo-30-m', 'Alfem', '30 m', 'Yiyecekleri saklamak icin, seffaf streci film.', 39.90, null, 'adet', false, 43),
  ('tek-kullanimlik-piknik', 'Alusaf Aluminyum Folyo 30 m', 'alusaf-aluminyum-folyo-30-m', 'Alusaf', '30 m', 'Firin ve saklama icin, dayanikli aluminyum folyo.', 49.90, null, 'adet', false, 44),
  ('tek-kullanimlik-piknik', 'Cimplast Buzdolabi Poseti 100 lu', 'cimplast-buzdolabi-poseti-100lu', 'Cimplast', '100lü', 'Gida saklama icin, kilitli buzdolabi poseti.', 34.90, null, 'paket', false, 45),
  ('tek-kullanimlik-piknik', 'Roll-up Kagit Pecete Kraft 100 lu', 'rollup-kraft-pecete-100lu', 'Roll-up', '100lü', 'Piknik ve mangal icin, kraft renk kagit pecete.', 34.90, null, 'paket', false, 46),
  ('tek-kullanimlik-piknik', 'Comfort Cop Poseti Battal 10 lu', 'comfort-cop-poseti-battal-10lu', 'Comfort', '10lu', 'Kokusuz ve dayanikli, buyuk boy battal cop poseti.', 49.90, 59.90, 'adet', true, 47),
  ('tek-kullanimlik-piknik', 'Plastik Kase 350 ml 25 li', 'plastik-kase-350ml-25li', 'Roll-up', '25li', 'Salata ve tatli icin, seffaf tek kullanimlik kase.', 44.90, null, 'paket', false, 48),
  ('tek-kullanimlik-piknik', 'Battal Karton Bardak 250 ml 25 li', 'karton-bardak-250ml-25li', 'Roll-up', '25li', 'Sicak icecek icin, kaplamali karton bardak.', 49.90, null, 'paket', false, 49),
  ('tek-kullanimlik-piknik', 'Firin Kagidi 8 m', 'firin-kagidi-8-m', 'Alfem', '8 m', 'Yapismaz pisirme icin, silikonlu firin kagidi.', 44.90, null, 'adet', false, 50),
  ('tek-kullanimlik-piknik', 'Comfort Cop Poseti Orta 30 lu', 'comfort-cop-poseti-orta-30lu', 'Comfort', '30lu', 'Mutfak icin, sizdirmaz orta boy cop poseti.', 54.90, null, 'adet', false, 51),
  ('tek-kullanimlik-piknik', 'Piknik Ortusu Tek Kullanimlik 5 li', 'piknik-ortusu-tek-kullanim-5li', 'Roll-up', '5li', 'Masa ve piknik icin, su gecirmez ortu.', 39.90, null, 'paket', false, 52),
  ('tek-kullanimlik-piknik', 'Kagit Karistirici Cubuk 250 li', 'kagit-karistirici-cubuk-250li', 'Roll-up', '250li', 'Sicak icecekler icin, ahsap karistirma cubugu.', 24.90, null, 'paket', false, 53),
  ('tek-kullanimlik-piknik', 'Mum Isitici Rechaud 6 li', 'mum-rechaud-6li', 'Roll-up', '6lı', 'Sofra isitici, uzun yanan rechaud mumu.', 29.90, null, 'paket', false, 54),
  ('tek-kullanimlik-piknik', 'Islak Cop Poseti Buzum Askili 20 li', 'buzum-askili-cop-poseti-20li', 'Cimplast', '20li', 'Askili ve saglam, mutfak tezgahi cop poseti.', 44.90, null, 'adet', false, 55),
  ('tek-kullanimlik-piknik', 'Karton Yemek Kutusu 750 ml 10 lu', 'karton-yemek-kutusu-750ml-10lu', 'Roll-up', '10lu', 'Paket servis icin, kapakli karton yemek kutusu.', 44.90, null, 'paket', false, 56)
on conflict (slug) do nothing;

-- Bebek
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('bebek', 'Prima Bebek Bezi 4 Numara 40 li', 'prima-bebek-bezi-4-40li', 'Prima', '40lı', 'Maxi beden, 12 saat kuru tutan bebek bezi.', 249.90, 299.90, 'adet', true, 40),
  ('bebek', 'Molfix Bebek Bezi 5 Numara 34 lu', 'molfix-bebek-bezi-5-34lu', 'Molfix', '34lu', 'Junior beden, esnek ve emici bebek bezi.', 199.90, null, 'adet', false, 41),
  ('bebek', 'Prima Islak Havlu Hassas 6 li', 'prima-islak-havlu-hassas-6li', 'Prima', '6x54', 'Hassas ciltler icin, kremli bebek islak havlusu.', 149.90, null, 'paket', false, 42),
  ('bebek', 'Bebelac 2 Devam Sutu 900 g', 'bebelac-2-devam-sutu-900-g', 'Bebelac', '900 g', '6 aydan itibaren, devam donemi bebek sutu.', 329.90, null, 'adet', true, 43),
  ('bebek', 'Aptamil 1 Baslangic Sutu 800 g', 'aptamil-1-baslangic-sutu-800-g', 'Aptamil', '800 g', '0-6 ay, baslangic donemi bebek maması.', 349.90, null, 'adet', false, 44),
  ('bebek', 'Milupa Pirincli Kasik Mama 200 g', 'milupa-pirincli-kasik-mama-200-g', 'Milupa', '200 g', 'Ek gida donemi, sutlu pirincli kasik mamasi.', 99.90, null, 'adet', false, 45),
  ('bebek', 'Sebamed Bebek Sampuani 250 ml', 'sebamed-bebek-sampuani-250-ml', 'Sebamed', '250 ml', 'Goz yakmayan, pH dengeli bebek sampuani.', 159.90, null, 'adet', false, 46),
  ('bebek', 'Johnsons Bebek Yagi 200 ml', 'johnsons-bebek-yagi-200-ml', 'Johnsons', '200 ml', 'Cilt bakimi ve masaj icin, hafif bebek yagi.', 94.90, null, 'adet', false, 47),
  ('bebek', 'Prima Bebek Bezi 3 Numara 60 li', 'prima-bebek-bezi-3-60li', 'Prima', '60lı', 'Midi beden, aylik ekonomik paket bebek bezi.', 329.90, null, 'adet', false, 48),
  ('bebek', 'Molfix Bebek Bezi 2 Numara 68 li', 'molfix-bebek-bezi-2-68li', 'Molfix', '68li', 'Mini beden, yenidoganlar icin yumusak bebek bezi.', 269.90, null, 'adet', false, 49),
  ('bebek', 'Uni Baby Bebek Sampuani 700 ml', 'uni-baby-bebek-sampuani-700-ml', 'Uni Baby', '700 ml', 'Goz yakmayan formul, aile boy bebek sampuani.', 119.90, null, 'adet', false, 50),
  ('bebek', 'Hipp Meyve Puresi Elma 125 g', 'hipp-meyve-puresi-elma-125-g', 'Hipp', '125 g', 'Katkisiz organik, ek gida donemi elma puresi.', 44.90, null, 'adet', false, 51),
  ('bebek', 'Sudocrem Pisik Kremi 125 g', 'sudocrem-pisik-kremi-125-g', 'Sudocrem', '125 g', 'Pisik ve tahrise karsi, koruyucu bebek kremi.', 149.90, null, 'adet', false, 52),
  ('bebek', 'Bebelac Biscolac Bebe Biskuvisi 100 g', 'bebelac-biscolac-biskuvi-100-g', 'Bebelac', '100 g', 'Ek gida donemi, sutle hazirlanan bebe biskuvisi.', 54.90, null, 'adet', false, 53),
  ('bebek', 'Canbebe Bebek Bezi 5 Numara 30 lu', 'canbebe-bebek-bezi-5-30lu', 'Canbebe', '30lu', 'Junior beden, ekonomik ve emici bebek bezi.', 149.90, null, 'adet', false, 54),
  ('bebek', 'Chicco Biberon Silikon 250 ml', 'chicco-biberon-silikon-250-ml', 'Chicco', '250 ml', 'Kolic karsiti, dogal emzik uclu biberon.', 179.90, null, 'adet', false, 55),
  ('bebek', 'Pampers Premium Bebek Bezi 4 32 li', 'pampers-premium-bebek-bezi-4-32li', 'Pampers', '32li', 'Ekstra yumusak, hassas cilt premium bebek bezi.', 269.90, null, 'adet', false, 56),
  ('bebek', 'Molped Emzirme Pedi 30 lu', 'molped-emzirme-pedi-30lu', 'Molped', '30lu', 'Emziren anneler icin, emici tek kullanimlik ped.', 69.90, null, 'adet', false, 57)
on conflict (slug) do nothing;

-- Evcil Hayvan
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('evcil-hayvan', 'Whiskas Kuru Kedi Mamasi Tavuk 2 kg', 'whiskas-kuru-kedi-mamasi-tavuk-2-kg', 'Whiskas', '2 kg', 'Yetiskin kediler icin, tavuklu dengeli kuru mama.', 249.90, 299.90, 'adet', true, 40),
  ('evcil-hayvan', 'Felix Yas Kedi Mamasi 85 g 12 li', 'felix-yas-kedi-mamasi-12li', 'Felix', '12x85 g', 'Soslu et parcali, yetiskin kedi yas mama paketi.', 179.90, null, 'paket', false, 41),
  ('evcil-hayvan', 'Pedigree Kuru Kopek Mamasi 3 kg', 'pedigree-kuru-kopek-mamasi-3-kg', 'Pedigree', '3 kg', 'Yetiskin kopekler icin, biftekli tam kuru mama.', 269.90, null, 'adet', true, 42),
  ('evcil-hayvan', 'Friskies Kedi Mamasi Balikli 1,5 kg', 'friskies-kedi-mamasi-balikli-1-5-kg', 'Friskies', '1,5 kg', 'Yetiskin kediler icin, balikli ekonomik kuru mama.', 134.90, null, 'adet', false, 43),
  ('evcil-hayvan', 'Sheba Yas Kedi Mamasi 85 g 6 li', 'sheba-yas-kedi-mamasi-6li', 'Sheba', '6x85 g', 'Tavuk ve hindi, jole icinde kedi yas mamasi.', 119.90, null, 'paket', false, 44),
  ('evcil-hayvan', 'Catsan Kedi Kumu Topaklanan 10 L', 'catsan-kedi-kumu-topaklanan-10-l', 'Catsan', '10 L', 'Koku hapseden, hizli topaklanan bentonit kedi kumu.', 179.90, null, 'adet', true, 45),
  ('evcil-hayvan', 'Purina One Kedi Mamasi Somonlu 1,5 kg', 'purina-one-kedi-mamasi-somon-1-5-kg', 'Purina One', '1,5 kg', 'Somonlu, sindirimi kolay yetiskin kedi mamasi.', 179.90, null, 'adet', false, 46),
  ('evcil-hayvan', 'Pedigree Yas Kopek Mamasi 400 g', 'pedigree-yas-kopek-mamasi-400-g', 'Pedigree', '400 g', 'Etli ve sebzeli, yetiskin kopek yas konservesi.', 44.90, null, 'adet', false, 47),
  ('evcil-hayvan', 'Whiskas Kuru Kedi Mamasi Balikli 500 g', 'whiskas-kuru-kedi-mamasi-balikli-500-g', 'Whiskas', '500 g', 'Balikli, pratik boy yetiskin kedi kuru mamasi.', 74.90, null, 'adet', false, 48),
  ('evcil-hayvan', 'Reflex Kitten Yavru Kedi Mamasi 2 kg', 'reflex-kitten-yavru-kedi-mamasi-2-kg', 'Reflex', '2 kg', 'Yavru kediler icin, tavuklu gelisim mamasi.', 219.90, null, 'adet', false, 49),
  ('evcil-hayvan', 'Dreamies Kedi Odul Mamasi 60 g', 'dreamies-kedi-odul-mamasi-60-g', 'Dreamies', '60 g', 'Ici dolgulu, citir kedi odul atistirmaligi.', 54.90, null, 'adet', false, 50),
  ('evcil-hayvan', 'Proplan Kopek Mamasi Kuzulu 3 kg', 'proplan-kopek-mamasi-kuzulu-3-kg', 'Pro Plan', '3 kg', 'Yetiskin kopekler icin, kuzu etli premium mama.', 329.90, null, 'adet', false, 51),
  ('evcil-hayvan', 'Cat Litter Silika Kedi Kumu 3,8 L', 'silika-kedi-kumu-3-8-l', 'Ever Clean', '3,8 L', 'Koku kontrollu, uzun omurlu silika kedi kumu.', 149.90, null, 'adet', false, 52),
  ('evcil-hayvan', 'Friskies Kopek Mamasi 1,5 kg', 'friskies-kopek-mamasi-1-5-kg', 'Friskies', '1,5 kg', 'Bifteksi tatta, yetiskin kopek kuru mamasi.', 124.90, null, 'adet', false, 53),
  ('evcil-hayvan', 'Reptekedi Balik Yemi Pul 100 ml', 'akvaryum-balik-yemi-pul-100-ml', 'Tetra', '100 ml', 'Tropik akvaryum baliklari icin, pul balik yemi.', 89.90, null, 'adet', false, 54),
  ('evcil-hayvan', 'Versele Muhabbet Kusu Yemi 1 kg', 'versele-muhabbet-kusu-yemi-1-kg', 'Versele', '1 kg', 'Muhabbet kuslari icin, karisik tohumlu kus yemi.', 94.90, null, 'adet', false, 55),
  ('evcil-hayvan', 'Whiskas Temptations Odul 60 g', 'whiskas-temptations-odul-60-g', 'Whiskas', '60 g', 'Disten temizleyen, citir kedi odul mamasi.', 54.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Mangal & Komur
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('mangal-komur', 'Mese Mangal Komuru 2 kg', 'mese-mangal-komuru-2-kg', 'Cinar', '2 kg', 'Uzun sure koz tutan, dogal mese odunu komuru.', 64.90, null, 'adet', true, 40),
  ('mangal-komur', 'Mangal Yakma Jeli 1 L', 'mangal-yakma-jeli-1-l', 'Alev', '1 L', 'Kolay tutusturan, kokusuz mangal yakma jeli.', 99.90, null, 'adet', false, 41),
  ('mangal-komur', 'Cakmakli Mangal Yakma Kubu 32 li', 'mangal-yakma-kubu-32li', 'Alev', '32li', 'Hizli tutusan, is birakmayan mangal yakma kubu.', 49.90, null, 'paket', false, 42),
  ('mangal-komur', 'Briket Komur 3 kg', 'briket-komur-3-kg', 'Cinar', '3 kg', 'Yuksek isili, uzun omurlu sikistirilmis briket komur.', 94.90, null, 'adet', false, 43),
  ('mangal-komur', 'Tasinabilir Karton Mangal Tek Kullanimlik', 'karton-mangal-tek-kullanimlik', 'Piknik', '1 adet', 'Piknik icin pratik, tek kullanimlik izgarali mangal.', 89.90, null, 'adet', true, 44),
  ('mangal-komur', 'Mese Odunu Komuru 10 kg', 'mese-odunu-komuru-10-kg', 'Cinar', '10 kg', 'Aile boy, dugun ve piknik icin dogal mese komuru.', 219.90, null, 'adet', false, 45),
  ('mangal-komur', 'Mangal Korukleyici El Yelpazesi', 'mangal-koruk-yelpaze', 'Piknik', '1 adet', 'Hasir orgu, mangal atesini canlandiran el yelpazesi.', 34.90, null, 'adet', false, 46),
  ('mangal-komur', 'Mangal Yakma Cubugu Odun 1 kg', 'mangal-yakma-cubugu-odun-1-kg', 'Cinar', '1 kg', 'Ince cira, mangal tutusturmaya yardimci cam cubuk.', 44.90, null, 'adet', false, 47),
  ('mangal-komur', 'Mangal Sisi Genis 6 li', 'mangal-sisi-genis-6li', 'Piknik', '6lı', 'Paslanmaz celik, et ve sebze icin genis mangal sisi.', 89.90, null, 'paket', false, 48),
  ('mangal-komur', 'Cakil Komur Cimento Torbasi 8 kg', 'cakil-komur-8-kg', 'Cinar', '8 kg', 'Restoran boy, yuksek verimli dokme mangal komuru.', 179.90, null, 'adet', false, 49),
  ('mangal-komur', 'Mangal Izgara Teli 32 cm', 'mangal-izgara-teli-32-cm', 'Piknik', '32 cm', 'Katlanabilir saplı, cift tarafli mangal izgara teli.', 119.90, null, 'adet', false, 50),
  ('mangal-komur', 'Hindistan Cevizi Komuru 1 kg', 'hindistan-cevizi-komuru-1-kg', 'Cinar', '1 kg', 'Nargile ve mangal icin, kokusuz kokopelet komur.', 74.90, null, 'adet', false, 51),
  ('mangal-komur', 'Mangal Yakma Fani Elektriksiz', 'mangal-yakma-baca', 'Piknik', '1 adet', 'Bacali tutusturucu, komuru hizli yakma silindiri.', 149.90, null, 'adet', false, 52),
  ('mangal-komur', 'Aluminyum Mangal Tepsi 5 li', 'aluminyum-mangal-tepsi-5li', 'Alusaf', '5li', 'Tek kullanimlik, mangal alti aluminyum tepsi.', 44.90, null, 'paket', false, 53),
  ('mangal-komur', 'Mangal Firca Temizleyici', 'mangal-izgara-fircasi', 'Piknik', '1 adet', 'Telli baslik, izgara temizleme mangal fircasi.', 54.90, null, 'adet', false, 54),
  ('mangal-komur', 'Kuru Cira Yakacak 2 kg', 'kuru-cira-yakacak-2-kg', 'Cinar', '2 kg', 'Soba ve mangal tutusturucu, recineli kuru cira.', 54.90, null, 'adet', false, 55)
on conflict (slug) do nothing;

-- Cakmak, Kibrit & Tup
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('cakmak-kibrit-tup', 'Bic Maxi Cakmak 3 lu', 'bic-maxi-cakmak-3lu', 'Bic', '3lu', 'Uzun omurlu, guvenli tutusturmali klasik cakmak.', 59.90, null, 'paket', true, 40),
  ('cakmak-kibrit-tup', 'Tokai Cakmak 5 li', 'tokai-cakmak-5li', 'Tokai', '5li', 'Ekonomik paket, gunluk kullanim tas cakmak.', 39.90, null, 'paket', false, 41),
  ('cakmak-kibrit-tup', 'Kibrit Kutu 10 lu', 'kibrit-kutu-10lu', 'Kav', '10lu', 'Mutfak ve mangal icin, kolay yanan kibrit paketi.', 24.90, null, 'paket', false, 42),
  ('cakmak-kibrit-tup', 'Cakmak Gazi Dolum Tupu 250 ml', 'cakmak-gazi-dolum-250-ml', 'Zenga', '250 ml', 'Cakmak dolumu icin, aritilmis butan cakmak gazi.', 49.90, null, 'adet', false, 43),
  ('cakmak-kibrit-tup', 'Piknik Tupu Kartus 220 g', 'piknik-tupu-kartus-220-g', 'Kamp Gaz', '220 g', 'Kamp ocagi icin, vidali butan piknik gazi kartusu.', 59.90, null, 'adet', true, 44),
  ('cakmak-kibrit-tup', 'Uzun Puro Cakmagi Ocak Yakma', 'uzun-mutfak-cakmagi', 'Zenga', '1 adet', 'Ocak ve mangal icin, uzun uclu mutfak cakmagi.', 54.90, null, 'adet', false, 45),
  ('cakmak-kibrit-tup', 'Piezo Ocak Cakmagi Kivilcimli', 'piezo-ocak-cakmagi', 'Zenga', '1 adet', 'Gazsiz, kivilcimli ocak tutusturucu mutfak cakmagi.', 44.90, null, 'adet', false, 46),
  ('cakmak-kibrit-tup', 'Kamp Tupu 450 g Vidali', 'kamp-tupu-450-g-vidali', 'Kamp Gaz', '450 g', 'Kamp ve piknik ocagi icin, buyuk boy vidali tup.', 89.90, null, 'adet', false, 47),
  ('cakmak-kibrit-tup', 'Sofben Cakmak Pili Ateşleyici', 'sofben-cakmak-pili', 'Zenga', '2li', 'Sofben ve ocak icin, otomatik ateşleme cakmagi.', 34.90, null, 'paket', false, 48),
  ('cakmak-kibrit-tup', 'Kibrit Soba Uzun 45 li', 'uzun-soba-kibriti-45li', 'Kav', '45li', 'Soba ve sömine icin, uzun boy guvenli kibrit.', 29.90, null, 'paket', false, 49),
  ('cakmak-kibrit-tup', 'Cakmak Tasi Yedek 9 lu', 'cakmak-tasi-yedek-9lu', 'Zenga', '9lu', 'Benzinli ve tas cakmaklar icin, yedek cakmak tasi.', 24.90, null, 'paket', false, 50),
  ('cakmak-kibrit-tup', 'Bic Mini Cakmak 5 li', 'bic-mini-cakmak-5li', 'Bic', '5li', 'Cepte tasinabilir, kucuk boy guvenli cakmak.', 74.90, null, 'paket', false, 51),
  ('cakmak-kibrit-tup', 'Kamp Gaz Isitici Aparat', 'kamp-gaz-isitici-aparat', 'Kamp Gaz', '1 adet', 'Piknik tupune takilan, sofra usti gaz ocak baslik.', 149.90, null, 'adet', false, 52),
  ('cakmak-kibrit-tup', 'Firin Cakmagi Elektronik', 'firin-cakmagi-elektronik', 'Zenga', '1 adet', 'Firin ve ocak icin, pilli elektronik ateşleyici.', 54.90, null, 'adet', false, 53),
  ('cakmak-kibrit-tup', 'Yangin Cakmagi Su Geciren 2 li', 'su-geciren-cakmak-2li', 'Zenga', '2li', 'Ruzgar ve suya dayanikli, kamp icin cakmak.', 59.90, null, 'paket', false, 54),
  ('cakmak-kibrit-tup', 'Tupas Sanayi Tupu Adaptoru', 'sanayi-tupu-adaptoru', 'Zenga', '1 adet', 'Piknik tupunu ocaga baglayan, guvenli adaptor hortum.', 89.90, null, 'adet', false, 55)
on conflict (slug) do nothing;

-- Sarj Aleti & Pil
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sarj-aleti-pil', 'Duracell Kalem Pil AA 4 lu', 'duracell-kalem-pil-aa-4lu', 'Duracell', '4lu', 'Uzun omurlu, oyuncak ve kumanda icin AA alkalin pil.', 89.90, 109.90, 'paket', true, 40),
  ('sarj-aleti-pil', 'Duracell Ince Kalem Pil AAA 4 lu', 'duracell-ince-pil-aaa-4lu', 'Duracell', '4lu', 'Kumanda ve saat icin, uzun omurlu AAA alkalin pil.', 89.90, null, 'paket', false, 41),
  ('sarj-aleti-pil', 'Varta 9V Pil Tekli', 'varta-9v-pil-tekli', 'Varta', '1 adet', 'Duman dedektoru ve oyuncak icin, 9 volt alkalin pil.', 54.90, null, 'adet', false, 42),
  ('sarj-aleti-pil', 'Anker USB Sarj Aleti 20W', 'anker-usb-sarj-aleti-20w', 'Anker', '20W', 'Hizli sarj, telefon ve tablet icin USB-C adaptor.', 299.90, 349.90, 'adet', true, 43),
  ('sarj-aleti-pil', 'USB-C Sarj Kablosu 2 m', 'usb-c-sarj-kablosu-2-m', 'Anker', '2 m', 'Dayanikli orgu kaplama, hizli veri ve sarj kablosu.', 159.90, null, 'adet', false, 44),
  ('sarj-aleti-pil', 'Lightning Sarj Kablosu 1 m', 'lightning-sarj-kablosu-1-m', 'Anker', '1 m', 'iPhone uyumlu, dayanikli hizli sarj kablosu.', 129.90, null, 'adet', false, 45),
  ('sarj-aleti-pil', 'Powerbank 26800 mAh', 'powerbank-26800-mah', 'Anker', '26800 mAh', 'Cift cikisli, telefon ve tablet icin tasinabilir sarj.', 949.90, null, 'adet', true, 46),
  ('sarj-aleti-pil', 'Varta Dugme Pil CR2032 2 li', 'varta-dugme-pil-cr2032-2li', 'Varta', '2li', 'Terazi ve saat icin, lityum dugme pil.', 49.90, null, 'paket', false, 47),
  ('sarj-aleti-pil', 'Duracell Sarj Edilebilir Pil AA 2 li', 'duracell-sarj-pil-aa-2li', 'Duracell', '2li', 'Tekrar sarjli, ekonomik NiMH AA sarjli pil.', 149.90, null, 'paket', false, 48),
  ('sarj-aleti-pil', 'Araba Sarj Adaptoru Cift USB', 'araba-sarj-adaptoru-cift-usb', 'Anker', '1 adet', 'Cakmakliktan hizli sarj, cift USB araba adaptoru.', 179.90, null, 'adet', false, 49),
  ('sarj-aleti-pil', 'Micro USB Kablo 1 m', 'micro-usb-kablo-1-m', 'Anker', '1 m', 'Eski model telefon ve cihazlar icin sarj kablosu.', 89.90, null, 'adet', false, 50),
  ('sarj-aleti-pil', 'Duracell Kalem Pil AA 8 li', 'duracell-kalem-pil-aa-8li', 'Duracell', '8li', 'Ekonomik paket, cok kullanimlik AA alkalin pil.', 159.90, null, 'paket', false, 51),
  ('sarj-aleti-pil', 'Kablosuz Sarj Standi 15W', 'kablosuz-sarj-standi-15w', 'Anker', '15W', 'Masaustu, telefon icin hizli kablosuz sarj standi.', 349.90, null, 'adet', false, 52),
  ('sarj-aleti-pil', 'Varta Isitma Cihazi Pil D 2 li', 'varta-buyuk-pil-d-2li', 'Varta', '2li', 'El feneri ve buyuk cihaz icin, D boy alkalin pil.', 74.90, null, 'paket', false, 53),
  ('sarj-aleti-pil', 'USB Cogaltici Hub 4 Port', 'usb-hub-4-port', 'Anker', '4 port', 'Bilgisayar icin, 4 girisli tak calistir USB cogaltici.', 249.90, null, 'adet', false, 54),
  ('sarj-aleti-pil', 'Pil Sarj Cihazi 4 lu Yuva', 'pil-sarj-cihazi-4lu', 'Varta', '4 yuva', 'AA ve AAA pil icin, gostergeli hizli pil sarj cihazi.', 299.90, null, 'adet', false, 55)
on conflict (slug) do nothing;

-- Plaj, Mayo & Terlik
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('plaj-mayo-terlik', 'Parmak Arasi Terlik Erkek', 'parmak-arasi-terlik-erkek', 'Wave', '1 cift', 'Plaj ve havuz icin, kaydirmaz erkek parmak arasi terlik.', 149.90, 199.90, 'adet', true, 40),
  ('plaj-mayo-terlik', 'Parmak Arasi Terlik Kadin', 'parmak-arasi-terlik-kadin', 'Wave', '1 cift', 'Rahat tabanli, plaj icin kadin parmak arasi terlik.', 149.90, null, 'adet', false, 41),
  ('plaj-mayo-terlik', 'Cocuk Deniz Ayakkabisi', 'cocuk-deniz-ayakkabisi', 'Wave', '1 cift', 'Kayalik plajlarda ayagi koruyan, cocuk deniz ayakkabisi.', 119.90, null, 'adet', false, 42),
  ('plaj-mayo-terlik', 'Plaj Havlusu Buyuk Boy', 'plaj-havlusu-buyuk-boy', 'Ozdilek', '1 adet', 'Emici pamuklu, hizli kuruyan buyuk boy plaj havlusu.', 199.90, null, 'adet', true, 43),
  ('plaj-mayo-terlik', 'Deniz Gozlugu Yetiskin', 'deniz-gozlugu-yetiskin', 'Wave', '1 adet', 'Buğu yapmayan, ayarlanabilir yetiskin yuzme gozlugu.', 129.90, null, 'adet', false, 44),
  ('plaj-mayo-terlik', 'Su Gecirmez Telefon Kilifi Universal', 'su-gecirmez-telefon-kilifi-universal', 'Wave', '1 adet', 'Havuz ve deniz icin, boyun askili su gecirmez kilif.', 89.90, null, 'adet', false, 45),
  ('plaj-mayo-terlik', 'Plaj Terligi Slide Erkek', 'plaj-terligi-slide-erkek', 'Wave', '1 cift', 'Bantli tasarim, havuz ve plaj icin slide terlik.', 179.90, null, 'adet', false, 46),
  ('plaj-mayo-terlik', 'Kadin Mayo Bikini Takim', 'kadin-bikini-takim', 'Marina', '1 takim', 'Yaz plajlari icin, sik ve rahat kadin bikini takimi.', 299.90, null, 'adet', false, 47),
  ('plaj-mayo-terlik', 'Erkek Desenli Deniz Sortu', 'erkek-deniz-sortu-desenli', 'Marina', '1 adet', 'Hizli kuruyan kumas, baglamali erkek deniz sortu.', 199.90, null, 'adet', false, 48),
  ('plaj-mayo-terlik', 'Yuzme Kepi Silikon', 'yuzme-kepi-silikon', 'Wave', '1 adet', 'Saci koruyan, esnek silikon yuzme bonesi.', 59.90, null, 'adet', false, 49),
  ('plaj-mayo-terlik', 'Plaj Sandaleti Kadin', 'plaj-sandaleti-kadin', 'Wave', '1 cift', 'Rahat tabanli, gunluk kullanim kadin plaj sandaleti.', 189.90, null, 'adet', false, 50),
  ('plaj-mayo-terlik', 'Cocuk Mayo Sortu', 'cocuk-mayo-sortu', 'Marina', '1 adet', 'UV korumali kumas, cocuk deniz mayo sortu.', 129.90, null, 'adet', false, 51),
  ('plaj-mayo-terlik', 'Plaj Cantasi Hasir', 'plaj-cantasi-hasir', 'Marina', '1 adet', 'Genis hacimli, omuz askili hasir plaj cantasi.', 179.90, null, 'adet', false, 52),
  ('plaj-mayo-terlik', 'Deniz Patigi Kadin', 'deniz-patigi-kadin', 'Wave', '1 cift', 'Kayalik zeminler icin, kaymaz tabanli kadin deniz patigi.', 109.90, null, 'adet', false, 53),
  ('plaj-mayo-terlik', 'Burun Klipsi ve Kulak Tikaci Set', 'burun-klips-kulak-tikaci-set', 'Wave', '1 set', 'Yuzucu icin, silikon burun klipsi ve kulak tikaci.', 49.90, null, 'adet', false, 54),
  ('plaj-mayo-terlik', 'Plaj Sapkasi Genis Kenar', 'plaj-sapkasi-genis-kenar', 'Marina', '1 adet', 'Gunes koruyan, genis kenarli hasir plaj sapkasi.', 149.90, null, 'adet', false, 55),
  ('plaj-mayo-terlik', 'Havlu Bornoz Cocuk', 'havlu-bornoz-cocuk', 'Ozdilek', '1 adet', 'Emici pamuklu, kapsonlu cocuk plaj bornozu.', 219.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Gunes Kremi & Plaj
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('gunes-kremi-plaj', 'Nivea Sun Gunes Kremi SPF50 200 ml', 'nivea-sun-gunes-kremi-spf50-200-ml', 'Nivea', '200 ml', 'Yuksek koruma, su ve tere dayanikli SPF50 gunes kremi.', 219.90, 259.90, 'adet', true, 40),
  ('gunes-kremi-plaj', 'La Roche-Posay Anthelios SPF50 50 ml', 'laroche-anthelios-spf50-50-ml', 'La Roche-Posay', '50 ml', 'Hassas ciltler icin, yuz gunes koruyucu SPF50.', 449.90, null, 'adet', false, 41),
  ('gunes-kremi-plaj', 'Sundance Cocuk Gunes Spreyi SPF50 200 ml', 'sundance-cocuk-gunes-spreyi-spf50-200-ml', 'Sundance', '200 ml', 'Cocuklar icin, kolay surulen sprey gunes koruyucu.', 179.90, null, 'adet', true, 42),
  ('gunes-kremi-plaj', 'Bioderma Photoderm SPF50 40 ml', 'bioderma-photoderm-spf50-40-ml', 'Bioderma', '40 ml', 'Yuz icin hafif dokulu, yuksek korumali gunes kremi.', 399.90, null, 'adet', false, 43),
  ('gunes-kremi-plaj', 'Nivea Gunes Sonrasi Bakim Jeli 200 ml', 'nivea-gunes-sonrasi-jel-200-ml', 'Nivea', '200 ml', 'Yanan cildi serinleten, aloe veralı gunes sonrasi jel.', 149.90, null, 'adet', false, 44),
  ('gunes-kremi-plaj', 'Sundance Gunes Yagi SPF6 150 ml', 'sundance-gunes-yagi-spf6-150-ml', 'Sundance', '150 ml', 'Bronzlasma icin, dusuk faktorlu gunes bakim yagi.', 119.90, null, 'adet', false, 45),
  ('gunes-kremi-plaj', 'Eucerin Sun Oil Control SPF50 50 ml', 'eucerin-sun-oil-control-spf50-50-ml', 'Eucerin', '50 ml', 'Yagli ciltler icin, matlastirici yuz gunes koruyucu.', 429.90, null, 'adet', false, 46),
  ('gunes-kremi-plaj', 'Nivea Sun Roll On SPF30 65 ml', 'nivea-sun-roll-on-spf30-65-ml', 'Nivea', '65 ml', 'Cepte tasinabilir, pratik roll-on gunes koruyucu.', 129.90, null, 'adet', false, 47),
  ('gunes-kremi-plaj', 'Vichy Capital Soleil SPF50 50 ml', 'vichy-capital-soleil-spf50-50-ml', 'Vichy', '50 ml', 'Su tutan formul, yuz ve vucut gunes koruyucu.', 389.90, null, 'adet', false, 48),
  ('gunes-kremi-plaj', 'Sundance Aftersun Losyon 250 ml', 'sundance-aftersun-losyon-250-ml', 'Sundance', '250 ml', 'Gunes sonrasi, nemlendiren serinletici bakim losyonu.', 134.90, null, 'adet', false, 49),
  ('gunes-kremi-plaj', 'Bioblas Gunes Spreyi SPF30 200 ml', 'bioblas-gunes-spreyi-spf30-200-ml', 'Bioblas', '200 ml', 'Kolay yayilan, orta korumali gunes koruma spreyi.', 149.90, null, 'adet', false, 50),
  ('gunes-kremi-plaj', 'Nivea Sun Cocuk Kremi SPF50 150 ml', 'nivea-sun-cocuk-kremi-spf50-150-ml', 'Nivea', '150 ml', 'Hassas cocuk cildi icin, cok yuksek korumali gunes kremi.', 199.90, null, 'adet', false, 51),
  ('gunes-kremi-plaj', 'Garnier Ambre Solaire SPF50 200 ml', 'garnier-ambre-solaire-spf50-200-ml', 'Garnier', '200 ml', 'Hizli emilen, su dostu vucut gunes koruyucu.', 229.90, null, 'adet', false, 52),
  ('gunes-kremi-plaj', 'Sundance Dudak Koruyucu SPF30', 'sundance-dudak-koruyucu-spf30', 'Sundance', '1 adet', 'Dudaklari gunese karsi koruyan, bakim stick.', 59.90, null, 'adet', false, 53),
  ('gunes-kremi-plaj', 'Isdin Fotoprotector SPF50 50 ml', 'isdin-fotoprotector-spf50-50-ml', 'Isdin', '50 ml', 'Su jeli dokulu, hafif yuz gunes koruyucu.', 369.90, null, 'adet', false, 54),
  ('gunes-kremi-plaj', 'Nivea Bronzlastirici Losyon SPF20 200 ml', 'nivea-bronzlastirici-losyon-spf20-200-ml', 'Nivea', '200 ml', 'Bronzlugu destekleyen, orta faktorlu vucut losyonu.', 179.90, null, 'adet', false, 55)
on conflict (slug) do nothing;

-- Sisme Bot & Havuz
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sisme-bot-havuz', 'Intex Sisme Havuz 262x175 cm', 'intex-sisme-havuz-262x175-cm', 'Intex', '262x175 cm', 'Bahce icin, dayanikli uc halkali aile sisme havuzu.', 449.90, 549.90, 'adet', true, 40),
  ('sisme-bot-havuz', 'Intex Sisme Kolluk Cocuk 2 li', 'intex-sisme-kolluk-cocuk-2li', 'Intex', '2li', 'Cocuklar icin, guvenli yuzme ogrenme kollugu.', 49.90, null, 'paket', false, 41),
  ('sisme-bot-havuz', 'Bestway Sisme Deniz Yatagi', 'bestway-sisme-deniz-yatagi', 'Bestway', '1 adet', 'Havuz ve deniz icin, yastikli sisme deniz yatagi.', 179.90, null, 'adet', true, 42),
  ('sisme-bot-havuz', 'Intex Simit Can Simidi 76 cm', 'intex-can-simidi-76-cm', 'Intex', '76 cm', 'Yetiskin icin, dayanikli sisme yuzme simidi.', 89.90, null, 'adet', false, 43),
  ('sisme-bot-havuz', 'Sisme Havuz Pompasi El Tipi', 'sisme-havuz-pompasi-el', 'Intex', '1 adet', 'Cift yonlu, hizli sisiren el tipi pompa.', 149.90, null, 'adet', false, 44),
  ('sisme-bot-havuz', 'Bestway Cocuk Havuzu 152 cm', 'bestway-cocuk-havuzu-152-cm', 'Bestway', '152 cm', 'Bahce ve balkon icin, kucuk boy cocuk havuzu.', 199.90, null, 'adet', false, 45),
  ('sisme-bot-havuz', 'Intex Sisme Top Plaj 51 cm', 'intex-sisme-top-plaj-51-cm', 'Intex', '51 cm', 'Havuz ve plaj oyunu icin, renkli sisme top.', 34.90, null, 'adet', false, 46),
  ('sisme-bot-havuz', 'Sisme Yunuslu Binek Cocuk', 'sisme-yunuslu-binek-cocuk', 'Bestway', '1 adet', 'Havuzda binilebilen, tutamacli yunus figuru.', 149.90, null, 'adet', false, 47),
  ('sisme-bot-havuz', 'Intex Deniz Yatagi Sirt Dayamali', 'intex-deniz-yatagi-sirt-dayamali', 'Intex', '1 adet', 'Havuzda dinlenmek icin, sirt destekli sisme koltuk.', 219.90, null, 'adet', false, 48),
  ('sisme-bot-havuz', 'Bestway Havuz Sisme Klor Tableti Sepeti', 'havuz-klor-sepeti', 'Bestway', '1 adet', 'Havuz suyu icin, yuzen klor tableti dagitici sepet.', 89.90, null, 'adet', false, 49),
  ('sisme-bot-havuz', 'Intex Sisme Bot 2 Kisilik', 'intex-sisme-bot-2-kisilik', 'Intex', '2 kisilik', 'Golde ve denizde, kurekli iki kisilik sisme bot.', 649.90, null, 'adet', true, 50),
  ('sisme-bot-havuz', 'Sisme Kayik Kureği Plastik 2 li', 'sisme-bot-kurek-2li', 'Intex', '2li', 'Sisme bot icin, hafif plastik kurek seti.', 129.90, null, 'paket', false, 51),
  ('sisme-bot-havuz', 'Havuz Suzgeci Kepce', 'havuz-suzge-kepce', 'Bestway', '1 adet', 'Havuz yuzeyi temizligi icin, saplı yaprak suzgeci.', 119.90, null, 'adet', false, 52),
  ('sisme-bot-havuz', 'Intex Bebek Havuzu 3 Halkali', 'intex-bebek-havuzu-3-halkali', 'Intex', '1 adet', 'Golgelikli, bebekler icin kucuk sisme havuz.', 149.90, null, 'adet', false, 53),
  ('sisme-bot-havuz', 'Sisme Yuzuk Halka Atma Oyunu', 'sisme-halka-atma-oyunu', 'Bestway', '1 set', 'Havuz ici eglence, sisme halka atma oyun seti.', 79.90, null, 'adet', false, 54),
  ('sisme-bot-havuz', 'Havuz Ortu Brandasi 305 cm', 'havuz-ortu-brandasi-305-cm', 'Intex', '305 cm', 'Havuz ustu koruma, toz tutmayan branda ortu.', 159.90, null, 'adet', false, 55),
  ('sisme-bot-havuz', 'Sisme Koltuk Bardaklikli', 'sisme-koltuk-bardaklikli', 'Bestway', '1 adet', 'Havuzda serinlemek icin, bardaklikli sisme koltuk.', 189.90, null, 'adet', false, 56)
on conflict (slug) do nothing;

-- Sinek & Bocek Kovucu
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  ('sinek-bocek-kovucu', 'Baygon Sinek Ilaci Sprey 400 ml', 'baygon-sinek-ilaci-sprey-400-ml', 'Baygon', '400 ml', 'Sinek ve sivrisinege karsi, hizli etkili sprey.', 94.90, 119.90, 'adet', true, 40),
  ('sinek-bocek-kovucu', 'Raid Elektrikli Sivrisinek Kovucu Set', 'raid-elektrikli-kovucu-set', 'Raid', '1 set', 'Fisli cihaz ve sivi, kokusuz sivrisinek kovucu.', 129.90, null, 'adet', true, 41),
  ('sinek-bocek-kovucu', 'Off Sivrisinek Kovucu Losyon 100 ml', 'off-sivrisinek-losyon-100-ml', 'Off', '100 ml', 'Cilde surulen, uzun sureli sivrisinek kovucu losyon.', 89.90, null, 'adet', false, 42),
  ('sinek-bocek-kovucu', 'Raid Kagit Sinek Tuzagi 4 lu', 'raid-sinek-tuzagi-4lu', 'Raid', '4lu', 'Mutfak icin, yapiskan asili sinek tuzagi.', 44.90, null, 'paket', false, 43),
  ('sinek-bocek-kovucu', 'Baygon Karinca Jeli 30 g', 'baygon-karinca-jeli-30-g', 'Baygon', '30 g', 'Karinca yuvasina karsi, uzun etkili sürme jel.', 79.90, null, 'adet', false, 44),
  ('sinek-bocek-kovucu', 'Off Elektrikli Kovucu Yedek Sivi 45 ml', 'off-elektrikli-yedek-sivi-45-ml', 'Off', '45 ml', 'Elektrikli cihaz icin, uzun omurlu yedek kovucu sivi.', 59.90, null, 'adet', false, 45),
  ('sinek-bocek-kovucu', 'Raid Hamambocegi Sprey 300 ml', 'raid-hamambocegi-sprey-300-ml', 'Raid', '300 ml', 'Hamambocegi ve karincaya karsi, kalici etkili sprey.', 99.90, null, 'adet', false, 46),
  ('sinek-bocek-kovucu', 'Baygon Elektrikli Tablet 30 lu', 'baygon-elektrikli-tablet-30lu', 'Baygon', '30lu', 'Cihaza takilan, gece boyu koruyan kovucu tablet.', 54.90, null, 'paket', false, 47),
  ('sinek-bocek-kovucu', 'Sivrisinek Kovucu Bileklik 4 lu', 'sivrisinek-kovucu-bileklik-4lu', 'Off', '4lu', 'Cocuk ve yetiskin icin, dogal kokulu kovucu bileklik.', 49.90, null, 'paket', false, 48),
  ('sinek-bocek-kovucu', 'Raid Guve Kovucu Asili 20 li', 'raid-guve-kovucu-asili-20li', 'Raid', '20li', 'Dolap ici, giysileri guveden koruyan asili tablet.', 59.90, null, 'paket', false, 49),
  ('sinek-bocek-kovucu', 'Off Fatih Sinek Spreyi Acik Alan 200 ml', 'off-acik-alan-sprey-200-ml', 'Off', '200 ml', 'Bahce ve piknik icin, cilde sikilan kovucu sprey.', 94.90, null, 'adet', false, 50),
  ('sinek-bocek-kovucu', 'Baygon Ucan Bocek Sprey Kokusuz 300 ml', 'baygon-ucan-bocek-sprey-300-ml', 'Baygon', '300 ml', 'Sinek ve sivrisinege karsi, kokusuz formul sprey.', 89.90, null, 'adet', false, 51),
  ('sinek-bocek-kovucu', 'Cibinlik Sinek Agi Tekli', 'cibinlik-sinek-agi', 'Ev Life', '1 adet', 'Yatak ustu asilan, sivrisinege karsi cibinlik agi.', 149.90, null, 'adet', false, 52),
  ('sinek-bocek-kovucu', 'Pencere Sinekligi Cirtli 130x150 cm', 'pencere-sinekligi-cirtli-130x150-cm', 'Ev Life', '130x150 cm', 'Pencereye takilan, cirt bantli kesilebilir sineklik.', 89.90, null, 'adet', false, 53),
  ('sinek-bocek-kovucu', 'Raid Fare Yapiskani 2 li', 'raid-fare-yapiskani-2li', 'Raid', '2li', 'Fare ve kemirgene karsi, guclu yapiskan tuzak.', 54.90, null, 'paket', false, 54),
  ('sinek-bocek-kovucu', 'Off Kamp Kovucu Spiral 10 lu', 'off-kamp-kovucu-spiral-10lu', 'Off', '10lu', 'Bahce ve kamp icin, tutusturmali sivrisinek spirali.', 39.90, null, 'paket', false, 55)
on conflict (slug) do nothing;
