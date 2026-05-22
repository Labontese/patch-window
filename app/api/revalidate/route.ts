import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

const BASE = 'https://patchwindow.serverdigital.net'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Revalidera listningssidor
  const paths = ['/', '/hot-take', '/brief', '/deep-dive', '/guides', '/feed.xml', '/sitemap.xml']
  paths.forEach((p) => revalidatePath(p))

  // Pinga IndexNow för artiklar publicerade de senaste 65 minuterna
  const indexNowKey = process.env.INDEXNOW_KEY
  if (indexNowKey) {
    const cutoff = new Date(Date.now() - 65 * 60 * 1000)
    const newArticles = getAllArticles().filter(
      (a) => new Date(a.publishedAt) >= cutoff
    )
    if (newArticles.length > 0) {
      const urls = newArticles.map((a) => `${BASE}/${a.format}/${a.slug}`)
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'patchwindow.serverdigital.net',
          key: indexNowKey,
          keyLocation: `${BASE}/${indexNowKey}.txt`,
          urlList: urls,
        }),
      }).catch(() => {}) // tyst fel — pingen är best-effort
    }
  }

  return NextResponse.json({ revalidated: paths, now: Date.now() })
}
