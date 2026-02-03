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
    <section className="relative w-full overflow-hidden rounded-2xl bg-slate-900 sm:rounded-3xl">
      <div className="relative h-[280px] min-h-[220px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
        <Image
          src={normalizeImageSrc(current.imageUrl)}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-full p-3 sm:p-6 md:p-10">
            <p className="text-[11px] font-medium text-white/80 sm:text-xs md:text-sm">{current.date}</p>
            <h1 className="mt-1.5 line-clamp-2 text-lg font-bold leading-tight text-white sm:line-clamp-none sm:text-2xl md:text-3xl lg:text-4xl">
              {current.title}
            </h1>
            <p className="mt-2 line-clamp-2 text-xs text-white/90 sm:line-clamp-3 sm:text-sm md:line-clamp-none md:text-base">
              {current.description}
            </p>

            <div className="mt-4 sm:mt-5">
              <Link
                href="/kurumsal"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-white/70 px-4 py-2.5 text-xs font-semibold text-white transition-colors active:scale-[0.98] hover:border-white hover:bg-white hover:text-slate-900 sm:px-6 sm:py-2.5 sm:text-sm"
              >
                DETAYLI İNCELE
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-1.5 top-1/2 grid size-10 min-h-[44px] min-w-[44px] -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors active:scale-95 hover:bg-white/25 sm:left-4 sm:size-10"
          aria-label="Önceki"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-1.5 top-1/2 grid size-10 min-h-[44px] min-w-[44px] -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors active:scale-95 hover:bg-white/25 sm:right-4 sm:size-10"
          aria-label="Sonraki"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-4">
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1.5 backdrop-blur sm:gap-2 sm:px-3 sm:py-2">
            {safeItems.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIdx(i)}
                className={`size-2 rounded-full transition-colors ${
                  i === idx ? 'bg-burgundy' : 'bg-white/60 hover:bg-white'
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

