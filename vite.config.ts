import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/shopping-list-card.ts',
      formats: ['es'],
      fileName: () => 'shopping-list-card.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
  },
});
