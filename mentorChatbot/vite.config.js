import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Explicit output directory
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html' // Explicit entry point
      }
    }
  },
  base: '/', // Ensure correct base path
});