import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { SceneTheme } from './settings'
import { themeDef } from './settings'
import type { Part } from '../types'

export type ViewName = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso'
export type Projection = 'perspective' | 'orthographic'

export interface DisplayOptions {
  wireframe: boolean
  edges: boolean
  grid: boolean
  shadows: boolean
}

/** Camera direction (from target toward camera) and up vector for each preset. */
const VIEWS: Record<ViewName, { dir: THREE.Vector3; up: THREE.Vector3 }> = {
  front: { dir: new THREE.Vector3(0, 0, 1), up: new THREE.Vector3(0, 1, 0) },
  back: { dir: new THREE.Vector3(0, 0, -1), up: new THREE.Vector3(0, 1, 0) },
  right: { dir: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 1, 0) },
  left: { dir: new THREE.Vector3(-1, 0, 0), up: new THREE.Vector3(0, 1, 0) },
  top: { dir: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, -1) },
  bottom: { dir: new THREE.Vector3(0, -1, 0), up: new THREE.Vector3(0, 0, 1) },
  iso: { dir: new THREE.Vector3(1, 0.75, 1).normalize(), up: new THREE.Vector3(0, 1, 0) },
}

const FOV = 40

/**
 * Owns the three.js renderer, cameras and model group. Kept outside React so
 * parameter edits rebuild geometry without tearing down the WebGL context.
 */
export class StudioScene {
  readonly scene = new THREE.Scene()
  private renderer: THREE.WebGLRenderer
  private perspective: THREE.PerspectiveCamera
  private orthographic: THREE.OrthographicCamera
  private controls: OrbitControls
  private container: HTMLElement
  private resizeObserver: ResizeObserver
  private modelGroup = new THREE.Group()
  private edgeGroup = new THREE.Group()
  private grid: THREE.Group = new THREE.Group()
  private ground: THREE.Mesh
  private sun: THREE.DirectionalLight
  private projection: Projection = 'perspective'
  private display: DisplayOptions = { wireframe: false, edges: true, grid: true, shadows: true }
  private radius = 1000
  private box = new THREE.Box3(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 1000, 500))
  private center = new THREE.Vector3(0, 500, 0)
  private gridSpan = 0
  private orthoHalfHeight = 1000
  private theme: SceneTheme = themeDef('studio').scene
  private frameHandle = 0
  private needsRender = true

  constructor(container: HTMLElement) {
    this.container = container
    const { clientWidth: w, clientHeight: h } = container
    const width = Math.max(w, 1)
    const height = Math.max(h, 1)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color(this.theme.background)

    this.perspective = new THREE.PerspectiveCamera(FOV, width / height, 1, 200_000)
    this.orthographic = new THREE.OrthographicCamera(-1, 1, 1, -1, -100_000, 200_000)

    this.controls = new OrbitControls(this.perspective, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.12
    this.controls.addEventListener('change', () => {
      this.needsRender = true
    })

    // Lighting: soft ambient fill plus one shadow-casting key light.
    this.scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x2a2620, 1.7))
    this.sun = new THREE.DirectionalLight(0xffffff, 2.2)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.scene.add(this.sun, this.sun.target)

    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShadowMaterial({ opacity: this.theme.shadowOpacity }),
    )
    this.ground.rotation.x = -Math.PI / 2
    this.ground.receiveShadow = true
    this.scene.add(this.ground)

    this.scene.add(this.modelGroup, this.edgeGroup, this.grid)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)

    this.setView('iso')
    this.animate()
  }

  // --- model ---------------------------------------------------------------

  setParts(parts: Part[]) {
    this.clearGroup(this.modelGroup)
    this.clearGroup(this.edgeGroup)

    for (const part of parts) {
      const material = new THREE.MeshStandardMaterial({
        color: part.color ?? 0xb9bec7,
        roughness: 0.68,
        metalness: 0.05,
        wireframe: this.display.wireframe,
      })
      const mesh = new THREE.Mesh(part.geometry, material)
      mesh.name = part.name
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.modelGroup.add(mesh)

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(part.geometry, 25),
        new THREE.LineBasicMaterial({
          color: this.theme.edge,
          transparent: true,
          opacity: this.theme.edgeOpacity,
        }),
      )
      edges.visible = this.display.edges
      this.edgeGroup.add(edges)
    }

    this.updateBounds()
    this.needsRender = true
  }

  private clearGroup(group: THREE.Group) {
    for (const child of [...group.children]) {
      group.remove(child)
      const mesh = child as THREE.Mesh | THREE.LineSegments
      // Part geometry is owned by the caller; only edge geometry is ours.
      if (group === this.edgeGroup) mesh.geometry.dispose()
      const mat = mesh.material as THREE.Material | THREE.Material[]
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    }
  }

  /** Recomputes grid, ground and light rig for the model size. */
  private updateBounds() {
    const box = new THREE.Box3().setFromObject(this.modelGroup)
    if (box.isEmpty()) box.set(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 1000, 500))
    this.box = box
    const sphere = box.getBoundingSphere(new THREE.Sphere())
    this.radius = Math.max(sphere.radius, 1)
    const center = this.center.copy(sphere.center)

    // Grid large enough to sit under the model, snapped to whole metres.
    // Only rebuilt when the span actually changes — sliders fire constantly.
    const span = Math.ceil((this.radius * 2.5) / 1000) * 1000
    if (span !== this.gridSpan) {
      this.gridSpan = span
      this.disposeGrid()
      this.grid = new THREE.Group()
      const fine = new THREE.GridHelper(span, span / 100, this.theme.gridFine, this.theme.gridFine)
      const coarse = new THREE.GridHelper(
        span,
        span / 1000,
        this.theme.gridCoarse,
        this.theme.gridCoarse,
      )
      fine.position.y = -0.6
      this.grid.add(fine, coarse)
      this.scene.add(this.grid)

      this.ground.geometry.dispose()
      this.ground.geometry = new THREE.PlaneGeometry(span, span)
    }
    this.grid.position.set(center.x, 0, center.z)
    this.grid.visible = this.display.grid
    this.ground.position.set(center.x, -0.5, center.z)
    this.ground.visible = this.display.shadows

    const d = this.radius * 2
    this.sun.position.set(center.x + d * 0.6, center.y + d * 1.2, center.z + d * 0.8)
    this.sun.target.position.copy(center)
    this.sun.castShadow = this.display.shadows
    const cam = this.sun.shadow.camera
    cam.left = -this.radius * 1.6
    cam.right = this.radius * 1.6
    cam.top = this.radius * 1.6
    cam.bottom = -this.radius * 1.6
    cam.near = 1
    cam.far = d * 4
    cam.updateProjectionMatrix()
  }

  // --- camera --------------------------------------------------------------

  private disposeGrid() {
    this.scene.remove(this.grid)
    this.grid.traverse((obj) => {
      const helper = obj as THREE.GridHelper
      helper.geometry?.dispose()
      const mat = helper.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    })
  }

  setView(name: ViewName) {
    const { dir, up } = VIEWS[name]
    const target = this.controls.target.copy(this.center).clone()
    const camera = this.activeCamera()
    camera.up.copy(up)
    this.frame(dir, up, target, camera)
    camera.lookAt(target)
    this.controls.update()
    this.needsRender = true
  }

  fit() {
    const target = this.controls.target.copy(this.center).clone()
    const camera = this.activeCamera()
    const dir = camera.position.clone().sub(target).normalize()
    this.frame(dir, camera.up, target, camera)
    this.controls.update()
    this.needsRender = true
  }

  /** Places the camera and sizes the ortho frustum so the model just fills the frame. */
  private frame(
    dir: THREE.Vector3,
    up: THREE.Vector3,
    target: THREE.Vector3,
    camera: THREE.Camera,
  ) {
    const { halfW, halfH, halfD } = this.projectedExtents(dir, up)
    const halfFov = Math.tan((FOV * Math.PI) / 360)
    const aspect = this.aspect()

    // Perspective needs to back off far enough for the wider of the two axes;
    // orthographic just needs a frustum big enough, with no depth allowance.
    const distance = Math.max(halfH / halfFov, halfW / (halfFov * aspect)) * 1.1 + halfD
    camera.position.copy(target).addScaledVector(dir.clone().normalize(), distance)

    this.orthographic.zoom = 1
    this.orthoHalfHeight = Math.max(halfH, halfW / aspect) * 1.1
    this.applyOrthoFrustum()
  }

  /**
   * Half-extents of the bounding box measured along the camera's right, up and
   * view axes. Fitting the box rather than its sphere keeps long, flat models —
   * a flight of stairs seen in elevation — from floating in empty viewport.
   */
  private projectedExtents(dir: THREE.Vector3, up: THREE.Vector3) {
    const forward = dir.clone().normalize()
    const right = new THREE.Vector3().crossVectors(up, forward)
    if (right.lengthSq() < 1e-8) right.set(1, 0, 0)
    right.normalize()
    const vertical = new THREE.Vector3().crossVectors(forward, right).normalize()

    const { min, max } = this.box
    const corner = new THREE.Vector3()
    let halfW = 0
    let halfH = 0
    let halfD = 0
    for (let i = 0; i < 8; i++) {
      corner
        .set(i & 1 ? max.x : min.x, i & 2 ? max.y : min.y, i & 4 ? max.z : min.z)
        .sub(this.center)
      halfW = Math.max(halfW, Math.abs(corner.dot(right)))
      halfH = Math.max(halfH, Math.abs(corner.dot(vertical)))
      halfD = Math.max(halfD, Math.abs(corner.dot(forward)))
    }
    return { halfW: Math.max(halfW, 1), halfH: Math.max(halfH, 1), halfD }
  }

  setProjection(projection: Projection) {
    if (projection === this.projection) return
    const from = this.activeCamera()
    this.projection = projection
    const to = this.activeCamera()
    to.position.copy(from.position)
    to.up.copy(from.up)
    to.quaternion.copy(from.quaternion)
    if (projection === 'orthographic') {
      // Match the perspective framing at the current orbit distance.
      const distance = from.position.distanceTo(this.controls.target)
      this.orthographic.zoom = 1
      this.orthoHalfHeight = distance * Math.tan((FOV * Math.PI) / 360)
      this.applyOrthoFrustum()
    }
    this.controls.object = to
    this.controls.update()
    this.needsRender = true
  }

  /** Rebuilds the ortho frustum from the stored half-height and the live aspect. */
  private applyOrthoFrustum() {
    const aspect = this.aspect()
    this.orthographic.left = -this.orthoHalfHeight * aspect
    this.orthographic.right = this.orthoHalfHeight * aspect
    this.orthographic.top = this.orthoHalfHeight
    this.orthographic.bottom = -this.orthoHalfHeight
    this.orthographic.updateProjectionMatrix()
  }

  private activeCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    return this.projection === 'perspective' ? this.perspective : this.orthographic
  }

  private aspect(): number {
    const { clientWidth: w, clientHeight: h } = this.container
    return Math.max(w, 1) / Math.max(h, 1)
  }

  // --- display -------------------------------------------------------------

  /** Repaints background, grid, edges and contact shadow for a new theme. */
  applyTheme(theme: SceneTheme) {
    this.theme = theme
    ;(this.scene.background as THREE.Color).set(theme.background)
    ;(this.ground.material as THREE.ShadowMaterial).opacity = theme.shadowOpacity
    for (const child of this.edgeGroup.children) {
      const material = (child as THREE.LineSegments).material as THREE.LineBasicMaterial
      material.color.set(theme.edge)
      material.opacity = theme.edgeOpacity
    }
    // Force the grid to be rebuilt with the new colours.
    this.gridSpan = 0
    this.updateBounds()
    this.needsRender = true
  }

  setDisplay(options: DisplayOptions) {
    this.display = options
    for (const child of this.modelGroup.children) {
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      material.wireframe = options.wireframe
      ;(child as THREE.Mesh).castShadow = options.shadows
    }
    for (const child of this.edgeGroup.children) child.visible = options.edges
    this.grid.visible = options.grid
    this.ground.visible = options.shadows
    this.sun.castShadow = options.shadows
    this.needsRender = true
  }

  /** PNG snapshot of the current view. */
  snapshot(): string {
    this.render()
    return this.renderer.domElement.toDataURL('image/png')
  }

  // --- lifecycle -----------------------------------------------------------

  private resize() {
    const width = Math.max(this.container.clientWidth, 1)
    const height = Math.max(this.container.clientHeight, 1)
    this.renderer.setSize(width, height)
    this.perspective.aspect = width / height
    this.perspective.updateProjectionMatrix()
    this.applyOrthoFrustum()
    this.needsRender = true
  }

  private render() {
    this.renderer.render(this.scene, this.activeCamera())
  }

  private animate = () => {
    this.frameHandle = requestAnimationFrame(this.animate)
    const damping = this.controls.update()
    if (damping || this.needsRender) {
      this.needsRender = false
      this.render()
    }
  }

  dispose() {
    cancelAnimationFrame(this.frameHandle)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.clearGroup(this.edgeGroup)
    this.clearGroup(this.modelGroup)
    this.disposeGrid()
    this.ground.geometry.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
