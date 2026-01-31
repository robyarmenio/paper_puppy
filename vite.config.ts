import { defineConfig } from 'vite';

export default defineConfig({
  base: '/paper_puppy/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
