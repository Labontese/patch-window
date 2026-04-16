/**
 * Wordmark — "Patch Window" satt i Playfair Display.
 *
 * Renderar texten direkt, inte som SVG. Texten är selectable och crawlable.
 * Fonten kommer från CSS-variabeln --font-playfair som layout.tsx sätter.
 *
 * Storlek och vikt styrs med props. Default är display-storlek för header.
 */

type WordmarkProps = {
  /** Font size i rem. Default: 1.5 (24px) */
  size?: string
  /** CSS class att lägga på elementet */
  className?: string
}

export default function Wordmark({ size = '1.5rem', className }: WordmarkProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        color: 'var(--color-text)',
      }}
    >
      Patch Window
    </span>
  )
}
