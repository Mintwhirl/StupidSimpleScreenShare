import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './public/index.html',
      },
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Preview server configuration (for production builds)
  preview: {
    port: 3000,
    host: true,
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Environment variables
  define: {
    'process.env': {},
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.test.js',
        '**/*.spec.js',
        '**/tests/',
        '**/test/',
        'public/',
        'vercel.json',
        'vite.config.js',
        '.eslintrc.cjs',
        '.prettierrc',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
