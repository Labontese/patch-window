import type { Metadata } from 'next'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Privacy Policy | Patch Window',
  description:
    'How Patch Window handles personal data — what we store, why, and how to remove it.',
  alternates: { canonical: 'https://patchwindow.serverdigital.net/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
        <div className="content-col">
          <h1>Privacy Policy</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Last updated: 2 May 2026
          </p>

          <h2>Who I am</h2>
          <p>
            Patch Window is a personal technical publication written and operated by Daniel
            Gustafsson, a sole trader registered in Sweden. I am the data controller for
            everything published at <code>patchwindow.serverdigital.net</code>.
          </p>
          <p>
            For privacy questions or requests, email{' '}
            <a href="mailto:daniel@serverdigital.net">daniel@serverdigital.net</a>.
          </p>

          <h2>What I store on your device</h2>
          <p>Three things, none of them for tracking-after-the-fact.</p>

          <p>
            <strong>1. Your display preferences (<code>pw-prefs</code>).</strong> A small JSON
            object in your browser&rsquo;s local storage. It holds your theme, accent colour,
            density, serif toggle, and easter egg state. The server never reads it. Clear it
            whenever you want. Functional, no consent required.
          </p>

          <p>
            <strong>2. Your consent choice (<code>pw-consent</code>).</strong> When you answer
            the consent banner, your choice (yes or no to analytics) is stored in local storage
            so the banner does not nag you again. Required to honour your decision. No consent
            needed for storing the consent itself.
          </p>

          <p>
            <strong>3. Analytics opt-out marker (<code>umami.disabled</code>).</strong> Only
            stored if you reject analytics or withdraw your consent. A flag the Umami tracker
            reads on each page load and stops itself if set. The tracker itself does not write
            cookies or persistent storage when running, so this is the only Umami-related
            entry that ever lands on your device, and only if you said no. See{' '}
            <a href="/cookies">Cookies</a> for full detail.
          </p>

          <p>No advertising IDs, no fingerprinting, no third-party tracking pixels.</p>

          <h2>What I store on the server</h2>
          <p>
            Two things, both kept on infrastructure I run with my partner Karin in Helsinki,
            Finland (Hetzner Cloud, EU jurisdiction).
          </p>

          <p>
            <strong>1. Web server logs.</strong> Every request to the site is logged by the
            reverse proxy (Traefik) and forwarded to a log database (Loki). The log entry
            contains your IP address, your user-agent string, the URL you requested, and a
            timestamp. I keep these for 30 days, then they are deleted.
          </p>
          <p>
            I use these logs to keep the site running and to investigate abuse. Legal basis:
            legitimate interest (GDPR Article 6(1)(f)). The CJEU has explicitly recognised this
            as a valid basis for server logs (case C-582/14, Breyer).
          </p>

          <p>
            <strong>2. Analytics via Umami.</strong> I run a self-hosted instance of Umami
            Analytics on the same server. If you accept analytics in the consent banner, Umami
            counts your page views and aggregates referrers, countries, browsers, and screen
            sizes. Your IP is hashed together with your user-agent and a daily-rotated salt;
            only the hash is stored, and the salt rotates every day so the same visitor cannot
            be re-identified across days.
          </p>
          <p>
            Legal basis: consent (GDPR Article 6(1)(a) and ePrivacy Article 5(3) / Swedish LEK
            9:28). You can withdraw at any time via the &ldquo;Cookie settings&rdquo; link in
            the footer.
          </p>
          <p>
            I retain Umami data for 25 months and then it is deleted, matching the French CNIL
            guidance ceiling for analytics retention.
          </p>

          <h2>What I do not do</h2>
          <ul>
            <li>No advertising. No ad networks, no retargeting, no audience segments.</li>
            <li>
              No third-party trackers. No Google Analytics, no Facebook Pixel, no Hotjar, no
              Mixpanel.
            </li>
            <li>No selling or sharing of any data with anyone, ever.</li>
            <li>
              No newsletter mailing list (yet &mdash; if I add one, I will update this page).
            </li>
            <li>No comments or user accounts. There is nothing to register for.</li>
          </ul>

          <h2>External links and embeds</h2>
          <p>
            The site links out to other sites (GitHub repositories, vendor docs, news articles).
            When you click an outbound link, the destination site sees your browser as you would
            expect.
          </p>
          <p>
            The footer shows a Ko-fi donation button. The image is served locally so your
            browser does not contact Ko-fi until you click. If you click it, you go to ko-fi.com
            and their privacy policy applies.
          </p>

          <h2>Fonts</h2>
          <p>
            The site uses three Google Fonts (Playfair Display, Source Serif 4, JetBrains Mono).
            They are downloaded at build time and served from this domain. Your browser never
            contacts Google to load them.
          </p>

          <h2>Joint controllers</h2>
          <p>
            I run Patch Window. Karin (Holmdigital, registered in Sweden) operates the
            underlying infrastructure including the Umami analytics instance. Karin and I are
            joint controllers under GDPR Article 26 for the analytics data specifically. We have
            a written agreement covering this. You can address any rights request to me at the
            email above; I will route it.
          </p>

          <h2>Your rights under GDPR</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request a copy of any personal data I hold about you (Article 15).</li>
            <li>Ask me to correct it (Article 16).</li>
            <li>Ask me to delete it (Article 17).</li>
            <li>Object to my processing of it (Article 21).</li>
            <li>
              Withdraw consent at any time (Article 7) &mdash; for analytics, use the
              &ldquo;Cookie settings&rdquo; link in the footer.
            </li>
            <li>
              Lodge a complaint with the Swedish data protection authority IMY at{' '}
              <a href="https://www.imy.se/en/individuals/data-protection/file-a-complaint/">
                imy.se
              </a>
              .
            </li>
          </ul>
          <p>
            To exercise any of these, email{' '}
            <a href="mailto:daniel@serverdigital.net">daniel@serverdigital.net</a>. I will
            respond within one month.
          </p>
          <p>
            In practice, the only personal data I hold about a typical visitor is their IP
            address in 30-day server logs (and a session token in Umami if you accepted
            analytics). If you want it deleted earlier, send me the IP and the rough time window
            and I will run a delete query.
          </p>

          <h2>Where the data lives</h2>
          <p>
            All processing happens on a single dedicated server in Helsinki, Finland. No US
            transfers, no third-country transfers, no Schrems II problem. Daily backups go to a
            Hetzner Storagebox in the same jurisdiction.
          </p>

          <h2>When this changes</h2>
          <p>
            I will update the date at the top whenever I change anything material. If I add new
            data flows (a newsletter, comments, embedded video, anything), I will write about it
            on the front page so it is hard to miss.
          </p>
          <p>
            If you spot an error or an inconsistency between what this page says and what the
            site actually does, email me. I read every message.
          </p>
        </div>
      </main>
      <InnerFooter />
    </>
  )
}
