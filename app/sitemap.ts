import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllTags } from '@/lib/articles'
import { PATHWAYS } from '@/lib/types'

const BASE = 'https://patchwindow.serverdigital.net'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const tags = getAllTags()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/hot-take`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/deep-dive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/brief`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about/daniel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/corrections`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
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

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BASE}/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...articleRoutes, ...pathwayRoutes, ...tagRoutes]
}
