import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { routes } from './routes.mjs';

export function prepareStatic({ directory = 'dist', siteUrl } = {}) {
  const root = resolve(directory);
  const site = new URL(`${(siteUrl || process.env.SITE_URL || 'https://aceg-comunicaciones-nueva-web.golditem8.chatgpt.site').replace(/\/+$/, '')}/`);
  if (!['https:', 'http:'].includes(site.protocol)) throw new Error('SITE_URL must use HTTP or HTTPS.');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const template = readFileSync(join(root, 'index.html'), 'utf8')
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escape(new URL('assets/operacion.webp', site).href)}" />`);
  const page = path => template.replace('</head>', `    <link rel="canonical" href="${escape(new URL(path.slice(1), site).href)}" />\n    <meta property="og:url" content="${escape(new URL(path.slice(1), site).href)}" />\n  </head>`);
  // Each route gets an entry point so Pages can serve deep links without SPA rewrites.
  for (const path of routes) {
    const target = join(root, path.slice(1));
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, 'index.html'), page(path));
  }
  writeFileSync(join(root, '404.html'), template);
  writeFileSync(join(root, '.nojekyll'), '');
  writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site).href}\n`);
  writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(path => `  <url><loc>${escape(new URL(path.slice(1), site).href)}</loc></url>`).join('\n')}\n</urlset>\n`);
  console.log(`Prepared ${routes.length} static routes for ${site.href}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) prepareStatic();
