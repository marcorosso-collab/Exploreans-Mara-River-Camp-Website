import type { APIRoute } from 'astro';
import { experiences, rooms, stories } from '../lib/data';

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const pages = ['/', '/stay/', '/experiences/', '/passport/', '/stories/', '/plan-your-stay/'];
  const urls = [
    ...pages.map((p) => ({ loc: p })),
    ...(await rooms()).map((r) => ({ loc: `/stay/${r.id}/` })),
    ...(await experiences()).map((e) => ({ loc: `/experiences/${e.id}/` })),
    // Stories first published on exploreans.com point there and stay out of this sitemap
    ...(await stories())
      .filter((s) => !s.data.canonical)
      .map((s) => ({ loc: `/stories/${s.id}/`, lastmod: s.data.date.toISOString().slice(0, 10) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
