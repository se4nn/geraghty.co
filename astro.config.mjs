import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://geraghty.co',
  integrations: [mdx()],
  devToolbar: { enabled: false },
  server: { port: Number(process.env.PORT) || 4321 },
});
