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

// Raíz del sitio = misma página que Pagina de inicio.html (GitHub Pages /aguahomi/)
const inicioSrc = path.join(root, 'Pagina de inicio.html');
if (fs.existsSync(inicioSrc)) {
  fs.copyFileSync(inicioSrc, path.join(pub, 'index.html'));
}

for (const dir of ['imagenes', 'video', 'fuentes']) {
  const src = path.join(root, dir);
  const dest = path.join(pub, dir);
  if (fs.existsSync(src)) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Favicon junto a los HTML en la raíz del proyecto (file:// y mismas rutas que en dist)
const favSrc = path.join(pub, 'favicon.svg');
const favRoot = path.join(root, 'favicon.svg');
if (fs.existsSync(favSrc)) {
  fs.copyFileSync(favSrc, favRoot);
}
