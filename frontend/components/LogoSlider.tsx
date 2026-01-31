'use client';

import type { PartnerLogo } from '../lib/dummyData';

type Props = {
  logos: PartnerLogo[];
};

export function LogoSlider({ logos }: Props) {
  // Duplicate list for seamless marquee
  const doubled = [...logos, ...logos];

  return (
    <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-card">
      <div className="relative">
        <div className="flex w-[200%] animate-marquee gap-6">
          {doubled.map((logo, idx) => (
            <div
              key={`${logo.id}-${idx}`}
              className="group grid min-w-[170px] flex-1 place-items-center rounded-2xl border border-black/5 bg-soft-gray px-4 py-6 text-center transition-all hover:bg-white"
            >
              {/* Dummy “logo” as text (grayscale vibe) */}
              <div className="text-sm font-bold tracking-wide text-slate-400 grayscale transition-all group-hover:text-slate-900 group-hover:grayscale-0">
                {logo.logoText}
              </div>
              <div className="mt-1 text-xs text-slate-500 group-hover:text-slate-600">{logo.name}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {/* UX note: real projede SVG/PNG logolar kullanılmalı. */}
        Partner logoları demo amaçlı metin olarak gösterilmektedir.
      </p>
    </div>
  );
}

