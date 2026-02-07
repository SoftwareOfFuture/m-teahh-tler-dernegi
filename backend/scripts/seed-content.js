require('dotenv').config();

// Use NON_POOLING connection for schema sync/migrations.
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const db = require('../models');

// PageContent (kurumsal, iletisim) - always seed/update antmutder.org themed baseline
// Other content (slides, news, etc.) - only when SEED_DEFAULT_CONTENT=true

function isoFromDotDate(dot) {
  // "30.01.2026" -> "2026-01-30"
  const m = String(dot || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return new Date().toISOString().split('T')[0];
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

async function seedMissingByKey(model, rows, name, getKey, attrs = ['id', 'title', 'code']) {
  if (!rows.length) {
    console.log(`${name}: skip (no seed rows)`);
    return;
  }

  const existing = await model.findAll(attrs ? { attributes: attrs } : {}).catch(() => []);
  const existingKeys = new Set(
    (existing || [])
      .map((r) => {
        const any = r && typeof r.get === 'function' ? r.get({ plain: true }) : r;
        return getKey(any);
      })
      .filter(Boolean)
  );

  const toInsert = rows.filter((r) => {
    const k = getKey(r);
    return k && !existingKeys.has(k);
  });

  if (!toInsert.length) {
    console.log(`${name}: up-to-date`);
    return;
  }

  await model.bulkCreate(toInsert);
  console.log(`${name}: inserted ${toInsert.length} missing rows`);
}

async function seedPageContent(pages) {
  for (const p of pages) {
    const existing = await db.PageContent.findOne({ where: { slug: p.slug } });
    if (existing) {
      await existing.update(p);
      console.log(`PageContent [${p.slug}]: updated`);
    } else {
      await db.PageContent.create(p);
      console.log(`PageContent [${p.slug}]: created`);
    }
  }
}

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });

    // PAGE CONTENT - Antalya İnşaat Müteahhitleri Derneği (antmutder.org) - always seed/update
    const pageContents = [
      {
        slug: 'kurumsal',
        heroTitle: 'Kurumsal',
        heroSubtitle: 'Antalya İnşaat Müteahhitleri Derneği vizyonu, misyonu ve kurumsal yapısı.',
        aboutTitle: 'Hakkımızda',
        aboutParagraph1:
          'Antalya İnşaat Müteahhitleri Derneği (ANTMUTDER); inşaat firmaları, mimarlar, mühendisler, müteahhitler ve inşaat sektörü profesyonellerinin bir araya geldiği bir dernek olarak, üyeler arasında dayanışmayı güçlendirmek, sektörel bilgi paylaşımını artırmak ve mesleki standartların gelişimine katkı sağlamak amacıyla çalışmalar yürütür.',
        aboutParagraph2:
          'Derneğimiz; sektöre yönelik konferans, seminer ve atölye çalışmaları düzenlemekte, networking etkinlikleri ile iş ağlarını geliştirmekte, üyelerine sürekli eğitim sunmakta, sektördeki önemli fuarlarda temsil sağlamakta, kaçak müteahhitlik ile ilgili ihbar hattı oluşturmakta ve yapı müteahhitlerinin sınıflandırılması konusunda bilgilendirme toplantıları düzenlemektedir.',
        quickInfo:
          'Merkez: Antalya\nÇalışma Alanı: İnşaat ve müteahhitlik\nÜyelik: Başvuru + Onay\nTemsil: İnşaat firmaları, mimarlar, mühendisler, müteahhitler',
        mission:
          'Üyelerimizin mesleki gelişimini desteklemek, sektörde ortak aklı büyütmek ve mesleki standartların yükseltilmesine katkı sağlamak.',
        vision: 'Sürdürülebilir ve kaliteli yapı üretiminde Antalya ve Türkiye genelinde öncü bir kurumsal yapı olmak.',
        isPublished: true,
      },
      {
        slug: 'iletisim',
        heroTitle: 'İletişim',
        heroSubtitle: 'Bize ulaşın. Mesajınızı iletin, en kısa sürede dönüş yapalım.',
        contactAddress: 'Antalya / Türkiye',
        contactEmail: 'info@antmutder.org',
        contactPhone: '+90 (242) 000 00 00',
        mapEmbedUrl: '',
        isPublished: true,
      },
    ];
    await seedPageContent(pageContents);

    const seedDefault = String(process.env.SEED_DEFAULT_CONTENT || '').toLowerCase() === 'true';
    if (!seedDefault) {
      console.log('seed-content: slides/news/etc. skipped (SEED_DEFAULT_CONTENT is not true)');
      process.exit(0);
    }

    // HERO SLIDER - antmutder.org teması
    const slides = [
      {
        title: 'Antalya İnşaat Müteahhitleri Derneği',
        description: 'Üyeler arasında dayanışma, sektörel bilgi paylaşımı ve mesleki standartların gelişimi.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
        href: '/kurumsal/',
        dateText: 'Antalya',
        sortOrder: 1,
        isPublished: true,
      },
      {
        title: 'Konferans, Seminer ve Atölye Çalışmaları',
        description: 'Sektöre yönelik eğitim ve bilgilendirme etkinlikleriyle üyelerimizi destekliyoruz.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
        href: '/etkinlikler/',
        dateText: 'Eğitim',
        sortOrder: 2,
        isPublished: true,
      },
      {
        title: 'Yapı Müteahhitlerinin Sınıflandırılması',
        description: 'Mevzuat bilgilendirme toplantıları ve danışmanlık hizmetleriyle yanınızdayız.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
        href: '/kurumsal/',
        dateText: 'Mevzuat',
        sortOrder: 3,
        isPublished: true,
      },
    ];

    // NEWS
    const news = [
      {
        title: 'Sektör Buluşması Antalya’da Gerçekleştirildi',
        excerpt: 'Üyelerimiz ile bir araya gelerek 2026 hedeflerini değerlendirdik.',
        content:
          'Üyelerimiz ile bir araya gelerek 2026 hedeflerini değerlendirdik.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        title: 'Yeni Dönem Eğitim Takvimi Yayında',
        excerpt: 'Sertifika programları ve mevzuat eğitimleri için başvurular açıldı.',
        content:
          'Sertifika programları ve mevzuat eğitimleri için başvurular açıldı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        publishDate: isoFromDotDate('27.01.2026'),
        isPublished: true,
      },
      {
        title: 'Kentsel Dönüşümde Güncel Yaklaşımlar',
        excerpt: 'Uzman konuşmacılarla düzenlenen panelde yeni uygulamalar ele alındı.',
        content:
          'Uzman konuşmacılarla düzenlenen panelde yeni uygulamalar ele alındı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
        publishDate: isoFromDotDate('22.01.2026'),
        isPublished: true,
      },
      {
        title: 'Teknik Gezi: Şantiye Ziyareti',
        excerpt: 'Örnek proje sahasında iş güvenliği ve kalite süreçlerini inceledik.',
        content:
          'Örnek proje sahasında iş güvenliği ve kalite süreçlerini inceledik.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        publishDate: isoFromDotDate('15.01.2026'),
        isPublished: true,
      },
      {
        title: 'İhracat ve Yurt Dışı Projeler Çalıştayı',
        excerpt: 'Yeni pazar fırsatlarını değerlendirmek için çalışma grupları kuruldu.',
        content:
          'Yeni pazar fırsatlarını değerlendirmek için çalışma grupları kuruldu.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
        publishDate: isoFromDotDate('10.01.2026'),
        isPublished: true,
      },
      {
        title: 'Üyelerimize Özel Danışmanlık Hattı',
        excerpt: 'Mevzuat, sözleşme ve uygulama süreçleri için destek hizmeti başladı.',
        content:
          'Mevzuat, sözleşme ve uygulama süreçleri için destek hizmeti başladı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80',
        publishDate: isoFromDotDate('05.01.2026'),
        isPublished: true,
      },
    ];

    // ANNOUNCEMENTS - ANTMUTDER teması
    const announcements = [
      {
        code: 'ANTMUTDER-2026-01',
        title: 'İnşaat Sektörü Analizi - Ocak 2026',
        excerpt: 'Antalya bölgesi inşaat sektörü analizi yayınlandı.',
        content: 'Antalya İnşaat Müteahhitleri Derneği olarak inşaat sektörü analizi raporunu paylaşıyoruz.\n\nDetaylar için derneğimizle iletişime geçebilirsiniz.',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        code: 'ANTMUTDER-2026-02',
        title: 'Kaçak Müteahhitlik İhbar Hattı',
        excerpt: 'Kaçak müteahhitlik ihbarı için bilgilendirme.',
        content: 'Kaçak müteahhitlik ile ilgili ihbar hattımız aktif. İhbar ve bildirimler için derneğimizle iletişime geçebilirsiniz.\n\nDetaylar için iletişim sayfamızı ziyaret edin.',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        code: 'ANTMUTDER-2026-03',
        title: 'Yapı Müteahhitlerinin Sınıflandırılması Yönetmeliği',
        excerpt: 'Yapı müteahhitlerinin sınıflandırılması konusunda bilgilendirme toplantısı.',
        content: 'Yapı Müteahhitlerinin Sınıflandırılması Yönetmeliği hakkında bilgilendirme toplantısı düzenlenecektir.\n\nÜyelerimizi davet ediyoruz.',
        publishDate: isoFromDotDate('29.01.2026'),
        isPublished: true,
      },
      {
        code: 'ANTMUTDER-2026-04',
        title: 'Genel Kurul Toplantısı Bilgilendirmesi',
        excerpt: 'Antalya İnşaat Müteahhitleri Derneği Genel Kurul duyurusu.',
        content: 'Genel Kurul Toplantısı tarih ve gündem bilgisi paylaşılacaktır.\n\nÜyelerimize duyurulur.',
        publishDate: isoFromDotDate('24.01.2026'),
        isPublished: true,
      },
    ];

    // VIDEOS
    const videos = [
      {
        title: 'Tanıtım Filmi',
        excerpt: 'Derneğimizin faaliyetlerini ve çalışmalarını anlatan kısa tanıtım videosu.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('18.09.2023'),
        isPublished: true,
      },
      {
        title: 'Etkinlikler Öne Çıkanlar',
        excerpt: 'Yılın öne çıkan etkinliklerinden kısa bir derleme.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('01.07.2025'),
        isPublished: true,
      },
      {
        title: 'Sektör Paneli',
        excerpt: 'Sektörün geleceği üzerine uzman görüşleri ve değerlendirmeler.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('27.01.2026'),
        isPublished: true,
      },
    ];

    // PUBLICATIONS - ANTMUTDER teması
    const publications = [
      {
        title: 'Antalya İnşaat Müteahhitleri Derneği Faaliyet Raporu 2025',
        excerpt: 'ANTMUTDER 2025 yılı faaliyetlerini içeren rapor.',
        coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('15.12.2025'),
        isPublished: true,
      },
      {
        title: 'Sektör Bülteni - Ocak 2026',
        excerpt: 'Antalya inşaat sektörü bülteni ve öne çıkan gelişmeler.',
        coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('31.01.2026'),
        isPublished: true,
      },
      {
        title: 'Yapı Müteahhitleri Mevzuat Bilgilendirme Notu',
        excerpt: 'Güncel mevzuat değişiklikleri ve yapı müteahhitleri sınıflandırması hakkında özet.',
        coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('20.01.2026'),
        isPublished: true,
      },
    ];

    await seedMissingByKey(db.HeroSlide, slides, 'HeroSlide', (r) => String(r?.title || '').trim());
    await seedMissingByKey(db.News, news, 'News', (r) => String(r?.title || '').trim());
    await seedMissingByKey(
      db.Announcement,
      announcements,
      'Announcement',
      (r) => (String(r?.code || '').trim() ? String(r.code).trim() : String(r?.title || '').trim()),
      ['id', 'title', 'code']
    );
    await seedMissingByKey(db.Video, videos, 'Video', (r) => String(r?.title || '').trim());
    await seedMissingByKey(db.Publication, publications, 'Publication', (r) => String(r?.title || '').trim());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

