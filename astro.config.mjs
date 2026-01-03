import { defineConfig } from 'astro/config';
import { z } from 'zod';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    // 🌐 DEPLOYMENT CONFIGURATION
    site: 'https://tharlam.github.io/final/',
    base: '/final/', 

    // 1. Integrations:
    integrations: [
        react(),
        sitemap(),
    ],

    // 🚀 DEVELOPMENT CONFIGURATION 
    server: {
        // This ensures the local dev server uses the same base path
        base: '/final/',
    },

    // ⚙️ CACHE BUSTING & OPTIMIZATION
    vite: {
        server: {
            watch: {
                // Use polling if changes aren't reflecting in some environments
                usePolling: true,
            },
        },
        optimizeDeps: {
            // Forces Vite to re-bundle dependencies on every start
            force: true,
        },
        build: {
            // Ensures CSS/JS assets get fresh hashes
            cssCodeSplit: true,
            assetsInlineLimit: 0,
        }
    },

    // 2. Collections:
    collections: {
        'news': {
            schema: z.object({
                title: z.string(),
                pubDate: z.date(),
                description: z.string(),
            }),
        },
    },
});