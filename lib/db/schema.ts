import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

/**
 * corrections — reader-reported factual errors.
 * Submitted via /corrections page, stored for editorial review.
 */
export const corrections = pgTable('corrections', {
  id: serial('id').primaryKey(),
  articleSlug: text('article_slug').notNull(),
  reportedText: text('reported_text').notNull(),
  correction: text('correction').notNull(),
  reporterEmail: text('reporter_email'),
  resolved: boolean('resolved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * newsletter_subscribers — placeholder for future newsletter.
 * No auth, no confirmation flow yet — just the table.
 */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  confirmedAt: timestamp('confirmed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
