import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Connect, Plugin, ViteDevServer, PreviewServer } from 'vite'

/**
 * Serves the object library from disk so edits made in the browser's source
 * editor can be saved back. This is local authoring tooling: it hands out write
 * access to a directory, so it is wired into the dev and preview servers only
 * and should not be exposed beyond localhost.
 */

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/

export interface ObjectApiOptions {
  /** Directory holding the object sources, relative to the project root. */
  dir?: string
}

function json(res: Parameters<Connect.NextHandleFunction>[1], status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req: Parameters<Connect.NextHandleFunction>[0]): Promise<string> {
  return new Promise((done, fail) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      // Object sources are hand-written files; anything this large is a bug.
      if (data.length > 2_000_000) fail(new Error('Source too large'))
    })
    req.on('end', () => done(data))
    req.on('error', fail)
  })
}

export function objectApi(options: ObjectApiOptions = {}): Plugin {
  let objectsDir = ''

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/objects')) return next()

    void (async () => {
      const id = decodeURIComponent(url.slice('/api/objects'.length).replace(/^\/+/, '').split('?')[0])
      const method = (req.method ?? 'GET').toUpperCase()

      try {
        if (method === 'GET' && !id) {
          await mkdir(objectsDir, { recursive: true })
          const files = (await readdir(objectsDir)).filter((f) => f.endsWith('.js')).sort()
          const objects = await Promise.all(
            files.map(async (file) => ({
              id: file.replace(/\.js$/, ''),
              source: await readFile(join(objectsDir, file), 'utf8'),
            })),
          )
          return json(res, 200, { writable: true, objects })
        }

        if (!ID_PATTERN.test(id)) {
          return json(res, 400, {
            error: 'Object ids may use lowercase letters, digits and dashes only.',
          })
        }
        const file = join(objectsDir, `${id}.js`)
        // Belt and braces: the id pattern already forbids separators.
        if (!resolve(file).startsWith(resolve(objectsDir))) {
          return json(res, 400, { error: 'Invalid object id.' })
        }

        if (method === 'PUT') {
          const source = await readBody(req)
          if (!source.trim()) return json(res, 400, { error: 'Source is empty.' })
          await mkdir(objectsDir, { recursive: true })
          await writeFile(file, source, 'utf8')
          return json(res, 200, { id, saved: true })
        }

        if (method === 'DELETE') {
          if (!existsSync(file)) return json(res, 404, { error: 'No such object.' })
          await unlink(file)
          return json(res, 200, { id, deleted: true })
        }

        if (method === 'GET') {
          if (!existsSync(file)) return json(res, 404, { error: 'No such object.' })
          return json(res, 200, { id, source: await readFile(file, 'utf8') })
        }

        return json(res, 405, { error: `${method} not supported.` })
      } catch (err) {
        return json(res, 500, { error: err instanceof Error ? err.message : String(err) })
      }
    })()
  }

  return {
    name: 'object-studio:object-api',
    configResolved(config) {
      objectsDir = resolve(config.root, options.dir ?? 'objects')
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(middleware)
    },
  }
}
