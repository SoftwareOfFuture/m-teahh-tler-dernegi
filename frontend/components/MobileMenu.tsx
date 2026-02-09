'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/* =============================================================================
   MobileMenu - Mobil uyumlu hamburger menü
   - Hamburger ↔ X animasyonu
   - Sağdan slide-in + opacity
   - Açıkken body scroll kilitli
   - Link tıklanınca otomatik kapanır
   - Dark mode uyumlu, minimal tasarım
   ============================================================================= */

export type MobileMenuItem =
  | { href: string; label: string }
  | { label: string; children: { href: string; label: string }[] };

type MobileMenuProps = {
  open: boolean;
  onToggle: () => void;
  items: MobileMenuItem[];
  activeHref?: string;
  /** Menü panelinde linklerin altında render edilecek ek içerik (örn. sosyal ikonlar) */
  footer?: React.ReactNode;
  /** Menü butonu için ek class */
  buttonClassName?: string;
  /** Menü paneli için ek class */
  panelClassName?: string;
};

const MENU_ID = 'mobile-menu-panel';

/**
 * Hamburger ↔ X animasyonlu ikon.
 * Üç çizgi: açıkken üst ve alt 45° döner, orta opacity 0.
 */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-6"
    >
      {/* Üst çizgi: açıkken 45° döner, ortaya taşınır */}
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        className={`origin-center transition-all duration-300 ease-in-out ${
          open ? 'translate-y-1.5 rotate-45' : ''
        }`}
      />
      {/* Orta çizgi: açıkken opacity 0 */}
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        className={`origin-center transition-all duration-300 ease-in-out ${
          open ? 'opacity-0' : ''
        }`}
      />
      {/* Alt çizgi: açıkken -45° döner, ortaya taşınır */}
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        className={`origin-center transition-all duration-300 ease-in-out ${
          open ? '-translate-y-1.5 -rotate-45' : ''
        }`}
      />
    </svg>
  );
}

export function MobileMenu({
  open,
  onToggle,
  items,
  activeHref = '',
  footer,
  buttonClassName = '',
  panelClassName = '',
}: MobileMenuProps) {
  // Menü açıkken body scroll devre dışı
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const isActive = (href: string) =>
    activeHref === href || activeHref.startsWith(href.replace(/#.*/, '') + '/');

  const linkBaseClass =
    'block min-h-[48px] rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out';

  const linkActiveClass =
    'bg-burgundy/10 text-burgundy dark:bg-burgundy/20 dark:text-burgundy-light';
  const linkInactiveClass =
    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800';

  return (
    <>
      {/* Hamburger / Kapat butonu */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open ? 'true' : 'false'}
        aria-controls={MENU_ID}
        aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        className={`grid size-10 min-h-[44px] min-w-[44px] place-items-center rounded-xl text-slate-700 transition-colors duration-200 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-burgundy/30 dark:text-slate-200 dark:hover:bg-slate-800 ${buttonClassName}`}
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Backdrop: tıklanınca kapat */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
        onClick={onToggle}
      />

      {/* Menü paneli: sağdan slide-in + opacity */}
      <div
        id={MENU_ID}
        role="navigation"
        aria-label="Mobil menü"
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(320px,85vw)] max-w-full flex-col overflow-y-auto rounded-l-2xl bg-white shadow-xl transition-[transform,opacity] duration-300 ease-in-out dark:bg-slate-900 dark:shadow-slate-950/50 lg:hidden ${panelClassName} ${
          open
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-0.5 p-4 pt-16">
          {items.map((item) => {
            if ('children' in item) {
              return (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={onToggle}
                      className={`${linkBaseClass} ${
                        isActive(c.href) ? linkActiveClass : linkInactiveClass
                      } pl-6`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onToggle}
                className={`${linkBaseClass} ${
                  isActive(item.href) ? linkActiveClass : linkInactiveClass
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {footer ? (
          <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-700">
            {footer}
          </div>
        ) : null}
      </div>
    </>
  );
}
