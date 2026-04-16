/**
 * GlyphWindow — stiliserat "patch window" som en schemalagd tidsrad.
 *
 * Visar en tidslinje med en fylld block-markering som representerar
 * underhållsfönstret. Alternativ till GlyphPrompt.
 * Alltid aria-hidden — semantiskt innehåll hanteras av parent-komponent.
 * Använder currentColor så CSS kan styra färg i båda lägena.
 */

type GlyphProps = {
  width?: number
  height?: number
  className?: string
}

export default function GlyphWindow({ width = 64, height = 32, className }: GlyphProps) {
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
      {/* Left bracket — vertical */}
      <rect fill="currentColor" x="2" y="10" width="3" height="12" rx="1" />
      {/* Left bracket — top horizontal */}
      <rect fill="currentColor" x="2" y="10" width="8" height="3" rx="1" />
      {/* Left bracket — bottom horizontal */}
      <rect fill="currentColor" x="2" y="19" width="8" height="3" rx="1" />

      {/* Timeline before window */}
      <rect fill="currentColor" x="12" y="15" width="8" height="2" rx="1" />

      {/* The patch window block */}
      <rect fill="currentColor" x="22" y="10" width="20" height="12" rx="1" />

      {/* Timeline after window */}
      <rect fill="currentColor" x="44" y="15" width="8" height="2" rx="1" />

      {/* Right bracket — top horizontal */}
      <rect fill="currentColor" x="54" y="10" width="8" height="3" rx="1" />
      {/* Right bracket — bottom horizontal */}
      <rect fill="currentColor" x="54" y="19" width="8" height="3" rx="1" />
      {/* Right bracket — vertical */}
      <rect fill="currentColor" x="59" y="10" width="3" height="12" rx="1" />
    </svg>
  )
}
