import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Yayınlar', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER yayınları. Raporlar, bültenler ve sektör dokümanları.'),
  openGraph: { url: absoluteUrl('/yayinlar/') },
  alternates: { canonical: absoluteUrl('/yayinlar/') },
};

export default function YayinlarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
