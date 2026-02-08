'use client';

import type { PartnerLogo } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { logos: PartnerLogo[] };

function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const v = String(raw || '').trim();
  if (!v) return null;
  const lower = v.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) return null;
  if (lower.startsWith('http://') || lower.startsWith('https://')) return v;
  return `https://${v.replace(/^\/+/, '')}`;
}

export function LogoSlider({ logos }: Props) {
  const doubled = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-soft sm:p-6">
      <div className="relative h-[120px] w-full overflow-hidden sm:h-[140px] md:h-[160px]">
        <div className="absolute left-0 top-0 inline-flex h-full animate-marquee gap-4 will-change-transform sm:gap-6">
          {doubled.map((logo, idx) => {
            const logoSrc = normalizeImageSrc(logo.logoUrl);
            const websiteUrl = normalizeWebsiteUrl(logo.websiteUrl);

            const CardContent = (
              <div className="group grid h-full w-[140px] shrink-0 flex-col place-items-center rounded-xl bg-slate-50 px-3 py-2 text-center transition-all duration-300 hover:bg-burgundy/5 hover:shadow-soft sm:w-[170px] sm:px-4 sm:py-3">
                <div className="flex h-[80px] w-full items-center justify-center">
                  {logoSrc ? (
                    /* eslint-disable @next/next/no-img-element */
                    <img src={logoSrc} alt={logo.name} className="max-h-[80px] w-auto max-w-[150px] object-contain" loading="lazy" />
                  ) : (
                    <div className="grid size-16 place-items-center rounded-lg bg-slate-200 text-lg font-bold text-slate-400">
                      {logo.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-1.5 w-full overflow-hidden sm:mt-2">
                  <div className="truncate text-[11px] font-semibold text-slate-700 sm:text-xs">{logo.name}</div>
                </div>
              </div>
            );

            if (websiteUrl) {
              return (
                <a key={`${logo.id}-${idx}`} href={websiteUrl} target="_blank" rel="noreferrer" className="block">
                  {CardContent}
                </a>
              );
            }
            return <div key={`${logo.id}-${idx}`}>{CardContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
