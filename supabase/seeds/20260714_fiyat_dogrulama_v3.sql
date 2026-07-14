-- Fiyat doğrulama temizliği (seed v3)
-- Fiyatı doğrulanamayan pasif ürünler kaldırılır:
delete from products where category_slug = 'sarkuteri-et' and price = 0 and is_active = false;
delete from products where category_slug = 'sarkuteri-et' and slug = 'gedik-pilic-kofte-300-g';
update products set price = 189.7 where slug = 'namet-dana-macar-salam-150-g'; -- Namet Dana Macar Salam 150 G
update products set price = 42.5 where slug = 'aytac-sipsak-dana-dilimli-macar-salam-60-g'; -- Aytaç Şipşak Dana Dilimli Macar Salam 60 G
update products set price = 329.0 where slug = 'torku-cemeni-siyrilmis-dilimli-pastirma-120-g'; -- Torku Çemeni Sıyrılmış Dilimli Pastırma 120 G
update products set price = 32.5 where slug = 'polonez-fit-yasam-hindi-fume-10-dilim-60-g'; -- Polonez Fit Yaşam Hindi Füme 10 Dilim 60 G
update products set price = 317.7 where slug = 'pinar-klasik-kangal-sucuk-225-g'; -- Pınar Klasik Kangal Sucuk 225 G
update products set price = 140.8 where slug = 'banvit-pilic-baget-kg'; -- Banvit Piliç Baget Kg
update products set price = 239.95 where slug = 'gedik-pilic-bonfile-kg'; -- Gedik Piliç Bonfile Kg
update products set price = 99.95 where slug = 'gedik-pilic-but-kg'; -- Gedik Piliç But Kg
update products set price = 125.0 where slug = 'keskinoglu-tabakli-butun-pilic-kg'; -- Keskinoğlu Tabaklı Bütün Piliç Kg
select count(*) as sarkuteri_count from products where category_slug = 'sarkuteri-et';
