# Platform Admin Hesapları

Bu liste `backend/scripts/seed-admin.js` içindeki tanımlara göredir. Toplam **3** platform admin hesabı vardır.

| # | E-posta | Şifre | SEO erişimi |
|---|---------|--------|-------------|
| 1 | `.env` içindeki `ADMIN_EMAIL` | `.env` içindeki `ADMIN_PASSWORD` | Evet |
| 2 | info@technochef.com.tr | TechnoChef2026 | Evet |
| 3 | info@antmutder.org | Antmutder2026! | Hayır |

Üçüncü hesap (info@antmutder.org) SEO sekmesine ve SEO API erişimine sahip değildir; diğer tüm admin işlemlerini yapabilir.

Yeni admin eklemek veya şifre güncellemek için `seed-admin.js` içindeki `PLATFORM_ADMINS` dizisini düzenleyip `npm run seed:admin` çalıştırın.
