import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js'
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter.js'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js'
import type { Part } from '../types'

export type ExportFormat = 'stl' | 'stl-ascii' | 'obj' | 'ply' | 'gltf' | 'glb' | 'json'

export const FORMATS: { id: ExportFormat; label: string; ext: string; note: string }[] = [
  { id: 'stl', label: 'STL (binary)', ext: 'stl', note: 'Universal mesh format for 3D printing and CAM.' },
  { id: 'stl-ascii', label: 'STL (ASCII)', ext: 'stl', note: 'Human-readable STL. Much larger files.' },
  { id: 'obj', label: 'OBJ', ext: 'obj', note: 'Keeps each part as a named group.' },
  { id: 'ply', label: 'PLY', ext: 'ply', note: 'Point/mesh format used by scanning tools.' },
  { id: 'gltf', label: 'glTF', ext: 'gltf', note: 'JSON scene with materials. Web and DCC friendly.' },
  { id: 'glb', label: 'GLB', ext: 'glb', note: 'Single-file binary glTF.' },
  { id: 'json', label: 'Parameters (JSON)', ext: 'json', note: 'The recipe, not the mesh — reload it into the studio.' },
]

export type Unit = 'mm' | 'cm' | 'm' | 'in'

/** Geometry is authored in millimetres; these convert to the export unit. */
export const UNIT_SCALE: Record<Unit, number> = {
  mm: 1,
  cm: 0.1,
  m: 0.001,
  in: 1 / 25.4,
}

/** Builds a throwaway scene at export scale so the live preview is untouched. */
function sceneForExport(parts: Part[], scale: number): THREE.Group {
  const group = new THREE.Group()
  for (const part of parts) {
    const geometry = part.geometry.clone()
    if (scale !== 1) geometry.scale(scale, scale, scale)
    const material = new THREE.MeshStandardMaterial({ color: part.color ?? 0xcccccc })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = part.name
    group.add(mesh)
  }
  group.updateMatrixWorld(true)
  return group
}

function disposeScene(group: THREE.Group) {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.isMesh) {
      mesh.geometry.dispose()
      const mat = mesh.material as THREE.Material | THREE.Material[]
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat.dispose()
    }
  })
}

function gltfParse(group: THREE.Group, binary: boolean): Promise<ArrayBuffer | object> {
  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(
      group,
      (result) => resolve(result as ArrayBuffer | object),
      (error) => reject(error),
      { binary },
    )
  })
}

export interface ExportResult {
  blob: Blob
  extension: string
}

export async function exportModel(
  parts: Part[],
  format: ExportFormat,
  unit: Unit,
  recipe: unknown,
): Promise<ExportResult> {
  if (format === 'json') {
    return {
      blob: new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' }),
      extension: 'json',
    }
  }

  const group = sceneForExport(parts, UNIT_SCALE[unit])
  try {
    switch (format) {
      case 'stl': {
        const data = new STLExporter().parse(group, { binary: true }) as unknown as DataView
        const bytes = new Uint8Array(data.buffer.slice(0) as ArrayBuffer)
        return { blob: new Blob([bytes], { type: 'model/stl' }), extension: 'stl' }
      }
      case 'stl-ascii': {
        const text = new STLExporter().parse(group) as string
        return { blob: new Blob([text], { type: 'model/stl' }), extension: 'stl' }
      }
      case 'obj': {
        const text = new OBJExporter().parse(group)
        return { blob: new Blob([text], { type: 'model/obj' }), extension: 'obj' }
      }
      case 'ply': {
        const data = new PLYExporter().parse(group, () => {}, { binary: false }) as unknown as string
        return { blob: new Blob([data ?? ''], { type: 'application/octet-stream' }), extension: 'ply' }
      }
      case 'glb': {
        const buffer = (await gltfParse(group, true)) as ArrayBuffer
        return { blob: new Blob([buffer], { type: 'model/gltf-binary' }), extension: 'glb' }
      }
      case 'gltf': {
        const json = await gltfParse(group, false)
        return {
          blob: new Blob([JSON.stringify(json, null, 2)], { type: 'model/gltf+json' }),
          extension: 'gltf',
        }
      }
    }
  } finally {
    disposeScene(group)
  }

  throw new Error(`Unsupported export format: ${format}`)
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Give the browser a beat to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
