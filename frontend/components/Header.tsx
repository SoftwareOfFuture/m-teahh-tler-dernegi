'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getToken } from '../lib/api';

type NavItem = { href: string; label: string };

export function Header() {
  const navItems: NavItem[] = useMemo(
    () => [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/kurumsal', label: 'Kurumsal' },
      { href: '/uyelerimiz', label: 'Üyelerimiz' },
      { href: '/duyurular', label: 'Kentsel Dönüşüm' },
      { href: '/haberler', label: 'Haberler' },
      { href: '/yayinlar', label: 'Yönetim Kurulu' },
      { href: '/iletisim', label: 'İletişim' },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full safe-area-inset-top">
      {/* Glassmorphism navbar: semi-transparent + backdrop-blur */}
      <div className="mx-4 mt-4 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-xl md:mx-6 md:mt-6 md:rounded-full md:px-6 md:py-3">
        <div className="flex w-full items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-xl shadow-soft transition-transform duration-300 group-hover:scale-105 md:size-12">
              <Image src="/logo.png" alt="ANTMUTDER" fill className="object-contain p-1.5" priority />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">Antalya İnşaat Müteahhitleri Derneği</div>
              <div className="text-xs font-medium text-burgundy">ANTMUTDER</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-burgundy/10 hover:text-burgundy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 xl:flex">
              <SocialLink href="#" ariaLabel="LinkedIn"><LinkedInIcon /></SocialLink>
              <SocialLink href="#" ariaLabel="X"><XIcon /></SocialLink>
              <SocialLink href="#" ariaLabel="Instagram"><InstagramIcon /></SocialLink>
            </div>

            <Link
              href={hasToken ? '/profilim' : '/login'}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl bg-burgundy px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:bg-burgundy-dark hover:shadow-glow active:scale-[0.98] sm:px-6 sm:text-sm"
            >
              {hasToken ? 'Profilim' : 'ÜYE GİRİŞİ'}
            </Link>

            <button
              type="button"
              className="grid size-10 min-h-[44px] min-w-[44px] place-items-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-100 active:scale-95 lg:hidden"
              aria-label="Menü"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: slide-down with animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 mt-2 rounded-2xl border border-white/20 bg-white/80 px-4 py-4 shadow-soft-lg backdrop-blur-xl md:mx-6">
          <nav className="flex flex-col gap-1">
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-burgundy/10 hover:text-burgundy"
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function SocialLink({ href, ariaLabel, children }: { href: string; ariaLabel: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="grid size-9 place-items-center rounded-lg text-slate-500 transition-all duration-300 hover:bg-burgundy/10 hover:text-burgundy"
    >
      {children}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
    </svg>
  );
}
