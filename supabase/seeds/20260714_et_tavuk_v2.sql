-- Et/Tavuk seed v2 (Migros + Getir; markalar: Polonez, Pınar, Uzman Kasap,
-- Keskinoğlu, Namet, Banvit, Gedik, Apikoğlu). Açık tartı 'Kg' ürünleri
-- gram bazlı satışa (sold_by_weight) çevrilir; fiyatsızlar pasif eklenir.
-- Et/Tavuk seed v2 (Migros + Getir verisi) - otomatik uretildi
delete from products where category_slug = 'sarkuteri-et' and slug in ('ersan-pismis-dana-doner-250-g', 'muslumoglu-dilimli-pastirma-120-g');
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kangal Sucuk 240 G', 'polonez-dana-kangal-sucuk-240-g', 'Polonez', '240 g', '', 449.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"240 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Kangal Sucuk Kg', 'polonez-kangal-sucuk-kg', 'Polonez', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Sucuk 240 G', 'polonez-sucuk-240-g', 'Polonez', '240 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti ve yağı, tuz, baharat karışımı, sarımsak, stabilizör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu madde (sodyum nitrit)","net_miktar":"240 g","saklama":null,"mensei":null,"uretici":null,"besin100":{"enerji_kcal":432,"enerji_kj":1786,"yag_g":40,"doymus_yag_g":22,"karbonhidrat_g":2,"seker_g":0,"protein_g":16,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Acılı Sucuk 240 G', 'polonez-acili-sucuk-240-g', 'Polonez', '240 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"240 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kasap Sucuk 300 G', 'polonez-dana-kasap-sucuk-300-g', 'Polonez', '300 g', '', 299, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Acılı Dana Kasap Sucuk 300 G', 'polonez-acili-dana-kasap-sucuk-300-g', 'Polonez', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Macar Salam 110 G', 'polonez-macar-salam-110-g', 'Polonez', '110 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"110 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Macar Salam 50 G', 'polonez-dana-macar-salam-50-g', 'Polonez', '50 g', '', 91.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Macar Dana Sade Salam 500 G', 'polonez-macar-dana-sade-salam-500-g', 'Polonez', '500 g', '', 1065.37, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Karabiberli Salam 110 G', 'polonez-karabiberli-salam-110-g', 'Polonez', '110 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"110 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Fıstıklı Salam 90 G', 'polonez-dana-fistikli-salam-90-g', 'Polonez', '90 g', '', 108.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"90 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Fıstıklı Salam 90 G', 'polonez-hindi-fistikli-salam-90-g', 'Polonez', '90 g', '', 54.5, 'adet', false, true, true, '{"icindekiler":"Hindi eti ve yağı, dana yağı, patates nişastası, Antep fıstığı (%3), tuz, baharat karışımı","net_miktar":"90 g","saklama":"Buzdolabında 0-4°C arasında saklayınız","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Parça Etli Salam 50 G', 'polonez-hindi-parca-etli-salam-50-g', 'Polonez', '50 g', '', 32.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Piliç Salam 60 G', 'polonez-pilic-salam-60-g', 'Polonez', '60 g', '', 18, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Frankfurter Sosis Kg', 'polonez-dana-frankfurter-sosis-kg', 'Polonez', '1 kg', '', 899.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Bratwurst Sosis Kg', 'polonez-dana-bratwurst-sosis-kg', 'Polonez', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Uzun Sosis 360 G', 'polonez-uzun-sosis-360-g', 'Polonez', '360 g', '', 135.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"360 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Tütsülenmiş Piliç Jumbo Sosis 320 G', 'polonez-tutsulenmis-pilic-jumbo-sosis-320-g', 'Polonez', '320 g', '', 115, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"320 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Kokteyl Hindi Sosis 300 G', 'polonez-kokteyl-hindi-sosis-300-g', 'Polonez', '300 g', '', 66.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Izgara Sosis 500 G', 'polonez-hindi-izgara-sosis-500-g', 'Polonez', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Jambon 150 G', 'polonez-dana-jambon-150-g', 'Polonez', '150 g', '', 262.75, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fit Yaşam Hindi Jambon 10 Dilim 60 G', 'polonez-fit-yasam-hindi-jambon-10-dilim-60-g', 'Polonez', '60 g (10 dilim)', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez İnce Lezzet Dana Tost Jambon 150 G', 'polonez-ince-lezzet-dana-tost-jambon-150-g', 'Polonez', '150 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Tavuk Jambon Sebzeli Kg', 'polonez-tavuk-jambon-sebzeli-kg', 'Polonez', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Jambon 60 G', 'polonez-hindi-jambon-60-g', 'Polonez', '60 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Taze hindi fileto etinden üretilir; yağları alınmış, baharat karışımı ile marine edilip fırında pişirilmiştir (üretici açıklaması)","net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Elit Çemeni Sıyrılmış Pastırma 110 G', 'polonez-elit-cemeni-siyrilmis-pastirma-110-g', 'Polonez', '110 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, pastırma çemeni (buğday unu, kırmızıbiber, sarımsak), tuz, antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"110 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":173,"enerji_kj":null,"yag_g":5,"doymus_yag_g":null,"karbonhidrat_g":4,"seker_g":null,"protein_g":28,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Çemeni Sıyrılmış Pastırma 75 G', 'polonez-cemeni-siyrilmis-pastirma-75-g', 'Polonez', '75 g', '', 359.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"75 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez İnce Lezzet Çemensiz Pastırma 120 G', 'polonez-ince-lezzet-cemensiz-pastirma-120-g', 'Polonez', '120 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"120 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Dilimli Antrikot Pastırma 100 G', 'polonez-dana-dilimli-antrikot-pastirma-100-g', 'Polonez', '100 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti ve dana yağı, çemen (çemen otu, kırmızıbiber, sarımsak dahil baharatlar), koruyucu (sodyum nitrit)","net_miktar":"100 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Çemensiz Pastırma 90 G', 'polonez-cemensiz-pastirma-90-g', 'Polonez', '90 g', '', 399, 'adet', false, true, true, '{"icindekiler":"Dana eti ve dana yağı, tuz, baharatlar, sarımsak, koruyucu (sodyum nitrit)","net_miktar":"90 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dilimli Dana Kavurma 200 G', 'polonez-dilimli-dana-kavurma-200-g', 'Polonez', '200 g', '', 355, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Blok Kavurma 1 Kg', 'polonez-blok-kavurma-1-kg', 'Polonez', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Füme Et 50 G', 'polonez-dana-fume-et-50-g', 'Polonez', '50 g', '', 124.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kurutulmuş Füme Et Dilimli 90 G', 'polonez-dana-kurutulmus-fume-et-dilimli-90-g', 'Polonez', '90 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"90 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Füme Kaburga Eti 200 G', 'polonez-dana-fume-kaburga-eti-200-g', 'Polonez', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Antrikot Füme Et Dilimli 90 G', 'polonez-dana-antrikot-fume-et-dilimli-90-g', 'Polonez', '90 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"90 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fümelenmiş Dana Dil 1 Kg', 'polonez-fumelenmis-dana-dil-1-kg', 'Polonez', '1 kg', '', 1353, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Piliç Füme 150 G', 'polonez-pilic-fume-150-g', 'Polonez', '150 g', '', 125.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fit Yaşam Piliç Füme 60 G', 'polonez-fit-yasam-pilic-fume-60-g', 'Polonez', '60 g', '', 32.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":{"enerji_kcal":83,"enerji_kj":null,"yag_g":1,"doymus_yag_g":null,"karbonhidrat_g":1,"seker_g":null,"protein_g":17,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Zeytinyağlı Otlu Piliç Füme 150 G', 'polonez-zeytinyagli-otlu-pilic-fume-150-g', 'Polonez', '150 g', '', 98.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":{"enerji_kcal":122,"enerji_kj":null,"yag_g":null,"doymus_yag_g":null,"karbonhidrat_g":1.5,"seker_g":null,"protein_g":15,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Füme 50 G', 'polonez-hindi-fume-50-g', 'Polonez', '50 g', '', 32.95, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fit Yaşam Hindi Füme 10 Dilim 60 G', 'polonez-fit-yasam-hindi-fume-10-dilim-60-g', 'Polonez', '60 g (10 dilim)', '', 24.75, 'adet', false, true, true, '{"icindekiler":"Hindi eti ve yağı, patates nişastası, tuz, baharat karışımı, stabilizatör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fit Yaşam XL Hindi Füme 150 G', 'polonez-fit-yasam-xl-hindi-fume-150-g', 'Polonez', '150 g', '', 129, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Füme Glutensiz 150 G', 'polonez-hindi-fume-glutensiz-150-g', 'Polonez', '150 g', '', 78.8, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Sade Hindi Füme Kg', 'polonez-sade-hindi-fume-kg', 'Polonez', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Hindi eti ve yağı, tuz, baharat karışımı, stabilizatör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":null,"saklama":"0-4°C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Karabiberli Hindi Füme Eti Kg', 'polonez-karabiberli-hindi-fume-eti-kg', 'Polonez', '', '', 1618.74, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Füme Göğüs Eti Kg', 'polonez-hindi-fume-gogus-eti-kg', 'Polonez', '', '', 1659.9, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Kangal Sucuk Vakumlu 210 G', 'apikoglu-dana-kangal-sucuk-vakumlu-210-g', 'Apikoğlu', '210 g', '', 350.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"210 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Fermente Parmak Sucuk 200 G', 'apikoglu-fermente-parmak-sucuk-200-g', 'Apikoğlu', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Kangal Fermente Sucuk 280 G', 'apikoglu-dana-kangal-fermente-sucuk-280-g', 'Apikoğlu', '280 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"280 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu 100 Yıllık Formül Klasik Dana Kangal Sucuk 450 G', 'apikoglu-100-yillik-formul-klasik-dana-kangal-sucuk-450-g', 'Apikoğlu', '450 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"450 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Parmak Sucuk 560 G', 'apikoglu-dana-parmak-sucuk-560-g', 'Apikoğlu', '560 g', '', 1110, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"560 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dilimli Dana Tavalık Sucuk 200 G', 'apikoglu-dilimli-dana-tavalik-sucuk-200-g', 'Apikoğlu', '200 g', '', 366.75, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Blok Dana Macar Salam 1 Kg', 'apikoglu-blok-dana-macar-salam-1-kg', 'Apikoğlu', '1 kg', '', 892, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Macar Salam Dilimli 250 G', 'apikoglu-macar-salam-dilimli-250-g', 'Apikoğlu', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Frankfurter Sosis 200 G', 'apikoglu-frankfurter-sosis-200-g', 'Apikoğlu', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Kokteyl Sosis 220 G', 'apikoglu-dana-kokteyl-sosis-220-g', 'Apikoğlu', '220 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"220 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Parça Pastırma 80 G', 'apikoglu-parca-pastirma-80-g', 'Apikoğlu', '80 g', '', 256.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"80 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Antrikot Pastırma 1 Kg', 'apikoglu-antrikot-pastirma-1-kg', 'Apikoğlu', '1 kg', '', 3799.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Blok Dana Kavurma 1500 G', 'apikoglu-blok-dana-kavurma-1500-g', 'Apikoğlu', '1500 g', '', 4730, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Isli Kuru Et 100 G', 'apikoglu-isli-kuru-et-100-g', 'Apikoğlu', '100 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"100 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Kaburga Füme Et Dilimli 250 G', 'apikoglu-kaburga-fume-et-dilimli-250-g', 'Apikoğlu', '250 g', '', 462.4, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Klasik Kangal Sucuk 225 G', 'pinar-klasik-kangal-sucuk-225-g', 'Pınar', '225 g', '', 201.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Şölen Acılı Kangal Sucuk 225 G', 'pinar-solen-acili-kangal-sucuk-225-g', 'Pınar', '225 g', '', 116.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Gurme Sucuk 250 G', 'pinar-gurme-sucuk-250-g', 'Pınar', '250 g', '', 325.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Sucuk Mangal Keyfi 300 G', 'pinar-sucuk-mangal-keyfi-300-g', 'Pınar', '300 g', '', 206, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar İllaki Dana Sucuk 240 G', 'pinar-illaki-dana-sucuk-240-g', 'Pınar', '240 g', '', 325, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"240 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Sucuk 90 G', 'pinar-ac-bitir-sucuk-90-g', 'Pınar', '90 g', '', 71.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"90 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Sucuk Kasap İllaki 300 G', 'pinar-sucuk-kasap-illaki-300-g', 'Pınar', '300 g', '', 244.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Kangal Sucuk Klasik 2''li 225 G', 'pinar-kangal-sucuk-klasik-2-li-225-g', 'Pınar', '2 x 225 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"2 x 225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Doyum Hindi Sucuk 225 G', 'pinar-doyum-hindi-sucuk-225-g', 'Pınar', '225 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Yörük Kangal Sucuk 225 G', 'pinar-yoruk-kangal-sucuk-225-g', 'Pınar', '225 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Doyum Salam 225 G', 'pinar-doyum-salam-225-g', 'Pınar', '225 g', '', 88.25, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Kahvaltılık Salam 250 G', 'pinar-kahvaltilik-salam-250-g', 'Pınar', '250 g', '', 91.14, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Salam Hindi Doyum Büfe 700 G', 'pinar-salam-hindi-doyum-bufe-700-g', 'Pınar', '700 g', '', 208.43, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Macar Salam 60 G', 'pinar-ac-bitir-macar-salam-60-g', 'Pınar', '60 g', '', 69.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Fıstıklı Hindi Salam 50 G', 'pinar-ac-bitir-fistikli-hindi-salam-50-g', 'Pınar', '50 g', '', 25.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Hindi Salam Taze Dilimlenmiş 10 Dilim 75 G', 'pinar-ac-bitir-hindi-salam-taze-dilimlenmis-10-dilim-75-g', 'Pınar', '75 g', '', 52.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"75 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Hindi Salam Büyük Dilim 60 G', 'pinar-ac-bitir-hindi-salam-buyuk-dilim-60-g', 'Pınar', '60 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Uzun Sosis 225 G', 'pinar-uzun-sosis-225-g', 'Pınar', '225 g', '', 284.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Sosis Hot Dog 295 G', 'pinar-sosis-hot-dog-295-g', 'Pınar', '295 g', '', 284.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"295 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Hindi Uzun Sosis 430 G', 'pinar-hindi-uzun-sosis-430-g', 'Pınar', '430 g', '', 160, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"430 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Füme Hindi Cheddarlı Jumbo Sosis 265 G', 'pinar-fume-hindi-cheddarli-jumbo-sosis-265-g', 'Pınar', '265 g', '', 129.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"265 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Hindi Kokteyl Sosis 130 G', 'pinar-ac-bitir-hindi-kokteyl-sosis-130-g', 'Pınar', '130 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"130 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Kokteyl Sosis 180 G', 'pinar-ac-bitir-kokteyl-sosis-180-g', 'Pınar', '180 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"180 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Büyük Dilim Jambon 50 G', 'pinar-ac-bitir-buyuk-dilim-jambon-50-g', 'Pınar', '50 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Aç Bitir Büyük Dilim Hindi Füme 60 G', 'pinar-ac-bitir-buyuk-dilim-hindi-fume-60-g', 'Pınar', '60 g', '', 55, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"60 g","saklama":"0-4 °C","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Füme Hindi Karabiberli Gurme 110 G', 'pinar-fume-hindi-karabiberli-gurme-110-g', 'Pınar', '110 g', '', 99.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"110 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Füme Hindi But Etli Gurme 110 G', 'pinar-fume-hindi-but-etli-gurme-110-g', 'Pınar', '110 g', '', 119.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"110 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Göğüs Füme Hindi Gurme 110 G', 'pinar-gogus-fume-hindi-gurme-110-g', 'Pınar', '110 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"110 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Gurme Füme Dil Kg', 'pinar-gurme-fume-dil-kg', 'Pınar', '1 kg', '', 0, 'adet', false, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Burger 225 G', 'pinar-burger-225-g', 'Pınar', '225 g', '', 151.65, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"225 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Burger 545 G', 'pinar-burger-545-g', 'Pınar', '545 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"545 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Gurme Burger 450 G', 'pinar-gurme-burger-450-g', 'Pınar', '450 g', '', 409.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"450 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Köfte Tekirdağ 390 G', 'pinar-kofte-tekirdag-390-g', 'Pınar', '390 g', '', 319.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"390 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Köfte İnegöl 390 G', 'pinar-kofte-inegol-390-g', 'Pınar', '390 g', '', 319.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"390 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Köfte Cızbız 395 G', 'pinar-kofte-cizbiz-395-g', 'Pınar', '395 g', '', 319.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"395 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar İllaki Dana Lokum Köfte 395 G', 'pinar-illaki-dana-lokum-kofte-395-g', 'Pınar', '395 g', '', 295, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"395 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar İllaki Dana Mikset Köfte 390 G', 'pinar-illaki-dana-mikset-kofte-390-g', 'Pınar', '390 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"390 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Poşetli Bütün Piliç Kg', 'banvit-posetli-butun-pilic-kg', 'Banvit', '1 kg', '', 106.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Kanat Kg', 'banvit-pilic-kanat-kg', 'Banvit', '1 kg', '', 199.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Baget Kg', 'banvit-pilic-baget-kg', 'Banvit', '1 kg', '', 108, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Bonfile Kg', 'banvit-pilic-bonfile-kg', 'Banvit', '1 kg', '', 229, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Pirzola Kg', 'banvit-pilic-pirzola-kg', 'Banvit', '1 kg', '', 218, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Kalçalı But Kg', 'banvit-pilic-kalcali-but-kg', 'Banvit', '1 kg', '', 208.95, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Bonfile Göğüs 750 G', 'banvit-pilic-bonfile-gogus-750-g', 'Banvit', '750 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"750 g","saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Izgara Kanat 750 G', 'banvit-pilic-izgara-kanat-750-g', 'Banvit', '750 g', '', 287.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"750 g","saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Pirzola 750 G', 'banvit-pilic-pirzola-750-g', 'Banvit', '750 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"750 g","saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Izgara Tava 750 G', 'banvit-pilic-izgara-tava-750-g', 'Banvit', '750 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"750 g","saklama":"0-4 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Dondurulmuş Piliç Bonfile 1 Kg', 'banvit-dondurulmus-pilic-bonfile-1-kg', 'Banvit', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":"-18 °C","mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Schnitzel 700 G', 'banvit-pilic-schnitzel-700-g', 'Banvit', '700 g', '', 119.95, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Schnitzel 300 G', 'banvit-pilic-schnitzel-300-g', 'Banvit', '300 g', '', 83.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Nugget 700 G', 'banvit-pilic-nugget-700-g', 'Banvit', '700 g', '', 136.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Nugget 300 G', 'banvit-pilic-nugget-300-g', 'Banvit', '300 g', '', 83.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Burger 300 G', 'banvit-pilic-burger-300-g', 'Banvit', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Çıtır Piliç Kanat 300 G', 'banvit-citir-pilic-kanat-300-g', 'Banvit', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Yaprak Döner 200 G', 'banvit-pilic-yaprak-doner-200-g', 'Banvit', '200 g', '', 99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Kokteyl Sosis 1000 G', 'banvit-pilic-kokteyl-sosis-1000-g', 'Banvit', '1000 g', '', 162.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Piliç Kokteyl Sosis 500 G', 'banvit-pilic-kokteyl-sosis-500-g', 'Banvit', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Tütsülenmiş Piliç Jumbo Sosis 330 G', 'banvit-tutsulenmis-pilic-jumbo-sosis-330-g', 'Banvit', '330 g', '', 95.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"330 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Banvit Tütsülenmiş Cheddarlı Piliç Jumbo Sosis 250 G', 'banvit-tutsulenmis-cheddarli-pilic-jumbo-sosis-250-g', 'Banvit', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":"Banvit Bandırma Vitaminli Yem San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kıyma 500 G', 'uzman-kasap-dana-kiyma-500-g', 'Uzman Kasap', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"500 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kıyma 400 G', 'uzman-kasap-dana-kiyma-400-g', 'Uzman Kasap', '400 g', '', 285, 'adet', false, true, true, '{"icindekiler":"Dana eti","net_miktar":"400 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kıyma 200 G', 'uzman-kasap-dana-kiyma-200-g', 'Uzman Kasap', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"200 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kıyma 2x200 G', 'uzman-kasap-dana-kiyma-2x200-g', 'Uzman Kasap', '2 x 200 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"2 x 200 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Yağsız Kıyma 400 G', 'uzman-kasap-dana-yagsiz-kiyma-400-g', 'Uzman Kasap', '400 g', '', 239, 'adet', false, true, true, '{"icindekiler":"Dana eti (yağsız)","net_miktar":"400 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Yağsız Kıyma 500 G', 'uzman-kasap-dana-yagsiz-kiyma-500-g', 'Uzman Kasap', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti (yağsız)","net_miktar":"500 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kuzu Kıyma 400 G', 'uzman-kasap-dana-kuzu-kiyma-400-g', 'Uzman Kasap', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti (omuz ve kaburga), kuzu eti (kaburga)","net_miktar":"400 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kuzu Kıyma Paket 500 G', 'uzman-kasap-dana-kuzu-kiyma-paket-500-g', 'Uzman Kasap', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, kuzu eti","net_miktar":"500 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kuşbaşı 400 G', 'uzman-kasap-dana-kusbasi-400-g', 'Uzman Kasap', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"400 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kuşbaşı Paket 1 Kg', 'uzman-kasap-dana-kusbasi-paket-1-kg', 'Uzman Kasap', '1 kg', '', 749.9, 'adet', false, true, true, '{"icindekiler":"Dana eti","net_miktar":"1 kg","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Yemeklik Kuşbaşı 300 G', 'uzman-kasap-dana-yemeklik-kusbasi-300-g', 'Uzman Kasap', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Sote 300 G', 'uzman-kasap-dana-sote-300-g', 'Uzman Kasap', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kontrafile 300 G', 'uzman-kasap-dana-kontrafile-300-g', 'Uzman Kasap', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Yemeklik Biftek 300 G', 'uzman-kasap-dana-yemeklik-biftek-300-g', 'Uzman Kasap', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana But Biftek 1 Kg', 'uzman-kasap-dana-but-biftek-1-kg', 'Uzman Kasap', '1 kg', '', 859.9, 'adet', false, true, true, '{"icindekiler":"Dana eti (but)","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Antrikot Kg', 'uzman-kasap-dana-antrikot-kg', 'Uzman Kasap', '', '', 1599.9, 'kg', true, true, true, '{"icindekiler":"Dana eti (antrikot)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Bonfile 400 G', 'uzman-kasap-dana-bonfile-400-g', 'Uzman Kasap', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti (bonfile), biberiye, kekik, maydanoz","net_miktar":"400 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kemikli Biftek (T-Bone Steak) Kg', 'uzman-kasap-dana-kemikli-biftek-t-bone-steak-kg', 'Uzman Kasap', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Dana eti (bonfile ve kontrfile bölümü, kemikli)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Olgunlaştırılmış Dana T-Bone Steak Kg', 'uzman-kasap-olgunlastirilmis-dana-t-bone-steak-kg', 'Uzman Kasap', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Olgunlaştırılmış dana eti","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Antrikot Burger Kg', 'uzman-kasap-dana-antrikot-burger-kg', 'Uzman Kasap', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Dana eti (antrikot)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Hamburger Köfte 330 G', 'uzman-kasap-hamburger-kofte-330-g', 'Uzman Kasap', '330 g', '', 179, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"330 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap İzmir Köfte 320 G', 'uzman-kasap-izmir-kofte-320-g', 'Uzman Kasap', '320 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"320 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Tekirdağ Köfte 320 G', 'uzman-kasap-tekirdag-kofte-320-g', 'Uzman Kasap', '320 g', '', 129, 'adet', false, true, true, '{"icindekiler":"Dana eti ve sığır yağı, ekmek (buğday unu (gluten içerir), su, tuz, maya), baharat karışımı (soğan tozu, tuz, kırmızı tatlı biber, kimyon, sarımsak tozu, karabiber, nane), bitkisel yağ (ayçiçek), biber salçası (kırmızı tatlı biber, asitlik düzenleyici (sitrik asit)), sirke, antioksidan (askorbik asit)","net_miktar":"320 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Klasik Köfte 320 G', 'uzman-kasap-klasik-kofte-320-g', 'Uzman Kasap', '320 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, kuzu eti, sığır yağı, ekmek (buğday unu (gluten içerir), su, tuz, maya), maydanoz, baharat karışımı (soğan tozu, tuz, kimyon, karabiber, sarımsak tozu, tatlı kırmızı biber), bitkisel yağ (ayçiçek), biber salçası (kırmızı tatlı biber, asitlik düzenleyici (sitrik asit)), sirke, antioksidan (askorbik asit)","net_miktar":"320 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Izgara Köfte 320 G', 'uzman-kasap-izgara-kofte-320-g', 'Uzman Kasap', '320 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"320 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dağ Kekikli Dana Çoban Köfte 400 G', 'uzman-kasap-dag-kekikli-dana-coban-kofte-400-g', 'Uzman Kasap', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti ve sığır yağı, ekmek (buğday unu (gluten içerir), su, tuz, maya), baharat karışımı (soğan tozu, tuz, karabiber, dağ kekiği (%0,1)), bitkisel yağ (ayçiçek), biber salçası","net_miktar":"400 g","saklama":"0°C - 4°C arasında muhafaza ediniz","mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Taze Sosis Köfte Kg', 'uzman-kasap-dana-taze-sosis-kofte-kg', 'Uzman Kasap', '', '', 899, 'kg', true, true, true, '{"icindekiler":null,"net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Cızbız Köfte 200 G', 'uzman-kasap-cizbiz-kofte-200-g', 'Uzman Kasap', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Kuzu Klasik Köfte 960 G', 'uzman-kasap-dana-kuzu-klasik-kofte-960-g', 'Uzman Kasap', '960 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, kuzu eti","net_miktar":"960 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Kuzu Dana Kebap 360 G', 'uzman-kasap-kuzu-dana-kebap-360-g', 'Uzman Kasap', '360 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Kuzu eti, dana eti","net_miktar":"360 g","saklama":null,"mensei":"Türkiye","uretici":"Migros Ticaret A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Kuzu Pirzola Kg', 'uzman-kasap-kuzu-pirzola-kg', 'Uzman Kasap', '', '', 1699.9, 'kg', true, true, true, '{"icindekiler":"Kuzu eti (pirzola)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Kuzu Pirzola 300 G', 'uzman-kasap-kuzu-pirzola-300-g', 'Uzman Kasap', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Kuzu eti (pirzola)","net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Kuzu Kemiksiz But Kg', 'uzman-kasap-kuzu-kemiksiz-but-kg', 'Uzman Kasap', '', '', 1037.9, 'kg', true, true, true, '{"icindekiler":"Kuzu eti (kemiksiz but)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana İlikli İncik (Osso Bucco) Kg', 'uzman-kasap-dana-ilikli-incik-osso-bucco-kg', 'Uzman Kasap', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Dana eti (kemikli incik, dilimli)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Uzman Kasap Dana Lokum 1 Kg', 'uzman-kasap-dana-lokum-1-kg', 'Uzman Kasap', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Poşetli Bütün Piliç Kg', 'gedik-posetli-butun-pilic-kg', 'Gedik', '', '', 119.95, 'kg', true, true, true, '{"icindekiler":"Piliç eti (bütün)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Fileto 1 Kg', 'gedik-pilic-fileto-1-kg', 'Gedik', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":"Piliç göğüs eti (fileto)","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Bonfile Kg', 'gedik-pilic-bonfile-kg', 'Gedik', '', '', 149.9, 'kg', true, true, true, '{"icindekiler":"Piliç göğüs eti (bonfile)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Göğüs Kemikli Kg', 'gedik-pilic-gogus-kemikli-kg', 'Gedik', '', '', 154.95, 'kg', true, true, true, '{"icindekiler":"Piliç göğüs eti (kemikli)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç But Kg', 'gedik-pilic-but-kg', 'Gedik', '', '', 134.95, 'kg', true, true, true, '{"icindekiler":"Piliç but","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Büyük Tabaklı Piliç Kalçalı But Kg', 'gedik-buyuk-tabakli-pilic-kalcali-but-kg', 'Gedik', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Piliç kalçalı but","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Baget 1 Kg', 'gedik-pilic-baget-1-kg', 'Gedik', '1 kg', '', 129.95, 'adet', false, true, true, '{"icindekiler":"Piliç baget","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Büyük Tabaklı Piliç Baget Kg', 'gedik-buyuk-tabakli-pilic-baget-kg', 'Gedik', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Piliç baget","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Kanat 1 Kg', 'gedik-pilic-kanat-1-kg', 'Gedik', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":"Piliç kanat","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Büyük Tabaklı Piliç Kanat Kg', 'gedik-buyuk-tabakli-pilic-kanat-kg', 'Gedik', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Piliç kanat","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Izgara Kanat Kg', 'gedik-pilic-izgara-kanat-kg', 'Gedik', '', '', 349.95, 'kg', true, true, true, '{"icindekiler":"Piliç kanat (ızgaralık)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Baby Kg', 'gedik-pilic-baby-kg', 'Gedik', '', '', 0, 'kg', true, false, false, '{"icindekiler":"Piliç eti (bütün, küçük boy)","net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Sarma Kg', 'gedik-pilic-sarma-kg', 'Gedik', '', '', 0, 'kg', true, false, false, '{"icindekiler":null,"net_miktar":null,"saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Kasap Köfte 240 G', 'gedik-pilic-kasap-kofte-240-g', 'Gedik', '240 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"240 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Köfte 300 G', 'gedik-pilic-kofte-300-g', 'Gedik', '300 g', '', 110.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Parmak Köfte 260 G', 'gedik-pilic-parmak-kofte-260-g', 'Gedik', '260 g', '', 82.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"260 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Pişmiş Piliç Şinitzel 300 G', 'gedik-pismis-pilic-sinitzel-300-g', 'Gedik', '300 g', '', 81.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Cordon Bleu 285 G', 'gedik-pilic-cordon-bleu-285-g', 'Gedik', '285 g', '', 88.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"285 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Çıtır Bonfile Parçaları 500 G', 'gedik-pilic-citir-bonfile-parcalari-500-g', 'Gedik', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Gedik Piliç Kemiksiz Kova 750 G', 'gedik-pilic-kemiksiz-kova-750-g', 'Gedik', '750 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"750 g","saklama":null,"mensei":"Türkiye","uretici":"Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Bütün Piliç Kg', 'keskinoglu-tabakli-butun-pilic-kg', 'Keskinoğlu', '', '', 99.99, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Piliç Fileto (Kemiksiz Göğüs) Kg', 'keskinoglu-tabakli-pilic-fileto-kemiksiz-gogus-kg', 'Keskinoğlu', '', '', 275, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Kemikli Göğüs Kg', 'keskinoglu-tabakli-kemikli-gogus-kg', 'Keskinoğlu', '', '', 169.95, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Baby Fileto Kg', 'keskinoglu-baby-fileto-kg', 'Keskinoğlu', '', '', 249, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Kök Kanat Kg', 'keskinoglu-tabakli-kok-kanat-kg', 'Keskinoğlu', '', '', 229.99, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Kanat 650 G', 'keskinoglu-pilic-kanat-650-g', 'Keskinoğlu', '650 g', '', 239.85, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"650 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Baget Kg', 'keskinoglu-pilic-baget-kg', 'Keskinoğlu', '', '', 89.95, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Kalçalı But Kg', 'keskinoglu-tabakli-kalcali-but-kg', 'Keskinoğlu', '', '', 129.99, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı But Pirzola Kg', 'keskinoglu-tabakli-but-pirzola-kg', 'Keskinoğlu', '', '', 210, 'kg', true, true, true, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Pirzola Kelebek Piliç 1 Kg', 'keskinoglu-pirzola-kelebek-pilic-1-kg', 'Keskinoğlu', '1 kg', '', 220.15, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tabaklı Piliç Ciğer Kg', 'keskinoglu-tabakli-pilic-ciger-kg', 'Keskinoğlu', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Taşlık 750 G', 'keskinoglu-pilic-taslik-750-g', 'Keskinoğlu', '750 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"750 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Bonfile 1 Kg', 'keskinoglu-pilic-bonfile-1-kg', 'Keskinoğlu', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Şinitzel 700 G', 'keskinoglu-pilic-sinitzel-700-g', 'Keskinoğlu', '700 g', '', 135, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Nugget 300 G', 'keskinoglu-pilic-nugget-300-g', 'Keskinoğlu', '300 g', '', 69, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"300 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Nugget 700 G', 'keskinoglu-pilic-nugget-700-g', 'Keskinoğlu', '700 g', '', 89, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Dondurulmuş Piliç Kasap Köfte 1 Kg', 'keskinoglu-dondurulmus-pilic-kasap-kofte-1-kg', 'Keskinoğlu', '1 kg', '', 169, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":"Dondurulmuş, -18°C","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Dondurulmuş Piliç Çıtır Kova 850 G', 'keskinoglu-dondurulmus-pilic-citir-kova-850-g', 'Keskinoğlu', '850 g', '', 219, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"850 g","saklama":"Dondurulmuş, -18°C","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Dondurulmuş Çıtır Piliç Topları 700 G', 'keskinoglu-dondurulmus-citir-pilic-toplari-700-g', 'Keskinoğlu', '700 g', '', 85.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"700 g","saklama":"Dondurulmuş, -18°C","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Dondurulmuş Piliç Çıtır Filetom 700 G', 'keskinoglu-dondurulmus-pilic-citir-filetom-700-g', 'Keskinoğlu', '700 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"700 g","saklama":"Dondurulmuş, -18°C","mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Çıtır Bonfile 400 G', 'keskinoglu-pilic-citir-bonfile-400-g', 'Keskinoğlu', '400 g', '', 99.95, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"400 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Döner 200 G', 'keskinoglu-pilic-doner-200-g', 'Keskinoğlu', '200 g', '', 89, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Yaprak Döner 500 G', 'keskinoglu-pilic-yaprak-doner-500-g', 'Keskinoğlu', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Kokteyl Sosis 750 G', 'keskinoglu-pilic-kokteyl-sosis-750-g', 'Keskinoğlu', '750 g', '', 79.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"750 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Sosis 750 G', 'keskinoglu-pilic-sosis-750-g', 'Keskinoğlu', '750 g', '', 140.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"750 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Uzun Sosis 1000 G', 'keskinoglu-pilic-uzun-sosis-1000-g', 'Keskinoğlu', '1000 g', '', 169.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1000 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Tombul Piliç Salam 350 G', 'keskinoglu-tombul-pilic-salam-350-g', 'Keskinoğlu', '350 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Piliç eti ve yağı, su, nişasta, bitkisel lif, tuz, baharat karışımı, koruyucu (sodyum asetat), duman aroması, antioksidan (askorbik asit), emülgatör (E450), fermente pirinç","net_miktar":"350 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Salam 700 G', 'keskinoglu-pilic-salam-700-g', 'Keskinoğlu', '700 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"700 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Kangal Sucuk 250 G', 'keskinoglu-pilic-kangal-sucuk-250-g', 'Keskinoğlu', '250 g', '', 59, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Büfe Sucuk 450 G', 'keskinoglu-pilic-bufe-sucuk-450-g', 'Keskinoğlu', '450 g', '', 103.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"450 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kıyma %20 Yağlı 400 G', 'namet-dana-kiyma-20-yagli-400-g', 'Namet', '400 g', '', 271.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"400 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kuşbaşı 400 G', 'namet-dana-kusbasi-400-g', 'Namet', '400 g', '', 275.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"400 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Köftelik Kıyma 500 G', 'namet-dana-koftelik-kiyma-500-g', 'Namet', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kıyma %15 Yağlı 500 G', 'namet-dana-kiyma-15-yagli-500-g', 'Namet', '500 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"500 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kuzu Karışık İnegöl Köfte 400 G', 'namet-dana-kuzu-karisik-inegol-kofte-400-g', 'Namet', '400 g', '', 249.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"400 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Köfte 400 G', 'namet-dana-kofte-400-g', 'Namet', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"400 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Parmak Köfte 200 G', 'namet-dana-parmak-kofte-200-g', 'Namet', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Burger Köfte 200 G', 'namet-dana-burger-kofte-200-g', 'Namet', '200 g', '', 100, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Pişmiş Dana Izgara Köfte 200 G', 'namet-pismis-dana-izgara-kofte-200-g', 'Namet', '200 g', '', 79, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Soslu Dana Parmak Köfte 250 G', 'namet-soslu-dana-parmak-kofte-250-g', 'Namet', '250 g', '', 118.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Soslu Pişmiş Burger 200 G', 'namet-dana-soslu-pismis-burger-200-g', 'Namet', '200 g', '', 133.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Pişmiş Dana Döner 200 G', 'namet-pismis-dana-doner-200-g', 'Namet', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Kuzu Pirzola 1 Kg', 'namet-kuzu-pirzola-1-kg', 'Namet', '1 kg', '', 1699.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Bonfile Kg', 'namet-dana-bonfile-kg', 'Namet', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Klasik Dana Kangal Sucuk 200 G', 'namet-klasik-dana-kangal-sucuk-200-g', 'Namet', '200 g', '', 271.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kangal Sucuk 250 G', 'namet-dana-kangal-sucuk-250-g', 'Namet', '250 g', '', 189, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Dilimli Sucuk 200 G', 'namet-dana-dilimli-sucuk-200-g', 'Namet', '200 g', '', 187.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kasap Sucuk 250 G', 'namet-dana-kasap-sucuk-250-g', 'Namet', '250 g', '', 209, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Parmak Sucuk Kg', 'namet-dana-parmak-sucuk-kg', 'Namet', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Jambon Kg', 'namet-dana-jambon-kg', 'Namet', '', '', 0, 'kg', true, false, false, null)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dilimli Dana Jambon 150 G', 'namet-dilimli-dana-jambon-150-g', 'Namet', '150 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":null,"uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  details = coalesce(excluded.details, products.details);
select count(*) as sarkuteri_count from products where category_slug = 'sarkuteri-et';
