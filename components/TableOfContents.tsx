import styles from './TableOfContents.module.css'

export interface TocEntry {
  id: string
  label: string
  level?: number
}

interface Props {
  entries: TocEntry[]
}

export default function TableOfContents({ entries }: Props) {
  return (
    <nav aria-label="Table of contents" className={styles.toc}>
      <p className={styles.heading}>On this page</p>
      <ol className={styles.list}>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={styles.item}
            data-level={entry.level ?? 2}
          >
            <a href={`#${entry.id}`} className={styles.link}>
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
