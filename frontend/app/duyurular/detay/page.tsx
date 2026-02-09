import { Suspense } from 'react';
import { DuyuruDetayView } from './view';

export default function DuyuruDetayPage() {
  return (
    <Suspense fallback={<div className="w-full px-4 py-10 text-sm text-slate-600">Yükleniyor…</div>}>
      <DuyuruDetayView />
    </Suspense>
  );
}
