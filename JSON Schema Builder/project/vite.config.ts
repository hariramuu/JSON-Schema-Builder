import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: {
      clientPort: 443,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
