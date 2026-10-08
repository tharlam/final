import { defineCollection, z } from 'astro:content';

// 1. Define the schema for the 'news' collection
const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string().optional(),
  }),
});

// 2. 🎯 CRITICAL FIX: Export the collections object
export const collections = {
  'news': newsCollection,
};