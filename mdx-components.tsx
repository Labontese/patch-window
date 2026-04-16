import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with anchor IDs for TOC and deep linking
    h2: ({ children, id, ...props }) => (
      <h2 id={id} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, id, ...props }) => (
      <h3 id={id} {...props}>
        {children}
      </h3>
    ),
    // Inline code — monospace, not serif
    code: ({ children, ...props }) => (
      <code {...props}>{children}</code>
    ),
    // Code blocks: keyboard-accessible scrollable region (SC 2.1.1).
    // rehype-pretty-code genererar <pre> med overflow-x: auto när rader är
    // för långa — utan tabindex kan tangentbordsanvändare inte scrolla dem.
    // Utan role/aria-label eftersom flera kodblock per artikel skulle skapa
    // duplikatlandmarks (SC 1.3.1/axe landmark-unique).
    pre: ({ children, ...props }) => (
      <pre tabIndex={0} {...props}>
        {children}
      </pre>
    ),
    // Smart links: external get rel="noopener noreferrer"
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith('http')
      if (isExternal) {
        return (
          <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
            {children}
          </a>
        )
      }
      return (
        <Link href={href ?? '#'} {...props}>
          {children}
        </Link>
      )
    },
    // Images require alt text (SC 1.1.1) — TypeScript enforces it via next/image
    img: ({ src, alt, width, height, ...props }) => {
      if (!alt && alt !== '') {
        throw new Error(`Image is missing alt text: ${src}. Add alt="" for decorative images.`)
      }
      return (
        <figure>
          <Image
            src={src ?? ''}
            alt={alt}
            width={typeof width === 'number' ? width : 800}
            height={typeof height === 'number' ? height : 450}
            style={{ maxWidth: '100%', height: 'auto' }}
            {...props}
          />
        </figure>
      )
    },
    // Responsive table wrapper
    table: ({ children, ...props }) => (
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table {...props}>{children}</table>
      </div>
    ),
    ...components,
  }
}
