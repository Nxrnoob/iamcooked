import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This will load .env.local
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/omdb': {
          target: 'https://www.omdbapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/omdb/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const apiKey = env.VITE_OMDB_API_KEY;
              if (apiKey) {
                // The request path already contains query parameters, so we need to append the API key.
                proxyReq.path += `&apikey=${apiKey}`;
              } else {
                console.error("VITE_OMDB_API_KEY is not defined. Make sure it's in your .env.local file.");
              }
            });
          }
        },
        '/api/jikan': {
          target: 'https://api.jikan.moe/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jikan/, ''),
        },
        '/api/tvmaze': {
          target: 'https://api.tvmaze.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tvmaze/, ''),
        }
      }
    }
  }
})