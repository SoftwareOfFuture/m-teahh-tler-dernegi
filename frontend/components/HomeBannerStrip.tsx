'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { HomeBanner } from '../lib/api';

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export function HomeBannerStrip({ banner }: { banner: HomeBanner | null }) {
  if (!banner) return null;

  const content = (
    <div className="group relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-card">
      <div className="relative h-[92px] sm:h-[110px] md:h-[130px]">
        <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4 sm:p-5">
          <div className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur">
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

