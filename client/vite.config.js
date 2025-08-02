import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    loader: 'jsx',  // Apply JSX loader globally for .js and .jsx files
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
});
