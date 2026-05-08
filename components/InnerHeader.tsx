import Link from 'next/link'
import { SITE_STATS, getSiteUptimeDays } from '@/lib/site-config'
import { getAllArticles } from '@/lib/articles'

export default function InnerHeader() {
  const uptime = getSiteUptimeDays()
  const articleCount = getAllArticles().length

  return (
    <header role="banner">
      <div className="v2 v2-head">
        <p className="v2-head__prompt" aria-hidden="true">
          {'daniel@patchwindow:~$ '}
          <span className="v2-head__cursor" aria-hidden="true" />
        </p>

        <p className="v2-head__title">
          <Link href="/" aria-label="Patch Window, go to homepage" style={{ color: 'inherit', textDecoration: 'none' }}>
            Patch Window
          </Link>
        </p>

        <p className="v2-head__meta">
          {SITE_STATS.currentPatch} &nbsp;·&nbsp; {articleCount} patches &nbsp;·&nbsp; uptime {uptime}d
        </p>

        <nav aria-label="Site navigation">
          <ul className="v2-head__nav">
            <li><Link href="/deep-dive" data-umami-event="nav-click" data-umami-event-item="deep-dives">Deep Dives</Link></li>
            <li><Link href="/hot-take" data-umami-event="nav-click" data-umami-event-item="hot-takes">Hot Takes</Link></li>
            <li><Link href="/brief" data-umami-event="nav-click" data-umami-event-item="briefs">Briefs</Link></li>
            <li><a href="/feed.xml" aria-label="RSS feed">RSS</a></li>
            <li><Link href="/about" data-umami-event="nav-click" data-umami-event-item="about">About</Link></li>
            <li><Link href="/tools" data-umami-event="nav-click" data-umami-event-item="tools">Tools</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
