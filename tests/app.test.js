import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync(
  resolve(import.meta.dirname, '..', 'src', 'index.html'),
  'utf-8',
);

/**
 * Loads the real page with its inline script running, as a browser would at `url`.
 * @param {string} url Address the page is served from; sets `location.hostname`.
 * @returns {{heading: string, title: string}} Text the script left in the h1 and title.
 */
function load(url) {
  const { document } = new JSDOM(html, { url, runScripts: 'dangerously' }).window;
  return { heading: document.querySelector('h1').textContent, title: document.title };
}

describe('index.html script', () => {
  it('shows the hostname as heading and title', () => {
    expect(load('https://example.com/')).toEqual({ heading: 'example.com', title: 'example.com' });
  });

  it('keeps the default text when opened from disk', () => {
    expect(load('file:///tmp/index.html')).toEqual({ heading: 'hi there!', title: 'hi there!' });
  });

  // jsdom's URL parser encodes these to xn-- labels the same way browsers do,
  // so each case round-trips through the page's decoder.
  it.each([
    'müller.de',
    'www.bücher.example',
    'müller-weg.example',
    '中国.example',
    'пример.испытание',
    'ελληνικά.example',
  ])('decodes the internationalized domain %s', (domain) => {
    expect(load(`https://${domain}/`)).toEqual({ heading: domain, title: domain });
  });
});
