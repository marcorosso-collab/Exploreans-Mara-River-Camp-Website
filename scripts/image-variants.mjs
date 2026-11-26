/**
 * Responsive variants for the processed photography in public/images/places/.
 * From each `name.webp` (up to 1920 px) it writes `name-640.webp` and `name-1280.webp`, plus
 * AVIF at every width (`name-640.avif`, `name-960.avif`, `name-1280.avif`, `name.avif`).
 * Existing files are kept, so it is safe to run again after adding photos:
 *   node scripts/image-variants.mjs
 * Img.astro serves whichever variants exist.
 */
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(process.cwd(), 'public/images/places');
const WIDTHS = [640, 960, 1280];
const VARIANT = /-(640|960|1280)\.webp$/;

const files = readdirSync(ROOT, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.webp') && !VARIANT.test(f));

let written = 0;
for (const rel of files) {
  const src = join(ROOT, rel);
  const base = src.replace(/\.webp$/, '');
  const { width } = await sharp(src).metadata();
  const jobs = [];
  for (const w of WIDTHS) {
    if (w >= width) continue;
    const webp = `${base}-${w}.webp`;
    if (w !== 960 && !existsSync(webp)) jobs.push(sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(webp));
    const avif = `${base}-${w}.avif`;
    if (!existsSync(avif)) jobs.push(sharp(src).resize({ width: w }).avif({ quality: 52, effort: 6 }).toFile(avif));
  }
  if (!existsSync(`${base}.avif`)) jobs.push(sharp(src).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`));
  written += jobs.length;
  await Promise.all(jobs);
}
console.log(`${files.length} photos checked, ${written} variants written`);
