'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { EventItem } from '../lib/dummyData';

type Props = {
  events: EventItem[];
};

export function Sidebar({ events }: Props) {
  const memberTypes = useMemo(
    () => [
      { value: 'all', label: 'Tüm Üyeler' },
      { value: 'a', label: 'A Grubu' },
      { value: 'b', label: 'B Grubu' },
      { value: 'c', label: 'C Grubu' },
    ],
    []
  );

  const [type, setType] = useState(memberTypes[0]?.value ?? 'all');
  const [q, setQ] = useState('');

  return (
    <aside className="space-y-6">
      {/* Üye Arama */}
      <div className="rounded-3xl bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900">Üye Arama</h3>

        <div className="mt-4 space-y-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
          >
            {memberTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Firma adı veya anahtar kelime"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
          />

          {/* Dummy action */}
          <button
            type="button"
            className="w-full rounded-full bg-soft-gray px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('member search', { type, q });
            }}
          >
            Ara
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Detaylı Üye Arama →
          </Link>
        </div>
      </div>

      {/* Sektörel Paydaşlar */}
      <button
        type="button"
        className="w-full rounded-full bg-soft-gray px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
      >
        SEKTÖREL PAYDAŞLAR
      </button>

      {/* Etkinlikler */}
      <div className="rounded-3xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Etkinlikler</h3>
          <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Tümünü Gör →
          </Link>
        </div>

        <ul className="mt-4 space-y-3">
          {events.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className={`mt-1 inline-block size-3 shrink-0 rounded-full ${dotColor(e.color)}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">{e.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {e.date} • {e.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200"
                aria-label="Aç"
              >
                <SmallArrow />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function dotColor(color: EventItem['color']) {
  switch (color) {
    case 'burgundy':
      return 'bg-burgundy';
    case 'green':
      return 'bg-emerald-500';
    case 'blue':
      return 'bg-sky-500';
    default:
      return 'bg-slate-400';
  }
}

function SmallArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

