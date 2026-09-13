import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/** Fine, deterministic moulded grain; linear normal data, never an image asset. */
export function goldGrain(): THREE.DataTexture {
  const size = 64, heights = new Float32Array(size * size)
  let seed = 1990
  for (let i = 0; i < heights.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    heights[i] = seed / 4294967296
  }
  const bytes = new Uint8Array(size * size * 4)
  const height = (x: number, y: number) => heights[((y + size) % size) * size + (x + size) % size]
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const normal = new THREE.Vector3((height(x - 1, y) - height(x + 1, y)) * .5, (height(x, y - 1) - height(x, y + 1)) * .5, 1).normalize()
    const i = (y * size + x) * 4
    bytes[i] = Math.round((normal.x * .5 + .5) * 255)
    bytes[i + 1] = Math.round((normal.y * .5 + .5) * 255)
    bytes[i + 2] = Math.round((normal.z * .5 + .5) * 255)
    bytes[i + 3] = 255
  }
  const texture = new THREE.DataTexture(bytes, size, size)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}

/** Millimetre-scale grain on every face, independent of each primitive's UVs. */
export function grainUV(geometry: THREE.BufferGeometry) {
  const p = geometry.getAttribute('position'), n = geometry.getAttribute('normal')
  const uv = new Float32Array(p.count * 2)
  for (let i = 0; i < p.count; i++) {
    const x = Math.abs(n.getX(i)), y = Math.abs(n.getY(i)), z = Math.abs(n.getZ(i))
    uv[i * 2] = (x > y && x > z ? p.getZ(i) : p.getX(i)) / 16
    uv[i * 2 + 1] = (y > x && y > z ? p.getZ(i) : p.getY(i)) / 16
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
}

/** Broad studio reflections let the metallic finish read as gold when orbiting. */
export function metalEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer)
  try { return pmrem.fromScene(room, .04) }
  finally { room.dispose(); pmrem.dispose() }
}
