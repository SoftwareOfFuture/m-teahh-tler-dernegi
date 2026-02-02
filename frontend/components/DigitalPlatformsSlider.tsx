'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

export type DigitalPlatformItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaLabel?: string;
  accent?: 'burgundy' | 'emerald' | 'sky' | 'slate';
};

function isInternalHref(href: string) {
  return href.startsWith('/');
}

function accentClasses(accent: DigitalPlatformItem['accent']) {
  switch (accent) {
    case 'emerald':
      return {
        pill: 'bg-emerald-100 text-emerald-800',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        ring: 'ring-emerald-500/15',
        glow: 'from-emerald-400/18 via-transparent to-transparent',
      };
    case 'sky':
      return {
        pill: 'bg-sky-100 text-sky-800',
        button: 'bg-sky-600 hover:bg-sky-700',
        ring: 'ring-sky-500/15',
        glow: 'from-sky-400/18 via-transparent to-transparent',
      };
    case 'slate':
      return {
        pill: 'bg-slate-100 text-slate-800',
        button: 'bg-slate-800 hover:bg-slate-900',
        ring: 'ring-slate-500/15',
        glow: 'from-slate-400/16 via-transparent to-transparent',
      };
    case 'burgundy':
    default:
      return {
        pill: 'bg-burgundy/10 text-burgundy-dark',
        button: 'bg-burgundy hover:bg-burgundy-dark',
        ring: 'ring-burgundy/15',
        glow: 'from-burgundy/18 via-transparent to-transparent',
      };
  }
}

function PlatformCard({ item }: { item: DigitalPlatformItem }) {
  const a = accentClasses(item.accent);
  const cta = item.ctaLabel || 'SİSTEME GİRİŞ';

  const inner = (
    <div className={`relative overflow-hidden rounded-3xl bg-white shadow-card ring-1 ${a.ring}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`} />
      <div className="relative p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${a.pill}`}>DİJİTAL PLATFORM</span>
          <span className="text-xs font-semibold text-slate-500">{item.subtitle}</span>
        </div>
        <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{item.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${a.button}`}>
            {cta} →
          </span>
        </div>
      </div>
    </div>
  );

  if (isInternalHref(item.href)) {
    return (
      <Link href={item.href} className="block" aria-label={cta}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noreferrer" className="block" aria-label={cta}>
      {inner}
    </a>
  );
}

export function DigitalPlatformsSlider({
  title = 'Dijital Platformlar',
  items,
}: {
  title?: string;
  items?: DigitalPlatformItem[];
}) {
  const list = useMemo<DigitalPlatformItem[]>(() => {
    if (Array.isArray(items) && items.length) return items;
    return [
      {
        id: 'tas',
        title: 'Taşeron Sistemi',
        subtitle: 'Güvenilir iş ortakları',
        description:
          'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz. Kurumsal yapı ile doğru iş birliklerini hızlandırıyoruz.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'burgundy',
      },
      {
        id: 'emlak',
        title: 'Emlak Yönetim Sistemi',
        subtitle: 'Güçlü bir vitrin',
        description:
          'Üyelere özel iş ağı: emlak profesyonelleri portföylerini sunar, müteahhitler doğru gayrimenkul kaynaklarına hızlı erişir.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'emerald',
      },
      {
        id: 'teknik',
        title: 'Teknik Proje Hizmetleri',
        subtitle: 'Uzmanlarla buluşun',
        description:
          'Mimar, mühendis ve teknik proje profesyonelleriyle kurumsal bir platformda buluşun; projelerinize uygun uzmanlara hızlıca ulaşın.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'sky',
      },
      {
        id: 'tedarik',
        title: 'İnşaat Malzemesi Tedarik Sistemi',
        subtitle: 'Güvenilir tedarik',
        description:
          'İnşaat süreçlerinde ihtiyaç duyduğunuz malzemeleri, güvenilir tedarikçilerle buluşturan kurumsal bir sistem.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'slate',
      },
    ];
  }, [items]);

  const itemElsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!list.length) return;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return;
    }

    let obs: IntersectionObserver | null = null;
    let disconnected = false;

    const els = itemElsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap) return;

        // Start hidden; reveal as user scrolls down.
        gsap.set(els, { opacity: 0, y: 18 });

        obs = new IntersectionObserver(
          (entries) => {
            if (disconnected) return;
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const el = entry.target as HTMLDivElement;
              gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
              obs?.unobserve(el);
            }
          },
          { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
        );

        for (const el of els) obs.observe(el);
      } catch {
      }
    })();

    return () => {
      disconnected = true;
      obs?.disconnect();
    };
  }, [list]);

  if (!list.length) return null;

  return (
    <section className="w-full" aria-label="Dijital platformlar">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-7">
        {list.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => {
              itemElsRef.current[idx] = el;
            }}
          >
            <PlatformCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

