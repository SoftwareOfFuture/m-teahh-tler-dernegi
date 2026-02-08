import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Üyelerimiz', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER üye firmaları. Antalya inşaat sektörü üyeleri ve iletişim.'),
  openGraph: { url: absoluteUrl('/uyelerimiz/') },
  alternates: { canonical: absoluteUrl('/uyelerimiz/') },
};

export default function UyelerimizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
