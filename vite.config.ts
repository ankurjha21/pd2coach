import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from https://<user>.github.io/pd2coach/,
  // not the domain root, so asset URLs need the repo name as a base path.
  base: '/pd2coach/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
})
