import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src',
  server: {
    port: '3000',
  },
  plugins: [react(),],
})
