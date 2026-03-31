
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";

export const metadata: Metadata = {
  title: {
    default: 'ناميكس برو | منصة الاستثمار الرقمي المتقدمة',
    template: '%s | ناميكس برو'
  },
  description: 'ناميكس برو (Namix Pro) هي المنصة الرائدة في إدارة الأصول الرقمية والتداول بالذكاء الاصطناعي. أمان متطور، عوائد استراتيجية، وحماية رأس المال للنخبة.',
  applicationName: 'Namix Pro',
  authors: [{ name: 'Namix Universal Network' }],
  generator: 'Next.js',
  keywords: ['تداول', 'استثمار', 'ذكاء اصطناعي', 'عملات رقمية', 'ناميكس', 'Namix Pro', 'أرباح', 'بوت تداول', 'استثمار آمن'],
  referrer: 'origin-when-cross-origin',
  creator: 'Namix Core',
  publisher: 'Namix Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Namix Pro',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://namix.pro',
    siteName: 'ناميكس برو',
    title: 'ناميكس برو | بوابتك لعالم الاستثمار الرقمي بذكاء',
    description: 'ابدأ رحلتك الاستثمارية اليوم مع ناميكس برو. محرك تداول متطور وبروتوكولات حماية عالمية.',
    images: [
      {
        url: 'https://namix.pro/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Namix Pro Sovereign Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ناميكس برو | منصة الاستثمار الرقمي المتقدمة',
    description: 'تداول واستثمر بذكاء مع بروتوكول ناميكس المعتمد.',
    images: ['https://namix.pro/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
    'apple-touch-fullscreen': 'yes',
    'apple-mobile-web-app-title': 'Namix',
    'theme-color': '#002d4d'
  }
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
        
        {/* Apple Icons - Critical for iOS Home Screen */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192.png" />
        
        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#002d4d" />

        {/* Structured Data (JSON-LD) for Google Sitelinks & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "ناميكس برو - Namix Pro",
                "url": "https://namix.pro",
                "logo": "https://namix.pro/icon-192.png",
                "description": "المنصة الرائدة في إدارة الأصول الرقمية والتداول بالذكاء الاصطناعي.",
                "sameAs": [
                  "https://twitter.com/namix",
                  "https://instagram.com/namix"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+1-000-000-0000",
                  "contactType": "customer service",
                  "areaServed": "Global",
                  "availableLanguage": ["Arabic", "English"]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "روابط ناميكس السريعة",
                "itemListElement": [
                  {
                    "@type": "SiteNavigationElement",
                    "position": 1,
                    "name": "إنشاء حساب / دخول",
                    "url": "https://namix.pro/login"
                  },
                  {
                    "@type": "SiteNavigationElement",
                    "position": 2,
                    "name": "عن ناميكس",
                    "url": "https://namix.pro/about"
                  },
                  {
                    "@type": "SiteNavigationElement",
                    "position": 3,
                    "name": "أكاديمية الذكاء المالي",
                    "url": "https://namix.pro/academy"
                  },
                  {
                    "@type": "SiteNavigationElement",
                    "position": 4,
                    "name": "الأسئلة الشائعة",
                    "url": "https://namix.pro/faq"
                  }
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
