import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: import.meta.env.VITE_PORT || 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 3000}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 3000}`,
        changeOrigin: true,
      },
      '/products': {
        target: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 3000}`,
        changeOrigin: true,
      }, 
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: "./src/main.jsx",
      output: {
        dir: 'dist/app',
      },
    },
  },
});
