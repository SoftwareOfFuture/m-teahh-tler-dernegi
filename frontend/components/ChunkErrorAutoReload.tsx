'use client';

import { useEffect } from 'react';

function isChunkLoadErrorMessage(message: string) {
  const m = (message || '').toLowerCase();
  return (
    m.includes('chunkloaderror') ||
    m.includes('loading chunk') ||
    m.includes('loading css chunk') ||
    m.includes('failed to fetch dynamically imported module') ||
    m.includes('/_next/static/chunks/') ||
    m.includes('/_next/static/css/')
  );
}

function getErrorMessage(value: unknown) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'message' in value && typeof (value as any).message === 'string') {
    return (value as any).message;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export function ChunkErrorAutoReload() {
  useEffect(() => {
    const KEY = 'amd_chunk_reload_once_v1';

    const reloadOnce = () => {
      try {
        if (sessionStorage.getItem(KEY)) return;
        sessionStorage.setItem(KEY, '1');
      } catch {
        // ignore storage failures
      }

      try {
        const url = new URL(window.location.href);
        url.searchParams.set('__refresh', String(Date.now()));
        window.location.replace(url.toString());
      } catch {
        window.location.reload();
      }
    };

    const onError = (event: ErrorEvent) => {
      const message = event?.message || '';
      const filename = (event as any)?.filename || '';
      if (isChunkLoadErrorMessage(message) || isChunkLoadErrorMessage(filename)) reloadOnce();
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = (event as any)?.reason;
      const message = getErrorMessage(reason);
      if (isChunkLoadErrorMessage(message)) reloadOnce();
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}

