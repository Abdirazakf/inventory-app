import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['inventory-app-pykr.onrender.com']
  },
  preview: {
    allowedHosts: ['inventory-app-pykr.onrender.com']
  }
})
