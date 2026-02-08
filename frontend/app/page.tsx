'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSlider } from '../components/HeroSlider';
import { HomeBannerStrip } from '../components/HomeBannerStrip';
import { NewsCard } from '../components/NewsCard';
import { DigitalPlatformsSlider } from '../components/DigitalPlatformsSlider';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { LogoSlider } from '../components/LogoSlider';
import { SiteFooter } from '../components/SiteFooter';
import type { NewsItem, PartnerLogo, SliderItem, VideoItem } from '../lib/types';
import {
  listBannersPublic,
  listMembersPublic,
  listNewsPublic,
  listPartnersPublic,
  listPublicationsRecent,
  listSlidesPublic,
  listVideosRecent,
  type HomeBanner,
  type Publication,
} from '../lib/api';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

export default function HomePage() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState<{ url: string; title: string } | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [membersForPartners, setMembersForPartners] = useState<any[]>([]);

  const formatDot = useMemo(() => {
    return (iso: string | null | undefined) => {
      if (!iso) return '';
      // YYYY-MM-DD -> DD.MM.YYYY
      const parts = String(iso).split('-');
      if (parts.length !== 3) return String(iso);
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const fetchWithRetry = async <T,>(fn: () => Promise<T>, retries = 2) => {
          let lastErr: any = null;
          for (let i = 0; i <= retries; i++) {
            try {
              return await fn();
            } catch (e) {
              lastErr = e;
              await sleep(400 + i * 600);
            }
          }
          throw lastErr;
        };

        // Batch requests to reduce simultaneous serverless DB connections (helps avoid intermittent 500s).
        const r1 = await Promise.allSettled([
          fetchWithRetry(() => listSlidesPublic({ limit: 8 }), 1),
          fetchWithRetry(() => listBannersPublic({ limit: 10 }), 2),
          fetchWithRetry(() => listNewsPublic({ page: 1, limit: 6 }), 1),
        ]);
        if (cancelled) return;

        const r2 = await Promise.allSettled([
          fetchWithRetry(() => listVideosRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPublicationsRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPartnersPublic({ limit: 500 }), 1),
          fetchWithRetry(() => listMembersPublic({ page: 1, limit: 500 }), 1),
        ]);
        if (cancelled) return;

        const slides = r1[0].status === 'fulfilled' ? r1[0].value : null;
        const bannersRes = r1[1].status === 'fulfilled' ? r1[1].value : null;
        const news = r1[2].status === 'fulfilled' ? r1[2].value : null;

        const vids = r2[0].status === 'fulfilled' ? r2[0].value : null;
        const pubs = r2[1].status === 'fulfilled' ? r2[1].value : null;
        const partners = r2[2].status === 'fulfilled' ? r2[2].value : null;
        const membersRes = r2[3]?.status === 'fulfilled' ? r2[3].value : null;

        if (Array.isArray(slides) && slides.length) {
          setSliderItems(
            slides.map((s) => ({
              id: String(s.id),
              date: s.dateText || '',
              title: s.title,
              description: s.description || '',
              imageUrl: s.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
              href: s.href || '#',
            }))
          );
        } else {
          setSliderItems([]);
        }
        setSlidesLoading(false);

        if (Array.isArray(bannersRes) && bannersRes.length) setBanners(bannersRes);
        else setBanners([]);
        setBannerLoading(false);

        if (news?.items?.length) {
          setNewsItems(
            news.items.map((n) => ({
              id: String(n.id),
              title: n.title,
              excerpt: n.excerpt || '',
              date: formatDot(n.publishDate),
              imageUrl: n.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            }))
          );
        } else {
          setNewsItems([]);
        }
        setNewsLoading(false);

        if (Array.isArray(vids) && vids.length) {
          setVideoItems(
            vids.map((v) => ({
              id: String(v.id),
              title: v.title,
              excerpt: v.excerpt || '',
              date: formatDot(v.publishDate),
              thumbnailUrl: v.thumbnailUrl || 'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
              href: v.href || '#',
            }))
          );
        } else {
          setVideoItems([]);
        }
        setVideosLoading(false);

        if (Array.isArray(pubs) && pubs.length) {
          setPublications(pubs);
        } else {
          setPublications([]);
        }

        // Combine partners and approved members (exclude admin accounts)
        const allLogos: PartnerLogo[] = [];
        
        // Add partners
        if (Array.isArray(partners)) {
          partners.forEach((p) => {
            allLogos.push({
              id: `partner-${p.id}`,
              name: p.title,
              logoText: p.logoText || p.title,
              logoUrl: p.logoUrl || null,
              websiteUrl: p.websiteUrl || null,
            });
          });
        }
        
        // Add approved members (exclude platform_admin role)
        if (membersRes?.items) {
          membersRes.items.forEach((m: any) => {
            // Exclude admin accounts
            if (m.role === 'platform_admin' || m.role === 'admin') return;
            if (!m.isApproved) return;
            
            const company = (m.company || m.name || '').trim();
            if (!company) return;
            
            allLogos.push({
              id: `member-${m.id}`,
              name: company,
              logoText: company,
              logoUrl: m.profileImageUrl || null,
              websiteUrl: m.websiteUrl || null,
            });
          });
        }
        
        setPartnerLogos(allLogos);
        setPartnersLoading(false);
      } catch {
        // Do not show dummy content on errors.
        setSliderItems([]);
        setNewsItems([]);
        setVideoItems([]);
        setPartnerLogos([]);
        setPublications([]);
        setSlidesLoading(false);
        setBannerLoading(false);
        setNewsLoading(false);
        setVideosLoading(false);
        setPartnersLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [formatDot]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {slidesLoading ? (
          <section className="relative w-full overflow-hidden rounded-2xl bg-slate-100">
            <div className="h-[320px] animate-pulse sm:h-[400px] md:h-[500px]" />
          </section>
        ) : (
          <HeroSlider items={sliderItems} />
        )}
        <div className="mt-4 w-full sm:mt-5">
          <HomeBannerStrip banners={banners} loading={bannerLoading} />
        </div>

        <section className="mt-12 w-full sm:mt-16">
          <div className="grid w-full grid-cols-1 gap-12 sm:gap-16 lg:gap-20">
            <div id="dijital-platformlar" className="animate-fade-in-up scroll-mt-24">
              <DigitalPlatformsSlider title="ANTMUTDER DİJİTAL PLATFORMLAR" />
            </div>

            <div className="animate-fade-in-up [animation-delay:0.05s]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Güncel Haberler</h2>
                <Link href="/haberler" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Haberler
                </Link>
              </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 stagger-children">
                  {newsItems.slice(0, 4).map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
                {!newsLoading && newsItems.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
                    Henüz haber eklenmemiş.
                  </div>
                ) : null}
              </div>

              <div className="animate-fade-in-up [animation-delay:0.1s]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                  <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Video Arşivi</h2>
                  <Link href="/videolar" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                    Tüm Videolar
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 stagger-children">
                  {videoItems.length > 0 ? (
                    <>
                      <div className="lg:col-span-7">
                        <VideoCard
                          item={videoItems[0]}
                          onOpen={(it) => {
                            if (!it.href || it.href === '#') return;
                            setVideoPreview({ url: it.href, title: it.title });
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                        {videoItems.slice(1, 3).map((item) => (
                          <VideoCard
                            key={item.id}
                            item={item}
                            onOpen={(it) => {
                              if (!it.href || it.href === '#') return;
                              setVideoPreview({ url: it.href, title: it.title });
                            }}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
                {!videosLoading && videoItems.length === 0 ? (
                  <div className="mt-4 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600 sm:mt-6">
                    Henüz video eklenmemiş.
                  </div>
                ) : null}
              </div>

              <div className="w-full min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-5">
                  <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Yayınlar</h2>
                  <Link href="/yayinlar" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                    Tüm Yayınlar
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {(publications.length ? publications : []).slice(0, 4).map((p) => (
                    <a
                      key={p.id}
                      href={p.fileUrl || '#'}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg hover:border-burgundy/20"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100">
                        <div className="flex h-full w-full items-center justify-center p-6 text-center">
                          <span className="text-4xl opacity-30">📄</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-burgundy/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-sm font-semibold text-white">İncele / İndir</span>
                        <span className="text-xs text-white/90">→</span>
                      </div>
                      <div className="p-4">
                        <div className="truncate font-semibold text-slate-800">{p.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{formatDot(p.publishDate)}</div>
                      </div>
                    </a>
                  ))}

                  {publications.length === 0 ? (
                    <div className="col-span-full rounded-xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
                      Yayın bulunamadı.
                    </div>
                  ) : null}
                </div>
              </div>

              <div id="partnerler" className="animate-fade-in-up scroll-mt-24 [animation-delay:0.15s]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-5">
                  <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Partnerlerimiz</h2>
                  <Link href="/uyelerimiz" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                    Tüm Partnerler
                  </Link>
                </div>

                <div className="rounded-2xl bg-slate-100/80 p-6 sm:p-8">
                  <LogoSlider logos={partnerLogos} />
                </div>
                {!partnersLoading && partnerLogos.length === 0 ? (
                  <div className="mt-4 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
                    Henüz partner eklenmemiş.
                  </div>
                ) : null}
              </div>
          </div>
        </section>

        <VideoPlayerModal
          open={!!videoPreview}
          url={videoPreview?.url ?? null}
          title={videoPreview?.title}
          onClose={() => setVideoPreview(null)}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

