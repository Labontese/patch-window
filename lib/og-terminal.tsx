/**
 * Shared terminal-frame OG-image template.
 *
 * Reproduces the macOS terminal aesthetic from Daniel-approved Bild 2:
 * - traffic-light dots (red/yellow/green)
 * - centered `patchwindow ~ %` header in muted mono
 * - command line with format-specific verb
 * - white serif title as "command output"
 * - amber UPPERCASE format-tag with vertical accent line bottom-right
 *
 * Used by all per-article OG routes (brief, deep-dive, hot-take, pathway, tag)
 * to keep the visual contract identical and the diff between formats
 * limited to the command verb + tag label.
 *
 * ImageResponse stodjer flexbox + en delmangd av CSS. display: grid stods inte.
 */

import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

/**
 * Truncates a slug for display in the command line. Long slugs blow out the
 * terminal width. We keep it readable by cutting at first hyphen past
 * MAX_SLUG_CHARS, falling back to character truncation.
 */
const MAX_SLUG_CHARS = 25
function truncateSlug(slug: string): string {
  if (slug.length <= MAX_SLUG_CHARS) return slug
  // Try to cut on a hyphen past the limit so it reads as a partial word
  const tail = slug.slice(MAX_SLUG_CHARS)
  const hyphen = tail.indexOf('-')
  if (hyphen >= 0 && hyphen < 8) {
    return slug.slice(0, MAX_SLUG_CHARS + hyphen) + '…'
  }
  return slug.slice(0, MAX_SLUG_CHARS) + '…'
}

/**
 * Truncates the title to fit max ~3 lines of large serif. ImageResponse
 * doesn't support line-clamp, so we cap character count instead.
 */
const MAX_TITLE_CHARS = 110
function truncateTitle(title: string): string {
  if (title.length <= MAX_TITLE_CHARS) return title
  return title.slice(0, MAX_TITLE_CHARS - 1).trimEnd() + '…'
}

type TerminalOgProps = {
  /** UPPERCASE label shown in amber bottom-right (BRIEF, DEEP-DIVE, HOT-TAKE, PATHWAY, TAG) */
  formatLabel: string
  /** Full command line shown after `$ ` prompt, e.g. `cat <slug>.brief` */
  command: string
  /** Title rendered as command output */
  title: string
}

export function renderTerminalOg({ formatLabel, command, title }: TerminalOgProps) {
  const safeTitle = truncateTitle(title)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a1628',
          padding: '48px 56px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#0f1d33',
            borderRadius: '14px',
            border: '1px solid #1f3352',
            overflow: 'hidden',
          }}
        >
          {/* Header bar with traffic lights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              background: '#13243f',
              borderBottom: '1px solid #1f3352',
              position: 'relative',
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#ff5f57',
                }}
              />
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#ffbd2e',
                }}
              />
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#28c840',
                }}
              />
            </div>

            {/* Centered terminal title — absolutely positioned to truly center */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Courier New, monospace',
                fontSize: 18,
                color: '#7a8aa3',
                letterSpacing: '0.02em',
              }}
            >
              patchwindow ~ %
            </div>
          </div>

          {/* Terminal body */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 48px',
              gap: '28px',
            }}
          >
            {/* Command line */}
            <div
              style={{
                display: 'flex',
                fontFamily: 'Courier New, monospace',
                fontSize: 26,
                color: '#e6edf5',
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ color: '#28c840', marginRight: '14px' }}>$</span>
              <span>{command}</span>
            </div>

            {/* Title as command output */}
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 60,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                maxWidth: '100%',
              }}
            >
              {safeTitle}
            </div>

            {/* Spacer pushes format-tag to bottom */}
            <div style={{ flex: 1 }} />

            {/* Format tag bottom-right with vertical accent */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#d4a017',
                  letterSpacing: '0.08em',
                }}
              >
                {formatLabel}
              </span>
              <span
                style={{
                  display: 'flex',
                  width: '4px',
                  height: '32px',
                  background: '#d4a017',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}

export { truncateSlug }
