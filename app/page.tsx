import type { Metadata } from 'next'
import { getAllArticles, getTagCounts } from '@/lib/articles'
import TerminalHeader from '@/components/patchlog/TerminalHeader'
import FeaturedPatch from '@/components/patchlog/FeaturedPatch'
import LogRow from '@/components/patchlog/LogRow'
import NowCard from '@/components/patchlog/NowCard'
import TagCloud from '@/components/patchlog/TagCloud'
import Subscribe from '@/components/patchlog/Subscribe'
import TerminalFooter from '@/components/patchlog/TerminalFooter'
import './patch-log.css'

export const metadata: Metadata = {
  title: 'Patch Window',
  description:
    'Linux, networking, containers, DevOps, and AI in production environments. Written by a practitioner.',
  openGraph: {
    type: 'website',
    title: 'Patch Window',
    description:
      'Linux, networking, containers, DevOps, and AI in production environments. Written by a practitioner.',
  },
}

export default function HomePage() {
  const allArticles = getAllArticles()
  const tagCounts = getTagCounts()

  // Featured: latest deep-dive, fallback to latest article
  const latestDeepDive =
    allArticles.find((a) => a.format === 'deep-dive') ?? allArticles[0]

  // Log: all articles except the featured one
  const logArticles = latestDeepDive
    ? allArticles.filter((a) => a.slug !== latestDeepDive.slug)
    : allArticles

  return (
    <main className="v2" id="main-content">
      {/* Visually-hidden h1 duplicate is NOT needed here —
          TerminalHeader renders the h1 itself */}

      <TerminalHeader articleCount={allArticles.length} />

      {latestDeepDive && <FeaturedPatch article={latestDeepDive} />}

      <div className="v2-columns">
        {/* Main column: log table */}
        <div>
          {logArticles.length > 0 ? (
            <table className="v2-log" aria-label="Patch log">
              <caption className="v2-log__caption">All patches</caption>
              <thead className="visually-hidden">
                <tr>
                  <th scope="col" className="v2-log__th--hidden-mobile">#</th>
                  <th scope="col">Format</th>
                  <th scope="col">Title</th>
                  <th scope="col">Published</th>
                  <th scope="col" className="v2-log__th--hidden-mobile">Read time</th>
                </tr>
              </thead>
              <tbody>
                {logArticles.map((article, i) => (
                  <LogRow key={article.slug} article={article} index={i} />
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No patches published yet.</p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="v2-side" aria-label="Sidebar">
          <NowCard />
          <TagCloud tags={tagCounts} />
          <Subscribe />
        </aside>
      </div>

      <TerminalFooter />
    </main>
  )
}
