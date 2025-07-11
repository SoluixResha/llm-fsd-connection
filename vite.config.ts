import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Enable source maps for debugging in production
    sourcemap: false,
    
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
  
  // Define environment variables (if needed)
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
