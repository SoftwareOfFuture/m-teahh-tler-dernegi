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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/30">
          <div className="grid size-14 place-items-center border-2 border-white bg-black/40 text-white transition-transform group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="min-w-0 border-t-2 border-navy p-4">
        <h3 className="font-heading line-clamp-2 text-sm font-semibold text-navy transition-colors group-hover:text-teal sm:text-base">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-navy/70">{item.excerpt}</p>
        <p className="mt-2 text-xs text-navy/50">{item.date}</p>
      </div>
    </>
  );

  const cardClass = 'group w-full overflow-hidden border-2 border-navy bg-white text-left transition-all hover:-translate-y-1 hover:shadow-brutal';

  if (clickable) {
    return <button type="button" onClick={() => onOpen!(item)} className={cardClass}>{content}</button>;
  }
  return <Link href={item.href} className={cardClass}>{content}</Link>;
}
