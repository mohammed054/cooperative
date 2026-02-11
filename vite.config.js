import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const repoName = 'cooperative'

// Check if Sentry auth token is available
const sentryAuthToken = process?.env?.SENTRY_AUTH_TOKEN

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this repo at https://<user>.github.io/<repoName>/
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [
    react(),
    ...(sentryAuthToken
      ? [
          sentryVitePlugin({
            org: 'ghaim-uae', // Replace with your organization
            project: 'ghaim-uae-website', // Replace with your project name

            // Only generate source maps and upload in production
            release: {
              name: '1.0.0',
            },

            // Authentication - use environment variable
            authToken: sentryAuthToken,

            // Source maps
            sourcemaps: {
              assets: ['./dist/assets'],
              ignore: ['node_modules'],
            },
          }),
        ]
      : []),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable source maps for Sentry
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          sentry: ['@sentry/react'],
          ui: ['react-icons/fa'],
          search: ['fuse.js'],
          carousel: ['swiper'],
        },
      },
    },
  },
}))
