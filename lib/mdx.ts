import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Returns all slugs for a given content type.
 * For 'articles', scans all three format subdirectories (hot-take, deep-dive, brief).
 * Used in generateStaticParams() for dynamic routes.
 */
export function getSlugs(type: 'articles' | 'pathways'): string[] {
  const dir = path.join(CONTENT_DIR, type)
  if (!fs.existsSync(dir)) return []

  if (type === 'pathways') {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  }

  // articles: scan format subdirectories
  const formatDirs = ['hot-take', 'deep-dive', 'brief']
  return formatDirs.flatMap((format) => {
    const formatDir = path.join(dir, format)
    if (!fs.existsSync(formatDir)) return []
    return fs
      .readdirSync(formatDir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  })
}

/**
 * Returns the full path to an MDX file.
 */
export function getContentPath(
  type: 'articles' | 'pathways',
  slug: string,
  format?: string
): string {
  if (type === 'pathways') {
    return path.join(CONTENT_DIR, type, `${slug}.mdx`)
  }
  if (!format) throw new Error('format is required for articles')
  return path.join(CONTENT_DIR, type, format, `${slug}.mdx`)
}
