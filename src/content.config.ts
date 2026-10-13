import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      dates: z.string(),
      order: z.number(),
      inGrid: z.boolean().default(true),
      tile: z.object({
        image: image(),
        logo: image(),
        logoScale: z.number(),
        grain: z.boolean().default(true),
        gradient: z
          .object({
            from: z.string(),
            to: z.string(),
            seed: z.number().default(0),
            darkness: z.number().optional(),
            fringe: z.enum(['auto', 'warm', 'cool']).default('auto'),
            dither: z.enum(['grain', 'crt']).default('grain'),
          })
          .optional(),
      }),
      link: z.string().optional(),
      caseStudy: z
        .object({
          summary: z.string(),
          role: z.string(),
          links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
          next: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { work };
