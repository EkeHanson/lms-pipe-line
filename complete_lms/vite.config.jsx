// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     global: 'window',  // This fixes the 'global is not defined' error
//   },
//   optimizeDeps: {
//     include: ['date-fns'],
//   },
//   ssr: {
//     noExternal: ['date-fns'],
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },
});
