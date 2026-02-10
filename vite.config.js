import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const repoName = 'cooperative'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this repo at https://<user>.github.io/<repoName>/
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'ghaim-uae', // Replace with your organization
      project: 'ghaim-uae-website', // Replace with your project name

      // Only generate source maps and upload in production
      release: {
        name: '1.0.0',
      },

      // Authentication - use environment variable
      authToken: import.meta.env.SENTRY_AUTH_TOKEN,

      // Source maps
      sourcemaps: {
        assets: ['./dist/assets'],
        ignore: ['node_modules'],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable source maps for Sentry
  },
}))
