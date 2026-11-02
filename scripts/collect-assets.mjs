import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('public/assets', { recursive: true });
const assets = {
  'motorola.webp': 'https://acegcomunicaciones.com.ar/media/assets/assets/3617536694-1656435949/logo-motorola-213x40-q85.webp',
  'r7.webp': 'https://acegcomunicaciones.com.ar/media/pages/catalogo/catalogo-de-productos/mototrbo-r-7/18adc8f73a-1654719612/vx-21002200-2-500x.webp',
  'r2.webp': 'https://acegcomunicaciones.com.ar/media/pages/catalogo/catalogo-de-productos/mototrbo-r2/3feac5450f-1705082968/mototrbo-r2-img-500x.webp',
  'industria.jpg': 'https://www.motorolasolutions.com/content/dam/msi/images/2023-elgin-manufacturing-r2.jpeg',
  'seguridad.jpg': 'https://www.motorolasolutions.com/content/dam/msi/docs/products/body-worn-cameras/v500/police-v500-2.jpg',
  'logistica.jpg': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
  'energia.jpg': 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=85',
  'mineria.jpg': 'https://www.motorolasolutions.com/content/dam/msi/images/mining/Section_2_Background_Image.png',
  'laboratorio.jpg': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1100&q=85',
};
for (const [local, file, matcher] of [
  ['slr.webp', '/private/tmp/aceg-slr.html', '/mototrbo-slr-5100/'],
  ['movil.webp', '/private/tmp/aceg-mobile.html', '/dgm-8000-5000-mototrbo/'],
]) {
  const html = readFileSync(file, 'utf8');
  const urls = [...html.matchAll(/src="([^"]+\.webp)"/g)].map(m => m[1]);
  const url = urls.find(u => u.includes(matcher) && !u.includes('1200x630'));
  if (url) assets[local] = url;
}
for (const [name, url] of Object.entries(assets)) {
  try {
    execFileSync('curl', ['-L', '-s', '--fail', '--max-time', '25', url, '-o', `public/assets/${name}`]);
    console.log(`OK ${name}`);
  } catch { console.error(`FAILED ${name}`); process.exitCode = 1; }
}
writeFileSync('public/assets/sources.json', JSON.stringify(assets, null, 2));
