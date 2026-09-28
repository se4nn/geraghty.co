import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project. Front matter drives the homepage tile,
// the body becomes the case study once those pages are rebuilt.
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
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
      link: z.string().optional(),
    }),
});

export const collections = { work };
