import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'cooperative';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this repo at https://<user>.github.io/<repoName>/
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
}));
