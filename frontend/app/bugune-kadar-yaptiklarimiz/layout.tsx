import type { Metadata } from 'next';
import { getPagePublic } from '../../lib/api';
import { SEO, buildTitle, buildDescription, absoluteUrl } from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPagePublic('bugune-kadar-yaptiklarimiz');
    const title = buildTitle(page.heroTitle || 'Bugüne Kadar Yaptıklarımız', '%s | ' + SEO.siteName);
    const description = buildDescription(page.heroSubtitle || page.aboutParagraph1 || SEO.defaultDescription);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrl('/bugune-kadar-yaptiklarimiz/'),
      },
      twitter: { title, description },
      alternates: { canonical: absoluteUrl('/bugune-kadar-yaptiklarimiz/') },
    };
  } catch {
    return {
      title: buildTitle('Bugüne Kadar Yaptıklarımız', '%s | ' + SEO.siteName),
      description: buildDescription(SEO.defaultDescription),
      alternates: { canonical: absoluteUrl('/bugune-kadar-yaptiklarimiz/') },
    };
  }
}

export default function BuguneKadarYaptiklarimizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
