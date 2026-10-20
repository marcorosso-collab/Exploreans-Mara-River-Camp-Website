import type { APIRoute, GetStaticPaths } from 'astro';
import { contourMap } from '../../lib/contours';

// Each variant is a different stretch of terrain so neighbouring sections never repeat
const VARIANTS = { a: 7, b: 23, c: 41 } as const;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(VARIANTS).map((variant) => ({ params: { variant } }));

export const GET: APIRoute = ({ params }) => {
  const seed = VARIANTS[params.variant as keyof typeof VARIANTS];
  const { width, height, paths } = contourMap({ seed });
  // White strokes: the map is used as a CSS mask and takes its colour from the ground
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths
    .map((d) => `<path d="${d}"/>`)
    .join('')}</g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
