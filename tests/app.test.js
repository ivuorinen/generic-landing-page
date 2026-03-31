/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('app.js - DOMContentLoaded handler', () => {
  beforeEach(() => {
    document.body.innerHTML = '<h1></h1>';
    document.title = 'hi there!';
  });

  it('sets h1 text content to window.location.hostname', async () => {
    // jsdom sets window.location.hostname to 'localhost'
    await import('../src/app.js?' + Date.now());

    document.dispatchEvent(new Event('DOMContentLoaded'));

    const h1 = document.querySelector('h1');
    expect(h1.textContent).toBe(window.location.hostname);
  });

  it('sets document.title to window.location.hostname', async () => {
    await import('../src/app.js?' + Date.now());

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.title).toBe(window.location.hostname);
  });

  it('falls back to document.title when hostname is empty', async () => {
    // Mock location.hostname to return empty string
    const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hostname: '',
    });

    document.title = 'fallback title';
    await import('../src/app.js?' + Date.now());

    document.dispatchEvent(new Event('DOMContentLoaded'));

    const h1 = document.querySelector('h1');
    expect(h1.textContent).toBe('fallback title');
    expect(document.title).toBe('fallback title');

    locationSpy.mockRestore();
  });
});
