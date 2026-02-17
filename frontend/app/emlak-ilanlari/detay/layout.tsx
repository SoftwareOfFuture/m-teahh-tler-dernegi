import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Emlak İlanı Detayı', '%s | ' + SEO.siteName),
  description: buildDescription('Emlak ilanı detayı. Konut, daire ve villa ilanları.'),
  alternates: { canonical: absoluteUrl('/emlak-ilanlari/detay/') },
};

export default function PropertyDetayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
