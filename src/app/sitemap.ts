import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/site-config'
 
/**
 * @fileOverview محرك توليد خارطة الموقع الديناميكي
 * يعتمد على SITE_CONFIG لضمان العمل على أي دومين.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
