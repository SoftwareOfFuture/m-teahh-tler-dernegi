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
  // En az 4 kopya ile kesintisiz sonsuz döngü
  const repeated = logos.length > 0 ? [...logos, ...logos, ...logos, ...logos] : [];

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl bg-white p-3 shadow-soft xs:p-4 sm:rounded-2xl sm:p-6">
      <div className="relative h-[90px] w-full overflow-hidden xs:h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px]">
        <div className="absolute left-0 top-0 inline-flex h-full animate-marquee gap-3 will-change-transform xs:gap-4 sm:gap-6">
          {repeated.map((logo, idx) => {
            const logoSrc = normalizeImageSrc(logo.logoUrl);
            const websiteUrl = normalizeWebsiteUrl(logo.websiteUrl);

            const CardContent = (
              <div className="group grid h-full w-[100px] shrink-0 flex-col place-items-center rounded-lg bg-slate-50 px-2 py-2 text-center transition-all duration-300 hover:bg-burgundy/5 hover:shadow-soft xs:w-[110px] xs:rounded-xl sm:w-[140px] sm:px-3 md:w-[170px] md:px-4 md:py-3">
                <div className="flex h-[60px] w-full items-center justify-center xs:h-[70px] sm:h-[80px]">
                  {logoSrc ? (
                    /* eslint-disable @next/next/no-img-element */
                    <img src={logoSrc} alt="" className="max-h-[60px] w-auto max-w-[100px] object-contain xs:max-h-[70px] xs:max-w-[120px] sm:max-h-[80px] sm:max-w-[150px]" loading="lazy" />
                  ) : (
                    <div className="grid size-12 place-items-center rounded-lg bg-slate-200 text-sm font-bold text-slate-500 xs:size-14 xs:text-base sm:size-16 sm:text-lg">
                      {logo.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-1 w-full overflow-hidden xs:mt-1.5 sm:mt-2">
                  <div className="truncate text-[10px] font-semibold text-slate-700 xs:text-[11px] sm:text-xs">{logo.name}</div>
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
