import { existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');

/**
 * Processed photography ships as `name.webp` (up to 1920 wide) plus `name-960.webp`.
 * Images uploaded through the CMS have no small variant and are served as they are.
 */
export function srcsetFor(src: string): string | undefined {
  if (!src.startsWith('/') || !src.endsWith('.webp')) return undefined;
  const small = src.replace(/\.webp$/, '-960.webp');
  if (!existsSync(join(PUBLIC_DIR, small))) return undefined;
  const size = dimensionsOf(src);
  return `${small} 960w, ${src} ${size?.width ?? 1920}w`;
}

const dimsCache = new Map<string, { width: number; height: number } | null>();

/** Reads intrinsic dimensions from a WebP, PNG or JPEG in /public so images reserve their space. */
export function dimensionsOf(src: string): { width: number; height: number } | null {
  if (dimsCache.has(src)) return dimsCache.get(src)!;
  let result: { width: number; height: number } | null = null;
  const file = join(PUBLIC_DIR, decodeURI(src));
  if (src.startsWith('/') && existsSync(file)) {
    const fd = openSync(file, 'r');
    const buf = Buffer.alloc(64 * 1024);
    const n = readSync(fd, buf, 0, buf.length, 0);
    closeSync(fd);
    result = parse(buf.subarray(0, n));
  }
  dimsCache.set(src, result);
  return result;
}

function parse(b: Buffer): { width: number; height: number } | null {
  // WebP
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}
