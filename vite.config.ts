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
        // nombre_del_remote: 'url_al_remoteEntry.js'
        chat_microservice:
          'https://chat-artifacts-microservice-frontend.azurewebsites.net/assets/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        //'js-cookie',
        // 'jwt-decode',
        '@apollo/client',
        'lucide-react',
        'graphql',
      ],
    }),
    tailwindcss(),
  ],

  server: {
    port: 3000,
  },
});
