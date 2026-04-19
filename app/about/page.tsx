import type { Metadata } from 'next'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'About Patch Window',
  description:
    'Patch Window covers Linux, networking, containers, DevOps, and AI in production environments.',
  openGraph: {
    title: 'About Patch Window',
    description:
      'Patch Window covers Linux, networking, containers, DevOps, and AI in production environments.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <div className="content-col">
          <h1>About Patch Window</h1>

          <p>
            In 1995, a friend and I got hold of a CD with Slackware from a computer magazine called
            DMZ &mdash; Datormagazin. You did not download distributions in those days. Not on a
            33.3k modem, with parents asking why the phone line was busy, and every kilobyte costing
            serious money for a 15-year-old. So we bought a thick manual online to learn how to do
            the install. It was one of the first books I read with genuine enjoyment. Since then,
            technical reading has always been something I return to.
          </p>

          <p>That is where this started. Not as a media project. As a habit.</p>

          <p>
            The name Patch Window comes from the maintenance window you schedule before touching
            production &mdash; that narrow slot where you apply updates, fix what is broken, and hope
            nothing else breaks in the process. Patches, reboots, configuration changes. The work
            that happens after hours, quietly, before anyone else is at their desk.
          </p>

          <p>
            Patch Window covers what happens inside that window. Linux, networking, containers,
            DevOps, AI tools landing in production environments. The audience is practitioners:
            sysadmins, platform engineers, homelab operators, people who manage real systems and need
            information they can actually use.
          </p>

          <p>
            Three formats, three purposes. Hot Takes are fast and opinionated when something ships
            that deserves a reaction. Deep Dives go long when the topic earns it: full technical
            analysis, tested against real hardware. Briefs cover news with the context that makes it
            useful, plus what it means for people running the affected systems.
          </p>

          <p>No paywalls. No coverage of tools the author has not used. No vague enterprise language.</p>

          <p>
            I was part of a Swedish tech forum early on, back when it was small and everyone knew
            everyone. It grew into something enormous, and somewhere along the way it stopped feeling
            personal. That is not happening here. The format may grow. The voice stays.
          </p>

          <p>
            The goal is that you read something here at 11 PM and think:{' '}
            <em>
              &ldquo;why did I start reading this, I should be asleep &mdash; but I can&rsquo;t
              stop.&rdquo;
            </em>{' '}
            Not: <em>&ldquo;another site that got my hopes up.&rdquo;</em>
          </p>
        </div>
      </main>
      <InnerFooter />
    </>
  )
}
