import { Suspense } from 'react';
import { PropertyDetailView } from './view';

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={<div className="w-full px-4 py-10 text-sm text-slate-600">Yükleniyor…</div>}>
      <PropertyDetailView />
    </Suspense>
  );
}
