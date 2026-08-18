import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        strictPort: false,
        host: '127.0.0.1',
        hmr: {
          protocol: 'ws',
          host: '127.0.0.1',
        }
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;

              if (id.includes('gsap') || id.includes('@gsap') || id.includes('framer-motion')) {
                return 'animation';
              }

              if (id.includes('/react/') || id.includes('/react-dom/')) {
                return 'react';
              }

              if (id.includes('lucide-react')) {
                return 'icons';
              }

              if (id.includes('@firebase/firestore') || id.includes('/firebase/firestore')) {
                return 'firebase-firestore';
              }

              if (id.includes('@firebase/auth') || id.includes('/firebase/auth')) {
                return 'firebase-auth';
              }

              if (id.includes('@firebase/storage') || id.includes('/firebase/storage')) {
                return 'firebase-storage';
              }

              if (id.includes('@firebase/functions') || id.includes('/firebase/functions')) {
                return 'firebase-functions';
              }

              if (id.includes('@firebase/analytics') || id.includes('/firebase/analytics')) {
                return 'firebase-analytics';
              }

              if (id.includes('@firebase') || id.includes('/firebase/')) {
                return 'firebase-core';
              }
            },
          },
        },
      },
      publicDir: 'Public',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
