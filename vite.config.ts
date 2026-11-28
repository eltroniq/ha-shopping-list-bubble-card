import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/hestia-todo-entry-editor.ts',
      formats: ['es'],
      fileName: () => 'hestia-todo-entry-editor.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
  },
});
