import type { Metadata } from 'next';
import { HomePageContent } from '../components/HomePageContent';
import { SEO, buildDescription, absoluteUrl } from '../lib/seo';

export const metadata: Metadata = {
  title: SEO.siteName,
  description: buildDescription(SEO.defaultDescription),
  openGraph: { url: absoluteUrl('/'), title: SEO.siteName, description: SEO.defaultDescription },
  alternates: { canonical: absoluteUrl('/') },
};

export default function HomePage() {
  return <HomePageContent />;
}
