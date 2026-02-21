'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSiteSettingsPublic } from '../lib/api';

function useCountdown(endAt: string | null) {
  const [diff, setDiff] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isPast, setIsPast] = useState(false);
  useEffect(() => {
    if (!endAt) {
      setDiff(null);
      return;
    }
    const end = new Date(endAt).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setDiff({ d: 0, h: 0, m: 0, s: 0 });
        setIsPast(true);
        return;
      }
      const total = Math.floor((end - now) / 1000);
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      setDiff({ d, h, m, s });
      setIsPast(false);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endAt]);
  return { diff, isPast };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-5 min-w-[72px] shadow-lg">
      <span className="text-3xl sm:text-4xl font-bold tabular-nums text-white drop-shadow-sm">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/80">{label}</span>
    </div>
  );
}

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<{ maintenanceMode: boolean; maintenanceEndAt: string | null } | null>(null);

  const isPlatformAdmin = pathname?.startsWith('/platform-admin');
  const endAt = settings?.maintenanceMode && settings?.maintenanceEndAt ? settings.maintenanceEndAt : null;
  const { diff, isPast } = useCountdown(endAt);

  useEffect(() => {
    if (isPlatformAdmin) {
      setSettings({ maintenanceMode: false, maintenanceEndAt: null });
      return;
    }
    getSiteSettingsPublic()
      .then((s) => setSettings({ maintenanceMode: !!s.maintenanceMode, maintenanceEndAt: s.maintenanceEndAt ?? null }))
      .catch(() => setSettings({ maintenanceMode: false, maintenanceEndAt: null }));
  }, [isPlatformAdmin, pathname]);

  if (isPlatformAdmin) return <>{children}</>;
  if (settings === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-burgundy border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Yükleniyor…</p>
        </div>
      </div>
    );
  }
  if (!settings.maintenanceMode) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#8B1538]/90 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/20 blur-[120px] animate-pulse" />
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-8 animate-spin" style={{ animationDuration: '8s' }}>
          <svg className="w-10 h-10 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
          Site Bakımda
        </h1>
        <p className="mt-3 text-white/85 text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
          Antalya İnşaat Müteahhitleri Derneği web sitemiz kısa süreli bakım çalışmasındadır. Anlayışınız için teşekkür ederiz.
        </p>
        {endAt && diff && (
          <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <CountdownBlock value={diff.d} label="Gün" />
            <CountdownBlock value={diff.h} label="Saat" />
            <CountdownBlock value={diff.m} label="Dakika" />
            <CountdownBlock value={diff.s} label="Saniye" />
          </div>
        )}
        {endAt && isPast && (
          <p className="mt-8 text-white/90 font-medium">Bakım tamamlanmak üzere. Lütfen kısa süre sonra tekrar deneyin.</p>
        )}
        {!endAt && (
          <p className="mt-8 text-white/80 text-sm">Yakında tekrar hizmetinizdeyiz.</p>
        )}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-xs">© Antalya İnşaat Müteahhitleri Derneği</p>
        </div>
      </div>
    </div>
  );
}
