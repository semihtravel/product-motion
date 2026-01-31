import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      // Force all packages to resolve from the root project's node_modules
      // to prevent duplicate React/Remotion instances
      'remotion': path.resolve(__dirname, '../node_modules/remotion'),
      '@remotion/player': path.resolve(__dirname, '../node_modules/@remotion/player'),
      '@remotion/transitions': path.resolve(__dirname, '../node_modules/@remotion/transitions'),
      '@remotion/web-renderer': path.resolve(__dirname, '../node_modules/@remotion/web-renderer'),
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'remotion', '@remotion/player', '@remotion/transitions', '@remotion/web-renderer'],
  },
  server: {
    port: 3001,
    cors: true,
  },
  build: {
    outDir: 'dist',
  },
});
