import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@contexts': path.resolve(__dirname, './src/shared/contexts'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@stores': path.resolve(__dirname, './src/shared/stores'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@services': path.resolve(__dirname, 'src/core/services'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: true,
  },
})
