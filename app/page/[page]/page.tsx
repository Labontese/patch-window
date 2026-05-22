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

export const revalidate = 3600

const PAGE_SIZE = 15

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const { page } = await params
  return {
    alternates: { canonical: `https://patchwindow.serverdigital.net/page/${page}` },
  }
}

export default async function PaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page: pageParam } = await params
  const pageNumber = parseInt(pageParam, 10)

  const { allArticles, tagCounts, latestDeepDive, paginatedArticles, totalPages, pageNumber: page } =
    getHomepageData(pageNumber)

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
                      index={(page - 1) * PAGE_SIZE + i}
                    />
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={page} totalPages={totalPages} />
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
