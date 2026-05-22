import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const paths = ['/', '/hot-take', '/brief', '/deep-dive', '/guides', '/feed.xml', '/sitemap.xml']
  paths.forEach((p) => revalidatePath(p))
  return NextResponse.json({ revalidated: paths, now: Date.now() })
}
