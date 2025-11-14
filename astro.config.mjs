import { defineConfig } from 'astro/config';
import { z } from 'zod';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap'; 

export default defineConfig({
	
	// 🌐 DEPLOYMENT CONFIGURATION
	site: 'https://tharlam.github.io', 
	base: '/final/', // This is for the production build (npm run build)

	// 1. Integrations:
	integrations: [
        react(),
        sitemap(), // Sitemap is now enabled
    ],

	// ------------------------------------------------------------------
	// 🚀 DEVELOPMENT CONFIGURATION 
	// ------------------------------------------------------------------
	dev: {
		// This tells 'npm run dev' to use '/final/' as the base path for routing.
		base: '/final/', 
	},
	// ------------------------------------------------------------------

	// 2. Collections: (Fixed schema for 'news' collection)
	collections: {
		'news': {
			schema: z.object({
                // Placeholder schema for news collection
                title: z.string(), 
                pubDate: z.date(), 
                description: z.string(), 
			}),
		},
	},
});