import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Haber Detayı', '%s | ' + SEO.siteName),
  description: buildDescription('ANTMUTDER haber detayı. Güncel duyurular ve haberler.'),
  alternates: { canonical: absoluteUrl('/haberler/detay/') },
};

export default function HaberDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
