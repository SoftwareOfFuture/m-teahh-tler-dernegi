import Image from 'next/image';
import Link from 'next/link';
import type { VideoItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { item: VideoItem; onOpen?: (item: VideoItem) => void };

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
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/20">
          <div className="grid size-14 place-items-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="min-w-0 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-burgundy sm:text-base">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.excerpt}</p>
        <p className="mt-2 text-xs text-slate-500">{item.date}</p>
      </div>
    </>
  );

  const cardClass =
    'group w-full overflow-hidden rounded-2xl bg-white shadow-soft text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-soft-xl';

  if (clickable) {
    return <button type="button" onClick={() => onOpen!(item)} className={cardClass}>{content}</button>;
  }
  return <Link href={item.href} className={cardClass}>{content}</Link>;
}
