/**
 * Logo — kombinerar SVG-glyph + Wordmark.
 *
 * Glyph-varianten styrs av CSS-variabeln --logo-glyph-variant i globals.css.
 * Byt värde från 'prompt' till 'window' för att se fönster-varianten live.
 *
 * Inline SVG:erna är aria-hidden — texten "Patch Window" i Wordmark
 * är det accessibla namnet. Logo-länken i SiteHeader ger hela kombinationen
 * ett accessible name via aria-label.
 */

import Wordmark from './Wordmark'

type LogoProps = {
  /** Vilken glyph-variant som visas. */
  variant?: 'prompt' | 'window'
  /** Storlek på wordmark. Default: 2rem */
  wordmarkSize?: string
  className?: string
}

/**
 * Glyphen renderas som text i monospace-font (inte SVG) för att garantera
 * skarphet vid alla storlekar. Ligger i egen span med aria-hidden — texten
 * "$_" ska aldrig läsas upp av skärmläsare, wordmarken bär det semantiska
 * innehållet.
 *
 * För favicon används en separat SVG (public/logo/) som är handritad för
 * små storlekar.
 */
export default function Logo({
  variant = 'prompt',
  wordmarkSize = '2rem',
  className,
}: LogoProps) {
  const glyph = variant === 'window' ? '▢' : '$_'

  return (
    <span
      className={`logo ${className ?? ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.6rem',
      }}
    >
      <span
        className="logo__glyph"
        aria-hidden="true"
        style={{
          color: 'var(--color-amber)',
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontWeight: 600,
          fontSize: wordmarkSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {glyph}
      </span>

      <Wordmark size={wordmarkSize} />
    </span>
  )
}
