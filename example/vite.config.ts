import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'webmcp-ecommerce', replacement: resolve(__dirname, '../src/index.ts') },
    ],
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material/ShoppingCart',
      '@mui/icons-material/ArrowBack',
      '@mui/icons-material/CheckCircle',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
})