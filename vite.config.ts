import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Production base must match where GitHub Pages serves the site: "/" for an
  // org/user page (<org>.github.io repo) or "/<repo>/" for project pages.
  // The dev server always runs at "/". CI sets VITE_BASE from configure-pages.
  base: command === 'build' ? (process.env.VITE_BASE ?? '/') : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
