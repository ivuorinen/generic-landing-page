/**
 * @vitest-environment jsdom
 */
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
    // Extract and set the lang attribute from the source HTML
    const langMatch = htmlSource.match(/<html[^>]*\slang="([^"]*)"/);
    if (langMatch) {
      document.documentElement.setAttribute('lang', langMatch[1]);
    }
    // Set the inner content (head + body)
    const bodyMatch = htmlSource.match(/<html[^>]*>([\s\S]*)<\/html>/i);
    if (bodyMatch) {
      document.documentElement.innerHTML = bodyMatch[1];
    }
  });

  it('has no critical accessibility violations', async () => {
    const results = await axe.run(document.documentElement, {
      rules: {
        // Only flag critical/serious issues
        region: { enabled: false }, // layout landmark not relevant for single-page
      },
    });

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (critical.length > 0) {
      const summary = critical
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');
      expect.fail(`Accessibility violations found:\n${summary}`);
    }
  });

  it('has a valid lang attribute on html element', () => {
    const lang = document.documentElement.getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang.length).toBeGreaterThanOrEqual(2);
  });

  it('has a charset meta tag', () => {
    const charset = document.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
  });

  it('has a viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  it('has a title element', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent.trim().length).toBeGreaterThan(0);
  });

  it('has exactly one h1 element', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
  });

  it('has no images without alt attributes', () => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });
});
