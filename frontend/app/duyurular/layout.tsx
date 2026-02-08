import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Duyurular', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER duyuruları ve haberler.'),
  openGraph: { url: absoluteUrl('/duyurular/') },
  alternates: { canonical: absoluteUrl('/duyurular/') },
};

export default function DuyurularLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
