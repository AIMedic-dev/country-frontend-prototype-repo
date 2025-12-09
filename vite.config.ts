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
  },
});
