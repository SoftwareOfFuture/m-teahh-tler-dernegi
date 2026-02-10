'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSlider } from './HeroSlider';
import { HomeBannerStrip } from './HomeBannerStrip';
import { NewsCard } from './NewsCard';
import { DigitalPlatformsSlider } from './DigitalPlatformsSlider';
import { VideoCard } from './VideoCard';
import { VideoPlayerModal } from './VideoPlayerModal';
import { LogoSlider } from './LogoSlider';
import { SiteFooter } from './SiteFooter';
import { AnnouncementCard } from './AnnouncementCard';
import type { NewsItem, PartnerLogo, SliderItem, VideoItem } from '../lib/types';
import {
  listAnnouncementsRecent,
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
import { useSiteSettings } from '../lib/useSiteSettings';
import {
  getAnimationClass,
  getStoredSectionAnimations,
  type SectionAnimationsMap,
  type SectionId,
} from '../lib/sectionAnimations';

const DEFAULT_SECTION_ANIM = 'fade-in-up';

export function HomePageContent() {
  const [sectionAnimations, setSectionAnimations] = useState<SectionAnimationsMap>({});
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [announcementItems, setAnnouncementItems] = useState<{ id: string; code: string; date: string; title: string }[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState<{ url: string; title: string } | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [membersForPartners, setMembersForPartners] = useState<any[]>([]);
  const siteSettings = useSiteSettings();

  const formatDot = useMemo(() => {
    return (iso: string | null | undefined) => {
      if (!iso) return '';
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
        const r1 = await Promise.allSettled([
          fetchWithRetry(() => listSlidesPublic({ limit: 8 }), 1),
          fetchWithRetry(() => listBannersPublic({ limit: 10 }), 2),
          fetchWithRetry(() => listNewsPublic({ page: 1, limit: 6 }), 1),
        ]);
        if (cancelled) return;
        const r2 = await Promise.allSettled([
          fetchWithRetry(() => listAnnouncementsRecent(), 1),
          fetchWithRetry(() => listVideosRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPublicationsRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPartnersPublic({ limit: 500 }), 1),
          fetchWithRetry(() => listMembersPublic({ page: 1, limit: 500 }), 1),
        ]);
        if (cancelled) return;
        const slides = r1[0].status === 'fulfilled' ? r1[0].value : null;
        const bannersRes = r1[1].status === 'fulfilled' ? r1[1].value : null;
        const news = r1[2].status === 'fulfilled' ? r1[2].value : null;
        const announcements = r2[0].status === 'fulfilled' ? r2[0].value : null;
        const vids = r2[1].status === 'fulfilled' ? r2[1].value : null;
        const pubs = r2[2].status === 'fulfilled' ? r2[2].value : null;
        const partners = r2[3].status === 'fulfilled' ? r2[3].value : null;
        const membersRes = r2[4]?.status === 'fulfilled' ? r2[4].value : null;
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
        } else setSliderItems([]);
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
        } else setNewsItems([]);
        setNewsLoading(false);
        if (Array.isArray(announcements) && announcements.length) {
          setAnnouncementItems(
            announcements.slice(0, 6).map((a) => ({
              id: String(a.id),
              code: a.code || '',
              date: formatDot(a.publishDate),
              title: a.title,
            }))
          );
        } else setAnnouncementItems([]);
        setAnnouncementsLoading(false);
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
        } else setVideoItems([]);
        setVideosLoading(false);
        if (Array.isArray(pubs) && pubs.length) setPublications(pubs);
        else setPublications([]);
        const allLogos: PartnerLogo[] = [];
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
        if (membersRes?.items) {
          membersRes.items.forEach((m: any) => {
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
        setSliderItems([]);
        setNewsItems([]);
        setAnnouncementItems([]);
        setVideoItems([]);
        setPartnerLogos([]);
        setPublications([]);
        setSlidesLoading(false);
        setBannerLoading(false);
        setNewsLoading(false);
        setAnnouncementsLoading(false);
        setVideosLoading(false);
        setPartnersLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [formatDot]);

  useEffect(() => {
    setSectionAnimations(getStoredSectionAnimations());
  }, []);

  const sectionClass = (id: SectionId) =>
    getAnimationClass(sectionAnimations[id] ?? DEFAULT_SECTION_ANIM);

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden px-3 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
        {slidesLoading ? (
          <section className={`relative w-full overflow-hidden rounded-2xl bg-slate-100 ${sectionClass('hero')}`}>
            <div className="h-[320px] animate-pulse sm:h-[400px] md:h-[500px]" />
          </section>
        ) : (
          <div className={sectionClass('hero')}>
            <HeroSlider items={sliderItems} />
          </div>
        )}
        <div className={`mt-3 w-full sm:mt-5 ${sectionClass('banner')}`}>
          <HomeBannerStrip banners={banners} loading={bannerLoading} />
        </div>
        {siteSettings?.promoVideoUrl ? (
          <div id="tanitim-filmi" className={`mt-8 w-full sm:mt-10 ${sectionClass('banner')} scroll-mt-24`}>
            <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-soft">
              <div className="flex flex-col items-center justify-center gap-4 px-4 py-8 sm:py-12 md:flex-row md:gap-8 md:px-8">
                <div className="w-full max-w-[560px] aspect-video rounded-xl overflow-hidden bg-slate-800 relative group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => setVideoPreview({ url: siteSettings.promoVideoUrl!, title: 'Tanıtım Filmi' })}
                  onKeyDown={(e) => e.key === 'Enter' && setVideoPreview({ url: siteSettings.promoVideoUrl!, title: 'Tanıtım Filmi' })}
                  aria-label="Tanıtım filmi oynat"
                >
                  {siteSettings.promoVideoCoverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external URL, dynamic
                    <img
                      src={siteSettings.promoVideoCoverUrl}
                      alt="Tanıtım filmi kapak"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                    <div className="size-16 rounded-full bg-burgundy/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform sm:size-20">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 sm:ml-1 sm:w-8 sm:h-8"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">Dernek Tanıtım Filmi</h2>
                  <p className="mt-2 text-sm text-slate-300">Derneğimizi daha yakından tanımak için tanıtım filmini izleyebilirsiniz.</p>
                  <button
                    type="button"
                    onClick={() => setVideoPreview({ url: siteSettings.promoVideoUrl!, title: 'Tanıtım Filmi' })}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-burgundy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-burgundy-dark"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Tanıtım Filmini İzle
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <section className="mt-6 w-full min-w-0 sm:mt-10 lg:mt-14">
          <div className="grid w-full grid-cols-1 gap-6 min-w-0 sm:gap-10 lg:gap-16">
            <div id="dijital-platformlar" className={`${sectionClass('dijitalPlatformlar')} scroll-mt-24`}>
              <DigitalPlatformsSlider title="ANTMUTDER DİJİTAL PLATFORMLAR" />
            </div>
            <div className={`min-w-0 ${sectionClass('news')}`}>
              <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-6">
                <h2 className="min-w-0 truncate text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">Güncel Haberler</h2>
                <Link href="/haberler" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Haberler
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 min-w-0 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4 stagger-children">
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
            <div className={`min-w-0 ${sectionClass('news')}`}>
              <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-6">
                <h2 className="min-w-0 truncate text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">Duyurular</h2>
                <Link href="/duyurular" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Duyurular
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 min-w-0 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 stagger-children">
                {announcementItems.slice(0, 6).map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>
              {!announcementsLoading && announcementItems.length === 0 ? (
                <div className="mt-6 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
                  Henüz duyuru eklenmemiş.
                </div>
              ) : null}
            </div>
            <div className={`min-w-0 ${sectionClass('video')}`}>
              <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-6">
                <h2 className="min-w-0 truncate text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">Video Arşivi</h2>
                <Link href="/videolar" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Videolar
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 min-w-0 sm:gap-6 lg:grid-cols-12 stagger-children">
                {videoItems.length > 0 ? (
                  <>
                    <div className="min-w-0 lg:col-span-7">
                      <VideoCard
                        item={videoItems[0]}
                        onOpen={(it) => {
                          if (!it.href || it.href === '#') return;
                          setVideoPreview({ url: it.href, title: it.title });
                        }}
                      />
                    </div>
                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
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
            <div className={`w-full min-w-0 overflow-hidden rounded-2xl bg-white p-3 shadow-soft sm:p-4 md:p-5 ${sectionClass('publications')}`}>
              <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-4">
                <h2 className="min-w-0 truncate text-base font-bold text-slate-800 sm:text-lg md:text-xl">Yayınlar</h2>
                <Link href="/yayinlar" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Yayınlar
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 min-w-0 sm:gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {(publications.length ? publications : []).slice(0, 4).map((p) => (
                  <a
                    key={p.id}
                    href={p.fileUrl || '#'}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg hover:border-burgundy/20"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 sm:aspect-[3/4]">
                      <div className="flex h-full w-full items-center justify-center p-4 text-center sm:p-5">
                        <span className="text-2xl opacity-30 sm:text-3xl">📄</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-burgundy/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-xs font-semibold text-white sm:text-sm">İncele / İndir</span>
                      <span className="text-[10px] text-white/90 sm:text-xs">→</span>
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <div className="line-clamp-2 text-xs font-semibold text-slate-800 sm:text-sm">{p.title}</div>
                      <div className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{formatDot(p.publishDate)}</div>
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
            <div id="partnerler" className={`min-w-0 scroll-mt-24 ${sectionClass('partners')}`}>
              <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-5">
                <h2 className="min-w-0 truncate text-lg font-bold text-slate-800 sm:text-xl md:text-2xl">Partnerlerimiz</h2>
                <Link href="/uyelerimiz" className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-burgundy/10 hover:text-burgundy">
                  Tüm Partnerler
                </Link>
              </div>
              <div className="min-w-0 overflow-hidden rounded-2xl bg-slate-100/80 p-4 sm:p-6 md:p-8">
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
