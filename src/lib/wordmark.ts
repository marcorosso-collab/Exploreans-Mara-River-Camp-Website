import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The master wordmark artwork as a plain SVG string, read from Wordmark.astro so islands
 * that need it (the Passport cover) use exactly the same paths and never a redrawing.
 */
export function wordmarkSvg(): string {
  const src = readFileSync(join(process.cwd(), 'src/components/Wordmark.astro'), 'utf8');
  const paths = src.match(/<path [^>]*\/>/g) ?? [];
  return `<svg viewBox="0.00 -0.01 746.96 154.24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true" focusable="false">${paths.join('')}</svg>`;
}
