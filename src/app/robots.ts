import { MetadataRoute } from 'next'
 
/**
 * @fileOverview ميثاق الخصوصية لمحركات البحث (Robots.txt)
 * يحدد المسارات المسموح أرشفتها والمسارات المحمية لضمان خصوصية بيانات المستثمرين.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/home/', 
        '/profile/', 
        '/trade/', 
        '/arena/',
        '/my-investments/',
        '/my-deposits/',
        '/my-withdrawals/',
        '/notifications/'
      ],
    },
    sitemap: 'https://namix.pro/sitemap.xml',
  }
}
