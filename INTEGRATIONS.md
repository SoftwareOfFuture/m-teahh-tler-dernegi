## AMD AI Blog – Entegrasyon

Bu repo içinde iki seçenek vardır:

1) **Bu proje (Next.js + Express + Postgres) için hazır entegrasyon**
- Platform admin panelinde **AI Blog** sekmesi ile başlık + tarih/saat ayarlanır.
- Zamanı gelince `/api/ai-blog/run-due` endpoint’i cron ile çalışır ve yazıyı üretip `/blog` sayfasında yayımlar.
  - **Vercel Hobby** planda cron **günde 1 kez** çalışabilir. Daha sık çalıştırma için **Pro** gerekir veya dış cron kullanılmalıdır.

2) **WordPress eklentisi (örnek / başlangıç paketi)**
- `integrations/wordpress-amd-ai-blog/` altında basit bir WordPress plugin iskeleti bulunur.
- Bu eklenti doğrudan OpenAI API çağırarak WP içinde yazı oluşturur (başka bir backend’e ihtiyaç duymaz).

### Gerekli ortam değişkenleri (bu proje)

- **`OPENAI_API_KEY`**: Blog içeriği üretimi için zorunlu.
- **`OPENAI_MODEL`** (opsiyonel): Varsayılan `gpt-4o-mini`.
- **`CRON_SECRET`** (opsiyonel): Eğer Vercel Cron dışı bir cron ile çağıracaksanız ek güvenlik için.

### Cron endpoint

- `POST /api/ai-blog/run-due`
  - Vercel Cron kullanıyorsanız header `x-vercel-cron: 1` geldiği için çalışır.
  - Dışarıdan çağıracaksanız `x-cron-secret: <CRON_SECRET>` header’ı veya `?secret=<CRON_SECRET>` ile çağırın.

### Dış cron örneği (GitHub Actions)

Hobby planda daha sık çalıştırmak isterseniz:

- GitHub Actions ile 5 dakikada bir `POST https://<domain>/api/ai-blog/run-due?secret=<CRON_SECRET>` çağırabilirsiniz.

### Özel yazılımlar (custom code) için önerilen yöntem

En güvenlisi: kendi backend’inizde (server-side) OpenAI çağrısını yapıp içeriği sitenizde yayınlamaktır.
Bu projedeki `/api/ai-blog/*` route’ları örnek bir referanstır.

