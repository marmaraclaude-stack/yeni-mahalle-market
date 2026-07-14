-- Şarküteri & Et temizliği:
-- 1) Bilinen markalar dışındaki (eski yer tutucu) ürünler vitrinden kaldırılır.
update products set is_active = false
where category_slug = 'sarkuteri-et'
  and (coalesce(trim(brand), '') = '' or brand not in (
    'Namet','Maret','Polonez','Pınar','Apikoğlu','Aytaç','Banvit','Gedik',
    'Keskinoğlu','Uzman Kasap','Şahin','Cumhuriyet','Torku','İkbal'
  ));
-- 2) Ad sonundaki gramaj takısı kaldırılır ("... 250 G", "... 1 Kg",
--    "... 2x110 G", "... Kg") — gramaj zaten ayrı satırda gösteriliyor.
update products
set name = trim(regexp_replace(name, '\s+((\d+\s*[xX]\s*)?\d+([.,]\d+)?\s*(g|kg|ml|l)|kg)\s*$', '', 'i'))
where category_slug = 'sarkuteri-et'
  and length(trim(regexp_replace(name, '\s+((\d+\s*[xX]\s*)?\d+([.,]\d+)?\s*(g|kg|ml|l)|kg)\s*$', '', 'i'))) > 3;
select
  (select count(*) from products where category_slug = 'sarkuteri-et' and is_active) as aktif,
  (select count(*) from products where category_slug = 'sarkuteri-et' and not is_active) as pasif;
