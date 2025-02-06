import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'ResilienceCalendar',
      formats: ['iife'],
      fileName: (format) => `resilience-calendar.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        name: 'ResilienceCalendar',
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'resilience-calendar.css';
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    }
  },
  define: {
    // Add polyfills for Node.js globals
    'process.env': {},
    'process.platform': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
  },
  base: './'
}) 