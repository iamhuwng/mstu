import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and React-DOM into separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split Mantine UI library
          'mantine-vendor': ['@mantine/core', '@mantine/hooks'],
          // Split Firebase
          'firebase-vendor': ['firebase/app', 'firebase/database', 'firebase/auth'],
          // Split chart libraries
          'chart-vendor': ['recharts'],
          // Split other heavy dependencies
          'misc-vendor': ['react-confetti', 'react-resizable'],
        },
      },
    },
    // Increase chunk size warning limit to 600KB (from default 500KB)
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: ['**/node_modules/**', '**/tests/**'],
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },
  },
});