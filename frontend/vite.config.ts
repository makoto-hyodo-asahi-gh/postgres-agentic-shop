import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      pages: '/src/pages',
      components: '/src/components',
      styles: '/src/styles',
      utils: '/src/utils',
      types: '/src/types',
      constants: '/src/constants',
      services: '/src/services',
      hooks: '/src/hooks',
    },
  },

  server: {
    host: true,
  },
});
