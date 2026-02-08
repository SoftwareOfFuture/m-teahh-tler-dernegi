import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { item: NewsItem };

export function NewsCard({ item }: Props) {
  return (
    <Link
      href={`/haberler/detay?id=${encodeURIComponent(String(item.id))}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-soft-xl"
    >
      <div className="relative aspect-[21/9] min-h-[100px] overflow-hidden">
        <Image
          src={normalizeImageSrc(item.imageUrl)}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="min-w-0 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 transition-colors duration-200 group-hover:text-burgundy sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
        <p className="mt-3 text-xs font-medium text-slate-400">{item.date}</p>
      </div>
    </Link>
  );
}
