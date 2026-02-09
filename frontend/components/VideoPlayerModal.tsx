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
    <div className="fixed inset-0 z-[80] flex flex-col bg-black">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-sm">
        <div className="min-w-0">
          <h2 id="video-modal-title" className="truncate text-sm font-bold text-white">
            {title || 'Video'}
          </h2>
          <p id="video-modal-description" className="truncate text-xs text-white/70">
            {url}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
          >
            Yeni sekmede aç
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-burgundy px-3 py-2 text-xs font-semibold text-white hover:bg-burgundy-dark"
          >
            Kapat
          </button>
        </div>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
        className="flex flex-1 min-h-0 w-full"
      >
        <div className="relative flex-1 w-full min-h-0">
            {info.kind === 'file' && info.fileUrl ? (
              <video className="absolute inset-0 h-full w-full object-contain" controls autoPlay src={info.fileUrl} />
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
  );
}

