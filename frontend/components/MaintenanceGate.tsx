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
  const [displayValue, setDisplayValue] = useState(value);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
      setKey((k) => k + 1);
    }
  }, [value, displayValue]);
  return (
    <div className="group relative flex flex-col items-center justify-center rounded-2xl min-w-[78px] sm:min-w-[88px] overflow-hidden maintenance-glass-card">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        key={key}
        className="relative text-4xl sm:text-5xl font-bold tabular-nums text-white drop-shadow-lg animate-maintenance-countdown-pop"
      >
        {String(displayValue).padStart(2, '0')}
      </span>
      <span className="relative mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
        {label}
      </span>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin" />
          <p className="text-white/60 text-sm font-medium">Yükleniyor…</p>
        </div>
      </div>
    );
  }
  if (!settings.maintenanceMode) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-90 maintenance-bg-mesh" />
      <div className="absolute inset-0 animate-maintenance-gradient opacity-70" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-burgundy/30 blur-[100px] animate-maintenance-float-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-rose-900/25 blur-[80px] animate-maintenance-float-slower" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/15 blur-[120px] animate-maintenance-pulse-slow" />
      <div className="absolute inset-0 opacity-[0.04] maintenance-grid-overlay" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none maintenance-grain" />

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-10 animate-maintenance-float-icon maintenance-glass-icon">
          <svg
            className="w-12 h-12 text-white animate-spin maintenance-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight maintenance-title-gradient">
          Site Bakımda
        </h1>
        <p className="mt-4 text-white/80 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium">
          Antalya İnşaat Müteahhitleri Derneği web sitemiz kısa süreli bakım çalışmasındadır. Anlayışınız için teşekkür ederiz.
        </p>

        {endAt && diff && (
          <div className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-5">
            <CountdownBlock value={diff.d} label="Gün" />
            <CountdownBlock value={diff.h} label="Saat" />
            <CountdownBlock value={diff.m} label="Dakika" />
            <CountdownBlock value={diff.s} label="Saniye" />
          </div>
        )}
        {endAt && isPast && (
          <p className="mt-10 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white/95 font-semibold text-sm sm:text-base inline-block">
            Bakım tamamlanmak üzere. Lütfen kısa süre sonra tekrar deneyin.
          </p>
        )}
        {!endAt && (
          <p className="mt-10 text-white/70 text-sm font-medium">Yakında tekrar hizmetinizdeyiz.</p>
        )}

        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-white/50 text-xs font-medium">© Antalya İnşaat Müteahhitleri Derneği</p>
        </div>
      </div>
    </div>
  );
}
