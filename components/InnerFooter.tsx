import Link from 'next/link'
import { SITE_STATS } from '@/lib/site-config'

/**
 * InnerFooter — V2-stilad footer för innersidor.
 *
 * Visuellt baserad på TerminalFooter men med SiteFooters
 * fullständiga innehåll: copyright, About, Corrections, RSS,
 * Contact och Ko-fi. Alla data-umami-event-attribut från
 * SiteFooter behålls.
 */
export default function InnerFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="v2-footer" role="contentinfo">
      {/* Vänster: copyright + primär-nav */}
      <span className="v2-footer__left">
        <span aria-hidden="true">{'$ '}</span>
        {`© ${year} Daniel Gustafsson · `}
        <Link href="/about" data-umami-event="nav-click" data-umami-event-item="about">
          About
        </Link>
        {' · '}
        <Link href="/corrections" data-umami-event="nav-click" data-umami-event-item="corrections">
          Corrections
        </Link>
        {' · '}
        <Link href="/feed.xml" data-umami-event="rss-click">
          RSS
        </Link>
        {' · '}
        <a href="mailto:daniel@serverdigital.net" data-umami-event="contact-click">
          Contact
        </a>
      </span>

      {/* Höger: patch-version + Ko-fi */}
      <span className="v2-footer__right">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <span aria-hidden="true">patch {SITE_STATS.currentPatch} applied</span>
          <span className="visually-hidden">Patch Window {SITE_STATS.currentPatch}</span>
        </span>
        {' · '}
        <a
          href="https://ko-fi.com/M4M41XYZRX"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="kofi-click"
          aria-label="Support on Ko-fi"
        >
          Ko-fi
        </a>
      </span>
    </footer>
  )
}
