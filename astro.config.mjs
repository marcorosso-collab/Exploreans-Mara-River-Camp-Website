import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mara.exploreans.com',
  trailingSlash: 'always',
  integrations: [react()],
  // No code blocks on this site; Shiki's inline styles would also clash with the CSP below
  markdown: { syntaxHighlight: false },
  build: {
    assets: 'assets',
    format: 'directory',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
  // Content Security Policy as a <meta> tag on every page (build and preview only, not dev).
  // Scripts may come from this site, from inline scripts Astro hashed at build time, and from
  // Google's tag host (Google Analytics, loaded only after consent). 'strict-dynamic' is not
  // used: it would also block Astro's own bundled <script type="module" src> files.
  // Inline style attributes (style="--i:1") need 'unsafe-inline' for styles.
  // frame-ancestors, object-src and base-uri cannot go in a <meta>, so netlify.toml sends them.
  security: {
    csp: {
      algorithm: 'SHA-384',
      scriptDirective: { resources: ["'self'", 'https://www.googletagmanager.com'] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  vite: {
    // Pre-bundled for the dev server so islands hydrate on first load
    optimizeDeps: { include: ['three', 'motion/react', 'react', 'react-dom/client'] },
  },
});
