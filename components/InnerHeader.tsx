import { SITE_STATS, getSiteUptimeDays } from '@/lib/site-config'
import { getAllArticles } from '@/lib/articles'

export default function InnerHeader() {
  const uptime = getSiteUptimeDays()
  const articleCount = getAllArticles().length

  return (
    <header className="v2-head" role="banner">
      <p className="v2-head__prompt" aria-hidden="true">
        {'daniel@patchwindow:~$ '}
        <span className="v2-head__cursor" aria-hidden="true" />
      </p>

      <p className="v2-head__title">
        <a href="/" aria-label="Patch Window, go to homepage" style={{ color: 'inherit', textDecoration: 'none' }}>
          Patch Window
        </a>
      </p>

      <p className="v2-head__meta">
        {SITE_STATS.currentPatch} &nbsp;·&nbsp; {articleCount} patches &nbsp;·&nbsp; uptime {uptime}d
      </p>

      <nav aria-label="Site navigation">
        <ul className="v2-head__nav">
          <li><a href="/deep-dive" data-umami-event="nav-click" data-umami-event-item="deep-dives">Deep Dives</a></li>
          <li><a href="/hot-take" data-umami-event="nav-click" data-umami-event-item="hot-takes">Hot Takes</a></li>
          <li><a href="/brief" data-umami-event="nav-click" data-umami-event-item="briefs">Briefs</a></li>
          <li><a href="/feed.xml" aria-label="RSS feed">RSS</a></li>
          <li><a href="/about" data-umami-event="nav-click" data-umami-event-item="about">About</a></li>
        </ul>
      </nav>
    </header>
  )
}
