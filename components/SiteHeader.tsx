import Link from 'next/link'
import Logo from '@/app/components/Logo'

/**
 * SiteHeader med Logo-komponent.
 *
 * Desktop: logo vanster, nav hoger.
 * Mobil: logo vanster, nav-lankarna wrappas under (flex-wrap).
 *
 * Logo-lanken har aria-label="Patch Window - startsida" sa
 * skarmlasare far ett tydligt accessible name pa lanken.
 * Glyph-SVG:n ar aria-hidden. Wordmark-texten bar namnet.
 */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-wrapper">
        <nav className="site-nav" aria-label="Main navigation">
          {/*
            Logo-lanken: aria-label ger skarmlasaren "Patch Window - startsida"
            sa det inte bara lases som "Patch Window Patch Window" (glyph + wordmark).
            Logo-komponenten ar rent dekorativ + wordmark-text, bade aria-hidden
            pa glyphen och synlig text i Wordmark.
          */}
          <Link
            href="/"
            className="site-logo"
            aria-label="Patch Window, go to homepage"
          >
            <Logo />
          </Link>

          <Link href="/deep-dive" className="nav-link">
            Deep Dives
          </Link>
          <Link href="/hot-take" className="nav-link">
            Hot Takes
          </Link>
          <Link href="/brief" className="nav-link">
            Briefs
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
