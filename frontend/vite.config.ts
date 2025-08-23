import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.DOMAIN ? `https://${process.env.DOMAIN}` : 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
