import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/modules': resolve(__dirname, './src/modules'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/styles': resolve(__dirname, './src/styles'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'], // Evitar múltiples instancias de React
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime', 
      'react-router-dom',
      'recharts' // Incluir recharts para pre-bundling con React
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Permite acceso desde otros dispositivos en la red
    open: true,
    allowedHosts: true,
    proxy: {
      '/api/analytics': {
        target: 'https://country-analytics-dceee2bhafg3d7bb.eastus-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/analytics/, '/analytics'),
        secure: true,
      },
    },
  },
  build: {
    // Deshabilitar chunking manual para evitar problemas con React y recharts
    // Vite manejará automáticamente la división de chunks de forma segura
    rollupOptions: {
      output: {
        // Solo separar el Speech SDK que es muy grande y no depende de React
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          
          // Solo separar Speech SDK (muy grande, ~450KB, no depende de React)
          if (id.includes('microsoft-cognitiveservices-speech-sdk')) {
            return 'speech';
          }
          
          // Todo lo demás (incluyendo React, ReactDOM, recharts, etc.) en vendor
          // Esto asegura que React esté disponible cuando recharts se carga
          return 'vendor';
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000, // Aumentar límite para evitar warnings
  },
});
