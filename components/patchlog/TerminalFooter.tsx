import { SITE_STATS } from '@/lib/site-config'

export default function TerminalFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="v2-footer" role="contentinfo">
      <span>
        <span aria-hidden="true">{'$ '}</span>
        {`© ${year} Daniel Gustafsson — `}
        <a href="/about">About</a>
        {' · '}
        <a href="/feed.xml">RSS</a>
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <span aria-hidden="true">patch {SITE_STATS.currentPatch} applied</span>
        <span className="visually-hidden">Patch Window {SITE_STATS.currentPatch}</span>
      </span>
    </footer>
  )
}
