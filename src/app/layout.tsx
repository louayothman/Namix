
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { SITE_CONFIG } from '@/lib/site-config';
import { headers } from 'next/headers';

/**
 * محرك توليد الميتاداتا الديناميكي
 * يكتشف الدومين الحالي تلقائياً لضمان عمل الصور والروابط على أي بيئة
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
  const headersList = await headers();
  const host = headersList.get('host') || 'namix.pro';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const currentDomain = `${protocol}://${host}`;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
        
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": SITE_CONFIG.name,
                "url": currentDomain,
                "logo": `${currentDomain}/icon-192.png`,
                "description": SITE_CONFIG.description
              }
            ])
          }}
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 overflow-x-hidden">
        <FirebaseClientProvider>
          <SWRegistration />
          {children}
          <PWAInstaller />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
