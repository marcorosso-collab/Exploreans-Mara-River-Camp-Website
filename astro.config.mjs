import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mara.exploreans.com',
  trailingSlash: 'always',
  integrations: [react()],
  build: {
    assets: 'assets',
    format: 'directory',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: { enabled: false },
  vite: {
    // Pre-bundled for the dev server so islands hydrate on first load
    optimizeDeps: { include: ['three', 'motion/react', 'react', 'react-dom/client'] },
  },
});
