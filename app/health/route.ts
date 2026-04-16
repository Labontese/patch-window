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
    // Log full error server-side (visible in container logs / Loki) but return
    // only a generic status to clients — raw DB error messages leak schema,
    // hostname, and role information (SECURITY-REVIEW 2026-04-16, HIGH #1).
    console.error('Health check DB ping failed:', err)

    return NextResponse.json(
      { status: 'error', timestamp, version },
      { status: 503 }
    )
  }
}
