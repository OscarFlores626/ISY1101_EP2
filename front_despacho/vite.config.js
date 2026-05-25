import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo local, el proxy redirige /api/* al backend local
    // En producción (Docker), Nginx hace el proxy — este bloque no aplica
    proxy: {
      '/api/v1/ventas': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/despachos': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})
