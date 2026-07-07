-- ============================================================
-- Yeni Mahalle Market: Ev & Yasam kategorisi seed'i
-- "sigara-tutun" kaldirildi, yerine "ev-yasam" geldi
-- (lib/shop/categories.ts ile ayni: tint 1, icon lamp, sort 22).
-- Bu dosya once kategoriyi (yoksa) ekler, ardindan 45 gercekci
-- Ev & Yasam urunu ekler (Getir Ev & Yasam mantigi):
--   bardak & sofra, mutfak gerecleri, saklama, ev gerecleri.
-- Diger kategorilerle cakisan urun YOK (pil, cakmak/kibrit,
-- folyo/strec/poset, temizlik, tek kullanimlik tabak/bardak yok).
--
-- Kolon sirasi mevcut seed ile BIREBIR AYNI:
--   (category_slug, name, slug, brand, size_text, description,
--    price, compare_at_price, unit, is_featured, sort)
-- compare_at_price HER ZAMAN null (indirim yok).
-- Sort degerleri 4000+dan baslar (mevcut degerlerle cakismaz).
-- Idempotent: on conflict (slug) do nothing.
-- ============================================================

-- Ev & Yasam kategorisi (products.category_slug FK icin sart)
insert into public.shop_categories (slug, name, tint, icon, sort, is_orderable) values
  ('ev-yasam', 'Ev & Yaşam', 1, 'lamp', 22, true)
on conflict (slug) do nothing;

-- Ev & Yasam urunleri (45 adet)
insert into public.products (category_slug, name, slug, brand, size_text, description, price, compare_at_price, unit, is_featured, sort) values
  -- Bardak & Sofra
  ('ev-yasam', 'Paşabahçe Su Bardağı 6''lı', 'pasabahce-su-bardagi-6li', 'Paşabahçe', '6x290 ml', 'Günlük kullanıma uygun, bulaşık makinesinde yıkanabilir cam su bardağı seti.', 149.90, null, 'paket', true, 4000),
  ('ev-yasam', 'LAV Çay Bardağı 6''lı', 'lav-cay-bardagi-6li', 'LAV', '6x155 ml', 'Klasik ince belli formda, dayanıklı cam çay bardağı seti.', 119.90, null, 'paket', false, 4001),
  ('ev-yasam', 'Paşabahçe Çay Tabağı 6''lı', 'pasabahce-cay-tabagi-6li', 'Paşabahçe', '6 adet', 'Çay bardaklarıyla uyumlu, sade cam çay tabağı seti.', 89.90, null, 'paket', false, 4002),
  ('ev-yasam', 'LAV Meşrubat Bardağı 3''lü', 'lav-mesrubat-bardagi-3lu', 'LAV', '3x365 ml', 'Soğuk içecekler için geniş hacimli cam meşrubat bardağı seti.', 99.90, null, 'paket', false, 4003),
  ('ev-yasam', 'Kütahya Porselen Kupa 300 ml', 'kutahya-porselen-kupa-300-ml', 'Kütahya Porselen', '300 ml', 'Kahve ve bitki çayları için kulplu beyaz porselen kupa.', 119.90, null, 'adet', false, 4004),
  ('ev-yasam', 'Kütahya Porselen Türk Kahvesi Fincan Takımı 4 Parça', 'kutahya-porselen-kahve-fincan-takimi-4-parca', 'Kütahya Porselen', '2 fincan + 2 tabak', 'İki kişilik, tabaklı porselen Türk kahvesi fincan takımı.', 299.90, null, 'paket', false, 4005),
  ('ev-yasam', 'Paşabahçe Cam Sürahi 1,7 L', 'pasabahce-cam-surahi-1-7-l', 'Paşabahçe', '1,7 L', 'Sofrada su ve limonata servisi için kapaklı cam sürahi.', 189.90, null, 'adet', false, 4006),
  ('ev-yasam', 'Kütahya Porselen Yemek Tabağı 6''lı 26 cm', 'kutahya-porselen-yemek-tabagi-6li', 'Kütahya Porselen', '6x26 cm', 'Günlük sofralar için dayanıklı beyaz porselen servis tabağı seti.', 449.90, null, 'paket', false, 4007),
  ('ev-yasam', 'Paşabahçe Cam Kase 2''li', 'pasabahce-cam-kase-2li', 'Paşabahçe', '2x14 cm', 'Çorba, salata ve tatlı servisi için iki parça cam kase.', 129.90, null, 'paket', false, 4008),
  ('ev-yasam', 'Emsan Çatal Kaşık Bıçak Seti 24 Parça', 'emsan-catal-kasik-bicak-seti-24-parca', 'Emsan', '24 parça', 'Altı kişilik, paslanmaz çelik çatal kaşık bıçak takımı.', 649.90, null, 'paket', false, 4009),
  -- Mutfak Gerecleri
  ('ev-yasam', 'Bambu Doğrama Tahtası Büyük Boy', 'bambu-dograma-tahtasi-buyuk-boy', '', '35x25 cm', 'Sebze ve ekmek doğramak için dayanıklı bambu kesme tahtası.', 179.90, null, 'adet', false, 4010),
  ('ev-yasam', 'Emsan 4 Yüzlü Rende', 'emsan-4-yuzlu-rende', 'Emsan', '4 yüzlü', 'Kalın, ince, toz ve dilim rendeleme yapan paslanmaz mutfak rendesi.', 149.90, null, 'adet', false, 4011),
  ('ev-yasam', 'Paslanmaz Sebze Soyacağı', 'paslanmaz-sebze-soyacagi', '', '1 adet', 'Patates ve havuç soymayı kolaylaştıran paslanmaz çelik soyacak.', 49.90, null, 'adet', false, 4012),
  ('ev-yasam', 'Paslanmaz Konserve Açacağı', 'paslanmaz-konserve-acacagi', '', '1 adet', 'Konserve ve şişe kapaklarını zahmetsiz açan pratik açacak.', 69.90, null, 'adet', false, 4013),
  ('ev-yasam', 'Plastik Huni Seti 3''lü', 'plastik-huni-seti-3lu', '', '3 boy', 'Sıvı ve kuru gıda aktarımı için üç farklı boy plastik huni.', 44.90, null, 'paket', false, 4014),
  ('ev-yasam', 'Paslanmaz Süzgeç 22 cm', 'paslanmaz-suzgec-22-cm', '', '22 cm', 'Makarna ve sebze süzmek için kulplu paslanmaz çelik süzgeç.', 129.90, null, 'adet', false, 4015),
  ('ev-yasam', 'Paslanmaz Tel Çırpıcı', 'paslanmaz-tel-cirpici', '', '30 cm', 'Yumurta ve krema çırpmak için ergonomik saplı çelik çırpıcı.', 79.90, null, 'adet', false, 4016),
  ('ev-yasam', 'Silikon Spatula Seti 2''li', 'silikon-spatula-seti-2li', '', '2 adet', 'Isıya dayanıklı, tavaları çizmeyen silikon spatula seti.', 99.90, null, 'paket', false, 4017),
  ('ev-yasam', 'Naylon Makarna Kepçesi', 'naylon-makarna-kepcesi', '', '1 adet', 'Haşlanmış makarnayı süzerek servis eden dişli mutfak kepçesi.', 59.90, null, 'adet', false, 4018),
  ('ev-yasam', 'Tefal Titanium Tava 26 cm', 'tefal-titanium-tava-26-cm', 'Tefal', '26 cm', 'Titanyum yapışmaz kaplamalı, sıcaklık göstergeli kızartma tavası.', 799.90, null, 'adet', true, 4019),
  ('ev-yasam', 'Karaca Granit Tencere 24 cm', 'karaca-granit-tencere-24-cm', 'Karaca', '24 cm', 'Granit kaplamalı, cam kapaklı ve her ocağa uygun derin tencere.', 899.90, null, 'adet', true, 4020),
  ('ev-yasam', 'Emsan Çelik Çaydanlık Seti', 'emsan-celik-caydanlik-seti', 'Emsan', '2 parça', 'İndüksiyon dahil tüm ocaklara uygun paslanmaz çelik çaydanlık takımı.', 699.90, null, 'adet', true, 4021),
  ('ev-yasam', 'Emsan Çelik Cezve No 2', 'emsan-celik-cezve-no-2', 'Emsan', '2 kişilik', 'İki kişilik, paslanmaz çelik gövdeli Türk kahvesi cezvesi.', 169.90, null, 'adet', false, 4022),
  ('ev-yasam', 'Sinbo Dijital Mutfak Tartısı', 'sinbo-dijital-mutfak-tartisi', 'Sinbo', '5 kg', 'Gram hassasiyetli, dara fonksiyonlu dijital mutfak terazisi.', 299.90, null, 'adet', false, 4023),
  ('ev-yasam', 'Paslanmaz Çelik Termos 1 L', 'paslanmaz-celik-termos-1-l', '', '1 L', 'Sıcak içecekleri saatlerce koruyan çift cidarlı çelik termos.', 349.90, null, 'adet', false, 4024),
  ('ev-yasam', 'Tritan Matara 750 ml', 'tritan-matara-750-ml', '', '750 ml', 'Okul ve spor için hafif, BPA içermeyen kapaklı su matarası.', 149.90, null, 'adet', false, 4025),
  ('ev-yasam', 'Paslanmaz Mutfak Makası', 'paslanmaz-mutfak-makasi', '', '21 cm', 'Et ve sebze kesimine uygun, ergonomik saplı paslanmaz mutfak makası.', 99.90, null, 'adet', false, 4026),
  ('ev-yasam', 'Emsan Çelik Servis Tepsisi', 'emsan-celik-servis-tepsisi', 'Emsan', '40x28 cm', 'Çay ve kahve servisi için kulplu paslanmaz çelik tepsi.', 249.90, null, 'adet', false, 4027),
  -- Saklama
  ('ev-yasam', 'Paşabahçe Cam Saklama Kabı Seti 3''lü', 'pasabahce-cam-saklama-kabi-3lu', 'Paşabahçe', '3 boy', 'Kapaklı, fırına ve buzdolabına uygun cam saklama kabı seti.', 299.90, null, 'paket', false, 4028),
  ('ev-yasam', 'Plastik Saklama Kabı Seti 5''li', 'plastik-saklama-kabi-seti-5li', '', '5 boy', 'İç içe geçerek yerden tasarruf sağlayan kapaklı saklama kabı seti.', 159.90, null, 'paket', false, 4029),
  ('ev-yasam', 'Paşabahçe Cam Kavanoz 1 L', 'pasabahce-cam-kavanoz-1-l', 'Paşabahçe', '1 L', 'Bakliyat ve turşu saklamak için metal kapaklı cam kavanoz.', 89.90, null, 'adet', false, 4030),
  ('ev-yasam', 'Kilitli Erzak Saklama Kabı 2 L', 'kilitli-erzak-saklama-kabi-2-l', '', '2 L', 'Un, şeker ve bakliyat için kilitli kapaklı şeffaf erzak kabı.', 99.90, null, 'adet', false, 4031),
  ('ev-yasam', 'Sızdırmaz Saklama Kabı 1,2 L', 'sizdirmaz-saklama-kabi-1-2-l', '', '1,2 L', 'Dört taraftan kilitlenen, sızdırmaz contalı gıda saklama kabı.', 69.90, null, 'adet', false, 4032),
  ('ev-yasam', 'Cam Baharatlık Seti 3''lü', 'cam-baharatlik-seti-3lu', '', '3x200 ml', 'Tezgah üstü için kapaklı, üç parça cam baharatlık seti.', 109.90, null, 'paket', false, 4033),
  ('ev-yasam', 'Cam Yağdanlık 500 ml', 'cam-yagdanlik-500-ml', '', '500 ml', 'Damlatmayan mekanizmalı, ölçekli cam zeytinyağı şişesi.', 119.90, null, 'adet', false, 4034),
  -- Ev Gerecleri
  ('ev-yasam', 'Osram LED Ampul E27 9W Beyaz Işık', 'osram-led-ampul-e27-9w-beyaz', 'Osram', '9 W', 'E27 duylu, enerji tasarruflu beyaz ışık LED ampul.', 59.90, null, 'adet', false, 4035),
  ('ev-yasam', 'Philips LED Ampul E27 9W Sarı Işık', 'philips-led-ampul-e27-9w-sari', 'Philips', '9 W', 'Sıcak sarı ışık veren, uzun ömürlü E27 LED ampul.', 69.90, null, 'adet', false, 4036),
  ('ev-yasam', 'Osram LED Ampul E27 13W Beyaz Işık', 'osram-led-ampul-e27-13w-beyaz', 'Osram', '13 W', 'Geniş alanlar için yüksek lümenli beyaz ışık LED ampul.', 89.90, null, 'adet', false, 4037),
  ('ev-yasam', 'Viko Üçlü Uzatma Kablosu 2 m', 'viko-3lu-uzatma-kablosu-2-m', 'Viko', '3 giriş / 2 m', 'Topraklı üç girişli, 2 metre kablolu grup priz.', 199.90, null, 'adet', false, 4038),
  ('ev-yasam', 'Viko Beşli Uzatma Kablosu 3 m', 'viko-5li-uzatma-kablosu-3-m', 'Viko', '5 giriş / 3 m', 'Anahtarlı ve topraklı beş girişli, 3 metre uzatma kablosu.', 279.90, null, 'adet', false, 4039),
  ('ev-yasam', 'Tealight Mum 10''lu', 'tealight-mum-10lu-paket', '', '10 adet', 'Yaklaşık dört saat yanan, kokusuz tealight mum paketi.', 69.90, null, 'paket', false, 4040),
  ('ev-yasam', 'Vanilya Kokulu Bardak Mum', 'vanilya-kokulu-bardak-mum', '', '210 g', 'Ortama tatlı vanilya kokusu yayan cam bardak mum.', 129.90, null, 'adet', false, 4041),
  ('ev-yasam', 'Plastik Elbise Askısı 10''lu', 'plastik-elbise-askisi-10lu', '', '10 adet', 'Kaydırmaz omuzlu, dayanıklı plastik elbise askısı seti.', 99.90, null, 'paket', false, 4042),
  ('ev-yasam', 'Plastik Çamaşır Mandalı 24''lü', 'plastik-camasir-mandali-24lu', '', '24 adet', 'Güçlü yaylı, güneşe dayanıklı plastik çamaşır mandalı paketi.', 59.90, null, 'paket', false, 4043),
  ('ev-yasam', 'Silikon Buz Kalıbı', 'silikon-buz-kalibi', '', '14 bölme', 'Buzları tek hamlede çıkarabileceğiniz esnek silikon buz kalıbı.', 59.90, null, 'adet', false, 4044)
on conflict (slug) do nothing;
