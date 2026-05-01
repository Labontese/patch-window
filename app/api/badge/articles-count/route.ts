import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/articles'

// shields.io endpoint-format: https://shields.io/badges/endpoint-badge
// Räknar publicerade artiklar (draft-filtrering sker redan i lib/articles.ts).
export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const count = getAllArticles().length

  return NextResponse.json({
    schemaVersion: 1,
    label: 'Articles',
    message: `${count} published`,
    color: '2d6a4f',
    labelColor: '0a1628',
    style: 'for-the-badge',
  })
}
