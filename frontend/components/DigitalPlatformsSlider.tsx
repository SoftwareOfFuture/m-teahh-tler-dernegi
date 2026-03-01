'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

export type DigitalPlatformItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaLabel?: string;
  accent?: 'burgundy' | 'emerald' | 'sky' | 'slate';
  backgroundImageUrl?: string;
};

function isInternalHref(href: string) {
  return href.startsWith('/');
}

function themeClasses(accent: DigitalPlatformItem['accent']) {
  switch (accent) {
    case 'emerald':
      return {
        overlay: 'bg-slate-900/80',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-slate-900 hover:bg-white',
      };
    case 'sky':
      return {
        overlay: 'bg-slate-900/80',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-slate-900 hover:bg-white',
      };
    case 'slate':
      return {
        overlay: 'bg-slate-900/80',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-slate-900 hover:bg-white',
      };
    case 'burgundy':
    default:
      return {
        overlay: 'bg-slate-900/80',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-slate-900 hover:bg-white',
      };
  }
}

function PlatformBlock({
  item,
  align = 'left',
  inView = true,
  cardRef,
  imageRef,
  overlayRef,
  gradientRef,
  contentRef,
  pillRef,
  titleRef,
  subtitleRef,
  descRef,
  buttonRef,
}: {
  item: DigitalPlatformItem;
  align?: 'left' | 'right';
  inView?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  imageRef?: (el: HTMLDivElement | null) => void;
  overlayRef?: (el: HTMLDivElement | null) => void;
  gradientRef?: (el: HTMLDivElement | null) => void;
  contentRef?: (el: HTMLDivElement | null) => void;
  pillRef?: (el: HTMLDivElement | null) => void;
  titleRef?: (el: HTMLHeadingElement | null) => void;
  subtitleRef?: (el: HTMLDivElement | null) => void;
  descRef?: (el: HTMLParagraphElement | null) => void;
  buttonRef?: (el: HTMLSpanElement | null) => void;
}) {
  const t = themeClasses(item.accent);
  const cta = item.ctaLabel || 'SİSTEME GİRİŞ';
  const bg =
    item.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70';

  const transitionClass = 'transition-all duration-500 ease-out';
  const inViewClass = inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]';
  const inner = (
    <div ref={cardRef} className={`relative min-h-[180px] w-full xs:min-h-[200px] sm:min-h-[280px] ${transitionClass} ${inViewClass}`}>
      <div ref={imageRef} className="absolute inset-0 overflow-hidden">
        <Image
          src={bg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        <div ref={overlayRef} className={`absolute inset-0 backdrop-blur-[2px] ${t.overlay}`} />
        <div ref={gradientRef} className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-burgundy/10 to-transparent" />
      </div>

      <div className="relative w-full min-w-0 px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className={`flex w-full min-w-0 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <div
            ref={contentRef}
            className={`min-w-0 max-w-full flex-1 ${align === 'right' ? 'text-right' : 'text-left'} ${transitionClass} ${inViewClass}`}
          >
            <div
              ref={pillRef}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold sm:gap-2 sm:px-4 sm:py-2 sm:text-xs ${t.pill}`}
            >
              DİJİTAL PLATFORM
            </div>

            <h3
              ref={titleRef}
              className={`mt-2 line-clamp-2 text-lg font-extrabold leading-tight tracking-tight xs:mt-3 xs:text-xl sm:line-clamp-none sm:mt-5 sm:text-4xl lg:text-5xl ${t.text}`}
            >
              {item.title}
            </h3>
            <div
              ref={subtitleRef}
              className={`mt-2 line-clamp-2 text-sm font-semibold sm:line-clamp-none sm:mt-4 sm:text-xl ${t.subText}`}
            >
              {item.subtitle}
            </div>
            <p
              ref={descRef}
              className={`mt-2 line-clamp-3 text-xs leading-relaxed sm:line-clamp-none sm:mt-4 sm:text-base ${t.subText}`}
            >
              {item.description}
            </p>

            <div className={`mt-5 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <span
                ref={buttonRef}
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-4 py-3 text-xs font-bold tracking-wide active:scale-[0.98] sm:px-5 sm:text-sm ${t.button}`}
              >
                {cta}
              </span>
            </div>
          </div>
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
        subtitle: 'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz!',
        description:
          'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz. Kurumsal yapı ile doğru iş birliklerini hızlandırıyoruz.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'burgundy',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'emlak',
        title: 'Emlak Yönetim Sistemi',
        subtitle: 'Üyelerimize özel, emlak dünyasında güçlü bir vitrin',
        description:
          'Üyelere özel iş ağı: emlak profesyonelleri portföylerini sunar, müteahhitler doğru gayrimenkul kaynaklarına hızlı erişir.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'emerald',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'teknik',
        title: 'Teknik Proje Hizmetleri',
        subtitle: 'Teknik bilgi, doğru projelerle buluşuyor.',
        description:
          'Mimar, mühendis ve teknik proje profesyonelleriyle kurumsal bir platformda buluşun; projelerinize uygun uzmanlara hızlıca ulaşın.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'sky',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'tedarik',
        title: 'İnşaat Malzemesi Tedarik Sistemi',
        subtitle: 'Kaliteli malzeme, güçlü iş birlikleri.',
        description:
          'İnşaat süreçlerinde ihtiyaç duyduğunuz malzemeleri, güvenilir tedarikçilerle buluşturan kurumsal bir sistem.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'slate',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2400&q=70',
      },
    ];
  }, [items]);

  const cardElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const imageElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const overlayElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const gradientElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const contentElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const pillElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const titleElsRef = useRef<Array<HTMLHeadingElement | null>>([]);
  const subtitleElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const descElsRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const buttonElsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!list.length) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setVisibleIndices(new Set(list.map((_, idx) => idx)));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = parseInt((entry.target as HTMLDivElement).getAttribute('data-index') ?? '', 10);
          if (!isNaN(i)) setVisibleIndices((prev) => new Set([...prev, i]));
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    const t = setTimeout(() => {
      const els = contentElsRef.current.filter(Boolean) as HTMLDivElement[];
      els.forEach((el) => observer.observe(el));
    }, 80);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [list]);

  if (!list.length) return null;

  return (
    <section className="w-full max-w-full overflow-x-hidden" aria-label="Dijital platformlar">
      <div className="mb-4 sm:mb-8">
        <h2 className="text-center text-base font-bold text-slate-800 xs:text-lg sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <div className="w-full overflow-x-hidden rounded-2xl shadow-soft-lg">
        {list.map((item, idx) => {
          const align: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
          const animDir: 'left' | 'right' = align === 'left' ? 'left' : 'right';
          return (
            <div key={item.id}>
              {idx > 0 ? <div className="h-px w-full bg-white/20" /> : null}
              <PlatformBlock
                item={item}
                align={align}
                inView={visibleIndices.has(idx)}
                cardRef={(el) => {
                  cardElsRef.current[idx] = el;
                }}
                imageRef={(el) => {
                  imageElsRef.current[idx] = el;
                }}
                overlayRef={(el) => {
                  overlayElsRef.current[idx] = el;
                }}
                gradientRef={(el) => {
                  gradientElsRef.current[idx] = el;
                }}
                contentRef={(el) => {
                  if (el) {
                    el.setAttribute('data-anim-dir', animDir);
                    el.setAttribute('data-index', String(idx));
                  }
                  contentElsRef.current[idx] = el;
                }}
                pillRef={(el) => {
                  pillElsRef.current[idx] = el;
                }}
                titleRef={(el) => {
                  titleElsRef.current[idx] = el;
                }}
                subtitleRef={(el) => {
                  subtitleElsRef.current[idx] = el;
                }}
                descRef={(el) => {
                  descElsRef.current[idx] = el;
                }}
                buttonRef={(el) => {
                  buttonElsRef.current[idx] = el;
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
