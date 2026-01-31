import Link from 'next/link';
import { Header } from '../components/Header';
import { HeroSlider } from '../components/HeroSlider';
import { Sidebar } from '../components/Sidebar';
import { NewsCard } from '../components/NewsCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { VideoCard } from '../components/VideoCard';
import { LogoSlider } from '../components/LogoSlider';
import { announcements, events, newsItems, partnerLogos, sliderItems, videoItems } from '../lib/dummyData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* HERO / SLIDER */}
        <HeroSlider items={sliderItems} />

        {/* Content + Sidebar (desktop) */}
        <section className="mt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* Main content */}
            <div className="space-y-12">
              {/* Güncel Haberler */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Güncel Haberler</h2>
                  <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {newsItems.slice(0, 6).map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Güncel Duyurular */}
              <div className="rounded-3xl bg-soft-gray p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Güncel Duyurular</h2>
                  <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {announcements.slice(0, 4).map((item) => (
                    <AnnouncementCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Video Arşiv */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Video Arşiv</h2>
                  <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {videoItems.slice(0, 3).map((item) => (
                    <VideoCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Üyelikler / Partner Logoları */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Üyelikler / Partnerler</h2>
                  <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <LogoSlider logos={partnerLogos} />
              </div>
            </div>

            {/* Sidebar (desktop sticky) - mobile'da aşağı iner */}
            <div>
              <div className="lg:sticky lg:top-24">
                <Sidebar events={events} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer-like minimal spacer */}
        <div className="mt-14 rounded-3xl bg-slate-900 px-6 py-10 text-white">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-white/90">Antalya Müteahhitler Derneği</p>
              <p className="mt-1 text-xs text-white/70">
                Kurumsal ve sade tasarım • Next.js 14 • Tailwind • TypeScript (Demo)
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#"
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                İletişim
              </Link>
              <Link
                href="#"
                className="rounded-full bg-burgundy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

