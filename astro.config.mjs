import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://geraghty.co',
  devToolbar: { enabled: false },
  // Dev server port comes from PORT when a launcher assigns one
  server: { port: Number(process.env.PORT) || 4321 },
});
