import { StyleGuard } from '@/components/dev/StyleGuard';
import { GlobalAudioPlayer } from '@/components/player/GlobalAudioPlayer';
import { SiteFooter, SiteHeader } from '@/components/layout/SiteChrome';
import { criticalCss } from '@/lib/critical-css';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo/json-ld';
import { site } from '@/lib/site';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${site.domain} — ${site.seoH1}`,
  description: site.description,
  manifest: '/manifest.json',
  openGraph: {
    title: site.seoH1,
    description: site.description,
    siteName: site.name,
    locale: 'ka_GE',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: '#F8FAFC',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={inter.variable}>
      <body className={`${inter.className} min-h-screen pb-24 font-sans antialiased`}>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <StyleGuard />
        <SiteHeader />
        {children}
        <SiteFooter />
        <GlobalAudioPlayer />
      </body>
    </html>
  );
}
