import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const projectId = env.VITE_SANITY_PROJECT_ID
  const dataset = env.VITE_SANITY_DATASET || 'production'

  // Espelha a rewrite /foto/* do vercel.json para dev e preview locais
  const fotoProxy = projectId
    ? {
        '/foto': {
          target: 'https://cdn.sanity.io',
          changeOrigin: true,
          rewrite: (path: string) =>
            path.replace(/^\/foto/, `/images/${projectId}/${dataset}`),
        },
      }
    : undefined

  return {
    plugins: [react()],
    server: { proxy: fotoProxy },
    preview: { proxy: fotoProxy },
  }
})
