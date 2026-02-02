'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import type { AnnouncementItem } from '../../lib/types';
import { listAnnouncementsPublic } from '../../lib/api';

export default function AnnouncementsPage() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
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
        const res = await listAnnouncementsPublic({ page: 1, limit: 50 });
        if (cancelled) return;
        if (res?.items?.length) {
          setItems(
            res.items.map((a) => ({
              id: String(a.id),
              code: a.code || `AMD-${String(a.publishDate || '').slice(0, 4) || '2026'}-${a.id}`,
              date: formatDot(a.publishDate),
              title: a.title,
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
      <PageHero title="Duyurular" subtitle="Güncel duyurular ve bilgilendirmeler." />

      <section className="mt-8 rounded-3xl bg-soft-gray p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Güncel Duyurular</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
        {!loading && items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-white px-4 py-3 text-sm text-slate-600">
            Henüz duyuru eklenmemiş.
          </div>
        ) : null}
      </section>
    </PageLayoutWithFooter>
  );
}

