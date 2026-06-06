import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { PATHWAYS } from '@/lib/types'

const BASE = 'https://patchwindow.serverdigital.net'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/hot-take`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/deep-dive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/brief`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about/daniel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/corrections`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: new Date('2026-05-02'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: new Date('2026-05-02'), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/${a.format}/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const pathwayRoutes: MetadataRoute.Sitemap = PATHWAYS.map((slug) => ({
    url: `${BASE}/pathway/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Tag pages are intentionally excluded from the sitemap. They are low-value,
  // near-duplicate listing pages that previously made up ~77% of submitted URLs
  // (305 of 398), diluting crawl budget and producing large numbers of
  // "Discovered - currently not indexed" entries in Search Console. Tag pages
  // also carry robots noindex (see app/tag/[slug]/page.tsx).
  return [...staticRoutes, ...articleRoutes, ...pathwayRoutes]
}
