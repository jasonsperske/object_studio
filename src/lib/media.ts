import * as THREE from 'three'
import type { Part, MediaSurface } from '../types'

/** Project UVs before any bend/hinge transform, so images follow the surface. */
export function surfaceUV(geometry: THREE.BufferGeometry, horizontal: 'x' | 'y' | 'z' = 'x', vertical: 'x' | 'y' | 'z' = 'y') {
  geometry.computeBoundingBox()
  const bounds = geometry.boundingBox!
  const pos = geometry.getAttribute('position')
  const get = (i: number, axis: string) => axis === 'x' ? pos.getX(i) : axis === 'y' ? pos.getY(i) : pos.getZ(i)
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (get(i, horizontal) - bounds.min[horizontal]) / Math.max(1e-9, bounds.max[horizontal] - bounds.min[horizontal])
    uv[i * 2 + 1] = (get(i, vertical) - bounds.min[vertical]) / Math.max(1e-9, bounds.max[vertical] - bounds.min[vertical])
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geometry
}

export type MediaKind = 'image' | 'video'
export interface SurfaceTexture { texture: THREE.Texture; kind: MediaKind }
/** Caller retains ownership of textures. The returned parts share geometry. */
export function applySurfaceTextures(parts: Part[], textures: Record<string, SurfaceTexture>): Part[] {
  return parts.map(part => {
    const surface = part.mediaSurface
    const binding = surface && textures[surface.id]
    if (!surface || !binding) return part
    if ((binding.kind === 'video' || (binding.texture as THREE.VideoTexture).isVideoTexture) && surface.accept !== 'image-video') throw new Error(`${surface.label} accepts images only.`)
    if (!part.geometry.getAttribute('uv')) throw new Error(`${surface.label} has no UV coordinates.`)
    return { ...part, map: binding.texture, color: 0xffffff }
  })
}
export function listMediaSurfaces(parts: Part[]): MediaSurface[] {
  return [...new Map(parts.flatMap(p => p.mediaSurface ? [[p.mediaSurface.id, p.mediaSurface] as const] : [])).values()]
}
export function fileMediaKind(file: Pick<File, 'type' | 'name'>): MediaKind | null {
  if (/^image\//i.test(file.type) || (!file.type && /\.(png|jpe?g|webp|gif|avif|bmp|svg)$/i.test(file.name))) return 'image'
  if (/^video\//i.test(file.type) || (!file.type && /\.(mp4|webm|ogv|mov|m4v)$/i.test(file.name))) return 'video'
  return null
}
export interface LoadedMedia extends SurfaceTexture { dispose: () => void }

/** Local blobs only. Nothing enters parameters, persistence, or URL serialization. */
export async function loadMediaFile(file: File, surface: MediaSurface): Promise<LoadedMedia> {
  const kind = fileMediaKind(file)
  if (!kind || (kind === 'video' && surface.accept !== 'image-video')) throw new Error(`${surface.label} accepts ${surface.accept === 'image' ? 'images only' : 'images or browser-supported video'}.`)
  const url = URL.createObjectURL(file)
  let cleanup = () => URL.revokeObjectURL(url)
  try {
    let texture: THREE.Texture
    if (kind === 'video') {
      const video = document.createElement('video')
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto'
      cleanup = () => { video.pause(); video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url) }
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve()
        video.onerror = () => reject(new Error('This browser cannot decode that movie. Try MP4 or WebM.'))
        video.src = url
      })
      await video.play()
      texture = new THREE.VideoTexture(video)
    } else if (file.type === 'image/gif' || /\.gif$/i.test(file.name)) {
      // WebCodecs supplies composited GIF frames, including disposal/blending.
      type Decoder = { tracks: { ready: Promise<void>; selectedTrack: { frameCount: number } }; decode: (o: { frameIndex: number }) => Promise<{ image: VideoFrame }>; close: () => void }
      const DecoderClass = (globalThis as unknown as { ImageDecoder?: new (o: { data: ArrayBuffer; type: string }) => Decoder }).ImageDecoder
      if (!DecoderClass) throw new Error('Animated GIF playback requires a browser with ImageDecoder (Chrome or Edge).')
      const decoder = new DecoderClass({ data: await file.arrayBuffer(), type: 'image/gif' })
      let stopped = false, timer = 0
      cleanup = () => { stopped = true; clearTimeout(timer); decoder.close(); URL.revokeObjectURL(url) }
      await decoder.tracks.ready
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d')!
      texture = new THREE.CanvasTexture(canvas)
      let frameIndex = 0
      const draw = async () => {
        const { image } = await decoder.decode({ frameIndex })
        if (stopped) { image.close(); return }
        canvas.width = image.displayWidth; canvas.height = image.displayHeight
        context.drawImage(image, 0, 0); texture.needsUpdate = true
        const delay = Math.max(20, (image.duration ?? 100000) / 1000)
        image.close()
        frameIndex = (frameIndex + 1) % decoder.tracks.selectedTrack.frameCount
        timer = window.setTimeout(() => { void draw().catch(() => cleanup()) }, delay)
      }
      try { await draw() } catch (err) { texture.dispose(); throw err }
      texture.userData.animated = true
    } else {
      const img = new Image()
      img.src = url
      await img.decode()
      texture = new THREE.Texture(img)
      texture.needsUpdate = true
    }
    texture.colorSpace = THREE.SRGBColorSpace
    let disposed = false
    return { texture, kind, dispose: () => { if (!disposed) { disposed = true; cleanup(); texture.dispose() } } }
  } catch (err) { cleanup(); throw err }
}
