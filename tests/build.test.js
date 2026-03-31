import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build as viteBuild } from 'vite';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

describe('Production build', () => {
  beforeAll(async () => {
    await viteBuild({ configFile: resolve(root, 'vite.config.js') });
  });

  it('creates dist directory', () => {
    expect(existsSync(dist)).toBe(true);
  });

  it('outputs index.html', () => {
    expect(existsSync(resolve(dist, 'index.html'))).toBe(true);
  });

  it('outputs app.js', () => {
    expect(existsSync(resolve(dist, 'app.js'))).toBe(true);
  });

  it('outputs app.css', () => {
    expect(existsSync(resolve(dist, 'app.css'))).toBe(true);
  });

  it('includes module script tag in built HTML', () => {
    const html = readFileSync(resolve(dist, 'index.html'), 'utf-8');
    expect(html).toContain('<script');
    expect(html).toContain('app.js');
  });

  it('includes viewport meta tag in built HTML', () => {
    const html = readFileSync(resolve(dist, 'index.html'), 'utf-8');
    expect(html).toContain('viewport');
  });
});
