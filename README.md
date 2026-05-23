# Yeni Mahalle Market

Sapanca / Sakarya'da hizmet veren **Yeni Mahalle Market** için kurumsal landing + canlı destek paneli.

- Next.js 16 (App Router, React 19, TypeScript)
- Supabase (Postgres + Realtime — chat veritabanı)
- Vercel deploy
- Domain: [sapancayenimahallemarket.com](https://sapancayenimahallemarket.com)

## Geliştirme

```bash
npm install
cp .env.example .env.local      # Supabase + admin key'lerini doldur
npm run dev                     # http://localhost:3000
```

## Build

```bash
npm run build && npm start
```

## Yapı

```
app/                 # App Router sayfaları + global CSS
  layout.tsx         # Metadata + JSON-LD + font setup
  page.tsx           # Landing
  sitemap.ts         # MetadataRoute sitemap
  robots.ts          # MetadataRoute robots
components/
  icons/             # Özel SVG ikon set'i
lib/
  business.ts        # NAP tek kaynak — UI, meta ve JSON-LD aynı stringi kullanır
```

## Önemli not

Bu projenin **NAP bilgisi** (isim, adres, telefon) Google için kritik. Tüm metinleri tek bir noktadan (`lib/business.ts`) okuyoruz. Düzenlerken bu kuralı bozmayın — Google İşletme profili ile sitenin birebir eşleşmesi gerekiyor.

## Lisans

© Yeni Mahalle Market. Tüm hakları saklıdır.
