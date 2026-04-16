import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Daniel Gustafsson',
  description:
    'Daniel Gustafsson has run Linux since 1995. He tests what he writes about on real hardware.',
  openGraph: {
    title: 'Daniel Gustafsson',
    description:
      'Daniel Gustafsson has run Linux since 1995. He tests what he writes about on real hardware.',
    type: 'profile',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Daniel Gustafsson',
  url: 'https://patchwindow.serverdigital.net/about/daniel',
  email: 'daniel@serverdigital.net',
  jobTitle: 'Systems administrator and technical writer',
  knowsAbout: ['Linux', 'DevOps', 'AIOps', 'Networking', 'Homelabs', 'Containers'],
}

export default function DanielPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Daniel Gustafsson' },
          ]}
        />
        <div className="content-col">
          <h1>Daniel Gustafsson</h1>

          <p>
            I&rsquo;m not the best at any one thing, but I know a little about most of them. That is
            a deliberate positioning, not false modesty. I have been running Linux since 1995 &mdash;
            SUSE and Slackware, found via CD from Datormagazin &mdash; and the 30 years since have
            been wide rather than deep: infrastructure, networking, monitoring, containers, security,
            scripting, the web stack. I have seen distributions come and go, watched Docker replace
            configuration management religion, and seen LLMs land in CI pipelines. That history gives
            context. It is not a credential.
          </p>

          <p>
            The home lab where I test is a three-node Proxmox VE cluster running on Dell PowerEdge
            R730xd, R240, and T430 servers, with dual Juniper EX4200 switches in Virtual Chassis and
            a Quanta LB6M handling the 10GbE fiber backbone. The network runs across 11 VLANs with
            pfSense doing inter-VLAN routing and firewall enforcement. Security monitoring goes
            through Wazuh SIEM. Container workloads run on K3s. The point of building it this way was
            exactly what I said when I finally got it working: everything that should be separate
            actually is, and the IP space is not cramped. When something behaves unexpectedly in my
            articles, it behaved that way on that hardware, in that network, on a real version I can
            point to.
          </p>

          <p>
            I write about tools I have run, on hardware I own, with versions I can name. Claims in
            Deep Dives are tied to specific configurations. When a test gives unexpected results, I
            publish those results, not a cleaned-up summary.
          </p>

          <p>
            The terminal is always where I end up anyway &mdash; we always slide back to it, no
            matter how many interfaces people build on top.
          </p>

          <h2>What I cover</h2>
          <ul>
            <li>Linux administration and internals</li>
            <li>Network configuration and operations</li>
            <li>Home lab and small-scale infrastructure</li>
            <li>Containers and Kubernetes in practice</li>
            <li>AI tools in DevOps and sysadmin contexts</li>
            <li>Monitoring, security observability, and SIEM</li>
            <li>Accessibility tooling and web infrastructure</li>
          </ul>

          <p style={{ marginTop: '1.5rem' }}>
            If you want to reach me:{' '}
            <a href="mailto:daniel@serverdigital.net">daniel@serverdigital.net</a>
          </p>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  )
}
