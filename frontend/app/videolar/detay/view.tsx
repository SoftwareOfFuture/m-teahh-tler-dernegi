'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../../components/PageHero';
import { PageLayoutWithFooter } from '../../../components/PageLayout';
import { VideoPlayerModal } from '../../../components/VideoPlayerModal';
import { normalizeImageSrc } from '../../../lib/normalizeImageSrc';
import { getVideoPublic } from '../../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function VideoDetailView() {
  const sp = useSearchParams();
  const id = sp.get('id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Awaited<ReturnType<typeof getVideoPublic>> | null>(null);
  const [videoPreview, setVideoPreview] = useState<{ url: string; title: string } | null>(null);

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
        const res = await getVideoPublic(safeId);
        if (cancelled) return;
        setItem(res);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'İçerik yüklenemedi.');
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

  const hasVideo = item?.href && item.href.trim() !== '';

  return (
    <PageLayoutWithFooter>
      <PageHero title="Arşiv Detayı" subtitle="İçeriği görüntüleyin." />

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/videolar" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            ← Arşiv
          </Link>
          {item?.publishDate ? (
            <div className="text-xs font-semibold text-slate-500">{formatDot(item.publishDate)}</div>
          ) : null}
        </div>

        {!safeId ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            İçerik bulunamadı.
          </div>
        ) : loading ? (
          <div className="mt-6 rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : !item ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
            İçerik bulunamadı.
          </div>
        ) : (
          <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
            {item.thumbnailUrl ? (
              <div className="relative aspect-[21/9] w-full">
                <Image
                  src={normalizeImageSrc(item.thumbnailUrl)}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {hasVideo && (
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <button
                      type="button"
                      onClick={() => setVideoPreview({ url: item.href!, title: item.title })}
                      className="grid size-16 place-items-center rounded-full bg-white/90 text-burgundy shadow-soft transition-all hover:scale-110 hover:bg-white"
                      aria-label="Videoyu oynat"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
            <div className="p-6">
              <h1 className="text-xl font-bold text-slate-900">{item.title}</h1>
              {item.excerpt ? (
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {item.excerpt}
                </div>
              ) : null}
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setVideoPreview({ url: item.href!, title: item.title })}
                  className="mt-6 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
                >
                  Videoyu İzle
                </button>
              )}
            </div>
          </article>
        )}
      </section>

      <VideoPlayerModal
        open={!!videoPreview}
        url={videoPreview?.url ?? null}
        title={videoPreview?.title}
        onClose={() => setVideoPreview(null)}
      />
    </PageLayoutWithFooter>
  );
}
