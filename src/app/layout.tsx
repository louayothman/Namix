
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { PWASplash } from "@/components/pwa/PWASplash";
import { SITE_CONFIG } from '@/lib/site-config';
import { headers } from 'next/headers';

/**
 * محرك توليد الميتاداتا الديناميكي
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'namix.pro';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const currentDomain = `${protocol}://${host}`;

  return {
    metadataBase: new URL(currentDomain),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description: SITE_CONFIG.description,
    applicationName: 'Namix',
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: 'Namix Universal Network' }],
    themeColor: '#002d4d',
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Namix',
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: currentDomain,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [
        {
          url: '/og-image.png',
          width: SITE_CONFIG.ogImageWidth,
          height: SITE_CONFIG.ogImageHeight,
          alt: `${SITE_CONFIG.name} - Professional Interface`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: ['/og-image.png'],
      creator: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#002d4d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-body antialiased selection:bg-primary/30 overflow-x-hidden">
        <FirebaseClientProvider>
          <SWRegistration />
          <PWASplash />
          {children}
          <PWAInstaller />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
