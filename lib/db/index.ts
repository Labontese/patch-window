import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set — refusing to start without a database')
}

/**
 * postgres-js connection (porsager/postgres).
 * max: 1 because Next.js runs in a serverless-like environment where
 * each worker is short-lived. Adjust if running a persistent Node server.
 */
const client = postgres(process.env.DATABASE_URL, { max: 1 })

export const db = drizzle(client, { schema })
