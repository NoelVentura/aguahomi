// @ts-check
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Vercel a veces ejecuta solo `astro build` (sin `npm run build`), así que el prebuild no corre.
const syncScript = path.join(__dirname, 'scripts', 'sync-static-to-public.mjs');
const syncResult = spawnSync(process.execPath, [syncScript], {
  cwd: __dirname,
  stdio: 'inherit',
});
if (syncResult.status !== 0) {
  throw new Error(`sync-static-to-public failed (exit ${syncResult.status})`);
}

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
