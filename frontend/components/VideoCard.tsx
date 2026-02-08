import Image from 'next/image';
import Link from 'next/link';
import type { VideoItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  item: VideoItem;
  onOpen?: (item: VideoItem) => void;
};

export function VideoCard({ item, onOpen }: Props) {
  const clickable = typeof onOpen === 'function' && item.href && item.href !== '#';

  const content = (
    <>
      <div className="relative aspect-[21/9] min-h-[100px] overflow-hidden">
        <Image
          src={normalizeImageSrc(item.thumbnailUrl)}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/50 via-black/10 to-transparent">
          <div className="grid size-12 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-white/25 text-white backdrop-blur-sm transition-all duration-400 group-hover:scale-110 group-hover:bg-white/35 sm:size-14">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="min-w-0 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-xs font-bold text-slate-900 transition-colors group-hover:text-burgundy sm:text-sm">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.excerpt}</p>
        <p className="mt-1.5 text-[11px] text-slate-400 sm:text-xs">{item.date}</p>
      </div>
    </>
  );

  const cardClass =
    'group w-full min-w-0 overflow-hidden rounded-2xl bg-white text-left shadow-card ring-1 ring-slate-100/60 transition-all duration-400 active:scale-[0.99] hover:-translate-y-1.5 hover:shadow-card-hover hover:ring-burgundy/10 sm:rounded-3xl';

  if (clickable) {
    return (
      <button type="button" onClick={() => onOpen(item)} className={cardClass}>
        {content}
      </button>
    );
  }

  return <Link href={item.href} className={cardClass}>{content}</Link>;
}

