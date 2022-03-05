import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImp from 'vite-plugin-imp';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginImp()],
  base: './',
  build: {
    outDir: 'build/app.content',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'src/app/pages/home/index.html')
      },
      external: ['electron']
    }
  },
  optimizeDeps: {
    exclude: ['electron']
  }
});
