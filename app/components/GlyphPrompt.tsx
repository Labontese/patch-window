/**
 * GlyphPrompt — $_ symbol som inline React-komponent.
 *
 * Dollar-prompt + block cursor i monospace-stilisering.
 * Alltid aria-hidden — semantiskt innehåll hanteras av parent-komponent.
 * Använder currentColor så CSS kan styra färg i båda lägena.
 */

type GlyphProps = {
  width?: number
  height?: number
  className?: string
}

export default function GlyphPrompt({ width = 64, height = 32, className }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 32"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Dollar sign: vertical stroke */}
      <rect fill="currentColor" x="11" y="2" width="3" height="28" rx="1" />

      {/* Dollar sign: top horizontal arc */}
      <rect fill="currentColor" x="7" y="5" width="11" height="3" rx="1" />
      {/* Dollar sign: top-left arc terminus */}
      <rect fill="currentColor" x="7" y="5" width="3" height="6" rx="1" />

      {/* Dollar sign: middle bar */}
      <rect fill="currentColor" x="7" y="14.5" width="11" height="3" rx="1" />

      {/* Dollar sign: bottom horizontal arc */}
      <rect fill="currentColor" x="7" y="24" width="11" height="3" rx="1" />
      {/* Dollar sign: bottom-right arc terminus */}
      <rect fill="currentColor" x="15" y="21" width="3" height="6" rx="1" />

      {/* Block cursor: solid rectangle */}
      <rect fill="currentColor" x="30" y="8" width="13" height="16" rx="1" />

      {/* Underscore */}
      <rect fill="currentColor" x="30" y="27" width="13" height="3" rx="1" />
    </svg>
  )
}
