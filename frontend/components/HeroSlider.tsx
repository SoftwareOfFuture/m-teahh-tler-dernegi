'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SliderItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { items: SliderItem[] };

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
    <section className="relative w-full overflow-hidden border-b-4 border-navy">
      <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[580px]">
        <Image
          src={normalizeImageSrc(current.imageUrl)}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 via-50% to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-full p-6 sm:p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">{current.date}</p>
            <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {current.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              {current.description}
            </p>
            <div className="mt-6">
              <Link
                href="/kurumsal"
                className="inline-block border-2 border-white bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
              >
                DETAYLI İNCELE
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border-2 border-white/50 bg-black/30 text-white transition-colors hover:bg-black/50 sm:left-6"
          aria-label="Önceki"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border-2 border-white/50 bg-black/30 text-white transition-colors hover:bg-black/50 sm:right-6"
          aria-label="Sonraki"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {safeItems.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-1 transition-all ${
                i === idx ? 'w-8 bg-teal' : 'w-1 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
