import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@core': '/src/core',
      '@features': '/src/features',
    },
  },
});
