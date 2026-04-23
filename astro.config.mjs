// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Vercel: https://aguahomi-zws7.vercel.app/  (raíz, sin base)
// GitHub Pages: https://noelventura.github.io/aguahomi/  (DEPLOY_TARGET=github en CI)
const isGithubPages = process.env.DEPLOY_TARGET === 'github';

// https://astro.build/config
export default defineConfig({
  site: isGithubPages
    ? 'https://noelventura.github.io'
    : 'https://aguahomi-zws7.vercel.app',
  ...(isGithubPages ? { base: '/aguahomi/' } : {}),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
