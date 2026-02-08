import { Navbar } from './Navbar';
import { SiteFooter } from './SiteFooter';

type Props = { children: React.ReactNode };

export function PageLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden px-3 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">{children}</main>
    </div>
  );
}

/** Tüm sayfalarda tam genişlik + footer en alta sabit (main ve footer ayrı) */
export function PageLayoutWithFooter({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden px-3 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
