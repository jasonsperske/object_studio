import { goldGrain, grainUV } from './metalFinish'
import * as THREE from 'three'
import { box } from './geometry'
import { surfaceUV } from './media'
import type { Part, Params } from '../types'

export interface CartridgeProfile {
  family: 'atari' | 'nes' | 'famicom' | 'master' | 'genesis' | 'snes' | 'gameboy' | 'gamegear' | 'n64'
  width: number; height: number; depth: number
  color: number; pins: number; screws: number; box: [number, number, number]
}

/** Shared manufacturing primitives; each family supplies its own shell silhouette. */
export function buildCartridge(p: Params, profile: CartridgeProfile): Part[] {
  const f = profile.family, variant = String(p.variant ?? 'standard')
  const snes = f === 'snes'
  const genesis = f === 'genesis' && variant === 'standard'
  const opened = p.presentation === 'open', boxed = p.presentation === 'boxed'
  let w = profile.width, h = profile.height, d = profile.depth
  if (f === 'genesis' && variant === 'ea') { w += 6; h += 9 }
  if (f === 'gameboy' && variant === 'color') h += 4
  const color = p.finish === 'gold' ? 0xb79a42 : p.finish === 'black' ? 0x26282b : p.finish === 'yellow' ? 0xd4b53c : p.finish === 'grey' ? 0xa8a9a5 : profile.color
  const parts: Part[] = []
  const gap = opened ? Math.max(20, Number(p.openGap ?? 35)) : 0
  const ox = boxed ? -(profile.box[0] + 16) / 2 : 0
  const frontZ = gap, backZ = -d - gap
  const add = (name: string, geometry: THREE.BufferGeometry, tint = color) => { geometry.translate(ox, 0, 0); parts.push({ name, geometry, color: tint }); return parts[parts.length - 1] }
  const block = (name: string, width: number, height: number, depth: number, x: number, y: number, z: number, tint = color) => add(name, box(width, height, depth, x, y, z), tint)
  const outline = (rear = false) => {
    const s = new THREE.Shape()
    // Clockwise round the face from the connector corner.
    s.moveTo(-w / 2, 0)
    if (f === 'nes') {
      // Measured from the straight-on reference (344 × 388 px silhouette).
      // The upper grip is a pocket in the FRONT, backed by the rear shell;
      // it must not cut a large bite through the complete cartridge.
      s.moveTo(-w / 2 + 6.3, .8)
      s.lineTo(-w / 2 + 6.3, 24.7); s.lineTo(-w / 2, 24.7)
      s.lineTo(-w / 2, h)
      s.lineTo(-56.5, h); s.lineTo(-56.5, h - 1.4)
      s.lineTo(-49.2, h - 1.4); s.lineTo(-49.2, h)
      s.lineTo(-41.2, h); s.lineTo(-41.2, h - (rear ? .8 : 17.2))
      s.lineTo(-15, h - (rear ? .8 : 17.2)); s.lineTo(-15, h)
      s.lineTo(49.5, h); s.lineTo(49.5, h - 1.4)
      s.lineTo(56.2, h - 1.4); s.lineTo(56.2, h)
      s.lineTo(w / 2, h)
      s.lineTo(w / 2, 24.7); s.lineTo(w / 2 - 6.3, 24.7)
      s.lineTo(w / 2 - 6.3, .8)
      s.quadraticCurveTo(w / 2 - 6.3, 0, w / 2 - 7.1, 0)
      s.lineTo(-w / 2 + 7.1, 0)
      s.quadraticCurveTo(-w / 2 + 6.3, 0, -w / 2 + 6.3, .8)
      s.closePath()
      return s
    } else if (f === 'famicom') {
      // Thin rectangular reference shell with small corner radii and a lower
      // insertion tongue, rather than the broad rounded Sega-style shoulders.
      s.moveTo(-w / 2 + 5, 0)
      s.lineTo(-w / 2 + 5, 5); s.lineTo(-w / 2, 5)
      s.lineTo(-w / 2, h - 1.2)
      s.quadraticCurveTo(-w / 2, h, -w / 2 + 1.2, h)
      s.lineTo(w / 2 - 1.2, h)
      s.quadraticCurveTo(w / 2, h, w / 2, h - 1.2)
      s.lineTo(w / 2, 5); s.lineTo(w / 2 - 5, 5)
      s.lineTo(w / 2 - 5, 0); s.closePath()
      return s
    } else if (f === 'master') {
      s.moveTo(-w / 2, 0)
      s.lineTo(-w / 2, h - 1.5); s.lineTo(-w / 2 + 1.5, h)
      s.lineTo(w / 2 - 1.5, h); s.lineTo(w / 2, h - 1.5)
      s.lineTo(w / 2, 0)
      if (rear) for (const x of [w / 2 - 9, -w / 2 + 9]) {
        s.lineTo(x + 2, 0); s.lineTo(x + 2, 2.5)
        s.lineTo(x - 2, 2.5); s.lineTo(x - 2, 0)
      }
      s.closePath(); return s
    } else if (genesis) {
      // Small front-elevation corner radii; the broad rounding is in X/Z.
      s.moveTo(-w / 2 + 2, 0)
      s.quadraticCurveTo(-w / 2, 0, -w / 2, 2)
      s.lineTo(-w / 2, h - 2); s.quadraticCurveTo(-w / 2, h, -w / 2 + 2, h)
      s.lineTo(w / 2 - 2, h); s.quadraticCurveTo(w / 2, h, w / 2, h - 2)
      s.lineTo(w / 2, 2); s.quadraticCurveTo(w / 2, 0, w / 2 - 2, 0)
      s.closePath(); return s
    } else if (f === 'n64') {
      s.lineTo(-w / 2, h - 17); s.quadraticCurveTo(-w / 2, h - 3, -w / 2 + 17, h - 3)
      s.quadraticCurveTo(0, h + 3, w / 2 - 17, h - 3); s.quadraticCurveTo(w / 2, h - 3, w / 2, h - 17)
    } else if (f === 'gameboy' && variant === 'color') {
      s.lineTo(-w / 2, h - 8); s.quadraticCurveTo(0, h + 6, w / 2, h - 8)
    } else if (f === 'gameboy') {
      s.lineTo(-w / 2, h - 4); s.lineTo(-w / 2 + 4, h); s.lineTo(w / 2 - 8, h)
      s.lineTo(w / 2 - 8, h - 7); s.lineTo(w / 2, h - 7)
    } else if (snes) {
      s.lineTo(-w / 2, h - 3); s.lineTo(-w / 2 + 23, h - 3); s.lineTo(-w / 2 + 23, h)
      s.lineTo(w / 2 - 23, h); s.lineTo(w / 2 - 23, h - 3); s.lineTo(w / 2, h - 3)
    } else if (['genesis', 'gamegear'].includes(f)) {
      s.lineTo(-w / 2, h - 8); s.quadraticCurveTo(-w / 2, h, -w / 2 + 8, h)
      s.lineTo(w / 2 - 8, h); s.quadraticCurveTo(w / 2, h, w / 2, h - 8)
    } else {
      s.lineTo(-w / 2, h - 2); s.lineTo(-w / 2 + 2, h); s.lineTo(w / 2 - 2, h); s.lineTo(w / 2, h - 2)
    }
    s.lineTo(w / 2, 0)
    if (rear && (f === 'n64' || (snes))) {
      const offset = f === 'n64' ? (variant === 'japan' ? w * .25 : w * .36) : w * .42
      for (const x of [offset, -offset]) {
        s.lineTo(x + 3.5, 0); s.lineTo(x + 3.5, 13); s.lineTo(x - 3.5, 13); s.lineTo(x - 3.5, 0)
      }
    }
    s.closePath()
    return s
  }
  const hole = (s: THREE.Shape, x: number, y: number, width: number, height: number) => {
    const path = new THREE.Path(); path.moveTo(x, y); path.lineTo(x + width, y); path.lineTo(x + width, y + height); path.lineTo(x, y + height); path.closePath(); s.holes.push(path)
  }
  const sheet = (shape: THREE.Shape, depth: number, z: number) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 }).translate(0, 0, z)
  const nwc = f === 'nes' && variant === 'nwc1990'
  const roundLabel = (x: number, y: number, width: number, height: number, radius: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(x + radius, y); shape.lineTo(x + width - radius, y)
    shape.quadraticCurveTo(x + width, y, x + width, y + radius)
    shape.lineTo(x + width, y + height); shape.lineTo(x, y + height)
    shape.lineTo(x, y + radius); shape.quadraticCurveTo(x, y, x + radius, y)
    return shape
  }
  const nesLabel = roundLabel(-12.6, nwc ? 83 : 41.8, 57.2, nwc ? 49.9 : 91.1, 1.5)
  const famicomLabel = new THREE.Shape()
  const lx = -w / 2 + 8, ly = 11, lw = w - 16, lh = h - 23, lr = 1.7
  famicomLabel.moveTo(lx + lr, ly)
  famicomLabel.lineTo(lx + lw - lr, ly); famicomLabel.quadraticCurveTo(lx + lw, ly, lx + lw, ly + lr)
  famicomLabel.lineTo(lx + lw, ly + lh - lr); famicomLabel.quadraticCurveTo(lx + lw, ly + lh, lx + lw - lr, ly + lh)
  famicomLabel.lineTo(lx + lr, ly + lh); famicomLabel.quadraticCurveTo(lx, ly + lh, lx, ly + lh - lr)
  famicomLabel.lineTo(lx, ly + lr); famicomLabel.quadraticCurveTo(lx, ly, lx + lr, ly)
  const snesLabel = roundLabel(-w * .31, h * .51, w * .62, h * .49 + .03, 2)
  const snesPocket = new THREE.Shape(roundLabel(-w * .31, .5, w * .62, 30, 2).getPoints(16).map(v => new THREE.Vector2(v.x, 31 - v.y)))
  const masterLabel = roundLabel(-w / 2 + 4, h - 19, w - 8, 19.03, 1)
  const arrow = new THREE.Shape()
  arrow.moveTo(-6.3, 35); arrow.lineTo(5.9, 35); arrow.lineTo(-.2, 26.4); arrow.closePath()
  const front = outline()
  if (f === 'nes') {
    front.holes.push(new THREE.Path(nesLabel.getPoints(16)))
    front.holes.push(new THREE.Path(arrow.getPoints()))
    // The grip is a recessed channel, not a row of raised bars on a flat face.
    hole(front, -41.2, .15, 26.2, h - 17.5)
  }
  if (f === 'famicom') front.holes.push(new THREE.Path(famicomLabel.getPoints(12)))
  if (snes) {
    front.holes.push(new THREE.Path(snesPocket.getPoints(16)))
    for (const x of [-w * .42, w * .42]) {
      const bore = new THREE.Path(); bore.absarc(x, 6, 2.6, 0, Math.PI * 2, true); front.holes.push(bore)
    }
  }
  if (nwc) hole(front, w * .22, h * .32, 16, 23)
  add('front-shell', sheet(front, 1.5, frontZ - 1.5))
  const rear = outline(true)
  const rearGrip = new THREE.Shape()
  rearGrip.moveTo(-w * .34, h - 10)
  rearGrip.lineTo(w * .34, h - 10)
  rearGrip.absarc(w * .34, h - 14, 4, Math.PI / 2, -Math.PI / 2, true)
  rearGrip.lineTo(-w * .34, h - 18)
  rearGrip.absarc(-w * .34, h - 14, 4, -Math.PI / 2, Math.PI / 2, true)
  rearGrip.closePath()
  if (genesis) {
    rear.holes.push(new THREE.Path(rearGrip.getPoints(16)))
    for (const x of [-w * .32, w * .32]) {
      const bore = new THREE.Path(); bore.absarc(x, h * .48, 3.1, 0, Math.PI * 2, true); rear.holes.push(bore)
    }
  }
  if (f === 'master') for (const x of [-w * .39, w * .39]) {
    const bore = new THREE.Path(); bore.absarc(x, h * .56, 3.1, 0, Math.PI * 2, true)
    rear.holes.push(bore)
  }
  add('rear-shell', sheet(rear, 1.5, backZ))
  // Open-backed trays: offset contours form walls, leaving the connector edge open.
  for (const [name, z] of [['front', frontZ - d / 2 + .2], ['rear', backZ + 1.5]] as const) {
    const shape = outline(name === 'rear')
    const contour = shape.getPoints(24)
    if (contour[0].distanceTo(contour[contour.length - 1]) < 1e-6) contour.pop()
    // Intersect inward-offset edge lines. Scaling a concave contour would cross
    // the thumb notch and regional key cuts instead of following their walls.
    const points = contour.map((v, i) => {
      const previous = contour[(i + contour.length - 1) % contour.length], next = contour[(i + 1) % contour.length]
      const a = v.clone().sub(previous).normalize(), b = next.clone().sub(v).normalize()
      const na = new THREE.Vector2(a.y, -a.x), nb = new THREE.Vector2(b.y, -b.x)
      return v.clone().add(na.add(nb).multiplyScalar(1.5 / Math.max(.05, 1 + a.dot(b))))
    })
    const path = new THREE.Path(points.reverse()); path.closePath(); shape.holes.push(path)
    // Walls stop above the edge connector using a shallow bottom notch in the outer contour.
    // The bottom strip is omitted by dropping the wall triangles below y=2.
    const g = sheet(shape, d / 2 - 1.7, z)
    const pos = g.getAttribute('position'), uv = g.getAttribute('uv'), normals = g.getAttribute('normal')
    const coords: number[] = [], tex: number[] = [], ns: number[] = []
    for (let i = 0; i < pos.count; i += 3) {
      if ([0, 1, 2].every(j => pos.getY(i + j) < 2)) continue
      for (let j = 0; j < 3; j++) { const k = i + j; coords.push(pos.getX(k), pos.getY(k), pos.getZ(k)); tex.push(uv.getX(k), uv.getY(k)); ns.push(normals.getX(k), normals.getY(k), normals.getZ(k)) }
    }
    const walls = new THREE.BufferGeometry(); walls.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3)); walls.setAttribute('normal', new THREE.Float32BufferAttribute(ns, 3)); walls.setAttribute('uv', new THREE.Float32BufferAttribute(tex, 2)); g.dispose()
    add(`${name}-rim`, walls)
  }
  if (genesis) for (const part of parts.filter(part => ['front-shell', 'front-rim'].includes(part.name))) {
    // Slice the original tray into narrow cross sections before rolling its
    // cheeks. Analytic normals keep the curve smooth without softening seams.
    const source = part.geometry, pos = source.getAttribute('position'), normals = source.getAttribute('normal')
    const vertices: number[] = [], ns: number[] = []
    const radius = w * .15, start = w * .35, depth = d / 2 - .2
    const emit = (v: THREE.Vector3, normal: THREE.Vector3) => {
      const x = v.x - ox, t = Math.min(1, Math.max(0, (Math.abs(x) - start) / radius))
      const angle = t * Math.PI / 2, k = Math.max(0, Math.min(1, (v.z - frontZ + d / 2) / (d / 2)))
      const drop = depth * (1 - Math.cos(angle))
      if (t > 0) {
        v.x = ox + Math.sign(x) * (start + radius * Math.sin(angle))
        const dx = Math.max(1e-5, Math.cos(angle) * Math.PI / 2)
        const dz = 1 - drop / (d / 2)
        const slope = Math.sign(x) * depth * Math.sin(angle) * Math.PI / (2 * radius) * k
        normal.set(normal.x / dx + normal.z * slope / (dx * dz), normal.y, normal.z / dz).normalize()
      }
      v.z -= drop * k
      vertices.push(v.x, v.y, v.z); ns.push(normal.x, normal.y, normal.z)
    }
    const cuts = [-w / 2, -start, start, w / 2]
    for (let i = 1; i < 32; i++) { cuts.push(-w / 2 + radius * i / 32, start + radius * i / 32) }
    cuts.sort((a, b) => a - b)
    const clip = (poly: THREE.Vector3[], edge: number, above: boolean) => {
      const out: THREE.Vector3[] = []
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length]
        const inside = above ? a.x >= edge : a.x <= edge
        if (inside) out.push(a.clone())
        if (inside !== (above ? b.x >= edge : b.x <= edge)) out.push(a.clone().lerp(b, (edge - a.x) / (b.x - a.x)))
      }
      return out
    }
    for (let i = 0; i < pos.count; i += 3) {
      const triangle = [0, 1, 2].map(j => new THREE.Vector3().fromBufferAttribute(pos, i + j))
      const normal = new THREE.Vector3().fromBufferAttribute(normals, i)
      for (let c = 0; c < cuts.length - 1; c++) {
        const poly = clip(clip(triangle, ox + cuts[c], true), ox + cuts[c + 1], false)
        for (let j = 1; j < poly.length - 1; j++) {
          if (poly[j].clone().sub(poly[0]).cross(poly[j + 1].clone().sub(poly[0])).lengthSq() < 1e-12) continue
          for (const v of [poly[0], poly[j], poly[j + 1]]) emit(v.clone(), normal.clone())
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(ns, 3))
    part.geometry = geometry; source.dispose()
  }
  const plane = (id: string, label: string, width: number, height: number, x: number, y: number, z: number, rotation: [number, number, number] = [0, 0, 0]) => {
    const g = new THREE.PlaneGeometry(width, height); g.rotateX(rotation[0]); g.rotateY(rotation[1]); g.rotateZ(rotation[2]); g.translate(x, y, z)
    const part = add(id, g, 0xe8e5da); part.mediaSurface = { id, label, accept: 'image' }
  }
  let labelW = w * .73, labelH = h * .53, labelY = h * .55, labelX = 0
  if (f === 'nes') { labelW = 57.2; labelH = 91.1; labelY = 87.35; labelX = 16 }
  if (nwc) { labelH = 49.9; labelY = 107.95 }
  if (f === 'snes' || f === 'n64') { labelW = w * .61; labelH = h * .53; labelY = h * .54 }
  if (f === 'gameboy') { labelW = w * .78; labelH = h * .49; labelY = h * .48 }
  if (f === 'nes') {
    // Recess floors lie below the shell face. The textured face follows the
    // rounded lower corners, keeping the image off the surrounding plastic.
    add('label-recess-floor', sheet(nesLabel, 1.25, frontZ - 1.5))
    const label = new THREE.ShapeGeometry(nesLabel, 16)
    surfaceUV(label); label.translate(0, 0, frontZ - .23)
    const part = add('cart-front', label)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front label', accept: 'image' }
  } else if (f === 'master') {
    // The sticker wraps the upper edge; both UV surfaces share the same seam.
    const label = new THREE.ShapeGeometry(masterLabel, 12)
    surfaceUV(label); label.translate(0, 0, frontZ + .03)
    const part = add('cart-front', label, 0xe8e5da)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front title band', accept: 'image' }
  } else if (snes) {
    // Separate UV slots meet at the fold of one continuous sticker.
    const label = new THREE.ShapeGeometry(snesLabel, 16)
    surfaceUV(label); label.translate(0, 0, frontZ + .03)
    const part = add('cart-front', label, 0xe8e5da)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front label', accept: 'image' }
    add('lower-front-pocket', sheet(snesPocket, .3, frontZ - 1.5))
    block('lower-pocket-center-tab', 24, 18, .45, -12, 12.5, frontZ - 1.2)
  } else if (genesis) {
    const label = new THREE.ShapeGeometry(roundLabel(-w * .35, 9, w * .7, h - 9 + .03, 1.5), 16)
    surfaceUV(label); label.translate(0, 0, frontZ + .03)
    const part = add('cart-front', label, 0xe8e5da)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front label', accept: 'image' }
  } else if (f === 'famicom') {
    add('label-recess-floor', sheet(famicomLabel, 1.15, frontZ - 1.5))
    const label = new THREE.ShapeGeometry(famicomLabel, 12)
    surfaceUV(label); label.translate(0, 0, frontZ - .33)
    const part = add('cart-front', label, 0xf0efdf)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front label', accept: 'image' }
  } else {
    block('label-recess', labelW + 2, labelH + 2, .3, labelX - labelW / 2 - 1, labelY - labelH / 2 - 1, frontZ, color)
    plane('cart-front', 'Cartridge front label', labelW, labelH, labelX, labelY, frontZ + .32)
  }
  // NES caution label sits below the shared center screw, between the lower pair.
  plane('cart-back', 'Cartridge rear label', w * (f === 'nes' ? .68 : f === 'master' ? .64 : snes ? .60 : genesis ? .72 : .6), h * (f === 'nes' ? .24 : f === 'master' ? .32 : snes ? .38 : genesis ? .23 : .3), 0, h * (f === 'nes' ? .40 : f === 'master' ? .50 : snes ? .66 : genesis ? .19 : .57), backZ - .03, [0, Math.PI, 0])
  if (snes) plane('cart-top', 'Cartridge top label', w * .62, d * .4, 0, h + .03, frontZ + .03 - d * .2, [-Math.PI / 2, 0, 0])
  else if (genesis) plane('cart-top', 'Cartridge top label', w * .7, d * .4, 0, h + .03, frontZ + .03 - d * .2, [-Math.PI / 2, 0, 0])
  else if (f === 'master') plane('cart-top', 'Cartridge top label', w - 8, d * .4, 0, h + .03, frontZ + .03 - d * .2, [-Math.PI / 2, 0, 0])
  else if (!['gameboy', 'gamegear', 'n64', 'famicom'].includes(f)) plane('cart-top', 'Cartridge top label', Math.min(labelW, w - 30), d * .4, f === 'nes' ? labelX : 0, h + .05, frontZ - d * .25, [-Math.PI / 2, 0, 0])
  // Distinctive moulded grips and shell latches.
  if (f === 'nes') {
    block('grip-channel-floor', 26.2, h - 17.2, 1.05, -41.2, 0, frontZ - 1.5)
    // Fine, closely spaced lands: forty below the deeper five-rib thumb pocket.
    for (let i = 0; i < 40; i++) block(`grip-rib-${i + 1}`, 25.8, 1.85, .32, -41, 14.5 + i * 2.5, frontZ - .45)
    const foot = roundLabel(0, 0, 25.8, 13, 1.3)
    add('grip-foot', sheet(foot, .32, frontZ - .45).rotateZ(Math.PI).translate(-15.2, 13.15, 0))
    block('thumb-pocket-floor', 26.2, 16.4, 1, -41.2, h - 17.2, frontZ - 4)
    for (let i = 0; i < 5; i++) block(`thumb-rib-${i + 1}`, 25.8, 1.8, .4, -41, h - 15.7 + i * 3.05, frontZ - 3)
    block('thumb-pocket-left-wall', .3, 16.4, 3, -41.2, h - 17.2, frontZ - 3)
    block('thumb-pocket-right-wall', .3, 16.4, 3, -15.3, h - 17.2, frontZ - 3)
    block('thumb-pocket-bottom-wall', 26.2, .35, 3, -41.2, h - 17.2, frontZ - 3)
    add('insertion-arrow', sheet(arrow, 1.2, frontZ - 1.5))
    if (String(p.screws) !== '5') for (const x of [-w * .44, w * .36]) block('top-latch', 7, 3, 3, x - 3.5, h - 5, frontZ - d / 2)
  }
  if (!snes && ['snes', 'n64', 'gamegear', 'gameboy'].includes(f)) {
    for (let side = -1; side <= 1; side += 2) for (let i = 0; i < (f === 'gameboy' ? 6 : 4); i++) block(`grip-${side}-${i}`, w * .075, 1.2, .7, side < 0 ? -w / 2 + 2 : w / 2 - w * .075 - 2, h * .55 + i * 3, frontZ)
  }
  if (snes) {
    for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
      const x = side < 0 ? -w / 2 : w / 2 - 22
      const band = new THREE.Shape()
      band.moveTo(x, 1 + i * 13.8); band.lineTo(x + 22, 1 + i * 13.8); band.lineTo(x + 22, 14.1 + i * 13.8); band.lineTo(x, 14.1 + i * 13.8); band.closePath()
      if (i === 0) { const bore = new THREE.Path(); bore.absarc(side * w * .42, 6, 2.6, 0, Math.PI * 2, true); band.holes.push(bore) }
      add(`front-side-band-${side}-${i}`, sheet(band, .6, frontZ))
      if (i > 0) block(`rear-side-band-${side}-${i}`, 22, 13.1, .4, x, 1 + i * 13.8, backZ - .4)
    }
    // Raised framing bridges the upper label and lower recessed panel.
    for (const x of [-w * .31 - 2.2, w * .31]) block('front-frame-rail', 2.2, h - .5, .65, x, .5, frontZ)
    block('rear-lower-band', w - 4, 10, .4, -w / 2 + 2, 16, backZ - .4)
    if (opened) for (const x of [-w * .36, w * .36]) {
      block('board-support', 2, 22, d * .3, x, 9, backZ + 1.5)
      block('upper-shell-rib', 2, 12, d * .27, x, h - 14, backZ + 1.5)
    }
  }
  if (f === 'master') {
    // Continuous rails frame the title band, leaving the lower face blank.
    for (let i = 0; i < 3; i++) {
      const y = h - 25 + i * 1.7
      block(`front-grip-rail-${i + 1}`, w, .7, .45, -w / 2, y, frontZ)
      for (const side of [-1, 1]) block(`side-grip-rail-${i + 1}-${side}`, .4, .7, d / 2 - .4,
        side < 0 ? -w / 2 - .4 : w / 2, y, frontZ - d / 2 + .2)
    }
    block('rear-upper-band', w - 6, 5, .4, -w / 2 + 3, h - 8, backZ - .4)
  }
  if (genesis) {
    // A shallow capsule pocket, with its floor behind the rear face.
    add('rear-grip-floor', sheet(rearGrip, .3, backZ + 1.2), new THREE.Color(color).multiplyScalar(.65).getHex())
    block('rear-maker-panel', 28, 12, .25, -14, h * .43, backZ - .25)
  }

  if (f === 'genesis' && variant === 'ea') block('yellow-release-tab', 8, 22, 5, w / 2 - 4, h * .6, frontZ - 3, 0xc6ad37)
  if (f === 'atari') block('connector-dust-shutter', w * .66, 5, d * .5, -w * .33, 1, -d * .75, 0x252629)
  if (f === 'famicom') {
    for (let i = 0; i < 4; i++) block(`top-grip-rib-${i + 1}`, w - 5, .65, .4, -w / 2 + 2.5, h - 8.5 + i * 2.2, frontZ)
    block('connector-lip', w - 10, 1.2, .45, -w / 2 + 5, .3, frontZ)
  }
  const count = f === 'nes' ? Number(p.screws ?? 3) : profile.screws
  // Rear-view reference: the center and lower pair are shared by both NES
  // revisions; only the five-screw shell has the two screws near the top corners.
  const locations = f === 'nes'
    ? [[-w * .45, h * .26], [w * .45, h * .26], [0, h * .58],
      ...(count === 5 ? [[-w * .43, h * .94], [w * .43, h * .94]] : [])]
    : snes ? [[-w * .42, 6], [w * .42, 6]]
    : genesis ? [[-w * .32, h * .48], [w * .32, h * .48]]
    : f === 'master' ? [[-w * .39, h * .56], [w * .39, h * .56]]
    : count === 1 ? [[0, h * .3]] : count === 2 ? [[-w * .34, h * .25], [w * .34, h * .25]] : [[-w * .39, h * .2], [w * .39, h * .2], [0, h * .77], ...(count === 5 ? [[-w * .39, h * .91], [w * .39, h * .91]] : [])]
  locations.forEach(([x, y], i) => {
    const screwZ = snes ? frontZ - .65 : backZ + (opened ? -10 : (f === 'master' || genesis) ? .65 : -.8)
    const screw = new THREE.CylinderGeometry(2, 2, 1.1, 16).rotateX(Math.PI / 2).translate(x, y, screwZ)
    add(`screw-${i + 1}`, screw, 0x777b7d)
    block(`screw-slot-${i + 1}`, 2.5, .55, .1, x - 1.25, y - .275, screwZ + (snes ? .56 : -.6), 0x242628)
    if (f === 'master' || genesis) {
      const well = new THREE.CylinderGeometry(3.1, 3.1, 1.5, 24, 1, true).rotateX(Math.PI / 2).translate(x, y, backZ + .75)
      // These are the inside walls of a bore, so wind and shade inward.
      const index = well.index!, normal = well.getAttribute('normal')
      for (let j = 0; j < index.count; j += 3) { const b = index.getX(j + 1); index.setX(j + 1, index.getX(j + 2)); index.setX(j + 2, b) }
      for (let j = 0; j < normal.count; j++) normal.setXYZ(j, -normal.getX(j), -normal.getY(j), -normal.getZ(j))
      add(`screw-well-${i + 1}`, well)
      if (genesis) add(`screw-seat-${i + 1}`, new THREE.RingGeometry(1.3, 3.1, 24).rotateY(Math.PI).translate(x, y, backZ + 1.45))
    }
    if (opened) add(`screw-boss-${i + 1}`, new THREE.CylinderGeometry(3.5, 3.5, d * .28, 16).rotateX(Math.PI / 2).translate(x, y, backZ + 1.5 + d * .14))
  })
  const boardW = w * .77, boardH = f === 'nes' ? h * (nwc ? .79 : .47) : snes ? 26 : h * .73
  const boardY = f === 'master' || genesis ? 8 : 3
  block('circuit-board', boardW, boardH, 1.4, -boardW / 2, snes ? 11 : boardY, -d / 2 - .7, 0x285d42)
  if (snes) block('connector-tongue', w * .44, 10, 1.4, -w * .22, 1, -d / 2 - .7, 0x285d42)
  for (let i = 0; i < profile.pins; i++) {
    const contactWidth = snes ? w * .43 : boardW * .9
    const pitch = contactWidth / profile.pins, x = -contactWidth / 2 + i * pitch
    for (const z of [-d / 2 - .76, -d / 2 + .71]) block(`contact-${i + 1}-${z < -d / 2 ? 'rear' : 'front'}`, pitch * .64, 7, .05, x, boardY, z, 0xb9a553)
  }
  if (opened || nwc) {
    for (let i = 0; i < (nwc ? 4 : 2); i++) {
      const x = -boardW * .31 + (i % 2) * boardW * .4, y = 17 + Math.floor(i / 2) * 22
      block(`rom-${i + 1}`, boardW * .25, 14, 3.2, x, y, -d / 2 + .7, 0x202326)
      for (let j = 0; j < 8; j++) for (const edge of [0, 1]) block('chip-leg', 1, .7, 1.2, x + j * boardW * .03, y - .7 + edge * 14.7, -d / 2 + 1, 0x9b9fa1)
    }
    if (p.battery) add('save-battery', new THREE.CylinderGeometry(8, 8, 2, 24).rotateX(Math.PI / 2).translate(boardW * .23, boardH - 10, -d / 2 + 2.2), 0xb9bdbe)
  }
  if (nwc) {
    block('dip-switch-housing', 14, 21, d / 2 - 1, w * .22 + 1, h * .32 + 1, -d / 2 + .7, 0x254e8a)
    for (let i = 0; i < 4; i++) block(`dip-switch-${i + 1}`, 7, 2, 1.4, w * .22 + (i === 2 ? 5 : 2), h * .32 + 3 + i * 4.2, -.2, 0xe5e3d9)
  }
  if (boxed) {
    const [bw, bh, bd] = profile.box, bx = w / 2 + 16 + bw / 2
    const plastic = ['genesis', 'master'].includes(f)
    block('box-body', bw, bh, bd, bx - bw / 2, 0, -bd, plastic ? 0x24262a : 0xd9d5c8)
    if (plastic) block('case-spine-hinge', 3, bh - 4, bd + 1, bx - bw / 2 - 1, 2, -bd - .5, 0x16181a)
    else for (const y of [1, bh - 2]) block('box-fold', bw - 2, .45, .2, bx - bw / 2 + 1, y, .01, 0xb1ac9f)
    plane('box-front', 'Box front', bw - 2, bh - 2, bx, bh / 2, .25)
    plane('box-back', 'Box back', bw - 2, bh - 2, bx, bh / 2, -bd - .05, [0, Math.PI, 0])
    plane('box-spine', 'Box left spine', bd - 2, bh - 2, bx - bw / 2 - .05, bh / 2, -bd / 2, [0, -Math.PI / 2, 0])
    plane('box-right', 'Box right spine', bd - 2, bh - 2, bx + bw / 2 + .05, bh / 2, -bd / 2, [0, Math.PI / 2, 0])
    plane('box-top', 'Box top flap', bw - 2, bd - 2, bx, bh + .05, -bd / 2, [-Math.PI / 2, 0, 0])
    plane('box-bottom', 'Box bottom flap', bw - 2, bd - 2, bx, -.05, -bd / 2, [Math.PI / 2, 0, 0])
  }
  // Floor convention also includes the underside label offset.
  if (boxed) for (const part of parts) part.geometry.translate(0, .05, 0)
  let grain: THREE.Texture | undefined
  for (const part of parts) if (p.finish === 'gold' && part.color === color && !part.mediaSurface) {
    if (f === 'nes') {
      grain ??= goldGrain()
      part.color = 0xe4ba63
      part.metalness = .94
      part.roughness = .22
      part.normalMap = grain
      grainUV(part.geometry)
    } else { part.metalness = .55; part.roughness = .38 }
  }
  return parts
}
