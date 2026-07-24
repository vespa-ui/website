import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages project sites are served from https://<user>.github.io/<repo>/,
  // so production builds need every asset path prefixed with the repo name.
  // The dev server always runs at "/" for convenience; override the build
  // value with VITE_BASE if deploying to a custom domain or a user/org page.
  base: command === 'build' ? (process.env.VITE_BASE ?? '/vespa-ui/') : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
