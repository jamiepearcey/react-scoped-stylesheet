import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteScopedStylesPlugin } from '@react-scoped-stylesheet/core'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteScopedStylesPlugin(),
    react({
      babel: {

      }
    })
  ],
  resolve: {
    preserveSymlinks: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'scheduler']
  }
})
