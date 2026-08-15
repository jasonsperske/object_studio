import * as THREE from 'three'
import type { Part } from '../types'

/**
 * Offscreen renders for the gallery. One renderer draws every card in turn and
 * is then thrown away, which keeps the gallery well under the browser's limit
 * on live WebGL contexts.
 */

const FOV = 35
/** Same three-quarter direction the viewport's Iso button uses. */
const DIRECTION = new THREE.Vector3(1, 0.75, 1).normalize()

function frameCamera(camera: THREE.PerspectiveCamera, box: THREE.Box3) {
  const center = box.getCenter(new THREE.Vector3())
  const forward = DIRECTION.clone()
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize()
  const up = new THREE.Vector3().crossVectors(forward, right).normalize()

  const corner = new THREE.Vector3()
  let halfW = 0
  let halfH = 0
  let halfD = 0
  for (let i = 0; i < 8; i++) {
    corner
      .set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z)
      .sub(center)
    halfW = Math.max(halfW, Math.abs(corner.dot(right)))
    halfH = Math.max(halfH, Math.abs(corner.dot(up)))
    halfD = Math.max(halfD, Math.abs(corner.dot(forward)))
  }

  // Square canvas, so width and height share one half-angle.
  const halfFov = Math.tan((FOV * Math.PI) / 360)
  const distance = (Math.max(halfW, halfH) / halfFov) * 1.12 + halfD
  camera.position.copy(center).addScaledVector(forward, distance)
  camera.lookAt(center)
  camera.near = Math.max(distance * 0.01, 0.1)
  camera.far = distance * 4
  camera.updateProjectionMatrix()
}

export interface ThumbnailRequest {
  id: string
  parts: Part[]
}

/**
 * Renders each request to a transparent PNG data URL. Geometry passed in is
 * disposed on the way out, so callers should hand over throwaway builds.
 */
export function renderThumbnails(requests: ThumbnailRequest[], size = 420): Record<string, string> {
  const output: Record<string, string> = {}
  if (!requests.length) return output

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  } catch {
    return output // No WebGL — the gallery falls back to text-only cards.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(size, size)
  renderer.setClearAlpha(0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 100_000)
  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x2a2620, 2))
  const sun = new THREE.DirectionalLight(0xffffff, 2.1)
  scene.add(sun)

  const group = new THREE.Group()
  scene.add(group)

  for (const request of requests) {
    for (const child of [...group.children]) group.remove(child)

    const materials: THREE.Material[] = []
    for (const part of request.parts) {
      const material = new THREE.MeshStandardMaterial({
        color: part.color ?? 0xb9bec7,
        roughness: 0.65,
        metalness: 0.05,
      })
      materials.push(material)
      group.add(new THREE.Mesh(part.geometry, material))
    }

    const box = new THREE.Box3().setFromObject(group)
    if (!box.isEmpty()) {
      frameCamera(camera, box)
      const radius = box.getBoundingSphere(new THREE.Sphere()).radius
      sun.position.copy(camera.position).add(new THREE.Vector3(0, radius, 0))
      renderer.render(scene, camera)
      output[request.id] = renderer.domElement.toDataURL('image/png')
    }

    for (const material of materials) material.dispose()
    for (const part of request.parts) part.geometry.dispose()
  }

  renderer.dispose()
  renderer.forceContextLoss()
  return output
}
