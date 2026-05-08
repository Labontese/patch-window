import { NextResponse } from 'next/server'
import { getAllArticlesWithContent } from '@/lib/articles'

// Dynamic rendering — content changes with new articles.
// CDN/browser caches for 1 hour via Cache-Control header.
export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = getAllArticlesWithContent()

  return NextResponse.json(
    {
      articles,
      total: articles.length,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
