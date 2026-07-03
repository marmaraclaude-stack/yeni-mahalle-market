# E-Ticaret Kurulum Rehberi

Kod tarafı hazır. Sitenin online sipariş alabilmesi için **iki manuel adım** gerekiyor
(ikisi de sizin hesaplarınızda olduğu için sizin yapmanız gerek):

---

## Adım 1 — Supabase: veritabanı tablolarını kur (5 dk)

1. [supabase.com](https://supabase.com) → giriş yap → **sitenin projesi**ni aç
   (chat widget'ın kullandığı proje — Vercel'deki `NEXT_PUBLIC_SUPABASE_URL` ile aynı).
2. Sol menü → **SQL Editor** → **New query**.
3. Şu dosyanın **tamamını** kopyala-yapıştır → **Run**:
   `supabase/migrations/20260703100000_eticaret_schema.sql`
   ("Success. No rows returned" görmelisin.)
4. Yeni bir query aç, şu dosyayı yapıştır → **Run**:
   `supabase/migrations/20260703100001_eticaret_seed.sql`
   (30 kategori + 284 ürün yüklenir.)
5. Kontrol: sol menü → **Table Editor** → `products` tablosunda ~284 satır görünmeli.

> Sıra önemli: önce schema, sonra seed.

### Ek: hesaba bağlı sepet tablosu (cart_items) — 1 dk

Sepetlerin hesaba bağlanması için bir SQL daha gerekiyor. SQL Editor'de
yeni bir query aç, şu dosyanın tamamını yapıştır → **Run**:
`supabase/migrations/20260703200000_cart_items.sql`

Bu tablo kurulmadan da site çalışır: sepet tarayıcıda (localStorage) tutulmaya
devam eder. Kurulunca giriş yapmış müşterilerin sepeti hesabına kaydedilir ve
cihazlar arasında taşınır.

## Adım 2 — Vercel: ortam değişkenleri (2 dk)

Vercel → proje → **Settings → Environment Variables**. Şunların var olduğundan emin ol
(chat kurulumundan zaten olması gerekenler):

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i (var olmalı) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (var olmalı) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (var olmalı) |
| `ADMIN_PASSWORD` | Admin panel parolası (var olmalı) |

iyzico için (BAŞVURU ONAYLANINCA eklenecek — şimdilik gerekmez):

| Değişken | Açıklama |
|---|---|
| `IYZICO_API_KEY` | iyzico API anahtarı |
| `IYZICO_SECRET_KEY` | iyzico gizli anahtar |
| `IYZICO_BASE_URL` | Test: `https://sandbox-api.iyzipay.com` · Canlı: `https://api.iyzipay.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://sapancayenimahallemarket.com` (iyzico dönüş adresi için) |

> iyzico anahtarları girilmediği sürece sitede online kart ödemesi GÖRÜNMEZ;
> kapıda nakit/kart ile sipariş normal çalışır. Anahtarlar girilince ayrıca
> admin panel → Ayarlar → "iyzico" anahtarını açman gerekir (çifte kontrol).

---

## Ne nerede?

| Sayfa | Adres |
|---|---|
| Ürün kataloğu | `/urunler` (kategori + arama filtreli) |
| Sepet | `/sepet` |
| Ödeme | `/odeme` (misafir veya üye) |
| Sipariş takibi | `/siparis/YM-XXXXXX` (üye: otomatik, misafir: telefonla doğrulama) |
| Giriş / Kayıt / Hesabım | `/giris` · `/kayit` · `/hesap` |
| Admin panel | `/admin` (özet) · `/admin/siparisler` (durum board'u) · `/admin/urunler` (fiyat/stok) · `/admin/ayarlar` |

## Sipariş akışı (admin tarafı)

Sipariş düşünce `/admin/siparisler`de belirir (15 sn'de bir otomatik yenilenir).
Durumlar: **Sipariş Alındı → Onaylandı → Hazırlanıyor → Kurye Yolda → Teslim Edildi**
(+ İptal). Her ilerletme müşterinin takip sayfasına anında yansır.
Kapıda ödemeli sipariş "Teslim Edildi" yapılınca ödeme otomatik "Ödendi" işaretlenir.

## Önemli notlar

- **Sigara & Tütün**: 4207/4733 sayılı kanunlar gereği online SATILAMAZ.
  Kategori katalogda görünür ama ürünler sepete eklenemez ("Mağazadan alınır").
- **Fiyatlar**: Seed'deki fiyatlar tahmini piyasa fiyatı — `/admin/urunler`den
  satır içi düzenlenebilir. Yeni ürün de oradan eklenir.
- **Teslimat ücreti / minimum sepet**: `/admin/ayarlar`dan yönetilir
  (varsayılan: ücret 0, minimum yok).
- **Acil kapatma**: `/admin/ayarlar` → "Sipariş almaya açık" anahtarı.

## iyzico başvurusu (özet)

1. [iyzico.com/basvuru](https://www.iyzico.com) → işletme bilgileri + banka hesabı ile başvur.
2. Onay gelince Merchant Panel → Ayarlar → API Anahtarları'ndan al.
3. Önce sandbox anahtarlarıyla test et (sandbox-merchant.iyzipay.com'dan ayrı test anahtarı).
4. Canlıya geçerken `IYZICO_BASE_URL`'i `https://api.iyzipay.com` yap.
