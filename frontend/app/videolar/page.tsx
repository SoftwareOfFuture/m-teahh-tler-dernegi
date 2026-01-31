'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { VideoCard } from '../../components/VideoCard';
import type { VideoItem } from '../../lib/dummyData';
import { videoItems as dummyVideos } from '../../lib/dummyData';
import { listVideosPublic } from '../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export default function VideosPage() {
  const [items, setItems] = useState<VideoItem[]>(dummyVideos);
  const [loading, setLoading] = useState(false);

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
      <PageHero title="Video Arşiv" subtitle="Etkinlikler, tanıtımlar ve video içerikleri." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Videolar</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
      </section>
    </PageLayoutWithFooter>
  );
}

