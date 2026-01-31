import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../api/client';
import { announcementsApi } from '../api/client';
import {
  heroData,
  bannerItems,
  fallbackProjects,
  testimonial,
  aboutData,
} from '../data/homePageData';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [newsForProjects, setNewsForProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      announcementsApi.list(1, 3).catch(() => ({ items: [] })),
      newsApi.list(1, 3).catch(() => ({ items: [] })),
    ]).then(([annData, newsData]) => {
      setAnnouncements(annData.items || []);
      setNewsForProjects(newsData.items || []);
      setLoading(false);
    });
  }, []);

  const projects = newsForProjects.length >= 3
    ? newsForProjects.slice(0, 3).map((n) => ({
        id: n.id,
        title: n.title,
        description: n.excerpt || n.content?.slice(0, 80) + '...',
        image: n.imageUrl || PLACEHOLDER,
        category: 'Haber',
      }))
    : fallbackProjects;

  const displayAnnouncements = announcements.length >= 3
    ? announcements.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        description: a.excerpt || a.content?.slice(0, 120),
        date: formatDate(a.publishDate),
        image: a.imageUrl || PLACEHOLDER,
      }))
    : [
        { id: 1, title: '2025 Yılı Genel Kurul Toplantısı', description: 'Derneğimizin yıllık olağan genel kurul toplantısı gerçekleştirilecektir.', date: '28 Ocak 2025', image: PLACEHOLDER },
        { id: 2, title: 'İnşaat Sektörü Semineri', description: 'Kalite standartları ve güncel mevzuat değişiklikleri hakkında bilgilendirme semineri.', date: '25 Ocak 2025', image: PLACEHOLDER },
        { id: 3, title: 'Üye Kabul Süreci Başladı', description: 'Yeni dönem üyelik başvuruları için başvuru süreci açılmıştır.', date: '20 Ocak 2025', image: PLACEHOLDER },
      ];

  return (
    <div>
      {/* HeroSection */}
      <section className="relative min-h-[320px] md:min-h-[420px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-primary-dark/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
            {heroData.title}
          </h1>
        </div>
      </section>

      {/* BannerSlider */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {bannerItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="group block rounded-2xl overflow-hidden shadow-corp hover:shadow-corp-hover hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section id="duyurular" className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy text-center mb-8 md:mb-10">Güncel Duyurular</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              displayAnnouncements.map((a) => (
                <Link key={a.id} to={announcements.length >= 3 ? `/announcements/${a.id}` : '/announcements'} className="card block hover:shadow-corp-hover transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <span className="text-sm font-semibold text-gold">{a.date}</span>
                    <h3 className="font-serif text-lg font-bold text-navy mt-1 mb-2">{a.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projeler" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy text-center mb-8 md:mb-10">Projelerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={p.id && newsForProjects.length >= 3 ? `/news/${p.id}` : '/news'}
                className="card block hover:shadow-corp-hover transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-md">
                    {p.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-navy mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/news" className="btn-secondary">Tüm Projeler</Link>
          </div>
        </div>
      </section>

      {/* MembershipCTA */}
      <section id="uyelik" className="py-12 md:py-16 bg-gradient-to-br from-navy to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Derneğimize Üye Olun</h2>
              <p className="text-white/90 mb-5 leading-relaxed">
                Antalya inşaat sektöründe güçlü bir ağa katılın. Eğitim, danışmanlık ve iş ortaklığı imkânlarından yararlanın.
              </p>
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md">
                Üyelik Başvurusu
              </Link>
            </div>
            <div className="pl-4 border-l-4 border-gold">
              <blockquote className="italic text-white/95 leading-relaxed mb-4">"{testimonial.quote}"</blockquote>
              <div>
                <strong className="text-gold-light">{testimonial.author}</strong>
                <span className="block text-sm text-white/80">{testimonial.role}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AboutSection */}
      <section id="hakkimizda" className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-corp order-2 md:order-1">
              <img src={aboutData.image} alt={aboutData.title} className="w-full aspect-[4/3] object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-4">{aboutData.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{aboutData.description}</p>
              <Link to="/members" className="btn-secondary">Üyeleri Görüntüle</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
