import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '../lib/types';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = { item: NewsItem };

export function NewsCard({ item }: Props) {
  return (
    <Link
      href={`/haberler/detay?id=${encodeURIComponent(String(item.id))}`}
      className="group block overflow-hidden border-2 border-navy bg-white transition-all hover:-translate-y-1 hover:shadow-brutal"
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
      <div className="min-w-0 border-t-2 border-navy p-4 sm:p-5">
        <h3 className="font-heading line-clamp-2 text-base font-semibold text-navy transition-colors group-hover:text-teal sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-navy/70">{item.excerpt}</p>
        <p className="mt-3 text-xs font-medium text-navy/50">{item.date}</p>
      </div>
    </Link>
  );
}
