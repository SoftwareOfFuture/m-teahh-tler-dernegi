'use client';

import Image from 'next/image';
import type { BoardMember } from '../lib/api';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { members: BoardMember[] };

export function BoardPyramid({ members }: Props) {
  const baskan = members.filter((m) => m.role === 'baskan');
  const uyeler = members.filter((m) => m.role === 'uyelik');

  if (members.length === 0) return null;

  const MemberCard = ({ m }: { m: BoardMember }) => {
    const src = normalizeImageSrc(m.imageUrl);
    return (
      <div className="flex flex-col items-center">
        <div className="relative size-20 overflow-hidden rounded-full border-2 border-burgundy/30 bg-slate-100 shadow-soft xs:size-24 sm:size-28 md:size-32">
          {src ? (
            <Image
              src={src}
              alt={m.name}
              fill
              className="object-cover"
              sizes="(max-width: 375px) 80px, (max-width: 640px) 96px, 112px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-burgundy/60 xs:text-3xl sm:text-4xl">
              {m.name.charAt(0)}
            </div>
          )}
        </div>
        <p className="mt-2 text-center text-sm font-semibold text-slate-800 xs:text-base">{m.name}</p>
        {m.unit ? <p className="mt-0.5 text-center text-xs text-slate-600 xs:text-sm">{m.unit}</p> : null}
      </div>
    );
  };

  return (
    <section className="mt-16">
      <h2 className="mb-8 text-center text-xl font-bold text-slate-900 sm:text-2xl">Yönetim Kurulu</h2>
      <div className="flex flex-col items-center gap-10">
        {/* Başkan - en üstte, tek */}
        {baskan.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft">
              <MemberCard m={baskan[0]} />
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-burgundy">Başkan</p>
          </div>
        )}

        {/* Başkan ile üyeler arasında çizgi */}
        {baskan.length > 0 && uyeler.length > 0 && (
          <div className="h-px w-12 bg-slate-200" aria-hidden />
        )}

        {/* Üyeler - piramit şeklinde (yuvarlak/oval kartlar) */}
        {uyeler.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 xs:gap-8 sm:gap-10 md:gap-12">
            {uyeler.map((m) => (
              <div
                key={m.id}
                className="flex rounded-2xl bg-white px-4 py-4 shadow-soft transition-all hover:shadow-soft-lg xs:px-5 xs:py-5"
              >
                <MemberCard m={m} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
