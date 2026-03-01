'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.error('App error:', error?.message ?? error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold text-slate-800">Bir hata oluştu</h1>
      <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
        Sayfa yüklenirken bir sorun yaşandı. Lütfen tekrar deneyin.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-[#8B1538] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Tekrar dene
      </button>
    </div>
  );
}
