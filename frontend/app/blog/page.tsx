'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { getBlogBySlug, listBlogPublic, type BlogPost } from '../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function BlogPageInner() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleItems = useMemo(() => items || [], [items]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await listBlogPublic({ page: 1, limit: 50 });
        if (cancelled) return;
        setItems(res.items || []);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Blog içerikleri yüklenemedi.');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadOne(slug: string) {
      setModalLoading(true);
      setError(null);
      try {
        const p = await getBlogBySlug(slug);
        if (cancelled) return;
        setSelected(p);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Blog yazısı açılamadı.');
      } finally {
        if (cancelled) return;
        setModalLoading(false);
      }
    }
    if (selectedSlug) loadOne(selectedSlug);
    return () => {
      cancelled = true;
    };
  }, [selectedSlug]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Blog" subtitle="Güncel yazılar ve bilgilendirici içerikler." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Yazılar</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedSlug(p.slug)}
              className="group text-left overflow-hidden rounded-3xl bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="text-xs font-semibold tracking-wide text-slate-500">{formatDot(p.publishDate)}</div>
              <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-burgundy line-clamp-2">{p.title}</h3>
              <p className="mt-2 text-xs text-slate-600 line-clamp-3">{p.excerpt || ''}</p>
              <div className="mt-3 text-xs font-semibold text-burgundy">Oku →</div>
            </button>
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
        {!loading && visibleItems.length === 0 ? <div className="mt-6 text-sm text-slate-500">Henüz yazı yok.</div> : null}
      </section>

      {selectedSlug ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-6 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{selected?.title || 'Blog Yazısı'}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {selected?.publishDate ? formatDot(selected.publishDate) : ''} {selected?.author ? `• ${selected.author}` : ''}
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setSelectedSlug(null);
                  setSelected(null);
                }}
              >
                Kapat
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto px-6 py-4">
              {modalLoading ? (
                <div className="text-sm text-slate-600">Yükleniyor…</div>
              ) : selected ? (
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{selected.content}</pre>
              ) : (
                <div className="text-sm text-slate-600">İçerik bulunamadı.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </PageLayoutWithFooter>
  );
}

export default function BlogPage() {
  // Keep Suspense to avoid static export warnings if we later add search params
  return (
    <Suspense fallback={<div />}>
      <BlogPageInner />
    </Suspense>
  );
}

