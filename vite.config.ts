import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    sourcemap: false,
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('/features/auth/')) {
            return 'auth';
          }
          if (id.includes('/features/quests/')) {
            return 'quests';
          }
          if (id.includes('/features/skills/')) {
            return 'skills';
          }
          if (id.includes('/features/social/')) {
            return 'social';
          }
          if (id.includes('/features/settings/')) {
            return 'settings';
          }
          
          // Core chunks
          if (id.includes('/core/repositories/')) {
            return 'repositories';
          }
          if (id.includes('/core/offlineQueue') || id.includes('/core/conflictResolution')) {
            return 'offline';
          }
          if (id.includes('/core/errorHandler')) {
            return 'error';
          }
        },
      },
    },
  },
});
