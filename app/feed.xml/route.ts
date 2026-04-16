import { getAllArticles } from '@/lib/articles'

const BASE = 'https://patchwindow.serverdigital.net'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = getAllArticles().slice(0, 20)

  const items = articles
    .map((a) => {
      const url = `${BASE}/${a.format}/${a.slug}`
      const pubDate = new Date(a.publishedAt).toUTCString()
      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(a.excerpt)}</description>
      <category>${escapeXml(a.format)}</category>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Patch Window</title>
    <link>${BASE}</link>
    <description>Linux, networking, containers, DevOps, and AI in production environments.</description>
    <language>en</language>
    <managingEditor>daniel@serverdigital.net (Daniel Gustafsson)</managingEditor>
    <webMaster>daniel@serverdigital.net (Daniel Gustafsson)</webMaster>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
