'use client'

import { useEffect, useRef, useState } from 'react'
import { loadPrefs, savePrefs, applyPrefs } from '@/lib/preferences'
import type { Prefs, AccentColor, Density, SerifToggle, EggToggle } from '@/lib/preferences'

export default function TweaksPanel() {
  const [open, setOpen] = useState(false)
  // null = SSR / not yet mounted
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Runs only on client after hydration — safe to read localStorage
    const loaded = loadPrefs()
    applyPrefs(loaded)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(loaded)
  }, [])

  // Move focus into panel when opened; restore to trigger when closed
  useEffect(() => {
    if (open && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    } else if (!open && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [open])

  // Focus trap + Escape handler
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!prefs) return null

  function update<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    const next = { ...prefs!, [key]: value }
    setPrefs(next)
    savePrefs(next)
    applyPrefs(next)
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="tweaks-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="tweaks-panel"
        aria-label="Open display settings"
        title="Display settings"
      >
        <SliderIcon />
      </button>

      {open && (
        <div
          ref={panelRef}
          id="tweaks-panel"
          className="tweaks-panel"
          role="dialog"
          aria-label="Display settings"
          aria-modal="false"
        >
          <div className="tweaks-panel__header">
            <span className="tweaks-panel__title">Display</span>
            <button
              className="tweaks-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close display settings"
            >
              ✕
            </button>
          </div>

          <fieldset className="tweaks-fieldset">
            <legend>Accent colour</legend>
            <div className="tweaks-row">
              {(['amber', 'cyan', 'rose'] as AccentColor[]).map((a) => (
                <button
                  key={a}
                  className={`tweaks-swatch tweaks-swatch--${a}${prefs.accent === a ? ' is-active' : ''}`}
                  onClick={() => update('accent', a)}
                  aria-pressed={prefs.accent === a}
                  aria-label={`Accent: ${a}`}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="tweaks-fieldset">
            <legend>Density</legend>
            <div className="tweaks-row">
              {(['compact', 'normal', 'spacious'] as Density[]).map((d) => (
                <button
                  key={d}
                  className={`tweaks-btn${prefs.density === d ? ' is-active' : ''}`}
                  onClick={() => update('density', d)}
                  aria-pressed={prefs.density === d}
                >
                  {d}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="tweaks-fieldset">
            <legend>Serif headings</legend>
            <div className="tweaks-row">
              {(['on', 'off'] as SerifToggle[]).map((s) => (
                <button
                  key={s}
                  className={`tweaks-btn${prefs.serif === s ? ' is-active' : ''}`}
                  onClick={() => update('serif', s)}
                  aria-pressed={prefs.serif === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="tweaks-fieldset">
            <legend>Easter egg</legend>
            <div className="tweaks-row">
              {(['on', 'off'] as EggToggle[]).map((e) => (
                <button
                  key={e}
                  className={`tweaks-btn${prefs.egg === e ? ' is-active' : ''}`}
                  onClick={() => update('egg', e)}
                  aria-pressed={prefs.egg === e}
                >
                  {e}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </>
  )
}

function SliderIcon() {
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
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
