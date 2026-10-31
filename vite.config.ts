import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * Local development middleware for Vercel Serverless `/api/*` endpoints.
 * In production on Vercel, requests to `/api/auth`, `/api/waitlist`, etc. are executed
 * as native Edge/Node functions. In local Vite dev (`localhost:5173`), this middleware
 * intercepts these calls, responds with HTTP 200, and prevents red 404 / ERR_ABORTED console errors.
 */
function localApiPlugin(): Plugin {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, localDev: true, found: false }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
