'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { listPropertiesPublic, type Property } from '../../lib/api';
import { normalizeImageSrc } from '../../lib/normalizeImageSrc';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

export default function EmlakIlanlariPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const res = await listPropertiesPublic({ page: 1, limit: 50 });
        if (res?.items?.length) setItems(res.items);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Emlak İlanları"
        subtitle="Konut, daire ve villa ilanları. Emlak sayfalarındaki konutları buradan inceleyebilirsiniz."
      />

      <section className="mt-8 min-w-0">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Konut İlanları</h2>
          <Link
            href="/"
            className="text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
          >
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 min-w-0 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/emlak-ilanlari/detay?id=${p.id}`}
              className="group block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/20 hover:shadow-soft-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={normalizeImageSrc(p.imageUrl) || PLACEHOLDER_IMG}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.price && (
                  <div className="absolute right-2 top-2 rounded-lg bg-burgundy px-3 py-1.5 text-sm font-bold text-white">
                    {p.price}
                  </div>
                )}
              </div>
              <div className="min-w-0 p-4 sm:p-5">
                <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-burgundy sm:text-lg">
                  {p.title}
                </h3>
                {p.address && (
                  <p className="mt-1 text-sm text-slate-600">{p.address}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {p.propertyType && <span>{p.propertyType}</span>}
                  {p.rooms && <span>• {p.rooms} oda</span>}
                  {p.area && <span>• {p.area} m²</span>}
                </div>
                {p.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {p.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div>
        )}
        {!loading && items.length === 0 && (
          <div className="mt-6 rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-600">
            Henüz emlak ilanı eklenmemiş.
          </div>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}
