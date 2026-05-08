import Link from 'next/link'
import { SITE_STATS, getSiteUptimeDays } from '@/lib/site-config'

interface Props {
  articleCount: number
}

export default function TerminalHeader({ articleCount }: Props) {
  const uptime = getSiteUptimeDays()

  return (
    <header className="v2-head" role="banner">
      <p className="v2-head__prompt" aria-hidden="true">
        {'daniel@patchwindow:~$ '}
        <span className="v2-head__cursor" aria-hidden="true" />
      </p>

      <h1 className="v2-head__title">
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Patch Window</Link>
      </h1>

      <p className="v2-head__description">Technical writing for sysadmins, platform engineers, and homelab operators. Deep dives, hot takes, and briefs on Linux, infrastructure, and the systems that keep things running.</p>

      <p className="v2-head__meta">
        {SITE_STATS.currentPatch} &nbsp;·&nbsp; {articleCount} patches &nbsp;·&nbsp; uptime {uptime}d
      </p>

      <nav aria-label="Site navigation">
        <ul className="v2-head__nav">
          <li><Link href="/deep-dive">Deep Dives</Link></li>
          <li><Link href="/hot-take">Hot Takes</Link></li>
          <li><Link href="/brief">Briefs</Link></li>
          <li><a href="/feed.xml" aria-label="RSS feed">RSS</a></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/tools">Tools</Link></li>
        </ul>
      </nav>
    </header>
  )
}
