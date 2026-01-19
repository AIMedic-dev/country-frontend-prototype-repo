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

          // Splits grandes dependencias en chunks separados
          if (id.includes('react-dom') || id.includes('react/')) return 'react';
          if (id.includes('react-router')) return 'router';
          if (id.includes('@apollo/client') || id.includes('graphql')) return 'apollo';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('microsoft-cognitiveservices-speech-sdk')) return 'speech';
          if (id.includes('socket.io-client')) return 'socket';
          if (id.includes('axios')) return 'http';
          if (id.includes('@hotjar/')) return 'hotjar';

          // fallback: todo lo demás en vendor
          return 'vendor';
        },
      },
    },
  },
});
