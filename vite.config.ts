import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { studioApi } from './server/studioApi'

/**
 * `BASE_PATH` is for project sites, which are served from a subdirectory —
 * GitHub Pages puts this one under /object_studio/. Local dev and preview stay
 * at the root, so nothing about the everyday loop changes. Everything that
 * builds a URL reads `import.meta.env.BASE_URL`, so setting it here is the
 * whole of the configuration.
 */
const base = process.env.BASE_PATH ?? '/'

/**
 * Paths are client-side routes, and a static host knows nothing about them.
 * GitHub Pages serves 404.html for anything it cannot find, so shipping the app
 * under that name too makes a deep link work: it loads, the router reads the
 * path, and the right object opens.
 *
 * `.nojekyll` stops Pages running the build through Jekyll, which would drop
 * any file or directory beginning with an underscore.
 */
function staticHostingFallback() {
  return {
    name: 'static-hosting-fallback',
    apply: 'build' as const,
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      writeFileSync(resolve(dist, '.nojekyll'), '')
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), studioApi(), staticHostingFallback()],
  server: { port: 5173 },
})
