import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: env.VITE_DEV_HOST || 'localhost',
      port: Number(env.VITE_DEV_PORT) || 5173,
      strictPort: true,
    },
    preview: {
      port: Number(env.VITE_DEV_PORT) || 5173,
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react';
            if (/[\\/]node_modules[\\/](@reduxjs|react-redux|@tanstack)[\\/]/.test(id)) return 'state';
            if (/[\\/]node_modules[\\/](recharts|d3-[^\\/]+)[\\/]/.test(id)) return 'charts';
            return undefined;
          },
        },
      },
    },
  };
});