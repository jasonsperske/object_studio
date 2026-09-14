import { useEffect, useMemo, useRef, useState } from 'react'
import { applySurfaceTextures, listMediaSurfaces, loadMediaFile, type LoadedMedia } from '../lib/media'
import type { Part } from '../types'

export function useMedia(parts: Part[], notify: (message: string) => void) {
  const [bindings, setBindings] = useState<Record<string, LoadedMedia>>({})
  const owned = useRef<Record<string, LoadedMedia>>({})
  const requests = useRef<Record<string, number>>({})
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => { active.current = false; Object.values(owned.current).forEach(m => m.dispose()); owned.current = {} }
  }, [])
  const surfaces = useMemo(() => listMediaSurfaces(parts), [parts])
  const assign = async (id: string, file: File) => {
    const surface = surfaces.find(s => s.id === id)
    if (!surface) return
    const ticket = requests.current[id] = (requests.current[id] ?? 0) + 1
    try {
      const media = await loadMediaFile(file, surface)
      if (!active.current || requests.current[id] !== ticket) { media.dispose(); return }
      owned.current[id]?.dispose()
      owned.current = { ...owned.current, [id]: media }
      setBindings(owned.current)
      notify(`${file.name} → ${surface.label}`)
    } catch (err) {
      if (active.current && requests.current[id] === ticket) notify(err instanceof Error ? err.message : String(err))
    }
  }
  const clear = (id: string) => {
    requests.current[id] = (requests.current[id] ?? 0) + 1
    owned.current[id]?.dispose()
    const next = { ...owned.current }; delete next[id]
    owned.current = next; setBindings(next)
  }
  return { parts: useMemo(() => applySurfaceTextures(parts, bindings), [parts, bindings]), surfaces, bindings, assign, clear }
}
