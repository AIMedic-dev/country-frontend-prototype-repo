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
        chat_microservice: 'https://chat-artifacts-microservice-frontend.azurewebsites.net/assets/remoteEntry.js',
        login_microfrontend: 'http://localhost:4400/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        '@apollo/client',
        'lucide-react',
        'graphql',
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
    target: 'es2022', // 👈 Esto es clave para permitir top-level await

    minify: false,
  },
});
