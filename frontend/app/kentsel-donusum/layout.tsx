import type { Metadata } from 'next';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export const metadata: Metadata = {
  title: buildTitle('Kentsel Dönüşüm', '%s | ' + SEO.siteName),
  description: buildDescription('Kentsel dönüşüm süreçleri, riskli yapı, faiz desteği ve kira yardımı hakkında bilgilendirme. ANTMUTDER kaynakları.'),
  openGraph: { url: absoluteUrl('/kentsel-donusum/') },
  alternates: { canonical: absoluteUrl('/kentsel-donusum/') },
};

export default function KentselDonusumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
