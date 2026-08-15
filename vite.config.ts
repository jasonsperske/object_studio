import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { studioApi } from './server/studioApi'

export default defineConfig({
  plugins: [react(), studioApi()],
  server: { port: 5173 },
})
