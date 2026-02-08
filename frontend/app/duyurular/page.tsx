'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { listAnnouncementsPublic, type Announcement } from '../../lib/api';
import type { AnnouncementItem } from '../../lib/types';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function toAnnouncementItem(a: Announcement): AnnouncementItem {
  return {
    id: String(a.id),
    code: a.code ?? '',
    date: formatDot(a.publishDate),
    title: a.title,
  };
}

export default function DuyurularPage() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const res = await listAnnouncementsPublic({ page: 1, limit: 50 });
        if (res?.items?.length) setItems(res.items.map(toAnnouncementItem));
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
      <PageHero
        title="Duyurular"
        subtitle="ANTMUTDER ve Antalya inşaat sektöründen güncel duyurular. Dernek haberleri ve bilgilendirmeleri."
      />

      <section className="mt-8 min-w-0">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Duyuru Arşivi</h2>
          <Link
            href="/"
            className="text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
          >
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 min-w-0 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div>
        )}
        {!loading && items.length === 0 && (
          <div className="mt-6 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
            Henüz duyuru eklenmemiş.
          </div>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}
