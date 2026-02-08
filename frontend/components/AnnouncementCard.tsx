import Link from 'next/link';
import type { AnnouncementItem } from '../lib/types';

type Props = { item: AnnouncementItem };

export function AnnouncementCard({ item }: Props) {
  return (
    <Link
      href="#"
      className="group flex items-start gap-3 border-2 border-navy bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-brutal"
    >
      <div className="grid size-10 shrink-0 place-items-center border-2 border-navy bg-cream text-teal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-navy/60">
          <span className="font-semibold text-navy">{item.code}</span> • {item.date}
        </p>
        <p className="mt-1 font-heading text-sm font-semibold text-navy line-clamp-2 group-hover:text-teal">{item.title}</p>
      </div>
    </Link>
  );
}
