'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { VideoCard } from '../../components/VideoCard';
import { VideoPlayerModal } from '../../components/VideoPlayerModal';
import type { VideoItem, AnnouncementItem } from '../../lib/types';
import { listVideosPublic, listAnnouncementsPublic } from '../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export default function VideosPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadAnnouncements() {
      setAnnouncementsLoading(true);
      try {
        const res = await listAnnouncementsPublic({ page: 1, limit: 50 });
        if (!cancelled && res?.items?.length) {
          setAnnouncements(
            res.items.map((a) => ({
              id: String(a.id),
              code: a.code ?? '',
              date: formatDot(a.publishDate),
              title: a.title,
            }))
          );
        }
      } finally {
        if (!cancelled) setAnnouncementsLoading(false);
      }
    }
    loadAnnouncements();
    return () => { cancelled = true; };
  }, []);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const res = await listVideosPublic({ page: 1, limit: 50 });
        if (res?.items?.length) {
          setItems(
            res.items.map((v) => ({
              id: String(v.id),
              title: v.title,
              excerpt: v.excerpt || '',
              date: formatDot(v.publishDate),
              thumbnailUrl: v.thumbnailUrl || 'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
              href: v.href || '#',
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Arşiv" subtitle="ANTMUTDER duyuruları, etkinlikleri ve sektör videoları." />

      {/* Duyurular - haberler gibi açılır kartlar */}
      <section className="mt-8 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Duyurular</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 min-w-0 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
        {announcementsLoading && <div className="mt-4 text-sm text-slate-500">Yükleniyor…</div>}
        {!announcementsLoading && announcements.length === 0 && (
          <div className="mt-4 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">Henüz duyuru eklenmemiş.</div>
        )}
      </section>

      {/* Videolar */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Videolar</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <VideoCard
              key={item.id}
              item={item}
              onOpen={(it) => {
                if (!it.href || it.href === '#') return;
                setPreview({ url: it.href, title: it.title });
              }}
            />
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
        {!loading && items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
            Henüz video eklenmemiş.
          </div>
        ) : null}
      </section>

      <VideoPlayerModal
        open={!!preview}
        url={preview?.url ?? null}
        title={preview?.title}
        onClose={() => setPreview(null)}
      />
    </PageLayoutWithFooter>
  );
}

