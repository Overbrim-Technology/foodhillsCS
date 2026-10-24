import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getCatalogData } from './api/catalog.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY'] as const) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-catalog-api',
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            const pathname = new URL(request.url || '/', 'http://localhost').pathname;
            if (pathname !== '/api/catalog') return next();
            if (request.method !== 'GET') {
              response.statusCode = 405;
              response.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            void getCatalogData().then(data => {
              response.statusCode = 200;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(data));
            }).catch(error => {
              console.error('Local catalog API failed', error);
              response.statusCode = 500;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: 'Catalog is temporarily unavailable' }));
            });
          });
        },
      },
    ],
  };
});
