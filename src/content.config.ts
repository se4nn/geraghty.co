import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per project: front matter drives the homepage tile, and a
// caseStudy block builds /work/<id>/ from its MDX body.
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      dates: z.string(),
      // Newest first on the homepage
      order: z.number(),
      // false: off the homepage grid; its case study, chips and Next Project
      // tile still work
      inGrid: z.boolean().default(true),
      tile: z.object({
        image: image(),
        logo: image(),
        // Logo width as a share of the tile width, from the Figma frame
        logoScale: z.number(),
        grain: z.boolean().default(true),
        // Live LensFlare over the image, which stays as the fallback. Colours
        // are usually --gradient-* tokens
        gradient: z
          .object({
            from: z.string(),
            to: z.string(),
            seed: z.number().default(0),
            // Only where a tile was designed lighter than the default
            darkness: z.number().optional(),
            // Pin the colour fringe to the side it falls in the artwork
            fringe: z.enum(['auto', 'warm', 'cool']).default('auto'),
            // Surface texture, see LensFlare
            dither: z.enum(['grain', 'crt']).default('grain'),
          })
          .optional(),
      }),
      // Where the tile links: /work/<id>/ once there's a case study
      link: z.string().optional(),
      // The case study hero; setting it builds the page
      caseStudy: z
        .object({
          // Meta description
          summary: z.string(),
          // Middle of the hero bar
          role: z.string(),
          // Top right of the hero, e.g. App Store and Website
          links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
          // The Next Project tile's project (a file name). Usually left out:
          // the default, the next case study down the homepage grid, is right
          next: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { work };
