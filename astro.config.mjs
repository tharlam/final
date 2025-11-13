// astro.config.mjs

import { defineConfig } from 'astro/config';
import { z } from 'zod';
import react from '@astrojs/react';

export default defineConfig({

  // ----------------------------------------------------
  // 🏠 LOCAL DEVELOPMENT CONFIGURATION
  // ----------------------------------------------------

  // Deployment settings (site and base) are removed/ignored 
  // because you are no longer deploying to GitHub Pages.
  // Astro defaults to a local base path of '/'

  // ----------------------------------------------------

  // 1. Integrations: Must include React for your JSX/TSX files to render.
  integrations: [react()],

  // 2. Collections: Re-adds the 'news' collection definition with the schema.
  collections: {
    // This schema validates the frontmatter in first-post.md
    'news': {
      schema: z.object({
        title: z.string(),
        author: z.string().default('Tharlam Academy Staff'),
        // Ensure the date is correctly recognized
        publishDate: z.date(),
        description: z.string().max(160),
        image: z.string().optional(),
      }),
    },
  },

  // vite section
  vite: {
    // Any specific Vite configurations go here.
  },
});