import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <Link
      href={`/haberler/detay?id=${encodeURIComponent(String(item.id))}`}
      className="group block min-w-0 overflow-hidden rounded-2xl bg-white shadow-card transition-all active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-card-hover sm:rounded-3xl"
    >
      <div className="relative aspect-[21/9] min-h-[100px] overflow-hidden">
        <Image
          src={normalizeImageSrc(item.imageUrl)}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-xs font-bold text-slate-900 transition-colors group-hover:text-burgundy sm:text-sm">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.excerpt}</p>
        <p className="mt-1.5 text-[11px] text-slate-400 sm:text-xs">{item.date}</p>
      </div>
    </Link>
  );
}

