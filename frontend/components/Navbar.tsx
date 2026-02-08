'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/* =============================================================================
   NAVBAR - Glassmorphism Pill Navbar
   =============================================================================
   A modern, responsive navbar with:
   - Sticky positioning, floating over hero
   - Pill-shaped container (large border-radius)
   - Glassmorphism: semi-transparent bg + backdrop-blur
   - Left: Logo + location | Center: Nav links | Right: Social icons
   - Soft gold/warm accent on hover
   - Hamburger menu for mobile with slide-down animation
   ============================================================================= */

export type NavItem = { href: string; label: string };
export type SocialLink = { href: string; label: string; icon: React.ReactNode };

type NavbarProps = {
  /** Logo URL (e.g. /logo.png) */
  logoUrl?: string;
  /** Brand/company name shown next to logo */
  brandName?: string;
  /** Small location text under brand (e.g. "Naarm/Melbourne") */
  location?: string;
  /** Navigation links */
  navItems?: NavItem[];
  /** Social media links with icons */
  socialLinks?: SocialLink[];
  /** Optional additional right-side content (e.g. CTA button) */
  rightContent?: React.ReactNode;
};

const defaultNavItems: NavItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/principles', label: 'Our Principles' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
];

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

const defaultSocialLinks: SocialLink[] = [
  { href: 'https://instagram.com', label: 'Instagram', icon: <InstagramIcon /> },
  { href: 'https://facebook.com', label: 'Facebook', icon: <FacebookIcon /> },
];

export function Navbar({
  logoUrl = '/logo.png',
  brandName = 'Brand',
  location = 'Naarm/Melbourne',
  navItems = defaultNavItems,
  socialLinks = defaultSocialLinks,
  rightContent,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full px-4 pt-4 safe-area-inset-top md:px-6 md:pt-6"
      role="banner"
    >
      {/* Pill container with glassmorphism.
          Using bg-white/60 + backdrop-blur-[14px] for premium frosted-glass effect.
          rounded-full creates the pill shape. Shadow adds floating feel. */}
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/30 bg-white/60 px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-[14px] md:px-6 md:py-3"
        aria-label="Main navigation"
      >
        {/* LEFT: Logo + location */}
        <Link
          href="/"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-3 md:min-w-0"
          aria-label="Home"
        >
          {logoUrl ? (
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full md:size-10">
              <Image src={logoUrl} alt="" fill className="object-cover" priority />
            </div>
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/10 font-semibold text-black/70 md:size-10">
              {brandName.charAt(0)}
            </div>
          )}
          <div className="hidden sm:block">
            <span className="block text-sm font-medium text-black/90">{brandName}</span>
            {/* Location text: smaller, muted for hierarchy */}
            <span className="block text-xs text-black/50">{location}</span>
          </div>
        </Link>

        {/* CENTER: Nav links — hidden on mobile, shown on lg+ */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-900'
                    : 'text-black/80 hover:bg-amber-50/80 hover:text-amber-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: Social icons + optional right content + hamburger on mobile */}
        <div className="flex items-center gap-3">
          {/* Social links — hidden on smaller screens to save space */}
          <div className="hidden items-center gap-2 md:flex">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="flex size-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-black/60 transition-colors duration-200 hover:bg-amber-50/80 hover:text-amber-700"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {rightContent}

          {/* Hamburger: touch-friendly 44px target, lg:hidden */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid size-10 min-h-[44px] min-w-[44px] place-items-center rounded-full text-black/80 transition-colors hover:bg-amber-50/80 lg:hidden"
            aria-expanded={mobileOpen ? 'true' : 'false'}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU: Slide-down panel with touch-friendly spacing */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'mt-3 max-h-[min(80vh,600px)] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen ? 'true' : 'false'}
      >
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/30 bg-white/60 px-4 py-4 shadow-lg backdrop-blur-[14px]">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-[48px] rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-amber-100/80 text-amber-900' : 'text-black/80 hover:bg-amber-50/80'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex gap-2 border-t border-black/5 pt-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  onClick={() => setMobileOpen(false)}
                  className="flex size-11 items-center justify-center rounded-full bg-black/5 text-black/70 transition-colors hover:bg-amber-50"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
