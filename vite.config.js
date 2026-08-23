import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        help: resolve(import.meta.dirname, 'help.html'),
        resources: resolve(import.meta.dirname, 'resources.html'),
      },
    },
  },
});
