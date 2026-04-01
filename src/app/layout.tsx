import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
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
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: SITE_CONFIG.ogImageWidth,
        height: SITE_CONFIG.ogImageHeight,
        alt: `${SITE_CONFIG.name} - Sovereign Interface`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
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

export const viewport: Viewport = {
  themeColor: '#002d4d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                "url": SITE_CONFIG.url,
                "logo": `${SITE_CONFIG.url}/icon-192.png`,
                "description": SITE_CONFIG.description
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": SITE_CONFIG.name,
                "url": SITE_CONFIG.url,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${SITE_CONFIG.url}/trade?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "روابط ناميكس السريعة",
                "itemListElement": [
                  { "@type": "SiteNavigationElement", "position": 1, "name": "إنشاء حساب / دخول", "url": `${SITE_CONFIG.url}/login` },
                  { "@type": "SiteNavigationElement", "position": 2, "name": "عن ناميكس", "url": `${SITE_CONFIG.url}/about` },
                  { "@type": "SiteNavigationElement", "position": 3, "name": "أكاديمية الذكاء المالي", "url": `${SITE_CONFIG.url}/academy` },
                  { "@type": "SiteNavigationElement", "position": 4, "name": "الأسئلة الشائعة", "url": `${SITE_CONFIG.url}/faq` }
                ]
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
