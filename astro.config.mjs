import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://geraghty.co',
  // Case studies are MDX, so their bodies can use the case study components
  integrations: [mdx()],
  devToolbar: { enabled: false },
  // Dev server port comes from PORT when a launcher assigns one
  server: { port: Number(process.env.PORT) || 4321 },
});
