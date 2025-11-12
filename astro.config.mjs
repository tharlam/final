// astro.config.mjs

import { defineConfig } from 'astro/config';
import { z } from 'zod';
import react from '@astrojs/react';
// ⬇️ ADDED FOR SMOOTH NAVIGATION
import { viewTransitions } from 'astro:transitions'; 

export default defineConfig({

    // ----------------------------------------------------
    // 🚀 GITHUB PAGES DEPLOYMENT CONFIGURATION (FINAL FIX)
    // ----------------------------------------------------

    // 1. Set the root domain for your GitHub Pages site.
    site: 'https://tharlam.github.io',

    // 2. CRITICAL FIX: Sets the base path to your repository name ('final').
    // This ensures all CSS/JS/Image links are fixed on the live site.
    base: '/final',

    // ----------------------------------------------------

    // 1. Integrations: Must include React for your JSX/TSX files to render.
    integrations: [
        react(),
        // ⬇️ ADDED FOR SMOOTH NAVIGATION
        viewTransitions(), 
    ],

    // 2. Collections: Re-adds the 'news' collection definition with the schema.
    collections: {
        'news': {
            schema: z.object({
                title: z.string(),
                author: z.string().default('Tharlam Academy Staff'),
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