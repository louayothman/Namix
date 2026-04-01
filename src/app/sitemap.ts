import { MetadataRoute } from 'next'
 
/**
 * @fileOverview محرك توليد خارطة الموقع (Sitemap)
 * يقوم بإرشاد عناكب البحث لكافة الروابط العامة لضمان أرشفة سريعة ودقيقة.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://namix.pro'
  
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
