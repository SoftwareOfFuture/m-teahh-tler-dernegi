import type { Metadata } from 'next';
import { getPagePublic } from '../../lib/api';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPagePublic('iletisim');
    const title = buildTitle(page.heroTitle || 'İletişim', '%s | ' + SEO.siteName);
    const description = buildDescription(page.heroSubtitle || SEO.defaultDescription);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrl('/iletisim/'),
      },
      twitter: { title, description },
      alternates: { canonical: absoluteUrl('/iletisim/') },
    };
  } catch {
    return {
      title: buildTitle('İletişim', '%s | ' + SEO.siteName),
      description: buildDescription(SEO.defaultDescription),
      alternates: { canonical: absoluteUrl('/iletisim/') },
    };
  }
}

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
