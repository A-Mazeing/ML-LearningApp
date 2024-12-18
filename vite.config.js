import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./", // Sorgt für korrektes Laden von Assets
  build: {
    outDir: "dist", // Sicherstellen, dass der Output korrekt ist
  },
  assetsInlineLimit: 0, // Erforderlich für große statische Dateien
});