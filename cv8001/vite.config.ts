import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/cv/', // must match App.tsx routing and homepage of package.json

  resolve:{
    alias : {
      "@": path.resolve(__dirname, "./src")
    }
  },

  server: {
    port: 5171,
  },

  build: {
    target: "esnext",
    minify: "esbuild",
    outDir: "dist",
    sourcemap: false, // turn off for better security and smaller size
  }
})
