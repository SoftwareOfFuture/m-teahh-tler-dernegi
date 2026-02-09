'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SliderItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { items: SliderItem[] };

const SWIPE_THRESHOLD = 50;

export function HeroSlider({ items }: Props) {
  const safeItems = useMemo(() => {
    const arr = items ?? [];
    if (arr.length === 0) {
      return [{
        id: 'default',
        date: '',
        title: 'ANTMUTDER DİJİTAL PLATFORMLAR',
        description: 'Sektörel birliktelik, güncel içerikler ve güçlü iletişim için dijital platformlarımızla yanınızdayız.',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70',
        href: '#',
      }];
    }
    return arr;
  }, [items]);
  const [idx, setIdx] = useState(0);
  const len = safeItems.length;
  const current = safeItems[idx % len];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % len), 6500);
    return () => clearInterval(t);
  }, [len]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current == null || len <= 1) return;
    const endX = e.changedTouches[0].clientX;
    const delta = touchStartX.current - endX;
    if (delta > SWIPE_THRESHOLD) setIdx((v) => (v + 1) % len);
    else if (delta < -SWIPE_THRESHOLD) setIdx((v) => (v - 1 + len) % len);
    touchStartX.current = null;
  }, [len]);

  return (
    <section className="relative mt-2 w-full min-w-0 overflow-hidden rounded-2xl shadow-soft-lg sm:mt-4 md:mt-6">
      <div
        className="relative h-[280px] min-w-0 touch-pan-y sm:h-[360px] md:h-[440px] lg:h-[500px] xl:h-[560px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={normalizeImageSrc(current.imageUrl)}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-full min-w-0 p-4 sm:p-6 md:p-8 lg:p-12">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl break-words">
              {current.title}
            </h1>
            {current.description ? (
              <p className="mt-2 max-w-2xl min-w-0 text-xs leading-relaxed text-white/90 sm:mt-3 sm:text-sm md:text-base break-words">
                {current.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {current.href && current.href !== '#' ? (
                <Link
                  href={current.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98] sm:px-6"
                >
                  Detay
                </Link>
              ) : null}
              <Link
                href="/kurumsal"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98] sm:px-6"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 border-white px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900 sm:px-6"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>

        {/* Sağ/sol oklar: sadece sm ve üzeri (mobilde gizli, dokunmatik kaydırma kullanılır) */}
        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:left-4 sm:grid sm:size-12"
          aria-label="Önceki slayt"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:right-4 sm:grid sm:size-12"
          aria-label="Sonraki slayt"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
          {safeItems.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setIdx(i)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label={`Slayt ${i + 1}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
