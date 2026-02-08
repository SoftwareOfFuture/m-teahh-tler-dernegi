import Link from 'next/link';
import type { AnnouncementItem } from '../lib/types';

type Props = {
  item: AnnouncementItem;
};

export function AnnouncementCard({ item }: Props) {
  return (
    <Link
      href="#"
      className="group flex items-start gap-2.5 rounded-2xl bg-white p-3 shadow-card ring-1 ring-slate-100/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover hover:ring-burgundy/10 sm:gap-3 sm:rounded-3xl sm:p-4"
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-burgundy-muted text-burgundy transition-colors duration-300 group-hover:bg-burgundy/10 sm:size-10">
        {/* Minimal “file” icon (list vibe) */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{item.code}</span> • {item.date}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-900 line-clamp-2 hover:text-burgundy sm:text-sm">{item.title}</p>
      </div>
    </Link>
  );
}

