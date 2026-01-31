import Link from 'next/link';
import type { AnnouncementItem } from '../lib/dummyData';

type Props = {
  item: AnnouncementItem;
};

export function AnnouncementCard({ item }: Props) {
  return (
    <Link
      href="#"
      className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-soft-gray text-slate-500">
        {/* Minimal “file” icon (TMB list vibe) */}
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
        <p className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2 hover:text-burgundy">{item.title}</p>
      </div>
    </Link>
  );
}

