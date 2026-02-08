'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { NewsCard } from '../../components/NewsCard';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import type { NewsItem } from '../../lib/types';
import { listNewsPublic } from '../../lib/api';

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const res = await listNewsPublic({ page: 1, limit: 50 });
        if (cancelled) return;
        if (res?.items?.length) {
          setItems(
            res.items.map((n) => ({
              id: String(n.id),
              title: n.title,
              excerpt: n.excerpt || '',
              date: formatDot(n.publishDate),
              imageUrl: n.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            }))
          );
        }
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [formatDot]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Haberler" subtitle="ANTMUTDER ve Antalya inşaat sektöründen güncel haberler." />

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">Güncel Haberler</h2>
          <Link href="/" className="link-editorial text-sm font-semibold text-teal hover:text-teal-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
        {!loading && items.length === 0 ? (
          <div className="mt-6 border-2 border-navy bg-cream-dark px-5 py-4 text-sm text-navy/70">
            Henüz haber eklenmemiş.
          </div>
        ) : null}
      </section>
    </PageLayoutWithFooter>
  );
}

