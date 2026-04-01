import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/site-config'
 
/**
 * @fileOverview ميثاق الخصوصية لمحركات البحث
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
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
