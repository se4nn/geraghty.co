import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown (or MDX) file per project. Front matter drives the homepage
// tile. A project with a caseStudy block gets a page built from its body,
// which is MDX so it can use the case study components.
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      dates: z.string(),
      // Newest first on the homepage
      order: z.number(),
      tile: z.object({
        image: image(),
        logo: image(),
        // Logo width as a share of the tile width, from the Figma frame
        logoScale: z.number(),
        grain: z.boolean().default(true),
        // Live LensFlare gradient over the image. The image stays as the
        // fallback. Colours are any CSS colour, usually a --gradient-* token.
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
      // Where the tile links to. Empty until the case study exists.
      // Projects with a caseStudy block live at /work/<file name>/.
      link: z.string().optional(),
      // Case study hero. Setting it builds /work/<id>/ from the body.
      caseStudy: z
        .object({
          // Meta description
          summary: z.string(),
          // Middle of the hero bar, between the tags and the dates
          role: z.string(),
          // Top right of the hero, e.g. App Store and Website
          links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
          // The project the Next Project tile shows (a file name in this
          // folder). Leave it out: the default is the next case study down
          // the homepage grid, which is the order Sean wants (8 Oct 2026).
          next: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { work };
