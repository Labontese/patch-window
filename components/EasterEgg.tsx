'use client'

import { useEffect, useRef, useState } from 'react'
import { loadPrefs } from '@/lib/preferences'

const TARGET = 'patch'

export default function EasterEgg() {
  const bufferRef = useRef<string>('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in a form field
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.target as HTMLElement).isContentEditable) return

      // Check preference
      const prefs = loadPrefs()
      if (prefs.egg !== 'on') return

      // Only handle printable single characters
      if (e.key.length !== 1) {
        bufferRef.current = ''
        return
      }

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-TARGET.length)

      if (bufferRef.current === TARGET) {
        bufferRef.current = ''
        setVisible(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setVisible(false), 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      className={`easter-egg${visible ? ' easter-egg--visible' : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {visible && (
        <span>
          <span aria-hidden="true">{'> '}</span>patch applied ✓
        </span>
      )}
    </div>
  )
}
