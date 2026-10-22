// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlSource = readFileSync(
  resolve(import.meta.dirname, '..', 'src', 'index.html'),
  'utf-8',
);

describe('Accessibility (axe-core)', () => {
  beforeEach(() => {
    const parsed = new DOMParser().parseFromString(htmlSource, 'text/html');
    document.replaceChild(
      document.adoptNode(parsed.documentElement),
      document.documentElement,
    );
  });

  // axe-core under jsdom exceeds the 5s default when the suite runs in parallel.
  it('has no critical accessibility violations', async () => {
    const results = await axe.run(document.documentElement, {
      rules: {
        region: { enabled: false }, // layout landmark not relevant for single-page
      },
    });

    // Only flag critical/serious issues
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (critical.length > 0) {
      const summary = critical
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');
      expect.fail(`Accessibility violations found:\n${summary}`);
    }
  }, 30_000);

  it('has a charset meta tag', () => {
    const charset = document.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
  });

  it('has a viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  it('has exactly one h1 element', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
  });
});
