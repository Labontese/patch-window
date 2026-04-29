import type { ArticleMeta } from '@/lib/types'
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

      <h1 className="v2-head__title">Patch Window</h1>

      <p className="v2-head__meta">
        {SITE_STATS.currentPatch} &nbsp;·&nbsp; {articleCount} patches &nbsp;·&nbsp; uptime {uptime}d
      </p>

      <nav aria-label="Site navigation">
        <ul className="v2-head__nav">
          <li><a href="/deep-dive">Deep Dives</a></li>
          <li><a href="/hot-take">Hot Takes</a></li>
          <li><a href="/brief">Briefs</a></li>
          <li><a href="/feed.xml" aria-label="RSS feed">RSS</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  )
}
