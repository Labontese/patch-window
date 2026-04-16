import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import packageJson from '@/package.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  const timestamp = new Date().toISOString()
  const version = packageJson.version

  try {
    await db.execute(sql`SELECT 1`)

    return NextResponse.json(
      { status: 'ok', timestamp, version },
      { status: 200 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    return NextResponse.json(
      { status: 'error', timestamp, version, db: message },
      { status: 503 }
    )
  }
}
