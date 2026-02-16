'use client';

import Link from 'next/link';
import { useSiteSettings } from '../lib/useSiteSettings';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SiteFooter() {
  const social = useSiteSettings();

  return (
    <footer className="mt-auto w-full min-w-0 overflow-hidden bg-burgundy-dark safe-area-inset-bottom" role="contentinfo">
      <div className="w-full min-w-0 px-3 py-8 xs:px-4 xs:py-10 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] [padding-bottom:max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))]">
        <div className="grid grid-cols-1 gap-8 min-w-0 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">Hakkımızda</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
              Antalya Müteahhitler Derneği olarak sektörel birliktelik, paylaşım ve dayanışma için çalışıyoruz.
            </p>
          </div>

          {/* Hızlı Erişim */}
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">Hızlı Erişim</h3>
            <ul className="mt-4 space-y-0 text-sm text-white/80 sm:space-y-2">
              <li><Link href="/" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Ana Sayfa</Link></li>
              <li><Link href="/kurumsal" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Kurumsal</Link></li>
              <li><Link href="/haberler" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Haberler</Link></li>
              <li><Link href="/videolar" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Arşiv</Link></li>
              <li><Link href="/yayinlar" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Yönetim Kurulu</Link></li>
              <li><Link href="/kentsel-donusum" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Kentsel Dönüşüm</Link></li>
              <li><Link href="/emlak-ilanlari" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Emlak İlanları</Link></li>
              <li><Link href="/iletisim" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">İletişim</Link></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">Yasal</h3>
            <ul className="mt-4 space-y-0 text-sm text-white/80 sm:space-y-2">
              <li><Link href="/kvkk" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">KVKK</Link></li>
              <li><Link href="/kullanim-sartlari" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Kullanım Şartları</Link></li>
              <li><Link href="/uyelik-sartlari" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">Üyelik Şartları</Link></li>
              <li><Link href="/sms-geri-bildirim" className="inline-block min-h-[44px] py-2.5 pr-2 transition-colors hover:text-white sm:min-h-0 sm:py-0">SMS Geri Bildirim</Link></li>
            </ul>
          </div>

          {/* İletişim & Sosyal Medya */}
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">İletişim</h3>
            <p className="mt-3 text-sm text-white/80">Antalya Müteahhitler Derneği</p>
            {(social?.facebookUrl || social?.instagramUrl || social?.twitterUrl || social?.youtubeUrl || social?.linkedinUrl) ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {social?.facebookUrl ? (
                  <a href={social.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                    <FacebookIcon />
                  </a>
                ) : null}
                {social?.instagramUrl ? (
                  <a href={social.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                    <InstagramIcon />
                  </a>
                ) : null}
                {social?.twitterUrl ? (
                  <a href={social.twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                    <TwitterIcon />
                  </a>
                ) : null}
                {social?.youtubeUrl ? (
                  <a href={social.youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                    <YouTubeIcon />
                  </a>
                ) : null}
                {social?.linkedinUrl ? (
                  <a href={social.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                    <LinkedInIcon />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/70">
            © Antalya İnşaat Müteahhitleri Derneği. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
