import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Automatically open browser
    cors: true, // Enable CORS
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
    minify: 'esbuild', // Fast minification
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle these dependencies
  },
})
