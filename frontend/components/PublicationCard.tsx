import type { Publication } from '../lib/api';

type Props = { item: Publication; formatDate: (iso: string | null) => string };

export function PublicationCard({ item, formatDate }: Props) {
  return (
    <a
      href={item.fileUrl || '#'}
      target={item.fileUrl?.startsWith('http') ? '_blank' : undefined}
      rel={item.fileUrl?.startsWith('http') ? 'noreferrer' : undefined}
      className="group flex items-start gap-3 rounded-xl bg-white p-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg xs:rounded-2xl xs:p-4"
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-burgundy/10 text-burgundy">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{formatDate(item.publishDate)}</p>
        <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2 transition-colors group-hover:text-burgundy">
          {item.title}
        </p>
      </div>
    </a>
  );
}
