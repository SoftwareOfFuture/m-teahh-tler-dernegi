import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { demoNews, demoAnnouncements, demoMembers } from '../data/demoData';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
];

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';

export default function DemoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((s) => (s + 1) % demoNews.length), 5000);
    return () => clearInterval(t);
  }, []);

  const displaySlides = demoNews.map((item, i) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    imageUrl: item.imageUrl || HERO_IMAGES[i % HERO_IMAGES.length],
    date: item.publishDate,
  }));

  return (
    <div>
      <div className="bg-primary/90 text-white py-2 px-4 text-center text-sm font-medium">
        🎯 Bu bir demo sayfasıdır. Örnek haber, duyuru ve üye içeriği gösterilmektedir.
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-corp aspect-[16/10] bg-dark-gray">
              {displaySlides.map((slide, i) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-sm opacity-90">{formatDate(slide.date)}</span>
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-1">{slide.title}</h2>
                    <p className="mt-2 text-sm md:text-base text-gray-200 line-clamp-2">{slide.excerpt}</p>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {displaySlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/register" className="card flex flex-col p-6 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-dark-gray mt-3">Üyelik Başvurusu</h3>
              <p className="text-sm text-gray-600 mt-1">Derneğimize üye olmak için başvuru yapın.</p>
              <span className="mt-3 text-primary font-medium text-sm group-hover:underline">Başvur →</span>
            </Link>

            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-dark-gray flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">D</span>
                Son Duyurular
              </h3>
              <ul className="mt-4 space-y-3">
                {demoAnnouncements.slice(0, 3).map((a) => (
                  <li key={a.id}>
                    <p className="text-sm text-gray-700 line-clamp-2">{a.title}</p>
                    <span className="text-xs text-gray-400">{formatDate(a.publishDate)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-dark-gray flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">E</span>
                Yaklaşan Etkinlikler
              </h3>
              <ul className="mt-4 space-y-3">
                {demoAnnouncements.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <p className="text-sm text-gray-700 line-clamp-2">{e.title}</p>
                    <span className="text-xs text-gray-400">{formatDate(e.eventDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-dark-gray text-center">Demo Haberler</h2>
          <p className="text-gray-600 text-center mt-2">Platformda yayınlanan örnek haber içerikleri</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {demoNews.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <img src={item.imageUrl} alt="" className="w-full aspect-video object-cover" />
                <div className="p-5">
                  <span className="text-xs text-gray-500">{formatDate(item.publishDate)}</span>
                  <h3 className="font-serif font-semibold text-dark-gray mt-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-dark-gray text-center">Demo Duyurular</h2>
        <p className="text-gray-600 text-center mt-2">Etkinlik ve duyuru örnekleri</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {demoAnnouncements.map((item) => (
            <div key={item.id} className="card p-6">
              <span className="text-xs text-gray-500">{formatDate(item.publishDate)}</span>
              <h3 className="font-serif font-semibold text-dark-gray mt-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.excerpt}</p>
              <p className="text-xs text-primary mt-2">Etkinlik: {formatDate(item.eventDate)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-dark-gray text-center">Demo Üye Dizini</h2>
          <p className="text-gray-600 text-center mt-2">Örnek üye profilleri</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {demoMembers.map((m) => (
              <div key={m.id} className="card p-6 text-center">
                <img src={m.profileImageUrl || AVATAR} alt="" className="w-20 h-20 rounded-full mx-auto object-cover" />
                <h3 className="font-semibold text-dark-gray mt-3">{m.name}</h3>
                <p className="text-sm text-primary">{m.company}</p>
                <p className="text-xs text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Ana Siteye Dön
        </Link>
        <span className="mx-4 text-gray-400">|</span>
        <Link to="/register" className="text-primary font-medium hover:underline">
          Üye Ol
        </Link>
      </div>
    </div>
  );
}
