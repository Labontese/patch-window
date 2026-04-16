import type { Format } from '@/lib/types'

const LABELS: Record<Format, string> = {
  'hot-take': 'HOT TAKE',
  'deep-dive': 'DEEP DIVE',
  'brief': 'BRIEF',
}

interface Props {
  format: Format
}

export default function FormatTag({ format }: Props) {
  const modifierClass = `format-tag--${format}`
  return (
    <span className={`format-tag ${modifierClass}`}>
      {LABELS[format]}
    </span>
  )
}
