-- Şarküteri seed (Migros sanal market verisi; 60 ürün). details jsonb
-- kolonu 20260714090000_product_details.sql ile eklenir. UPSERT: mevcut
-- slug'da yalnız marka/gramaj/etiket bilgisi güncellenir, fiyat korunur.
-- Şarküteri seed (Migros sanal market verisi) - otomatik üretildi
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Kangal Sucuk 240 G', 'namet-kangal-sucuk-240-g', 'Namet', '240 g', '', 385, 'adet', false, true, true, '{"icindekiler":"Dana eti ve yağı, baharat karışımı, tuz, sarımsak, stabilizör (E450)","net_miktar":"240 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":440,"enerji_kj":1820,"yag_g":40,"doymus_yag_g":21,"karbonhidrat_g":4,"seker_g":0.5,"protein_g":16,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Fermente Kangal Sucuk Kg', 'namet-fermente-kangal-sucuk-kg', 'Namet', '1 kg', '', 999.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Parmak Sucuk 280 G', 'namet-dana-parmak-sucuk-280-g', 'Namet', '280 g', '', 235, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"280 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Maret Dana Kasap Sucuk 400 G', 'maret-dana-kasap-sucuk-400-g', 'Maret', '400 g', '', 339, 'adet', false, true, true, '{"icindekiler":"Dana eti ve yağı, baharat karışımı, tuz, sarımsak, antioksidan (sodyum askorbat), koruyucu (sodyum nitrit)","net_miktar":"400 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":440,"enerji_kj":null,"yag_g":null,"doymus_yag_g":21,"karbonhidrat_g":null,"seker_g":null,"protein_g":null,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kasap Sucuk 250 G', 'polonez-dana-kasap-sucuk-250-g', 'Polonez', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti ve yağı, tuz, baharat karışımı, sarımsak, stabilizör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"250 g","saklama":"0-4 °C''de muhafaza ediniz, koruyucu atmosferde ambalajlanmıştır","mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":432,"enerji_kj":1786,"yag_g":40,"doymus_yag_g":22,"karbonhidrat_g":2,"seker_g":0,"protein_g":16,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kasap Sucuk Kg', 'polonez-dana-kasap-sucuk-kg', 'Polonez', '1 kg', '', 1999.9, 'adet', false, true, true, '{"icindekiler":"Dana eti ve yağı, tuz, baharat karışımı, sarımsak, stabilizör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"1 kg","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":432,"enerji_kj":1786,"yag_g":40,"doymus_yag_g":22,"karbonhidrat_g":2,"seker_g":0,"protein_g":16,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Cumhuriyet Kangal Sucuk Kg', 'cumhuriyet-kangal-sucuk-kg', 'Cumhuriyet', '1 kg', '', 1170, 'adet', false, true, true, '{"icindekiler":"Dana eti ve dana yağı, tuz, baharatlar (kimyon, toz kırmızı biber, karabiber), sarımsak, dekstroz, stabilizör, koruyucu","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Erdoğdu Et ve Gıda Ürünleri Tic. Ltd. Şti.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Şahin Kangal Sucuk Kg', 'sahin-kangal-sucuk-kg', 'Şahin', '1 kg', '', 1254, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":444,"enerji_kj":null,"yag_g":null,"doymus_yag_g":null,"karbonhidrat_g":null,"seker_g":null,"protein_g":null,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Şahin Vakumlu Kangal Isıl İşlem Görmüş Sucuk 180 G', 'sahin-vakumlu-kangal-isil-islem-gormus-sucuk-180-g', 'Şahin', '180 g', '', 315.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"180 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Kangal Sucuk Kg', 'apikoglu-kangal-sucuk-kg', 'Apikoğlu', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, dana yağı, tuz, toz kırmızı biber, kimyon, sarımsak, stabilizör (E452), antioksidan (E300), koruyucu (E250)","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":440,"enerji_kj":1820,"yag_g":40,"doymus_yag_g":25,"karbonhidrat_g":4,"seker_g":0,"protein_g":16,"tuz_g":2.6}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Kangal Fermente Sucuk 380 G', 'apikoglu-dana-kangal-fermente-sucuk-380-g', 'Apikoğlu', '380 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, dana yağı, tuz, toz kırmızı biber, kimyon, sarımsak, stabilizör (E452), antioksidan (E300), koruyucu (E250)","net_miktar":"380 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":440,"enerji_kj":1820,"yag_g":40,"doymus_yag_g":25,"karbonhidrat_g":4,"seker_g":0,"protein_g":16,"tuz_g":2.6}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Aytaç Isıl İşlem Görmüş Kangal Sucuk 200 G', 'aytac-isil-islem-gormus-kangal-sucuk-200-g', 'Aytaç', '200 g', '', 185, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":"0 °C / +4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Torku Isıl İşlem Kangal Sucuk Kg', 'torku-isil-islem-kangal-sucuk-kg', 'Torku', '1 kg', '', 539.99, 'adet', false, true, true, '{"icindekiler":"Dana eti, dana yağı, sığır yağı, kuzu eti, baharat karışımı (gluten içerir), tuz, sarımsak, stabilizör (sodyum polifosfat), antioksidan (askorbik asit, sodyum askorbat)","net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":427,"enerji_kj":null,"yag_g":null,"doymus_yag_g":null,"karbonhidrat_g":null,"seker_g":null,"protein_g":null,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'İkbal Geleneksel Fermente Sucuk 200 G', 'ikbal-geleneksel-fermente-sucuk-200-g', 'İkbal', '200 g', '', 350.88, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":"Türkiye","uretici":"İkbal Gıda ve İht. Mad. İml. San. İç ve Dış Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Macar Salam Kg', 'namet-macar-salam-kg', 'Namet', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":195,"enerji_kj":810,"yag_g":15,"doymus_yag_g":9,"karbonhidrat_g":5,"seker_g":0,"protein_g":10,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Macar Dilimli Salam 200 G', 'namet-macar-dilimli-salam-200-g', 'Namet', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":195,"enerji_kj":810,"yag_g":15,"doymus_yag_g":9,"karbonhidrat_g":5,"seker_g":0,"protein_g":10,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Macar Salam 150 G', 'namet-dana-macar-salam-150-g', 'Namet', '150 g', '', 89.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet 7/24 Dana Macar Salam 60 G', 'namet-7-24-dana-macar-salam-60-g', 'Namet', '60 g', '', 56.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"60 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Fıstıklı Macar Salam Kg', 'namet-fistikli-macar-salam-kg', 'Namet', '1 kg', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"1 kg","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":199,"enerji_kj":null,"yag_g":null,"doymus_yag_g":null,"karbonhidrat_g":null,"seker_g":null,"protein_g":null,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Macar Salam 250 G', 'polonez-macar-salam-250-g', 'Polonez', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"250 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fıstıklı Salam 110 G', 'polonez-fistikli-salam-110-g', 'Polonez', '110 g', '', 108.99, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"110 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Maret Macar Tombul Salam 250 G', 'maret-macar-tombul-salam-250-g', 'Maret', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Maret Pratik Dana Macar Salam 50 G', 'maret-pratik-dana-macar-salam-50-g', 'Maret', '50 g', '', 40.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Aytaç Şipşak Dana Dilimli Macar Salam 60 G', 'aytac-sipsak-dana-dilimli-macar-salam-60-g', 'Aytaç', '60 g', '', 26.5, 'adet', false, true, true, '{"icindekiler":"Dana eti ve yağı, su, patates nişastası, baharatlar, koruyucular","net_miktar":"60 g","saklama":"0 °C / +4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kokteyl Sosis 450 G', 'namet-dana-kokteyl-sosis-450-g', 'Namet', '450 g', '', 389.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"450 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":180,"enerji_kj":null,"yag_g":14,"doymus_yag_g":null,"karbonhidrat_g":3.5,"seker_g":null,"protein_g":10,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Kokteyl Sosis 250 G', 'namet-kokteyl-sosis-250-g', 'Namet', '250 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":{"enerji_kcal":180,"enerji_kj":null,"yag_g":14,"doymus_yag_g":null,"karbonhidrat_g":3.5,"seker_g":null,"protein_g":10,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kokteyl Sosis 300 G', 'polonez-dana-kokteyl-sosis-300-g', 'Polonez', '300 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, su, baharat karışımı, tuz, soya proteini, stabilizör, koruyucu (sodyum nitrit); soya proteini içerir","net_miktar":"300 g","saklama":"Buzdolabında 0 °C / +4 °C''de muhafaza ediniz, güneş ışığına maruz bırakmayınız","mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":246,"enerji_kj":1020,"yag_g":20,"doymus_yag_g":10.1,"karbonhidrat_g":5,"seker_g":0,"protein_g":11,"tuz_g":1.8}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Kokteyl Sosis 200 G', 'polonez-dana-kokteyl-sosis-200-g', 'Polonez', '200 g', '', 262.5, 'adet', false, true, true, '{"icindekiler":"Dana eti, su, baharat karışımı, tuz, soya proteini, stabilizör, koruyucu (sodyum nitrit); soya proteini içerir","net_miktar":"200 g","saklama":"Buzdolabında 0 °C / +4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":246,"enerji_kj":1020,"yag_g":20,"doymus_yag_g":10.1,"karbonhidrat_g":5,"seker_g":0,"protein_g":11,"tuz_g":1.8}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Sosis 500 G', 'polonez-dana-sosis-500-g', 'Polonez', '500 g', '', 179.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"500 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Maret Piliç Kokteyl Sosis 250 G', 'maret-pilic-kokteyl-sosis-250-g', 'Maret', '250 g', '', 64.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":"Namet Gıda San. ve Tic. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Aytaç Piliç Kokteyl Sosis 350 G', 'aytac-pilic-kokteyl-sosis-350-g', 'Aytaç', '350 g', '', 104.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"350 g","saklama":"0 °C / +4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Aytaç Çiftlik Piliç Kokteyl Sosis 400 G', 'aytac-ciftlik-pilic-kokteyl-sosis-400-g', 'Aytaç', '400 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"400 g","saklama":"Buzdolabında 0 °C / +4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar 10''lu Ekonomik Sosis 430 G', 'pinar-10-lu-ekonomik-sosis-430-g', 'Pınar', '430 g', '', 269, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"430 g","saklama":null,"mensei":"Türkiye","uretici":"Pınar Entegre Et ve Un San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Pınar Dana Kokteyl Sosis 215 G', 'pinar-dana-kokteyl-sosis-215-g', 'Pınar', '215 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti ve yağı, bitkisel yağ (ayçiçek yağı), su, patates nişastası, soya proteini, tuz, süt proteini, baharat karışımı, sarımsak, kıvam arttırıcı (guar gam), koruyucular (sodyum laktat, sodyum nitrit), stabilizör (sodyum polifosfat), antioksidan (askorbik asit), aroma vericiler, renklendirici (amonyum sülfit karamel)","net_miktar":"215 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"Pınar Entegre Et ve Un San. A.Ş.","besin100":{"enerji_kcal":217,"enerji_kj":null,"yag_g":17,"doymus_yag_g":8,"karbonhidrat_g":4,"seker_g":null,"protein_g":12,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Dilimli Jambon 110 G', 'namet-dana-dilimli-jambon-110-g', 'Namet', '110 g', '', 115, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"110 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":{"enerji_kcal":93,"enerji_kj":394,"yag_g":1,"doymus_yag_g":0.6,"karbonhidrat_g":8,"seker_g":0,"protein_g":13,"tuz_g":3}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Jambon 7/24 50 G', 'namet-dana-jambon-7-24-50-g', 'Namet', '50 g', '', 42.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Piliç Jambon 7/24 50 G', 'namet-pilic-jambon-7-24-50-g', 'Namet', '50 g', '', 34.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Jambon 50 G', 'polonez-dana-jambon-50-g', 'Polonez', '50 g', '', 47.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dana Jambon Küpleri 100 G', 'polonez-dana-jambon-kupleri-100-g', 'Polonez', '100 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"100 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Çemeni Sıyrılmış Dilimli Pastırma 130 G', 'namet-cemeni-siyrilmis-dilimli-pastirma-130-g', 'Namet', '130 g', '', 399, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"130 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Klasik Dilimli Pastırma 130 G', 'namet-klasik-dilimli-pastirma-130-g', 'Namet', '130 g', '', 0, 'adet', false, false, false, '{"icindekiler":"Dana eti, çemen (çemen unu (buğday unu içerir), sarımsak, tuz, kırmızı biber)","net_miktar":"130 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":{"enerji_kcal":197,"enerji_kj":831,"yag_g":null,"doymus_yag_g":null,"karbonhidrat_g":null,"seker_g":null,"protein_g":35,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Dilimli Antrikot Pastırma 100 G', 'namet-dana-dilimli-antrikot-pastirma-100-g', 'Namet', '100 g', '', 231, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"100 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Dilimli Çemensiz Seçme Pastırma 100 G', 'polonez-dilimli-cemensiz-secme-pastirma-100-g', 'Polonez', '100 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"100 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Torku Çemeni Sıyrılmış Dilimli Pastırma 120 G', 'torku-cemeni-siyrilmis-dilimli-pastirma-120-g', 'Torku', '120 g', '', 249, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"120 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Müslümoğlu Dilimli Pastırma 120 G', 'muslumoglu-dilimli-pastirma-120-g', 'Müslümoğlu', '120 g', '', 199, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"120 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Apikoğlu Dana Pastırma Çemeni Sıyrılmış 90 G', 'apikoglu-dana-pastirma-cemeni-siyrilmis-90-g', 'Apikoğlu', '90 g', '', 269.9, 'adet', false, true, true, '{"icindekiler":"Dana eti, baharat karışımı (çemen otu tohumu unu, kırmızı toz biber, sarımsak, nohut unu, buğday unu), tuz, koruyucu (E250)","net_miktar":"90 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"Apikoğlu Sucuk ve Et Ürünleri Gıda San. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Hindi Füme 2x110 G', 'polonez-hindi-fume-2x110-g', 'Polonez', '2 x 110 g', '', 129.9, 'adet', false, true, true, '{"icindekiler":"Hindi eti ve yağı, tuz, baharat karışımı, stabilizatör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"220 g (2 x 110 g)","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":{"enerji_kcal":83,"enerji_kj":351,"yag_g":1,"doymus_yag_g":null,"karbonhidrat_g":1,"seker_g":null,"protein_g":17,"tuz_g":null}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Zeytinyağlı Kekikli Hindi Füme 150 G', 'polonez-zeytinyagli-kekikli-hindi-fume-150-g', 'Polonez', '150 g', '', 145, 'adet', false, true, true, '{"icindekiler":"Hindi eti ve yağı, zeytinyağı (%5), tuz, baharat karışımı, kekik (%0,75), stabilizatör (sodyum polifosfat), antioksidan (askorbik asit), koruyucu (sodyum nitrit)","net_miktar":"150 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Füme Kaburga Eti 80 G', 'polonez-fume-kaburga-eti-80-g', 'Polonez', '80 g', '', 219, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"80 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet 7/24 Piliç Füme 50 G', 'namet-7-24-pilic-fume-50-g', 'Namet', '50 g', '', 30.25, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"50 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Polonez Fit Yaşam Hindi Füme 200 G', 'polonez-fit-yasam-hindi-fume-200-g', 'Polonez', '200 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"200 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kavurma 150 G', 'namet-dana-kavurma-150-g', 'Namet', '150 g', '', 223.95, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"150 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":{"enerji_kcal":358,"enerji_kj":1484,"yag_g":30,"doymus_yag_g":18,"karbonhidrat_g":0,"seker_g":0,"protein_g":22,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dilimli Kavurma 200 G', 'namet-dilimli-kavurma-200-g', 'Namet', '200 g', '', 222.5, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Füme Kavurma 100 G', 'namet-fume-kavurma-100-g', 'Namet', '100 g', '', 0, 'adet', false, false, false, '{"icindekiler":null,"net_miktar":"100 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Maret Pratik Kavurma 100 G', 'maret-pratik-kavurma-100-g', 'Maret', '100 g', '', 175.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"100 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Dana Kavurma Kg', 'namet-dana-kavurma-kg', 'Namet', '1 kg', '', 1499, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"1 kg","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":{"enerji_kcal":358,"enerji_kj":1484,"yag_g":30,"doymus_yag_g":18,"karbonhidrat_g":0,"seker_g":0,"protein_g":22,"tuz_g":2}}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Şahin Klasik Kayseri Çemeni 200 G', 'sahin-klasik-kayseri-cemeni-200-g', 'Şahin', '200 g', '', 64.9, 'adet', false, true, true, '{"icindekiler":"Su, kırmızı biber, çemen unu (%3), sarımsak, tuz, kimyon, yenibahar, karanfil, tarçın, koruyucu (potasyum sorbat)","net_miktar":"200 g","saklama":"0-4 °C''de muhafaza ediniz","mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Keskinoğlu Piliç Döner 200 G', 'keskinoglu-pilic-doner-200-g', 'Keskinoğlu', '200 g', '', 89, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"200 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Namet Pişmiş Döner 250 G', 'namet-pismis-doner-250-g', 'Namet', '250 g', '', 249, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":"NAMET GIDA SAN. VE TİC. A.Ş.","besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
insert into products (category_slug, name, slug, brand, size_text, description, price, unit, sold_by_weight, is_active, in_stock, details)
values ('sarkuteri-et', 'Erşan Pişmiş Dana Döner 250 G', 'ersan-pismis-dana-doner-250-g', 'Erşan', '250 g', '', 144.9, 'adet', false, true, true, '{"icindekiler":null,"net_miktar":"250 g","saklama":null,"mensei":"Türkiye","uretici":null,"besin100":null}'::jsonb)
on conflict (slug) do update set
  brand = excluded.brand,
  size_text = excluded.size_text,
  details = excluded.details;
select count(*) as sarkuteri_count from products where category_slug = 'sarkuteri-et';
