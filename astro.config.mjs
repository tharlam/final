// astro.config.mjs

import { defineConfig } from 'astro/config';
import { z } from 'zod';
import react from '@astrojs/react';

export default defineConfig({
  
  // 🌐 DEPLOYMENT CONFIGURATION
  site: 'https://tharlam.github.io', 
  base: '/final/', // This is for the production build (npm run build)

  // 1. Integrations:
  integrations: [react()],

  // ------------------------------------------------------------------
  // 🚀 NEW: DEVELOPMENT CONFIGURATION (Fixes your localhost issue)
  // ------------------------------------------------------------------
  dev: {
    // This tells 'npm run dev' to use '/final/' as the base path for routing.
    base: '/final/', 
  },
  // ------------------------------------------------------------------

  // 2. Collections: (rest of your config...)
  collections: {
    'news': {
      schema: z.object({
        // ...
      }),
    },
  },
  vite: { /* ... */ },
});