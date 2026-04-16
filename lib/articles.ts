import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ArticleMeta, Format } from './types'
import { FORMATS, PATHWAYS } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles')

// Words per minute for reading time estimate.
const WPM = 220

function validateFrontmatter(data: Record<string, unknown>, filePath: string): void {
  if (!data.title) throw new Error(`Missing required field "title" in ${filePath}`)
  if (!data.format) throw new Error(`Missing required field "format" in ${filePath}`)
  if (!data.slug) throw new Error(`Missing required field "slug" in ${filePath}`)
  if (!data.pathway) throw new Error(`Missing required field "pathway" in ${filePath}`)
  if (!data.publishedAt) throw new Error(`Missing required field "publishedAt" in ${filePath}`)
  if (!data.excerpt) throw new Error(`Missing required field "excerpt" in ${filePath}`)

  if (!FORMATS.includes(data.format as Format)) {
    throw new Error(`Invalid format "${data.format}" in ${filePath}. Must be one of: ${FORMATS.join(', ')}`)
  }

  if (!PATHWAYS.includes(data.pathway as (typeof PATHWAYS)[number])) {
    throw new Error(`Invalid pathway "${data.pathway}" in ${filePath}. Must be one of: ${PATHWAYS.join(', ')}`)
  }
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / WPM)
}

export function getArticlesByFormat(format: Format): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, format)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  const articles = files.map((file) => {
    const filePath = path.join(dir, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    validateFrontmatter(data, filePath)

    if (data.draft === true) return null

    const meta: ArticleMeta = {
      title: data.title as string,
      format: data.format as Format,
      slug: data.slug as string,
      pathway: data.pathway as (typeof PATHWAYS)[number],
      tags: Array.isArray(data.tags) ? data.tags : [],
      publishedAt: data.publishedAt as string,
      updatedAt: data.updatedAt as string | undefined,
      excerpt: data.excerpt as string,
      related: data.related,
      draft: data.draft,
      lang: data.lang as string | undefined,
      readingTime: estimateReadingTime(content),
    }

    return meta
  })

  return (articles.filter(Boolean) as ArticleMeta[]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getAllArticles(): ArticleMeta[] {
  return FORMATS.flatMap((format) => getArticlesByFormat(format)).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getArticleByFormatAndSlug(format: Format, slug: string): ArticleMeta | null {
  const filePath = path.join(CONTENT_DIR, format, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  validateFrontmatter(data, filePath)

  return {
    title: data.title as string,
    format: data.format as Format,
    slug: data.slug as string,
    pathway: data.pathway as (typeof PATHWAYS)[number],
    tags: Array.isArray(data.tags) ? data.tags : [],
    publishedAt: data.publishedAt as string,
    updatedAt: data.updatedAt as string | undefined,
    excerpt: data.excerpt as string,
    related: data.related,
    draft: data.draft,
    lang: data.lang as string | undefined,
    readingTime: estimateReadingTime(content),
  }
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.tags.includes(tag))
}

export function getArticlesByPathway(pathway: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.pathway === pathway)
}

export function getAllTags(): string[] {
  const all = getAllArticles().flatMap((a) => a.tags)
  return [...new Set(all)].sort()
}
