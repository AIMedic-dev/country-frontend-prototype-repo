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
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'], // Pre-bundling de dependencias críticas
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // CRÍTICO: NO tocar React ni ReactDOM - dejar que Vite los maneje automáticamente
          // Separar React causa el error "Cannot set properties of undefined (setting 'Children')"
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return; // undefined - Vite lo manejará automáticamente
          }
          
          // React Router (puede separarse porque no depende directamente de React internals)
          if (id.includes('react-router')) return 'router';
          
          // Apollo/GraphQL
          if (id.includes('@apollo/client') || id.includes('graphql')) return 'apollo';
          
          // Charts
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          
          // Speech SDK (muy grande)
          if (id.includes('microsoft-cognitiveservices-speech-sdk')) return 'speech';
          
          // Socket.IO
          if (id.includes('socket.io-client')) return 'socket';
          
          // HTTP client
          if (id.includes('axios')) return 'http';
          
          // Hotjar
          if (id.includes('@hotjar/')) return 'hotjar';

          // Todo lo demás en vendor (incluyendo React si no fue capturado antes)
          return 'vendor';
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
