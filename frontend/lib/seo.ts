/**
 * Merkezi SEO sabitleri ve yardımcılar.
 * Admin panelinden gelen değerler (getPagePublic('seo')) ile birleştirilebilir.
 */

const SITE_NAME = 'ANTMUTDER – Antalya Müteahhitler Derneği';
const DEFAULT_DESCRIPTION =
  'Antalya Müteahhitler Derneği (ANTMUTDER). Sektörel birliktelik, paylaşım ve dayanışma. Haberler, yayınlar, video arşivi ve iletişim.';
const DEFAULT_KEYWORDS =
  'ANTMUTDER, Antalya müteahhitler derneği, inşaat sektörü, müteahhit derneği, Antalya dernek, sektörel birliktelik';
const BASE_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://antmutder.org';

export const SEO = {
  siteName: SITE_NAME,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultKeywords: DEFAULT_KEYWORDS,
  baseUrl: BASE_URL,
  locale: 'tr_TR',
  twitterHandle: '@antmutder',
} as const;

export function buildTitle(title: string | null | undefined, template?: string): string {
  const t = (title || SEO.siteName).trim();
  if (!template || t === SEO.siteName) return t;
  return template.replace('%s', t);
}

export function buildDescription(desc: string | null | undefined): string {
  const d = (desc || SEO.defaultDescription).trim();
  return d.length > 160 ? d.slice(0, 157) + '...' : d;
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SEO.baseUrl}${p}`;
}

/** JSON-LD Organization (footer / genel) */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO.siteName,
    url: SEO.baseUrl,
    description: SEO.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Antalya',
      addressCountry: 'TR',
    },
    sameAs: [],
  };
}

/** JSON-LD WebSite (ana sayfa) */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO.siteName,
    url: SEO.baseUrl,
    description: SEO.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SEO.baseUrl}/haberler?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList JSON-LD */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  };
}
