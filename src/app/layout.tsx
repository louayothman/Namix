import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Outfit, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { PWASplash } from "@/components/pwa/PWASplash";
import { NotificationManager } from "@/components/pwa/NotificationManager";
import { SITE_CONFIG } from '@/lib/site-config';

// استدعاء الخطوط السيادية من محرك غوغل لضمان الاستقرار والأداء
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  applicationName: 'Namix',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Namix',
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
    <html lang="ar" dir="rtl" className={`${outfit.variable} ${ibmPlexArabic.variable}`}>
      <body className="font-body antialiased selection:bg-primary/30 overflow-x-hidden">
        <FirebaseClientProvider>
          <SWRegistration />
          <PWASplash />
          {children}
          <NotificationManager />
          <PWAInstaller />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
