import type { Metadata, Viewport } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { PWASplash } from "@/components/pwa/PWASplash";
import { NotificationManager } from "@/components/pwa/NotificationManager";
import { SITE_CONFIG } from '@/lib/site-config';
import { headers } from 'next/headers';

// استدعاء خط Quicksand المحلي (للإنجليزي والأرقام)
const quicksand = localFont({
  src: [
    { path: '../../public/fonts/Quicksand-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Quicksand-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Quicksand-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Quicksand-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Quicksand-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-quicksand',
  display: 'swap',
});

// استدعاء خط IBM Plex Sans Arabic المحلي (للعربية)
const ibmPlexArabic = localFont({
  src: [
    { path: '../../public/fonts/IBMPlexSansArabic-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSansArabic-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

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
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Namix',
    }
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
    <html lang="ar" dir="rtl" className={`${quicksand.variable} ${ibmPlexArabic.variable}`}>
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
