// Getir tarzı ALT KATEGORİLER. DB şeması değişmeden çalışır: ürün, adı +
// markası üzerinde kurallı (RegExp) eşlemeyle bir alt kategoriye atanır.
// /urunler'de kategori seçiliyken çip barı ve bölümlenmiş görünüm üretir.
// SIRA ÖNEMLİ: ilk eşleşen kural kazanır. Eşleşmeyen ürün "diger"e düşer.
// NOT: Kurallar supabase/migrations altındaki seed ürün adlarından çıkarıldı;
// Türkçe/ASCII yazım farkları ([şs], [çc], [ıi], [öo], [üu]) birlikte kapsanır.
// Her kategorinin SON kuralı catch-all (/./) olduğu için "diger" pratikte
// hiç kullanılmaz: her ürün adlandırılmış bir alt kategoriye düşer.

export interface SubCategory {
  slug: string;
  name: string;
  /** `${name} ${brand}` tr-TR lowercase metni üzerinde test edilir. */
  match: RegExp;
}

export const OTHER_SUB_SLUG = "diger";
export const OTHER_SUB_NAME = "Diğer";

export const CATEGORY_SUBS: Record<string, SubCategory[]> = {
  "meyve-sebze": [
    { slug: "yesillik", name: "Yeşillik", match: /maydanoz|dereotu|nane|roka|taze so[ğg]an|ye[şs]illik|marul|k[ıi]v[ıi]rc[ıi]k/ },
    { slug: "meyve", name: "Meyve", match: /muz|elma|karpuz|[çc]ilek|[şs]eftali|portakal|mandalina|limon|[üu]z[üu]m|kivi|\bnar\b|hicaznar|avokado|armut|ayva|greyfurt|kavun|nektarin|kay[ıi]s[ıi]|incir|hurma|ananas|mango|erik|kiraz|vi[şs]ne|b[öo][ğg][üu]rtlen|yaban mersini|ahududu|ejder|[çc]a[ğg]la|kestane|yeni d[üu]nya|\bdut\b|karadut|pasiflora|[çc]ark[ıi]felek/ },
    { slug: "sebze", name: "Sebze", match: /./ },
  ],
  // Migros sanal market yapısı: Sucuk / Salam / Sosis / Jambon / Pastırma /
  // Füme Et / Kavurma + mağazadaki taze et grupları; kalan "Diğer Et Şarküteri".
  "sarkuteri-et": [
    { slug: "sucuk", name: "Sucuk", match: /sucuk/ },
    { slug: "salam", name: "Salam", match: /salam/ },
    { slug: "sosis", name: "Sosis", match: /sosis/ },
    { slug: "jambon", name: "Jambon", match: /jambon/ },
    { slug: "pastirma", name: "Pastırma", match: /past[ıi]rma/ },
    { slug: "fume-et", name: "Füme Et", match: /f[üu]me|fume|bacon/ },
    { slug: "kavurma", name: "Kavurma", match: /kavurma/ },
    // Hindi TAVUKTAN ÖNCE: "hindi" geçen ürün Hindi'ye düşer, kalan kümes Tavuk'a.
    { slug: "hindi", name: "Hindi", match: /hindi/ },
    { slug: "tavuk", name: "Tavuk", match: /tavuk|pili[çc]|baget|kanat|g[öo][ğg][üu]s|gogus|nugget|[şs]nitzel|sinitzel|\bbut\b/ },
    { slug: "kirmizi-et", name: "Kırmızı Et", match: /k[ıi]yma|ku[şs]ba[şs][ıi]|kusbasi|bonfile|biftek|antrikot|k[öo]fte|kofte|dana|kuzu|\bet\b/ },
    { slug: "diger-et-sarkuteri", name: "Diğer Et Şarküteri", match: /./ },
  ],
  // Migros su ürünleri reyonu: taze balık (somon/levrek/çipura/hamsi...),
  // karides & deniz mahsulleri, dondurulmuş ve işlenmiş/füme ürünler.
  // SIRA: işlenmiş & dondurulmuş önce (ör. "Füme Somon" → İşlenmiş, "Somon" değil).
  "balik-su-urunleri": [
    { slug: "islenmis-fume", name: "İşlenmiş & Füme", match: /f[üu]me|fume|marin|salamura/ },
    { slug: "dondurulmus", name: "Dondurulmuş", match: /dondurul|pane\b|kroket/ },
    { slug: "somon", name: "Somon", match: /somon/ },
    { slug: "levrek-cipura", name: "Levrek & Çipura", match: /levrek|[çc]ipura|cipura|[çc]upra/ },
    { slug: "alabalik", name: "Alabalık", match: /alabal[ıi]k|alabalik/ },
    { slug: "karides-deniz", name: "Karides & Deniz Mahsulleri", match: /karides|midye|kalamar|ahtapot|istiridye|surimi|deniz mahsul/ },
    { slug: "hamsi-diger", name: "Hamsi & Diğer Balık", match: /hamsi|istavrit|palamut|sardalya|uskumru|mezgit|barbun|tekir|kefal|l[üu]fer|lufer|k[ıi]l[ıi][çc]|kalkan|dil bal|orkinos|sinarit|mercan|tran[çc]a/ },
    { slug: "diger-su-urunleri", name: "Diğer", match: /./ },
  ],
  "ekmek-firin": [
    { slug: "un-pastacilik", name: "Un & Pastacılık", match: /\bun\b|unu\b|maya|kabartma|vanilya|kar[ıi][şs][ıi]m|karisim|hamuru|kaday[ıi]f|eri[şs]te|eriste|krep|ni[şs]asta/ },
    { slug: "kek-kurabiye", name: "Kek & Kurabiye", match: /kek|kurabiye|browni|kuru pasta|milf[öo]y|milfoy/ },
    { slug: "simit-pogaca", name: "Simit & Poğaça", match: /simit|po[ğg]a[çc]a|pogaca|poace|a[çc]ma|acma|[çc][öo]rek|corek|kruvasan|g[öo]zleme|gozleme/ },
    { slug: "yufka-lavas", name: "Lavaş & Yufka", match: /lava[şs]|lavas|bazlama|yufka|pide|tortilla|wrap/ },
    { slug: "ekmek", name: "Ekmek", match: /./ },
  ],
  "sut-kahvaltilik": [
    { slug: "peynir", name: "Peynir", match: /peynir|ka[şs]ar|kasar|labne|\blor\b|[çc]e[çc]il|cecil|tulum|[üu][çc]gen/ },
    { slug: "yogurt-ayran", name: "Yoğurt & Ayran", match: /yo[ğg]urt|yogurt|ayran|kefir|activia/ },
    { slug: "tereyagi-margarin", name: "Tereyağı & Margarin", match: /tereya[ğg]|tereyag|margarin|kaymak|sana\b/ },
    { slug: "bal-recel-ezme", name: "Bal, Reçel & Ezme", match: /bal[ıi]?\b|re[çc]el|recel|nutella|sarelle|kakaolu|ezme|tahin|pekmez|petek/ },
    { slug: "yumurta", name: "Yumurta", match: /yumurta/ },
    { slug: "sut", name: "Süt", match: /./ },
  ],
  "icecek-su": [
    { slug: "soda-maden-suyu", name: "Soda & Maden Suyu", match: /maden suyu|soda|schweppes|tonik|beypazar[ıi]|s[ıi]rma|sar[ıi]k[ıi]z|k[ıi]z[ıi]lay/ },
    { slug: "su", name: "Su", match: /\bsu\b|kaynak suyu|damacana/ },
    { slug: "soguk-cay-limonata", name: "Soğuk Çay & Limonata", match: /[ıi]ce tea|so[ğg]uk [çc]ay|fuse tea|didi|limonata|ye[şs]il [çc]ay|[ıi]hlamur/ },
    { slug: "meyve-suyu", name: "Meyve Suyu", match: /meyve suyu|nektar|suyu|cappy|tamek|dimes|tropicana|juss/ },
    { slug: "enerji-icecegi", name: "Enerji İçeceği", match: /enerji|red ?bull|monster|malt|bur[çc]ak/ },
    { slug: "ayran-sut-icecekleri", name: "Ayran & Süt İçecekleri", match: /ayran|latte|buzlu kahve|s[üu]t/ },
    { slug: "gazli-icecek", name: "Gazlı İçecek", match: /./ },
  ],
  "bakliyat-makarna": [
    { slug: "makarna", name: "Makarna", match: /makarna|spag|penne|burgu|kelebek|fiyonk|eri[şs]te|eriste|lazanya|fettu|rigatoni|mant[ıi]|manti|noodle|boncuk/ },
    { slug: "pirinc-bulgur", name: "Pirinç & Bulgur", match: /pirin[çc]|pirinc|baldo|osmanc[ıi]k|basmati|bulgur|firik|kinoa|karabu[ğg]day/ },
    { slug: "un-nisasta", name: "Un & Nişasta", match: /\bun\b|unu\b|ni[şs]asta|nisasta/ },
    { slug: "sehriye-kuskus", name: "Şehriye & Kuskus", match: /[şs]ehriye|sehriye|kuskus|[ıi]rmik|irmik/ },
    { slug: "bakliyat", name: "Bakliyat", match: /./ },
  ],
  "konserve-hazir-yemek": [
    { slug: "ton-baligi-deniz", name: "Ton Balığı & Deniz", match: /ton bal|dardanel|uskumru|sardalya|hamsi|karides/ },
    { slug: "hazir-corba", name: "Hazır Çorba", match: /[çc]orba|corba/ },
    { slug: "salca-domates", name: "Salça & Domates", match: /sal[çc]a|salca|do[ğg]ranm[ıi][şs]|dogranmis|domates suyu|konsantre/ },
    { slug: "hazir-yemek-sos", name: "Hazır Yemek & Sos", match: /haz[ıi]r|hazir|\bsos\b|sarma|dolma|pilaki|k[ıi]s[ıi]r\b|pilav|etli|k[öo]fteli|kofteli|menemen|noodle|indomie|zeytinya[ğg]l[ıi]|zeytinyagli/ },
    { slug: "konserve", name: "Konserve", match: /./ },
  ],
  "yag-sos-baharat": [
    { slug: "zeytinyagi", name: "Zeytinyağı", match: /zeytinya[ğg]|zeytinyag/ },
    { slug: "sivi-yag", name: "Sıvı Yağ", match: /ya[ğg]/ },
    { slug: "ketcap-mayonez-sos", name: "Ketçap, Mayonez & Sos", match: /ket[çc]ap|ketcap|mayonez|hardal|barbek[üu]|barbeku|sos|soya|sal[çc]a|salca|tahin/ },
    { slug: "sirke-nar-eksisi", name: "Sirke & Nar Ekşisi", match: /sirke|nar ek[şs]isi|eksisi|balsamik/ },
    { slug: "tuz-seker", name: "Tuz & Şeker", match: /tuz|[şs]eker/ },
    { slug: "baharat", name: "Baharat & Bulyon", match: /./ },
  ],
  "atistirmalik": [
    { slug: "kraker", name: "Kraker", match: /kraker|crax|krispi|grissini/ },
    { slug: "gofret", name: "Gofret", match: /gofret|[çc]okoprens|cokoprens/ },
    { slug: "bar", name: "Bar", match: /\bbar\b|canga|wanted|metro|albeni|snickers|mars|hobby|caramio/ },
    { slug: "kek", name: "Kek", match: /kek|browni/ },
    { slug: "biskuvi", name: "Bisküvi", match: /./ },
  ],
  "cips-kuruyemis": [
    { slug: "cips", name: "Cips", match: /cips|lay|ruffles|doritos|cheetos|pringles|patos|[çc]erezza|cerezza|nacho|patlam[ıi][şs]|patlatmal[ıi]k|patlatmalik|popcorn/ },
    { slug: "cekirdek", name: "Çekirdek", match: /[çc]ekird|cekird|[çc]itliyo|citliyo|nutzz/ },
    { slug: "kuru-meyve", name: "Kuru Meyve", match: /kuru [üu]z[üu]m|kuru uzum|kuru kay[ıi]s[ıi]|kuru kayisi|kuru [ıi]ncir|hurma|mango|cranberry|kurusu|kuru dut|kuru erik|kuru muz|k[ıi]z[ıi]lc[ıi]k|kuru ananas|tropik|kuru elma|goji|vi[şs]ne/ },
    { slug: "kuruyemis", name: "Kuruyemiş", match: /./ },
  ],
  "cikolata-sekerleme": [
    { slug: "lokum-helva", name: "Lokum & Helva", match: /lokum|helva|cezerye|pi[şs]maniye|pismaniye|kestane|akide|badem ezmesi|badem [şs]ekeri|badem sekeri/ },
    { slug: "sakiz", name: "Sakız", match: /sak[ıi]z|sakiz|fal[ıi]m|falim|vivident/ },
    { slug: "sekerleme-jelibon", name: "Şekerleme & Jelibon", match: /jelibon|haribo|yumu[şs]ak [şs]eker|yumusak seker|marshmallow|tofita|lolipop|chupa|pastil|olips|ay[ıi]c[ıi]k|ayicik|sarma[şs][ıi]k/ },
    { slug: "cikolata", name: "Çikolata", match: /./ },
  ],
  "kahve-cay": [
    { slug: "turk-kahvesi", name: "Türk Kahvesi", match: /t[üu]rk kahvesi|turk kahvesi|mehmet efendi|dibek|menengi[çc]|menengic|osmanl[ıi] kahvesi|cezve/ },
    { slug: "hazir-kahve", name: "Hazır Kahve", match: /nescafe|jacobs|tchibo|haz[ıi]r kahve|hazir kahve|3[üu]1|3u1|2u1|cappuccino|latte|gold|classic|dolce gusto|kaps[üu]l|kapsul|espresso|so[ğg]uk kahve|soguk kahve|krema|crown/ },
    { slug: "filtre-cekirdek", name: "Filtre & Çekirdek Kahve", match: /filtre|[çc]ekirdek|cekirdek|kahve d[üu]nyas[ıi]|kahve dunyasi/ },
    { slug: "bitki-cayi", name: "Yeşil & Bitki Çayı", match: /ye[şs]il [çc]ay|yesil cay|[ıi]hlamur|ada[çc]ay|adacay|ku[şs] ?burnu|kus ?burnu|rezene|papatya|zencefil|k[ıi][şs] [çc]ay|kis cay|meyve bah[çc]esi|form|kekik|nane|beyaz [çc]ay|oralet|sahlep|salep/ },
    { slug: "cay", name: "Çay", match: /./ },
  ],
  "dondurma": [
    { slug: "kulah", name: "Külah", match: /cornetto|k[üu]lah|kulah|waffle/ },
    { slug: "cubuk", name: "Çubuk Dondurma", match: /magnum|[çc]ubuk|cubuk|twister|frigo|mikado|kalippo|\bmax\b|maxi|alaska|[çc][ıi]t[ıi]r|citir|buz\b/ },
    { slug: "sandvic", name: "Sandviç Dondurma", match: /sandvi[çc]|sandvic|sandwich/ },
    { slug: "kutu", name: "Kutu Dondurma", match: /./ },
  ],
  "donuk-gida": [
    { slug: "deniz-urunleri", name: "Deniz Ürünleri", match: /karides|kalamar|bal[ıi]k|balik|levrek|somon/ },
    { slug: "pizza", name: "Pizza & Pide", match: /pizza|lahmacun|pide/ },
    { slug: "patates", name: "Donuk Patates", match: /patates|kroket/ },
    { slug: "borek-hamur", name: "Börek, Mantı & Hamur", match: /b[öo]re[kğg]|bore[kg]|milf[öo]y|milfoy|yufka|mant[ıi]|manti|hamuru|waffle|pankek|baklava|peynirli [çc]ubuk|peynirli cubuk/ },
    { slug: "kofte-tavuk", name: "Köfte & Tavuk", match: /nugget|k[öo]fte|kofte|[şs]nitzel|sinitzel|snitzel|kanat|pili[çc]|pilic|tavuk|hamburger/ },
    { slug: "donuk-sebze", name: "Donuk Sebze & Meyve", match: /./ },
  ],
  "zeytin-tursu": [
    { slug: "tursu", name: "Turşu", match: /tur[şs]u|tursu|[şs]algam|salgam/ },
    { slug: "ezme-mezelik", name: "Zeytin Ezmesi & Mezelik", match: /ezme|salamura|yaprak|kapari|kuru domates|domates kurusu|tapenade|mezelik/ },
    { slug: "siyah-zeytin", name: "Siyah Zeytin", match: /siyah|gemlik|sele|kalamata/ },
    { slug: "yesil-zeytin", name: "Yeşil Zeytin", match: /ye[şs]il|yesil|[çc]izik|cizik|k[ıi]rma|kirma|domat|dolgulu|[çc]atlak|catlak/ },
    { slug: "zeytin", name: "Zeytin", match: /./ },
  ],
  "temizlik-deterjan": [
    { slug: "bulasik", name: "Bulaşık", match: /bula[şs][ıi]k|bulasik|fairy|pril|finish|somat|alix/ },
    { slug: "banyo-wc", name: "Banyo & WC", match: /\bwc\b|klozet|banyo|kire[çc]|kirec|bref|calgon/ },
    { slug: "camasir-suyu", name: "Çamaşır Suyu", match: /[çc]ama[şs][ıi]r suyu|camasir suyu|domestos|\bace\b/ },
    { slug: "camasir", name: "Çamaşır Yıkama", match: /deterjan|yumu[şs]at[ıi]c[ıi]|yumusatici|omo|ariel|persil|perwoll|yumo[şs]|yumos|vernel|matik|ipek|sofa|boncu[ğg]|boncug|sirkesi/ },
    { slug: "yuzey", name: "Yüzey Temizlik", match: /./ },
  ],
  "kagit-urunleri": [
    { slug: "islak-havlu", name: "Islak Havlu & Mendil", match: /[ıi]slak/ },
    { slug: "tuvalet-kagidi", name: "Tuvalet Kağıdı", match: /tuvalet/ },
    { slug: "mendil", name: "Mendil", match: /mendil/ },
    { slug: "pecete", name: "Peçete", match: /pe[çc]ete|pecete|pecere|kokteyl/ },
    { slug: "kagit-havlu", name: "Kağıt Havlu", match: /./ },
  ],
  "kisisel-bakim": [
    { slug: "sac-bakim", name: "Saç Bakım", match: /[şs]ampuan|sampuan|sa[çc] kremi|sac kremi|elidor|pantene|blendax|gliss|elseve|head|clear/ },
    { slug: "agiz-bakim", name: "Ağız Bakım", match: /di[şs]|\bdis\b|colgate|sensodyne|signal|ipana|oral-b|listerine|a[ğg][ıi]z/ },
    { slug: "deodorant", name: "Deodorant", match: /deo|roll-?on|rexona|axe|old spice/ },
    { slug: "tiras", name: "Tıraş", match: /t[ıi]ra[şs]|tra[şs]|tras|gillette|arko men|b[ıi][çc]ak|bicak|jilet/ },
    { slug: "dus-sabun", name: "Duş Jeli & Sabun", match: /du[şs] jeli|dus jeli|sabun|palmolive|[şs]akir|sakir/ },
    { slug: "ped-hijyen", name: "Ped & Hijyen", match: /\bped\b|orkid|molped|tampon|hijyenik|kulak|[ıi]slak|islak|dezenfekta|o\.b\./ },
    { slug: "cilt-bakim", name: "Cilt Bakım & Kolonya", match: /./ },
  ],
  "vitamin-ilk-yardim": [
    { slug: "agri-soguk-alginligi", name: "Ağrı & Soğuk Algınlığı", match: /aspirin|parol|nurofen|voltaren|bepanthol|vicks|gaviscon|rennie|strepsils|merhem|pastil|antiasit|emulgel|thermacare/ },
    { slug: "yara-bandi-sargi", name: "Yara Bandı & Sargı", match: /yara band|bandaj|gazl[ıi] bez|gazli bez|pamuk|flaster|hansaplast|canped|[ıi]lk yard[ıi]m|ilk yardim/ },
    { slug: "antiseptik", name: "Antiseptik & Dezenfektan", match: /antiseptik|dezenfekta|oksijenli|batticon|betadine|rivanol|dettol/ },
    { slug: "maske-olcum", name: "Maske & Ölçüm", match: /maske|ate[şs] [öo]l[çc]|ates olc|termometre|tansiyon/ },
    { slug: "vitamin-takviye", name: "Vitamin & Takviye", match: /./ },
  ],
  "tek-kullanimlik-piknik": [
    { slug: "cop-poseti", name: "Çöp Poşeti", match: /[çc][öo]p po[şs]|cop pos|[çc][öo]p tor|cop tor/ },
    { slug: "folyo-strec-poset", name: "Folyo, Streç & Poşet", match: /folyo|stre[çc]|strec|kilitli|buzdolab[ıi]|buzdolabi|dondurucu|pi[şs]irme|pisirme|f[ıi]r[ıi]n ka[ğg]|firin kag|f[ıi]r[ıi]n torba|firin torba|buz po[şs]et|buz poset/ },
    { slug: "catal-kasik", name: "Çatal, Kaşık & Pipet", match: /[çc]atal|catal|ka[şs][ıi]k|kasik|b[ıi][çc]ak|bicak|pipet|kar[ıi][şs]t[ıi]r[ıi]c[ıi]|karistirici/ },
    { slug: "bardak-tabak", name: "Bardak, Tabak & Peçete", match: /bardak|tabak|kase|kutu|tepsi|pe[çc]ete|pecete/ },
    { slug: "piknik-gerecleri", name: "Piknik Gereçleri", match: /./ },
  ],
  "bebek": [
    { slug: "islak-mendil", name: "Islak Mendil", match: /[ıi]slak/ },
    { slug: "bebek-bezi", name: "Bebek Bezi", match: /\bbez\b|bezi|k[üu]lot|kulot|prima|molfix|huggies|pampers|canbebe|onlylife/ },
    { slug: "biberon-emzik", name: "Biberon & Emzik", match: /biberon|emzik|avent|chicco|\bnuk\b|di[şs] ka[şs][ıi]y|dis kasiy|mama [öo]nl[üu]|mama onlu/ },
    { slug: "mama-devam-sutu", name: "Mama & Devam Sütü", match: /mama|devam s[üu]t|baslangic|ba[şs]lang[ıi][çc]|aptamil|bebelac|hipp|milupa|hero baby|p[üu]re|pure|bisk[üu]visi|biskuvisi|biscolac|[çc]ocuk s[üu]t/ },
    { slug: "bebek-bakim", name: "Bebek Bakım", match: /./ },
  ],
  "evcil-hayvan": [
    { slug: "kedi-kumu", name: "Kedi Kumu", match: /kedi kumu|kedi tuvaleti|catsan|ever clean|bentonit|silika/ },
    { slug: "kedi-mamasi", name: "Kedi Maması", match: /kedi mama|kedi [öo]d[üu]l|kedi odul|whiskas|felix|dreamies|sheba|kitten|temptations|malt/ },
    { slug: "kopek-mamasi", name: "Köpek Maması", match: /k[öo]pek|kopek|pedigree|chappi|dentastix|tasma|gezdirme/ },
    { slug: "kus-balik-kemirgen", name: "Kuş, Balık & Kemirgen", match: /ku[şs]|kus |muhabbet|kanarya|papa[ğg]an|papagan|bal[ıi]k yemi|balik yemi|akvaryum|hamster|tav[şs]an|tavsan|gaga/ },
    { slug: "aksesuar-oyuncak", name: "Aksesuar & Oyuncak", match: /./ },
  ],
  "ev-yasam": [
    { slug: "bardak-sofra", name: "Bardak & Sofra", match: /bardak|tabak|kase|fincan|kupa|s[üu]rahi|surahi|sofra|[çc]atal|catal|ka[şs][ıi]k|kasik|b[ıi][çc]ak|bicak/ },
    { slug: "saklama", name: "Saklama & Kavanoz", match: /saklama|kavanoz|erzak|vakum|\bkap\b|kab[ıi]\b|kutu/ },
    { slug: "aydinlatma-pil", name: "Aydınlatma & Pil", match: /ampul|led|fener|lamba|ayd[ıi]nlat|aydinlat|\bpil\b|mum/ },
    { slug: "banyo-camasir", name: "Banyo & Çamaşır", match: /havlu|paspas|ask[ıi]|aski|sepet|le[ğg]en|legen|kova|mandal|[çc]ama[şs][ıi]r|camasir|kurutma/ },
    { slug: "mutfak-gerecleri", name: "Mutfak Gereçleri", match: /./ },
  ],
  "mangal-komur": [
    { slug: "tutusturucu-cira", name: "Tutuşturucu & Çıra", match: /yakma|tutu[şs]t|tutust|[çc][ıi]ra|cira|jel|parafin/ },
    { slug: "komur-odun", name: "Kömür & Odun", match: /k[öo]m[üu]r|komur|odun|briket/ },
    { slug: "mangal-ekipman", name: "Mangal & Ekipman", match: /./ },
  ],
  "cakmak-kibrit-tup": [
    { slug: "kibrit", name: "Kibrit", match: /kibrit/ },
    { slug: "tup-kartus", name: "Tüp & Kartuş", match: /t[üu]p|tup|kartu[şs]|kartus|aygaz|reg[üu]lat[öo]r|regulator|kamp gaz|kamp oca[ğg]|kamp ocagi|gaz ka[çc]ak|gaz kacak/ },
    { slug: "cakmak-gazi-yedek", name: "Çakmak Gazı & Yedek", match: /[çc]akmak gaz|cakmak gaz|[çc]akmak ta[şs]|cakmak tas|benzin|fitil|ate[şs]leyici|atesleyici|sofben/ },
    { slug: "cakmak", name: "Çakmak", match: /./ },
  ],
  "sarj-aleti-pil": [
    { slug: "sarj-edilebilir-pil", name: "Şarj Edilebilir Pil", match: /[şs]arj edilebilir|sarj edilebilir|pil [şs]arj cihaz|pil sarj cihaz/ },
    { slug: "pil", name: "Pil", match: /\bpil\b|duracell|varta|energizer|panasonic|d[üu][ğg]me|dugme|cr2032|lr44|alkalin/ },
    { slug: "powerbank", name: "Powerbank", match: /powerbank|power bank/ },
    { slug: "kablo", name: "Şarj Kablosu", match: /kablo\b|kablosu\b/ },
    { slug: "sarj-aleti-adaptor", name: "Şarj Aleti & Adaptör", match: /./ },
  ],
  "plaj-mayo-terlik": [
    { slug: "mayo-bikini", name: "Mayo & Bikini", match: /mayo|bikini|tankini|deniz [şs]ortu|deniz sortu/ },
    { slug: "terlik-ayakkabi", name: "Terlik & Deniz Ayakkabısı", match: /terli[kğg]|sandalet|ayakkab|pati[ğgk]|patig|slide/ },
    { slug: "yuzme-gozluk", name: "Deniz Gözlüğü & Yüzme", match: /g[öo]zl[üu]|gozlu|[şs]norkel|snorkel|y[üu]z|yuz|bone|kep\b|kulak t[ıi]ka|kulak tika|burun klips/ },
    { slug: "havlu-bornoz", name: "Plaj Havlusu & Bornoz", match: /havlu|pe[şs]temal|pestemal|bornoz|pareo/ },
    { slug: "plaj-oyun", name: "Plaj Oyunları", match: /top\b|topu|kova|kum|raket|file|voleybol/ },
    { slug: "sapka-canta", name: "Şapka, Çanta & Aksesuar", match: /./ },
  ],
  "gunes-kremi-plaj": [
    { slug: "semsiye-gozluk", name: "Şemsiye & Gözlük", match: /[şs]emsiye|semsiye|g[öo]zl[üu]|gozlu/ },
    { slug: "gunes-sonrasi", name: "Güneş Sonrası", match: /g[üu]ne[şs] sonras[ıi]|gunes sonrasi|after ?sun|aloe vera/ },
    { slug: "bronzlastirici", name: "Bronzlaştırıcı", match: /bronzla[şs]t|bronzlast/ },
    { slug: "cocuk-gunes", name: "Çocuk Güneş Ürünleri", match: /[çc]ocuk|cocuk|kids|bebek/ },
    { slug: "gunes-spreyi-yagi", name: "Güneş Spreyi & Yağı", match: /sprey|ya[ğg][ıi]|yagi|roll/ },
    { slug: "gunes-kremi", name: "Güneş Kremi & Losyon", match: /./ },
  ],
  "sisme-bot-havuz": [
    { slug: "pompa-aksesuar", name: "Pompa & Aksesuar", match: /pompa|tamir|yama|k[üu]re[kğg]|kure[kg]|s[üu]zge[çc]|suzgec|kep[çc]e|kepce|klor|branda|kapak|bardakl[ıi]k|bardaklik/ },
    { slug: "simit-kolluk", name: "Deniz Simidi & Kolluk", match: /simi[dt]|kollu/ },
    { slug: "yatak-koltuk", name: "Deniz Yatağı & Koltuk", match: /yata[kğg]|yatag|koltuk|[şs]ezlong|sezlong/ },
    { slug: "havuz", name: "Havuz", match: /havuz/ },
    { slug: "bot-binek-oyun", name: "Bot, Binek & Oyun", match: /./ },
  ],
  "sinek-bocek-kovucu": [
    { slug: "elektrikli-kovucu", name: "Elektrikli Kovucu", match: /elektrikli|likit|s[ıi]v[ıi]l[ıi]|sivili|\bmat\b|vape|yedek s[ıi]v[ıi]|yedek sivi|uv lamba|raket|ultrasonik/ },
    { slug: "sineklik-cibinlik", name: "Sineklik & Cibinlik", match: /cibinli|sinekli/ },
    { slug: "tuzak-yem", name: "Tuzak & Yem", match: /tuza[kğg]|tuzag|yem\b|yemi|yap[ıi][şs]kan|yapiskan|fare|kapan|g[üu]ve|guve|kar[ıi]nca jel|karinca jel|sinek ka[ğg][ıi]d|sinek kagid|serit|[şs]erit/ },
    { slug: "kovucu-losyon", name: "Kovucu Losyon & Bileklik", match: /kovucu|losyon|bileklik|spiral|sarmal|tuts[üu]|tutsu|sitronella|derma/ },
    { slug: "sprey-ilac", name: "Sprey & İlaç", match: /./ },
  ],
};

/** KODDAKİ varsayılan alt kategori tanımları; yoksa boş dizi.
    Vitrin/admin sayfaları DB'yi de hesaba katan getSubcatsMap() kullanır
    (lib/shop/subcats-data); bu fonksiyon yalnız varsayılanları verir. */
export function defaultSubcatsFor(categorySlug: string): SubCategory[] {
  return CATEGORY_SUBS[categorySlug] ?? [];
}

/** İstemciye taşınabilir alt kategori tanımı (RegExp yerine desen metni). */
export interface SubcatDTO {
  slug: string;
  name: string;
  pattern: string;
}

export function subToDTO(s: SubCategory): SubcatDTO {
  return { slug: s.slug, name: s.name, pattern: s.match.source };
}

export function dtoToSub(d: SubcatDTO): SubCategory {
  let match: RegExp;
  try {
    match = new RegExp(d.pattern);
  } catch {
    match = /(?!)/; // geçersiz desen: hiçbir ada eşleşmez (elle atama çalışır)
  }
  return { slug: d.slug, name: d.name, match };
}

/**
 * Ürünü verilen listedeki bir alt kategoriye ata. Yönetici elle bir alt
 * kategori seçmişse (override) ve listede geçerliyse onu kullanır; yoksa
 * ilk eşleşen kural, o da yoksa "diger".
 */
export function assignSubcategory(
  subs: SubCategory[],
  name: string,
  brand: string,
  override?: string | null,
): string {
  if (subs.length === 0) return OTHER_SUB_SLUG;
  if (override && subs.some((s) => s.slug === override)) return override;
  const hay = `${name} ${brand}`.toLocaleLowerCase("tr-TR");
  for (const s of subs) {
    if (s.match.test(hay)) return s.slug;
  }
  return OTHER_SUB_SLUG;
}
