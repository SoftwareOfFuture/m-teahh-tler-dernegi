'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeBanner } from '../lib/api';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export function HomeBannerStrip({ banners, loading }: { banners: HomeBanner[]; loading?: boolean }) {
  const list = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const layerARef = useRef<HTMLDivElement | null>(null);
  const layerBRef = useRef<HTMLDivElement | null>(null);
  const activeLayerRef = useRef<'a' | 'b'>('a');
  const currentIndexRef = useRef(0);

  const [activeLayer, setActiveLayer] = useState<'a' | 'b'>('a');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layerA, setLayerA] = useState<HomeBanner | null>(() => list[0] ?? null);
  const [layerB, setLayerB] = useState<HomeBanner | null>(() => list[0] ?? null);

  const activeBanner = (activeLayer === 'a' ? layerA : layerB) ?? list[0] ?? null;

  useEffect(() => {
    if (!list.length) return;
    activeLayerRef.current = 'a';
    currentIndexRef.current = 0;
    setActiveLayer('a');
    setCurrentIndex(0);
    setLayerA(list[0]);
    setLayerB(list[0]);
    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap) return;
        if (layerARef.current) gsap.set(layerARef.current, { opacity: 1, zIndex: 2 });
        if (layerBRef.current) gsap.set(layerBRef.current, { opacity: 0, zIndex: 1 });
      } catch {
      }
    })();
  }, [list]);

  useEffect(() => {
    const len = list.length;
    if (len <= 1) return;
    let killed = false;
    const t = setInterval(() => {
      const fromLayer = activeLayerRef.current;
      const toLayer = fromLayer === 'a' ? 'b' : 'a';
      const nextIndex = (currentIndexRef.current + 1) % len;
      const nextBanner = list[nextIndex];

      // Put next banner into the hidden layer (React will re-render with new image)
      if (toLayer === 'a') setLayerA(nextBanner);
      else setLayerB(nextBanner);

      // Animasyon bitince activeLayer güncellenir (CSS ile GSAP çakışması önlenir)
      (async () => {
        try {
          const mod: any = await import('gsap');
          const gsap = mod?.gsap || mod?.default || mod;
          if (!gsap || killed) return;

          const activeEl = fromLayer === 'a' ? layerARef.current : layerBRef.current;
          const nextEl = toLayer === 'a' ? layerARef.current : layerBRef.current;
          if (!activeEl || !nextEl) return;

          // Çıkış katmanı üstte, giriş altta - crossfade için
          gsap.set(activeEl, { opacity: 1, zIndex: 2 });
          gsap.set(nextEl, { opacity: 0, zIndex: 1 });

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(activeEl, { opacity: 0, zIndex: 1 });
              gsap.set(nextEl, { opacity: 1, zIndex: 2 });
              setActiveLayer(toLayer);
              setCurrentIndex(nextIndex);
              activeLayerRef.current = toLayer;
              currentIndexRef.current = nextIndex;
            },
          });
          tl.to(activeEl, { opacity: 0, duration: 0.7, ease: 'power2.in' }, 0);
          tl.to(nextEl, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);
        } catch {
          setActiveLayer(toLayer);
          setCurrentIndex(nextIndex);
          activeLayerRef.current = toLayer;
          currentIndexRef.current = nextIndex;
        }
      })();
    }, 6500);
    return () => {
      killed = true;
      clearInterval(t);
    };
  }, [list]);

  if (!list.length && loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-200 sm:rounded-2xl">
        <div className="h-[60px] animate-pulse sm:h-[90px] md:h-[120px] lg:h-[160px]" />
      </div>
    );
  }
  if (!list.length) return null;
  if (!activeBanner) return null;

  const layerAEffective = layerA ?? activeBanner;
  const layerBEffective = layerB ?? activeBanner;

  const content = (
    <div ref={rootRef} className="group relative w-full min-w-0 overflow-hidden rounded-xl bg-slate-900 shadow-soft-lg sm:rounded-2xl">
      <div className="relative h-[65px] w-full min-w-0 sm:h-[90px] md:h-[120px] lg:h-[150px] xl:h-[190px]">
        {/* Layer A - animasyon dışında opacity activeLayer ile, animasyonda GSAP kontrolü */}
        <div
          ref={layerARef}
          className="absolute inset-0"
          style={{ opacity: activeLayer === 'a' ? 1 : 0, zIndex: activeLayer === 'a' ? 2 : 1 }}
        >
          <Image
            src={normalizeImageSrc(layerAEffective.imageUrl)}
            alt={layerAEffective.title}
            fill
            sizes="(min-width: 1920px) 1920px, 100vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        {/* Layer B - animasyon dışında opacity activeLayer ile, animasyonda GSAP kontrolü */}
        <div
          ref={layerBRef}
          className="absolute inset-0"
          style={{ opacity: activeLayer === 'b' ? 1 : 0, zIndex: activeLayer === 'b' ? 2 : 1 }}
        >
          <Image
            src={normalizeImageSrc(layerBEffective.imageUrl)}
            alt={layerBEffective.title}
            fill
            sizes="(min-width: 1920px) 1920px, 100vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </div>
      {/* Mobil: dot göstergeleri */}
      {list.length > 1 ? (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 sm:bottom-3 md:bottom-4" aria-hidden>
          {list.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors sm:h-2 sm:w-2 ${
                i === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  if (isInternalHref(activeBanner.href)) {
    return (
      <Link href={activeBanner.href} className="block" aria-label={activeBanner.title}>
        {content}
      </Link>
    );
  }

  return (
    <a href={activeBanner.href} className="block" target="_blank" rel="noreferrer" aria-label={activeBanner.title}>
      {content}
    </a>
  );
}

