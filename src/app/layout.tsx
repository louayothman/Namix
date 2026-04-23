
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { PWASplash } from "@/components/pwa/PWASplash";
import { NotificationManager } from "@/components/pwa/NotificationManager";
import { SITE_CONFIG } from '@/lib/site-config';
import { headers } from 'next/headers';

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
    <html lang="ar" dir="rtl">
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
