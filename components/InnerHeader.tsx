import Link from 'next/link'

/**
 * InnerHeader — V2-stilad header för innersidor.
 *
 * Visuellt baserad på TerminalHeader men utan prompt-rad och
 * build-metadata (homepagestspecifika element). Logotypen pekar
 * tillbaka till startsidan. Nav-länkarna behåller aria-label,
 * data-umami-event-attribut och nav aria-label från SiteHeader.
 */
export default function InnerHeader() {
  return (
    <header className="v2-inner-head" role="banner">
      <Link
        href="/"
        className="v2-inner-head__logo"
        aria-label="Patch Window, go to homepage"
      >
        <span aria-hidden="true" className="v2-inner-head__prompt-prefix">{'$_ '}</span>
        <span className="v2-inner-head__title">Patch Window</span>
      </Link>

      <nav aria-label="Main navigation">
        <ul className="v2-head__nav">
          <li>
            <Link href="/deep-dive" data-umami-event="nav-click" data-umami-event-item="deep-dives">
              Deep Dives
            </Link>
          </li>
          <li>
            <Link href="/hot-take" data-umami-event="nav-click" data-umami-event-item="hot-takes">
              Hot Takes
            </Link>
          </li>
          <li>
            <Link href="/brief" data-umami-event="nav-click" data-umami-event-item="briefs">
              Briefs
            </Link>
          </li>
          <li>
            <Link href="/about" data-umami-event="nav-click" data-umami-event-item="about">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
