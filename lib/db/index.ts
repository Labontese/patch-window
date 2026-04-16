import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * postgres-js connection (porsager/postgres), lazily initialized.
 * max: 1 because Next.js runs in a serverless-like environment where
 * each worker is short-lived. Adjust if running a persistent Node server.
 *
 * Lazy init: fail-loud when the DB is actually used at runtime, not at
 * module import time. Next.js build-time page-data-collection imports
 * route modules even for force-dynamic routes, which previously tripped
 * a hard throw before DATABASE_URL was available in the build env.
 */
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

let _db: DrizzleDb | null = null

function getDb(): DrizzleDb {
  if (_db) return _db
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set — refusing to query without a database')
  }
  const client = postgres(process.env.DATABASE_URL, { max: 1 })
  _db = drizzle(client, { schema })
  return _db
}

export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    const real = getDb()
    const value = Reflect.get(real as object, prop, receiver)
    return typeof value === 'function' ? value.bind(real) : value
  },
})
