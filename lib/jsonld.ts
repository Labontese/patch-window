/**
 * Safely serialize structured data for inline <script type="application/ld+json">.
 *
 * Escapes characters that could break out of the <script> context:
 *   - `<` becomes `\u003c` (prevents closing </script> tag injection)
 *   - `>` becomes `\u003e` (defense in depth)
 *   - `&` becomes `\u0026` (prevents HTML entity interference)
 *   - U+2028 and U+2029 become their Unicode escapes (JSON allows them raw,
 *     but older browsers treat them as line terminators in script context)
 *
 * Reference: SECURITY-REVIEW 2026-04-16, HIGH #3.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
