import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { objectApi } from './server/objectApi'

export default defineConfig({
  plugins: [react(), objectApi()],
  server: { port: 5173 },
})
