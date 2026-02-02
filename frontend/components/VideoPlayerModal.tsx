'use client';

import { useEffect, useMemo } from 'react';

function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '').trim();
      return id || null;
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1] || null;
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/shorts/')[1] || null;
    }
  } catch {
    // ignore
  }
  return null;
}

function toEmbedInfo(rawUrl: string): { kind: 'youtube' | 'vimeo' | 'file' | 'unknown'; embedUrl?: string; fileUrl?: string } {
  const u = String(rawUrl || '').trim();
  if (!u || u === '#') return { kind: 'unknown' };

  const yt = parseYouTubeId(u);
  if (yt) return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0` };

  try {
    const url = new URL(u);
    if (url.hostname.includes('vimeo.com')) {
      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts[0];
      if (id && /^\d+$/.test(id)) return { kind: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch {
    // ignore
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { kind: 'file', fileUrl: u };

  return { kind: 'unknown' };
}

export function VideoPlayerModal({
  open,
  url,
  title,
  onClose,
}: {
  open: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const info = useMemo(() => (url ? toEmbedInfo(url) : { kind: 'unknown' as const }), [url]);

  if (!open || !url) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Kapat" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[min(980px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900">{title || 'Video'}</div>
            <div className="truncate text-xs text-slate-500">{url}</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-soft-gray"
            >
              Yeni sekmede aç
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-burgundy px-3 py-1.5 text-xs font-semibold text-white hover:bg-burgundy-dark"
            >
              Kapat
            </button>
          </div>
        </div>

        <div className="bg-black">
          <div className="relative aspect-video w-full">
            {info.kind === 'file' && info.fileUrl ? (
              <video className="absolute inset-0 h-full w-full" controls autoPlay src={info.fileUrl} />
            ) : info.kind !== 'unknown' && info.embedUrl ? (
              <iframe
                title={title || 'Video'}
                src={info.embedUrl}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-slate-900 p-6 text-center">
                <div>
                  <div className="text-sm font-bold text-white">Video önizleme desteklenmiyor</div>
                  <div className="mt-2 text-xs text-white/70">Bu linki yeni sekmede açmayı deneyin.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

