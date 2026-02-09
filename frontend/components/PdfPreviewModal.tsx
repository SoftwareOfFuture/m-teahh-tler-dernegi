'use client';

import { useEffect } from 'react';

export function PdfPreviewModal({
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

  if (!open || !url) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 bg-white">
        <div className="min-w-0">
          <h2 id="pdf-modal-title" className="truncate text-sm font-bold text-slate-900">
            {title || 'PDF Önizleme'}
          </h2>
          <p id="pdf-modal-description" className="truncate text-xs text-slate-500">
            {url}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
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

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-modal-title"
        aria-describedby="pdf-modal-description"
        className="flex flex-1 min-h-0 w-full"
      >
        <iframe title={title || 'PDF'} src={url} className="flex-1 w-full min-h-0 border-0" />
      </div>
    </div>
  );
}

