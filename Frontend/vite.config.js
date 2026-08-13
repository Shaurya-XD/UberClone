import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // The app is served from the root of the Express container in ECS.
  base: '/',
  plugins: [react()],
})
