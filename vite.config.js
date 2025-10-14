// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  // Development server configuration
  server: {
    port: 3000,
    host: true,
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
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
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
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },
    // Simple test configuration without projects
    include: ['tests/**/*.test.js', 'src/**/*.test.js'],
    exclude: ['src/**/*.stories.*', '**/*.mdx'],
  },
});
