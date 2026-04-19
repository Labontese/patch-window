import type { Metadata } from 'next'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Corrections',
  description: 'How Patch Window handles corrections and updates to published articles.',
  openGraph: {
    title: 'Corrections',
    description: 'How Patch Window handles corrections and updates to published articles.',
    type: 'website',
  },
}

export default function CorrectionsPage() {
  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Corrections' }]} />
        <div className="content-col">
          <h1>Corrections</h1>

          <p>When Patch Window publishes something incorrect, we fix it visibly.</p>

          <p>
            Corrections appear at the top of the affected article with a correction notice stating
            what was wrong, what the correct information is, and when the correction was made. The
            original text is updated. We do not delete the correction notice once added.
          </p>

          <p>
            Not every correction means we had it wrong from the start. Sometimes a reader points out
            something we had not considered, and we update the article because we learned something.
            Those corrections are handled the same way &mdash; visible notice, original text updated.
          </p>

          <p>
            We read pushback. When we disagree with a correction request, we say so and explain why.
            When the reader has a point we had not considered, we say that too.
          </p>

          <p>
            Minor corrections (spelling, broken links, formatting) are fixed without a correction
            notice unless they affect the meaning of the article.
          </p>

          <p>
            If you spot an error, email{' '}
            <a href="mailto:daniel@serverdigital.net">daniel@serverdigital.net</a>. We read every
            report.
          </p>
        </div>
      </main>
      <InnerFooter />
    </>
  )
}
