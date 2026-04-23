/**
 * Copia HTML y carpetas de la raíz del proyecto a public/ antes del build,
 * para que Astro los incluya en dist (Vercel y GitHub Pages).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

const files = [
  'Pagina de inicio.html',
  'nosotros.html',
  'contacto.html',
  'compra.html',
  'compra-ok.html',
];

for (const name of files) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(pub, name));
  }
}

for (const dir of ['imagenes', 'video', 'fuentes']) {
  const src = path.join(root, dir);
  const dest = path.join(pub, dir);
  if (fs.existsSync(src)) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(src, dest, { recursive: true });
  }
}
