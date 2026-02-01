'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { HomeBanner } from '../lib/api';

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export function HomeBannerStrip({ banner }: { banner: HomeBanner | null }) {
  if (!banner) return null;

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap || !rootRef.current || killed) return;
        gsap.fromTo(
          rootRef.current,
          { opacity: 0, y: 10, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out' }
        );
      } catch {
        // If gsap isn't available, silently skip animation.
      }
    })();
    return () => {
      killed = true;
    };
  }, [banner.id]);

  const content = (
    <div
      ref={rootRef}
      className="group relative w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative h-[92px] p-2 sm:h-[110px] sm:p-3 md:h-[130px]">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-50">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-contain"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-end p-4 sm:p-5">
          <div className="max-w-[92%] truncate rounded-full bg-slate-900/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {banner.title}
          </div>
        </div>
      </div>
    </div>
  );

  if (isInternalHref(banner.href)) {
    return (
      <Link href={banner.href} className="block" aria-label={banner.title}>
        {content}
      </Link>
    );
  }

  return (
    <a href={banner.href} className="block" target="_blank" rel="noreferrer" aria-label={banner.title}>
      {content}
    </a>
  );
}

