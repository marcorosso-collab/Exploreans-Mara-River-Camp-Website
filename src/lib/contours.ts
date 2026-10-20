/**
 * The map line: contour lines from an explorer's map (Brand Bible ch. 03).
 * Generated once at build time as real isolines of a smooth terrain, so the
 * lines can be drawn on scroll and lit by the cursor without shipping any JS
 * to compute them in the browser.
 */
import { contours } from 'd3-contour';
import { line, curveBasisClosed } from 'd3-shape';
import { createNoise2D } from 'simplex-noise';

export interface ContourOptions {
  seed?: number;
  width?: number;
  height?: number;
  levels?: number;
  scale?: number;
}

export interface ContourMap {
  width: number;
  height: number;
  paths: string[];
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map<string, ContourMap>();

export function contourMap({
  seed = 7,
  width = 1600,
  height = 1000,
  levels = 18,
  scale = 1,
}: ContourOptions = {}): ContourMap {
  const key = `${seed}:${width}:${height}:${levels}:${scale}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const noise = createNoise2D(mulberry32(seed));
  const cell = 12;
  // The grid overhangs the visible area so ring segments that trace the grid border stay off-canvas
  const pad = 4;
  const nx = Math.ceil(width / cell) + 1 + pad * 2;
  const ny = Math.ceil(height / cell) + 1 + pad * 2;
  const values = new Float64Array(nx * ny);

  // Two octaves of smooth noise plus a gentle ridge give hills, saddles and valleys
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const x = (i / nx) * 2.4 * scale;
      const y = (j / ny) * 1.5 * scale;
      const v =
        noise(x, y) * 1 +
        noise(x * 2.1 + 11.3, y * 2.1 - 4.7) * 0.38 +
        noise(x * 4.3 - 2.1, y * 4.3 + 8.9) * 0.08;
      values[j * nx + i] = v;
    }
  }

  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const thresholds = Array.from({ length: levels }, (_, k) => min + ((k + 0.5) / levels) * (max - min));

  const smooth = line<[number, number]>()
    .x((p) => p[0])
    .y((p) => p[1])
    .curve(curveBasisClosed)
    .digits(0);

  const paths: string[] = [];
  for (const geometry of contours().size([nx, ny]).thresholds(thresholds)(Array.from(values))) {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) {
        if (ring.length < 10) continue;
        const pts: [number, number][] = [];
        for (let k = 0; k < ring.length - 1; k += 2) {
          const [x, y] = ring[k];
          pts.push([(x - pad) * cell, (y - pad) * cell]);
        }
        const d = smooth(pts);
        if (d) paths.push(d);
      }
    }
  }

  const result = { width, height, paths };
  cache.set(key, result);
  return result;
}
