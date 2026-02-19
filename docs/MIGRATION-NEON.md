# Prisma Postgres → Neon Migrasyon Rehberi

Veritabanını Prisma Postgres'ten Neon'a taşımak için adımlar.

## Ön koşul

Prisma kotası dolduğunda yedek almak için sorgular bloklu olabilir. İki seçenek:

- **A)** Ay sonunda kota sıfırlanınca yedek alın
- **B)** Prisma'yı geçici olarak Starter plana geçirip yedek alın (≈$10)

---

## Adım 1: Yedek al (mevcut Prisma DB)

```bash
cd backend
npm run backup:db
```

Çıktı: `backend/backup-YYYY-MM-DDTHH-MM-SS.sql`

**Yedek yöntemleri (sırayla denenir):**
1. **pg_dump** – Yüklüyse tam schema + veri
2. **Docker** – `docker run ... pg_dump ...`
3. **Node.js (pg)** – Yerel PostgreSQL kurulumu gerekmez, **sadece veri** yedekler

**Node.js yedeği kullanıldıysa:** Restore öncesi hedef DB'de schema oluşturulmalı (`npm run db:sync`). pg_dump/Docker ile tam yedek alındıysa schema zaten dahildir.

---

## Adım 2: Neon hesabı ve proje

1. https://neon.tech → Ücretsiz kayıt
2. **New Project** → İsim: `muteahhitler-db`
3. **Connection string** kopyala (örn: `postgres://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

---

## Adım 3: Yedeği Neon'a yükle

**Node.js yedeği (veri only) kullandıysanız:** Önce Neon'da schema oluşturun:
```bash
# .env'de POSTGRES_URL veya DATABASE_URL'i Neon connection string yapın, sonra:
npm run db:sync
```

Sonra restore:
```bash
cd backend
NEON_URL="postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" node scripts/restore-db.js backup-xxx.sql
```

`NEON_URL` yerine yeni connection string kullanın.

**psql yoksa:** Restore script önce psql, sonra Docker, sonra Node.js ile dener.

---

## Adım 4: Vercel env değişkenlerini güncelle

1. Vercel Dashboard → Proje → **Settings** → **Environment Variables**
2. `POSTGRES_URL` → Neon connection string
3. `DATABASE_URL` → Aynı Neon connection string
4. `PRISMA_DATABASE_URL` → Silebilirsiniz (Sequelize kullanıyorsunuz)
5. **Production**, **Preview**, **Development** için kaydedin

---

## Adım 5: Redeploy

Vercel → **Deployments** → **Redeploy** veya yeni bir push yapın.

---

## Adım 6: Kontrol

- Site açılıyor mu?
- Admin paneline giriş yapılabiliyor mu?
- Veriler görünüyor mu?

Sorun varsa Vercel **Logs** üzerinden hata mesajına bakın.
