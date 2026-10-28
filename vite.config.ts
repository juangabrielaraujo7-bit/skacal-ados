import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import catalog from './api/catalog';
import order from './api/order';
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'SANITY_'));
  return { plugins: [react(), { name: 'ska-local-api', configureServer(server) { server.middlewares.use('/api/catalog', (req, res) => { void catalog(req, res); }); server.middlewares.use('/api/order', (req, res) => { void order(req, res); }); } } ] };
});
