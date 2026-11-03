import { writeFileSync } from 'node:fs';
import { routes as paths } from './routes.mjs';
const origin = 'https://aceg-comunicaciones-nueva-web.golditem8.chatgpt.site';
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
