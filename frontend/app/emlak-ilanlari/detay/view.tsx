'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../../components/PageHero';
import { PageLayoutWithFooter } from '../../../components/PageLayout';
import { normalizeImageSrc } from '../../../lib/normalizeImageSrc';
import { getPropertyPublic } from '../../../lib/api';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

export function PropertyDetailView() {
  const sp = useSearchParams();
  const id = sp.get('id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Awaited<ReturnType<typeof getPropertyPublic>> | null>(null);

  const safeId = useMemo(() => {
    const n = Number(id || '');
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!safeId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getPropertyPublic(safeId);
        if (cancelled) return;
        setItem(res);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'İlan yüklenemedi.');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [safeId]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Emlak İlanı Detayı" subtitle="İlan detaylarını görüntüleyin." />

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/emlak-ilanlari"
            className="text-sm font-semibold text-burgundy hover:text-burgundy-dark"
          >
            ← Emlak İlanlarına dön
          </Link>
        </div>

        {!safeId ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            İlan bulunamadı.
          </div>
        ) : loading ? (
          <div className="mt-6 rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : !item ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
            İlan bulunamadı.
          </div>
        ) : (
          <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
            {/* Görsel - sabah/emlak tarzı büyük alan */}
            <div className="relative aspect-[21/9] w-full min-h-[200px] bg-slate-100">
              <Image
                src={normalizeImageSrc(item.imageUrl) || PLACEHOLDER_IMG}
                alt={item.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {item.price && (
                <div className="absolute right-4 top-4 rounded-xl bg-burgundy px-4 py-2.5 text-lg font-bold text-white shadow-lg">
                  {item.price}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{item.title}</h1>

              {/* Özet bilgiler - ikonlu satır */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-slate-200 pb-6 text-sm text-slate-700">
                {item.address && (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.address}
                  </span>
                )}
                {item.propertyType && (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {item.propertyType}
                  </span>
                )}
                {item.rooms && (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {item.rooms} oda
                  </span>
                )}
                {item.area && (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {item.area} m²
                  </span>
                )}
              </div>

              {/* Açıklama */}
              {item.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-slate-900">Açıklama</h2>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {item.description}
                  </div>
                </div>
              )}
            </div>
          </article>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}
