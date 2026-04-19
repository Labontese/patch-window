'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function resolveInitialTheme(): Theme {
  // Only runs on client — safe to access localStorage and matchMedia
  if (typeof window === 'undefined') return 'dark'
  try {
    const prefs = JSON.parse(localStorage.getItem('pw-prefs') || '{}')
    if (prefs.theme === 'light' || prefs.theme === 'dark') return prefs.theme as Theme
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    const prefs = JSON.parse(localStorage.getItem('pw-prefs') || '{}')
    prefs.theme = theme
    localStorage.setItem('pw-prefs', JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export default function ThemeToggle() {
  // null = not yet mounted (SSR), string = mounted on client
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    // Read from localStorage after hydration — lazy initializer can't access window safely
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolveInitialTheme())
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  // Hidden placeholder during SSR / before hydration to avoid layout shift
  if (theme === null) {
    return (
      <button
        className="theme-toggle"
        aria-label="Toggle theme"
        aria-pressed={false}
        style={{ visibility: 'hidden' }}
        disabled
      >
        <SunIcon />
      </button>
    )
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'light'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
