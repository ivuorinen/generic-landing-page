import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  root: 'src',
  plugins: [tailwindcss()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
      output: {
        entryFileNames: 'app.js',
        assetFileNames(assetInfo) {
          if (assetInfo.name?.endsWith('.css')) return 'app.css';
          return '[name][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
