import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const basePath = process.env.NODE_ENV === 'production' ? '/Sky-Watcher/' : '/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});