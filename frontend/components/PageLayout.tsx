import { Navbar } from './Navbar';
import { SiteFooter } from './SiteFooter';

type Props = { children: React.ReactNode };

export function PageLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden px-3 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 md:px-6 lg:px-8 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] [padding-bottom:max(4rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}

export function PageLayoutWithFooter({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden px-3 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 md:px-6 lg:px-8 [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] [padding-bottom:max(4rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
