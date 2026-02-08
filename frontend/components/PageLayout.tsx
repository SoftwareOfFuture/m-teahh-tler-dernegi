import { Navbar } from './Navbar';
import { SiteFooter } from './SiteFooter';

type Props = { children: React.ReactNode };

export function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}

export function PageLayoutWithFooter({ children }: Props) {
  return (
    <PageLayout>
      {children}
      <SiteFooter />
    </PageLayout>
  );
}
