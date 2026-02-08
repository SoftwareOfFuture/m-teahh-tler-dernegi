import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { ChunkErrorAutoReload } from '../components/ChunkErrorAutoReload';
import './globals.css';

const fontHeading = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Antalya İnşaat Müteahhitleri Derneği',
  description: 'ANTMUTDER - İnşaat sektöründe paylaşım, dayanışma ve sektörel sorunların çözümü için birlikte çalışıyoruz.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body className="font-body antialiased">
        <ChunkErrorAutoReload />
        {children}
      </body>
    </html>
  );
}
