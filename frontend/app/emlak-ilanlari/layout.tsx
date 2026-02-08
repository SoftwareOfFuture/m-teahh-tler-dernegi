import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Emlak İlanları', '%s | ' + SEO.siteName),
  description: buildDescription('Emlak ilanları. Konut, daire ve villa ilanları. Antalya inşaat sektörü emlak fırsatları.'),
  openGraph: { url: absoluteUrl('/emlak-ilanlari/') },
  alternates: { canonical: absoluteUrl('/emlak-ilanlari/') },
};

export default function EmlakIlanlariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
