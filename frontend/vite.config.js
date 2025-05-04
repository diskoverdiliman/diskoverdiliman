import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import process from 'process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': {
      VITE_APP_API_URL: process.env.VITE_APP_API_URL,
      VITE_APP_STATIC_URL: process.env.VITE_APP_STATIC_URL,
      VITE_BASE_URL: process.env.VITE_BASE_URL,
    }
  },
  server: {
    proxy: {
      '/leaflet-css': {
        target: 'https://unpkg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/leaflet-css/, ''),
      },
    },
  },
  // add this in production
  // base: '/static/',
})
