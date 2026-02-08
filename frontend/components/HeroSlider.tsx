'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SliderItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  items: SliderItem[];
};

export function HeroSlider({ items }: Props) {
  const safeItems = useMemo(() => items ?? [], [items]);
  const [idx, setIdx] = useState(0);

  const len = safeItems.length;
  const current = len ? safeItems[idx % len] : null;

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % len), 6500);
    return () => clearInterval(t);
  }, [len]);

  if (!current) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-slate-premium shadow-premium-lg sm:rounded-3xl">
      <div className="relative h-[300px] min-h-[240px] sm:h-[380px] md:h-[480px] lg:h-[540px]">
        <Image
          src={normalizeImageSrc(current.imageUrl)}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-premium via-slate-premium/60 via-40% to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-full p-5 sm:p-6 md:p-10 lg:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs md:text-sm">{current.date}</p>
            <h1 className="mt-2 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:line-clamp-none sm:text-2xl md:text-3xl lg:text-4xl">
              {current.title}
            </h1>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/90 sm:line-clamp-3 sm:text-sm md:line-clamp-none md:text-base">
              {current.description}
            </p>

            <div className="mt-5 sm:mt-6">
              <Link
                href="/kurumsal"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-white/80 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 active:scale-[0.98] hover:border-white hover:bg-white hover:text-slate-900 sm:px-6 sm:py-2.5 sm:text-sm"
              >
                DETAYLI İNCELE
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-2 top-1/2 grid size-11 min-h-[44px] min-w-[44px] -translate-y-1/2 place-items-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-all duration-300 active:scale-95 hover:bg-white/25 hover:scale-105 sm:left-5 sm:size-12"
          aria-label="Önceki"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-2 top-1/2 grid size-11 min-h-[44px] min-w-[44px] -translate-y-1/2 place-items-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-all duration-300 active:scale-95 hover:bg-white/25 hover:scale-105 sm:right-5 sm:size-12"
          aria-label="Sonraki"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-5">
          <div className="flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 backdrop-blur-md sm:gap-2.5 sm:px-5 sm:py-2.5">
            {safeItems.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === idx ? 'h-2 w-7 bg-white' : 'size-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

