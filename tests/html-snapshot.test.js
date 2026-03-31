import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlSource = readFileSync(
  resolve(import.meta.dirname, '..', 'src', 'index.html'),
  'utf-8',
);

describe('HTML structure snapshot', () => {
  it('matches the expected index.html structure', () => {
    expect(htmlSource).toMatchSnapshot();
  });
});

describe('CSS class regression', () => {
  it('body contains expected Tailwind utility classes', () => {
    expect(htmlSource).toContain('h-screen');
    expect(htmlSource).toContain('bg-gray-50');
  });

  it('container div has expected layout classes', () => {
    expect(htmlSource).toContain('flex');
    expect(htmlSource).toContain('items-center');
    expect(htmlSource).toContain('justify-between');
    expect(htmlSource).toContain('px-8');
    expect(htmlSource).toContain('py-16');
    expect(htmlSource).toContain('mx-auto');
    expect(htmlSource).toContain('max-w-7xl');
  });

  it('h1 has expected typography classes', () => {
    expect(htmlSource).toContain('text-3xl');
    expect(htmlSource).toContain('font-extrabold');
    expect(htmlSource).toContain('tracking-tight');
    expect(htmlSource).toContain('text-gray-900');
  });
});
