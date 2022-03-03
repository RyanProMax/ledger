import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build/app.content',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/app/pages/index.html'),
        config: resolve(__dirname, 'src/app/pages/config.html')
      }
    }
  }
});
