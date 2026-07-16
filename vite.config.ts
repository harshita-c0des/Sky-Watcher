import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { cartographer } from "@replit/vite-plugin-cartographer";

// This forces the production base path to use your exact repository name capitalization
const basePath = process.env.NODE_ENV === 'production' ? '/Sky-Watcher/' : '/';

export default defineConfig({
  base: basePath,
  plugins: [react(), cartographer()],
  build: {
    outDir: 'dist', 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
