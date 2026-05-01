import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

// shields.io endpoint-format: https://shields.io/badges/endpoint-badge
// shields.io cachar själv ~1h, så static + ISR-revalidate räcker.
export const dynamic = 'force-static'
export const revalidate = 3600

const MAX_MESSAGE_LEN = 30

/**
 * Smart trunkering. Långa artikel-titlar har ofta formen
 * "Wazuh 4.14.5: a security patch for ...". Om titeln har en kolon
 * inom gränsen, klipp där. Annars klipp vid sista ordgräns före gränsen.
 */
function truncateTitle(title: string, max: number = MAX_MESSAGE_LEN): string {
  if (title.length <= max) return title

  const colonIdx = title.indexOf(':')
  if (colonIdx > 0 && colonIdx <= max) {
    return title.slice(0, colonIdx).trim()
  }

  const slice = title.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > 10) {
    return slice.slice(0, lastSpace).trim()
  }
  return slice.trim()
}

export async function GET() {
  const articles = getAllArticles()
  const latest = articles[0]

  const message = latest ? truncateTitle(latest.title) : 'No articles yet'

  return NextResponse.json({
    schemaVersion: 1,
    label: 'Latest',
    message,
    color: 'd4a017',
    labelColor: '0a1628',
    style: 'for-the-badge',
  })
}
