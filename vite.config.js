import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./", // Sorgt f�r korrektes Laden von Assets
  build: {
    outDir: "dist", // Sicherstellen, dass der Output korrekt ist
  },
  assetsInlineLimit: 0, // Erforderlich f�r gro�e statische Dateien
});