'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SliderItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { items: SliderItem[] };

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

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % len), 6500);
    return () => clearInterval(t);
  }, [len]);

  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl shadow-soft-lg md:mx-6 md:mt-6">
      <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[560px]">
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
          <div className="w-full max-w-full p-6 sm:p-8 md:p-12">
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              ANTMUTDER DİJİTAL PLATFORMLAR
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              Sektörel birliktelik, güncel içerikler ve güçlü iletişim için dijital platformlarımızla yanınızdayız.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/kurumsal"
                className="inline-flex items-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98]"
              >
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
          aria-label="Önceki"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
          aria-label="Sonraki"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {safeItems.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
