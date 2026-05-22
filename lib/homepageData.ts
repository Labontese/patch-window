import { getAllArticles, getTagCounts } from '@/lib/articles'
import type { ArticleMeta } from '@/lib/types'

const PAGE_SIZE = 15

export interface HomepageData {
  allArticles: ArticleMeta[]
  tagCounts: Array<{ tag: string; count: number }>
  latestDeepDive: ArticleMeta | undefined
  logArticles: ArticleMeta[]
  paginatedArticles: ArticleMeta[]
  totalPages: number
  pageNumber: number
}

export function getHomepageData(page: number): HomepageData {
  const allArticles = getAllArticles()
  const tagCounts = getTagCounts()

  const latestDeepDive =
    allArticles.find((a) => a.format === 'deep-dive') ?? allArticles[0]

  const logArticles = latestDeepDive
    ? allArticles.filter((a) => a.slug !== latestDeepDive.slug)
    : allArticles

  const totalPages = Math.ceil(logArticles.length / PAGE_SIZE)
  const pageNumber = Math.min(Math.max(1, page), totalPages || 1)
  const paginatedArticles = logArticles.slice(
    (pageNumber - 1) * PAGE_SIZE,
    pageNumber * PAGE_SIZE
  )

  return { allArticles, tagCounts, latestDeepDive, logArticles, paginatedArticles, totalPages, pageNumber }
}
