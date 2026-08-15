import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { SceneTheme } from '../lib/settings'
import type { DisplayOptions, Projection, ViewName } from '../lib/studioScene'
import { StudioScene } from '../lib/studioScene'
import type { Part } from '../types'

export interface ViewportHandle {
  setView: (view: ViewName) => void
  fit: () => void
  snapshot: () => string | null
}

interface Props {
  parts: Part[]
  sceneTheme: SceneTheme
  projection: Projection
  display: DisplayOptions
  /** Bumped by the parent to request a re-fit (e.g. after switching objects). */
  fitToken: number
}

/**
 * Thin React shell around StudioScene. The WebGL context is created once and
 * survives every parameter change; only the geometry is swapped.
 */
const Viewport = forwardRef<ViewportHandle, Props>(function Viewport(
  { parts, sceneTheme, projection, display, fitToken },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<StudioScene | null>(null)
  const previousParts = useRef<Part[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const scene = new StudioScene(containerRef.current)
    sceneRef.current = scene
    return () => {
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    scene.setParts(parts)
    // Free the previous build's buffers, which the scene no longer references.
    // The identity check matters under StrictMode, where effects re-run with
    // the same parts array and would otherwise dispose the live geometry.
    const previous = previousParts.current
    previousParts.current = parts
    if (previous !== parts) for (const part of previous) part.geometry.dispose()
  }, [parts])

  useEffect(() => {
    sceneRef.current?.applyTheme(sceneTheme)
  }, [sceneTheme])

  useEffect(() => {
    sceneRef.current?.setProjection(projection)
  }, [projection])

  useEffect(() => {
    sceneRef.current?.setDisplay(display)
  }, [display])

  useEffect(() => {
    sceneRef.current?.fit()
  }, [fitToken])

  useImperativeHandle(ref, () => ({
    setView: (view) => sceneRef.current?.setView(view),
    fit: () => sceneRef.current?.fit(),
    snapshot: () => sceneRef.current?.snapshot() ?? null,
  }))

  return <div className="viewport" ref={containerRef} />
})

export default Viewport
