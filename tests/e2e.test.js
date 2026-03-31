import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'vite';

let server;
let baseUrl;

describe('E2E - Vite dev server', () => {
  beforeAll(async () => {
    server = await createServer({
      root: 'src',
      server: { port: 0, open: false },
      logLevel: 'silent',
    });
    await server.listen();
    const address = server.httpServer.address();
    baseUrl = `http://localhost:${address.port}`;
  });

  afterAll(async () => {
    await server?.close();
  });

  it('serves index.html at the root', async () => {
    const res = await fetch(baseUrl);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<h1');
  });

  it('serves index.html with correct content type', async () => {
    const res = await fetch(baseUrl);
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('serves app.js as a module', async () => {
    const res = await fetch(`${baseUrl}/app.js`);
    expect(res.status).toBe(200);
    const js = await res.text();
    expect(js).toContain('DOMContentLoaded');
  });

  it('serves app.css', async () => {
    const res = await fetch(`${baseUrl}/app.css`);
    expect(res.status).toBe(200);
  });

  it('falls back to index.html for unknown routes (SPA behavior)', async () => {
    const res = await fetch(`${baseUrl}/does-not-exist`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<h1');
  });
});
