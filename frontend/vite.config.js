import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Railway runs the preview server behind its own domain.
    // Allow Railway hostnames so Vite doesn't block requests.
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.railway.app',
      '.up.railway.app',
    ],
  },
})
