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
      className="group block min-w-0 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100/60 transition-all duration-400 active:scale-[0.99] hover:-translate-y-1.5 hover:shadow-card-hover hover:ring-burgundy/10 sm:rounded-3xl"
    >
      <div className="relative aspect-[21/9] min-h-[100px] overflow-hidden">
        <Image
          src={normalizeImageSrc(item.imageUrl)}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
      </div>
      <div className="min-w-0 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-burgundy sm:text-base">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{item.excerpt}</p>
        <p className="mt-3 text-xs font-medium text-slate-400">{item.date}</p>
      </div>
    </Link>
  );
}

