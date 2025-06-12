// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-country',
      remotes: {
        chat_microservice:
          'https://chat-artifacts-microservice-frontend.azurewebsites.net/assets/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        //'@apollo/client',
        'lucide-react',
        //'graphql',
        // 'js-cookie',
        // 'jwt-decode',
      ],
    }),
    tailwindcss(),
  ],

  server: {
    port: 3000,
  },

  build: {
    target: 'esnext', // 👈 Esto es clave para permitir top-level await
    modulePreload: false,
    cssCodeSplit: true,
    minify: true,
  },
});
