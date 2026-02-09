'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getToken } from '../lib/api';
import { useSiteSettings } from '../lib/useSiteSettings';

/* =============================================================================
   NAVBAR - Kurumsal Beyaz Navbar
   - Kaydırırken aşağı gidince gizlenir, yukarı veya durunca geri gelir
   ============================================================================= */

export type NavItem = { href: string; label: string };

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/kurumsal', label: 'Kurumsal' },
  { href: '/haberler', label: 'Haberler' },
  { href: '/videolar', label: 'Video Arşivi' },
  { href: '/yayinlar', label: 'Yayınlar' },
  { href: '/kentsel-donusum', label: 'Kentsel Dönüşüm' },
  { href: '/emlak-ilanlari', label: 'Emlak İlanları' },
  { href: '/uyelerimiz', label: 'Partnerler' },
  { href: '/iletisim', label: 'İletişim' },
];

const SCROLL_SHOW_TOP = 40;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const social = useSiteSettings();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = typeof window !== 'undefined' ? window.scrollY : 0;
      const delta = y - lastScrollY.current;
      if (y <= SCROLL_SHOW_TOP) {
        setNavbarVisible(true);
      } else if (delta > 8) {
        setNavbarVisible(false);
      } else if (delta < -8) {
        setNavbarVisible(true);
      }
      lastScrollY.current = y;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-soft transition-transform duration-300 ease-out safe-area-inset-top ${
        navbarVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="banner"
    >
      <nav
        className="flex w-full min-w-0 flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 md:py-3 lg:px-6"
        aria-label="Ana navigasyon"
      >
        {/* SOL: Logo */}
        <Link
          href="/"
          className="flex min-h-[44px] shrink-0 items-center gap-2 sm:gap-3"
          aria-label="Ana sayfa"
        >
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full sm:size-10">
            <Image src="/logo.png" alt="" fill className="object-contain p-1" priority sizes="44px" />
          </div>
          <div className="hidden min-w-0 shrink sm:block">
            <span className="block truncate text-xs font-bold text-slate-900 sm:text-sm">Antalya İnşaat Müteahhitleri Derneği</span>
            <span className="block truncate text-[10px] text-slate-500">ANTMUTDER</span>
          </div>
        </Link>

        {/* ORTA: Nav linkleri — tek sıra, sıkı */}
        <div className="hidden shrink-0 flex-nowrap items-center gap-px lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href.replace(/#.*/, '') + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded px-2 py-1.5 text-[11px] font-medium transition-all duration-200 lg:text-xs xl:px-2.5 xl:text-sm ${
                  isActive
                    ? 'bg-burgundy/10 text-burgundy'
                    : 'text-slate-700 hover:bg-burgundy/5 hover:text-burgundy'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* SAĞ: Sosyal ikonlar + Üye Girişi + Hamburger */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-0.5 md:flex">
            {social?.instagramUrl ? (
              <a
                href={social.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full text-slate-600 transition-colors duration-200 hover:bg-burgundy/5 hover:text-burgundy"
              >
                <InstagramIcon />
              </a>
            ) : null}
            {social?.facebookUrl ? (
              <a
                href={social.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full text-slate-600 transition-colors duration-200 hover:bg-burgundy/5 hover:text-burgundy"
              >
                <FacebookIcon />
              </a>
            ) : null}
          </div>

          <Link
            href={hasToken ? '/profilim' : '/login'}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-burgundy px-3 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98] sm:px-4 sm:py-2 sm:text-xs"
          >
            {hasToken ? 'Profilim' : 'Üye Girişi'}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid size-10 min-h-[44px] min-w-[44px] place-items-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-burgundy/5 lg:hidden"
            {...(mobileOpen ? { 'aria-expanded': 'true' as const } : { 'aria-expanded': 'false' as const })}
            aria-label="Menüyü aç/kapat"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBİL MENÜ: Slide-down */}
      <div
        className={`overflow-hidden border-t border-slate-100 transition-all duration-300 ease-out ${
          mobileOpen ? 'max-h-[min(80vh,600px)] opacity-100' : 'max-h-0 opacity-0'
        }`}
        {...(mobileOpen ? {} : { 'aria-hidden': 'true' as const })}
      >
        <div className="w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-0.5" aria-label="Mobil navigasyon">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-[48px] rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-burgundy/10 text-burgundy' : 'text-slate-700 hover:bg-burgundy/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {(social?.instagramUrl || social?.facebookUrl) ? (
              <div className="mt-3 flex gap-2 border-t border-slate-200/50 pt-3">
                {social?.instagramUrl ? (
                  <a
                    href={social.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    onClick={() => setMobileOpen(false)}
                    className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-burgundy/10"
                  >
                    <InstagramIcon />
                  </a>
                ) : null}
                {social?.facebookUrl ? (
                  <a
                    href={social.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    onClick={() => setMobileOpen(false)}
                    className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-burgundy/10"
                  >
                    <FacebookIcon />
                  </a>
                ) : null}
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
