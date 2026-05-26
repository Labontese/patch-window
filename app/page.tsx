import type { Metadata } from 'next'
import { getHomepageData } from '@/lib/homepageData'
import TerminalHeader from '@/components/patchlog/TerminalHeader'
import FeaturedPatch from '@/components/patchlog/FeaturedPatch'
import LogRow from '@/components/patchlog/LogRow'
import Pagination from '@/components/patchlog/Pagination'
import NowCard from '@/components/patchlog/NowCard'
import TagCloud from '@/components/patchlog/TagCloud'
import Subscribe from '@/components/patchlog/Subscribe'
import Footer from '@/components/Footer'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Patch Window: Linux, DevOps & AI in production homelabs',
  description:
    'Linux, networking, containers, DevOps, and AI in production environments. Three formats: deep-dives, briefs, and hot-takes.',
  alternates: { canonical: 'https://patchwindow.serverdigital.net/' },
  openGraph: {
    type: 'website',
    siteName: 'Patch Window',
    title: 'Patch Window: Linux, DevOps & AI in production homelabs',
    description:
      'Linux, networking, containers, DevOps, and AI in production environments. Three formats: deep-dives, briefs, and hot-takes.',
    url: 'https://patchwindow.serverdigital.net/',
    images: [
      {
        url: 'https://patchwindow.serverdigital.net/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Patch Window — Linux, AIOps, and the production homelab',
      },
    ],
  },
}

const PAGE_SIZE = 15

export default function HomePage() {
  const { allArticles, tagCounts, latestDeepDive, paginatedArticles, totalPages } =
    getHomepageData(1)

  return (
    <>
    <main className="v2" id="main-content">
      <TerminalHeader articleCount={allArticles.length} />

      {latestDeepDive && <FeaturedPatch article={latestDeepDive} />}

      <div className="v2-columns">
        <div>
          {paginatedArticles.length > 0 ? (
            <>
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
                  {paginatedArticles.map((article, i) => (
                    <LogRow
                      key={article.slug}
                      article={article}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={1} totalPages={totalPages} />
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No patches published yet.</p>
          )}
        </div>

        <aside className="v2-side" aria-label="Sidebar">
          <NowCard />
          <TagCloud tags={tagCounts} />
          <Subscribe />
        </aside>
      </div>

    </main>
    <Footer />
    </>
  )
}
