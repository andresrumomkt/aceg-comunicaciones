import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareStatic } from './prepare-static.mjs';
import { routes } from './routes.mjs';

for (const siteUrl of ['https://example.github.io/aceg/', 'https://aceg.example/']) {
  test(`static deep links and metadata for ${siteUrl}`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'aceg-static-'));
    try {
      writeFileSync(join(directory, 'index.html'), '<head><meta property="og:image" content="old" /></head><div id="root"></div>');
      prepareStatic({ directory, siteUrl });
      for (const route of routes) {
        const html = readFileSync(join(directory, route.slice(1), 'index.html'), 'utf8');
        assert.ok(html.includes(`href="${new URL(route.slice(1), siteUrl).href}"`));
        assert.ok(html.includes(`${siteUrl}assets/operacion.webp`));
        assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
      }
      assert.ok(readFileSync(join(directory, 'robots.txt'), 'utf8').includes(`${siteUrl}sitemap.xml`));
      assert.equal((readFileSync(join(directory, 'sitemap.xml'), 'utf8').match(/<loc>/g) || []).length, routes.length);
      assert.ok(readFileSync(join(directory, '404.html'), 'utf8').includes('id="root"'));
      assert.equal(readFileSync(join(directory, '.nojekyll'), 'utf8'), '');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
