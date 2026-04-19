const PREFS_KEY = 'pw-prefs'

export type AccentColor = 'amber' | 'cyan' | 'rose'
export type Density = 'compact' | 'normal' | 'spacious'
export type SerifToggle = 'on' | 'off'
export type EggToggle = 'on' | 'off'
export type Theme = 'dark' | 'light'

export interface Prefs {
  theme: Theme
  accent: AccentColor
  density: Density
  serif: SerifToggle
  egg: EggToggle
}

const DEFAULTS: Prefs = {
  theme: 'dark',
  accent: 'amber',
  density: 'normal',
  serif: 'on',
  egg: 'on',
}

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

const ACCENT_VARS: Record<AccentColor, { amber: string; amberBorder: string; focus: string }> = {
  amber: { amber: '#d4a017', amberBorder: '#d4a017', focus: '#d4a017' },
  cyan:  { amber: '#22b8c8', amberBorder: '#22b8c8', focus: '#22b8c8' },
  rose:  { amber: '#e05c7a', amberBorder: '#e05c7a', focus: '#e05c7a' },
}

const DENSITY_FONT_SIZE: Record<Density, string> = {
  compact: '93.75%',   // ~15px base
  normal: '100%',      // 16px base
  spacious: '112.5%',  // 18px base
}

const SERIF_VAR: Record<SerifToggle, string> = {
  on: "var(--font-playfair), 'Georgia', serif",
  off: "var(--font-ui)",
}

export function applyPrefs(prefs: Prefs): void {
  const root = document.documentElement

  // Theme
  root.setAttribute('data-theme', prefs.theme)

  // Accent
  const accent = ACCENT_VARS[prefs.accent] ?? ACCENT_VARS.amber
  root.style.setProperty('--color-amber', accent.amber)
  root.style.setProperty('--color-amber-border', accent.amberBorder)
  root.style.setProperty('--color-focus', accent.focus)

  // Density
  root.style.setProperty('font-size', DENSITY_FONT_SIZE[prefs.density] ?? '100%')

  // Serif toggle
  root.style.setProperty('--font-serif', SERIF_VAR[prefs.serif] ?? SERIF_VAR.on)
}
