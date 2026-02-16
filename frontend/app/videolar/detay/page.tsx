import { Suspense } from 'react';
import { VideoDetailView } from './view';

export default function VideoDetailPage() {
  return (
    <Suspense fallback={<div className="w-full px-4 py-10 text-sm text-slate-600">Yükleniyor…</div>}>
      <VideoDetailView />
    </Suspense>
  );
}
