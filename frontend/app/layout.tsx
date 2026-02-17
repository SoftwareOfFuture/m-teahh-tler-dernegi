import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ChunkErrorAutoReload } from '../components/ChunkErrorAutoReload';
import { SEO, organizationJsonLd, websiteJsonLd, absoluteUrl } from '../lib/seo';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B1538',
};

export const metadata: Metadata = {
  metadataBase: new URL(SEO.baseUrl),
  title: {
    default: SEO.siteName,
    template: '%s | ' + SEO.siteName,
  },
  description: SEO.defaultDescription,
  keywords: SEO.defaultKeywords,
  applicationName: SEO.siteName,
  authors: [{ name: SEO.siteName, url: SEO.baseUrl }],
  creator: SEO.siteName,
  publisher: SEO.siteName,
  formatDetection: { telephone: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: SEO.locale,
    siteName: SEO.siteName,
    title: SEO.siteName,
    description: SEO.defaultDescription,
    url: SEO.baseUrl,
    images: [{ url: absoluteUrl('/logo.png'), width: 512, height: 512, alt: SEO.siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.siteName,
    description: SEO.defaultDescription,
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = organizationJsonLd();
  const webJsonLd = websiteJsonLd();
  return (
    <html lang="tr" className={fontSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <ChunkErrorAutoReload />
        {children}
      </body>
    </html>
  );
}
