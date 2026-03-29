import { describe, it, expect } from 'vitest';
import config from '../vite.config.js';

describe('vite.config.js', () => {
  const resolvedConfig =
    typeof config === 'function' ? config({}) : config;

  it('sets root to src directory', () => {
    expect(resolvedConfig.root).toBe('src');
  });

  it('sets base to relative path', () => {
    expect(resolvedConfig.base).toBe('./');
  });

  it('outputs to dist directory', () => {
    expect(resolvedConfig.build.outDir).toBe('../dist');
  });

  it('empties output directory before build', () => {
    expect(resolvedConfig.build.emptyOutDir).toBe(true);
  });

  it('names JS output as app.js', () => {
    expect(resolvedConfig.build.rollupOptions.output.entryFileNames).toBe(
      'app.js',
    );
  });

  describe('assetFileNames', () => {
    const assetFileNames =
      resolvedConfig.build.rollupOptions.output.assetFileNames;

    it('renames CSS files to app.css', () => {
      expect(assetFileNames({ name: 'style.css' })).toBe('app.css');
    });

    it('keeps original name for non-CSS assets', () => {
      expect(assetFileNames({ name: 'image.png' })).toBe('[name][extname]');
    });

    it('handles assets with no name gracefully', () => {
      expect(assetFileNames({})).toBe('[name][extname]');
    });
  });

  it('configures dev server on port 3000', () => {
    expect(resolvedConfig.server.port).toBe(3000);
  });

  it('opens browser on dev server start', () => {
    expect(resolvedConfig.server.open).toBe(true);
  });
});
