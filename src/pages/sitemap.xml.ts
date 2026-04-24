import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://mara.exploreans.com';
  
  // Get all dynamic content
  const accommodations = await getCollection('accommodation');
  const experiences = await getCollection('experiences');
  const journal = await getCollection('journal', ({ data }) => !data.draft);
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  ];
  
  // Build sitemap entries
  const entries = [
    // Static pages
    ...staticPages.map(page => `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
    `),
    
    // Accommodation pages
    ...accommodations.map(item => `
    <url>
      <loc>${siteUrl}/accommodation/${item.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    `),
    
    // Experience pages
    ...experiences.map(item => `
    <url>
      <loc>${siteUrl}/experiences/${item.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    `),
    
    // Journal pages
    ...journal.map(item => `
    <url>
      <loc>${siteUrl}/journal/${item.slug}</loc>
      <lastmod>${item.data.date.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    `),
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
