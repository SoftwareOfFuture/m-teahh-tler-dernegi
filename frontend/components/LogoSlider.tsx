'use client';

import type { PartnerLogo } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  logos: PartnerLogo[];
};

function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const v = String(raw || '').trim();
  if (!v) return null;
  const lower = v.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) return null;
  if (lower.startsWith('http://') || lower.startsWith('https://')) return v;
  return `https://${v.replace(/^\/+/, '')}`;
}

export function LogoSlider({ logos }: Props) {
  // Duplicate list for seamless marquee
  const doubled = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden rounded-3xl bg-white p-4 shadow-card sm:p-6">
      {/* Keep marquee out of normal flow to avoid page width expansion */}
      <div className="relative h-[140px] w-full overflow-hidden sm:h-[160px]">
        {/* NOTE: avoid fixed 200% widths; animate only inside the clipped area */}
        <div className="absolute left-0 top-0 inline-flex h-full animate-marquee gap-4 will-change-transform sm:gap-6">
          {doubled.map((logo, idx) => {
            const logoSrc = normalizeImageSrc(logo.logoUrl);
            const websiteUrl = normalizeWebsiteUrl(logo.websiteUrl);
            
            const CardContent = (
              <div className="group grid h-full w-[170px] shrink-0 flex-col place-items-center rounded-2xl border border-black/5 bg-white px-4 py-3 text-center transition-all hover:bg-soft-gray hover:shadow-md">
                {/* Logo image or fallback */}
                <div className="flex h-[80px] w-full items-center justify-center">
                  {logoSrc ? (
                    /* eslint-disable @next/next/no-img-element */
                    <img
                      src={logoSrc}
                      alt={logo.name}
                      className="max-h-[80px] w-auto max-w-[150px] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid size-16 place-items-center rounded-full bg-soft-gray text-lg font-extrabold tracking-wide text-slate-400">
                      {logo.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Company name below logo */}
                <div className="mt-2 w-full">
                  <div className="truncate text-xs font-bold text-slate-700">{logo.name}</div>
                </div>
              </div>
            );
            
            if (websiteUrl) {
              return (
                <a
                  key={`${logo.id}-${idx}`}
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {CardContent}
                </a>
              );
            }
            
            return (
              <div key={`${logo.id}-${idx}`}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
