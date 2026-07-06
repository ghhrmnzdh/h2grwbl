import { defineConfig } from 'vite'

// base: './' keeps all asset URLs relative, so the same build works whether it is
// served from a domain root (Vercel) or a project subpath (GitHub Pages).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
})
