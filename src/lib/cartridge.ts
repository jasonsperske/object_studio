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
  const opened = p.presentation === 'open', boxed = p.presentation === 'boxed'
  let w = profile.width, h = profile.height, d = profile.depth
  if (f === 'genesis' && variant === 'ea') { w += 6; h += 9 }
  if (f === 'snes' && variant === 'sfc') { w = 127; h = 87; d = 20 }
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
      // Lower insertion tongue, broad shoulders, and the notch over the left grip.
      s.moveTo(-w / 2 + 4, 0)
      s.lineTo(-w / 2 + 4, 24); s.lineTo(-w / 2, 24)
      s.lineTo(-w / 2, h - 1); s.lineTo(-w / 2 + 1, h)
      s.lineTo(-44, h); s.lineTo(-44, h - 7)
      s.lineTo(-18, h - 7); s.lineTo(-18, h)
      s.lineTo(w / 2 - 1, h); s.lineTo(w / 2, h - 1)
      s.lineTo(w / 2, 24); s.lineTo(w / 2 - 4, 24)
      s.lineTo(w / 2 - 4, 0); s.closePath()
      return s
    } else if (f === 'n64') {
      s.lineTo(-w / 2, h - 17); s.quadraticCurveTo(-w / 2, h - 3, -w / 2 + 17, h - 3)
      s.quadraticCurveTo(0, h + 3, w / 2 - 17, h - 3); s.quadraticCurveTo(w / 2, h - 3, w / 2, h - 17)
    } else if (f === 'gameboy' && variant === 'color') {
      s.lineTo(-w / 2, h - 8); s.quadraticCurveTo(0, h + 6, w / 2, h - 8)
    } else if (f === 'gameboy') {
      s.lineTo(-w / 2, h - 4); s.lineTo(-w / 2 + 4, h); s.lineTo(w / 2 - 8, h)
      s.lineTo(w / 2 - 8, h - 7); s.lineTo(w / 2, h - 7)
    } else if (f === 'snes' && variant !== 'sfc') {
      s.lineTo(-w / 2, h - 13); s.lineTo(-w / 2 + 12, h - 13); s.lineTo(-w / 2 + 12, h)
      s.lineTo(w / 2 - 12, h); s.lineTo(w / 2 - 12, h - 13); s.lineTo(w / 2, h - 13)
    } else if (['genesis', 'gamegear', 'famicom'].includes(f) || (f === 'snes' && variant === 'sfc')) {
      s.lineTo(-w / 2, h - 8); s.quadraticCurveTo(-w / 2, h, -w / 2 + 8, h)
      s.lineTo(w / 2 - 8, h); s.quadraticCurveTo(w / 2, h, w / 2, h - 8)
    } else {
      s.lineTo(-w / 2, h - 2); s.lineTo(-w / 2 + 2, h); s.lineTo(w / 2 - 2, h); s.lineTo(w / 2, h - 2)
    }
    s.lineTo(w / 2, 0)
    if (rear && (f === 'n64' || (f === 'snes' && variant !== 'sfc'))) {
      const offset = f === 'n64' ? (variant === 'japan' ? w * .25 : w * .36) : w * .36
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
  const nesLabel = roundLabel(-15, nwc ? 83 : 48, 66, nwc ? 48 : 83, 2)
  const arrow = new THREE.Shape()
  arrow.moveTo(-11, 39); arrow.lineTo(1, 39); arrow.lineTo(-5, 30); arrow.closePath()
  const front = outline()
  if (f === 'nes') {
    front.holes.push(new THREE.Path(nesLabel.getPoints(16)))
    front.holes.push(new THREE.Path(arrow.getPoints()))
    // The grip is a recessed channel, not a row of raised bars on a flat face.
    hole(front, -44, 5, 26, h - 12.1)
  }
  if (nwc) hole(front, w * .22, h * .32, 16, 23)
  add('front-shell', sheet(front, 1.5, frontZ - 1.5))
  add('rear-shell', sheet(outline(true), 1.5, backZ))
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
  const plane = (id: string, label: string, width: number, height: number, x: number, y: number, z: number, rotation: [number, number, number] = [0, 0, 0]) => {
    const g = new THREE.PlaneGeometry(width, height); g.rotateX(rotation[0]); g.rotateY(rotation[1]); g.rotateZ(rotation[2]); g.translate(x, y, z)
    const part = add(id, g, 0xe8e5da); part.mediaSurface = { id, label, accept: 'image' }
  }
  let labelW = w * .73, labelH = h * .53, labelY = h * .55, labelX = 0
  if (f === 'nes') { labelW = 66; labelH = 83; labelY = 89.5; labelX = 18 }
  if (nwc) { labelH = 48; labelY = 107 }
  if (f === 'snes' || f === 'n64') { labelW = w * .61; labelH = h * .53; labelY = h * .54 }
  if (f === 'gameboy') { labelW = w * .78; labelH = h * .49; labelY = h * .48 }
  if (f === 'nes') {
    // Recess floors lie below the shell face. The textured face follows the
    // rounded lower corners, keeping the image off the surrounding plastic.
    add('label-recess-floor', sheet(nesLabel, .9, frontZ - 1.5))
    const label = new THREE.ShapeGeometry(nesLabel, 16)
    surfaceUV(label); label.translate(0, 0, frontZ - .58)
    const part = add('cart-front', label)
    part.mediaSurface = { id: 'cart-front', label: 'Cartridge front label', accept: 'image' }
  } else {
    block('label-recess', labelW + 2, labelH + 2, .3, labelX - labelW / 2 - 1, labelY - labelH / 2 - 1, frontZ, color)
    plane('cart-front', 'Cartridge front label', labelW, labelH, labelX, labelY, frontZ + .32)
  }
  plane('cart-back', 'Cartridge rear label', w * .6, h * .3, 0, h * .57, backZ - .03, [0, Math.PI, 0])
  if (!['gameboy', 'gamegear', 'n64'].includes(f)) plane('cart-top', 'Cartridge top label', Math.min(labelW, w - 30), d * .4, f === 'nes' ? labelX : 0, h + .05, frontZ - d * .25, [-Math.PI / 2, 0, 0])
  // Distinctive moulded grips and shell latches.
  if (f === 'nes') {
    block('grip-channel-floor', 26, h - 12, .7, -44, 5, frontZ - 1.5)
    // Full-height horizontal grip lands, inset flush with the shell surface.
    // Leave a smooth foot below the ribs, as on the supplied blank shell.
    for (let i = 0; i < 23; i++) block(`grip-rib-${i + 1}`, 25.6, 3.25, .65, -43.8, 18 + i * 4.65, frontZ - .8)
    block('grip-foot', 25.6, 10.5, .65, -43.8, 5.3, frontZ - .8)
    add('insertion-arrow', sheet(arrow, .8, frontZ - 1.5))
    block('connector-lip', w - 9, 1.2, 1.4, -w / 2 + 4.5, .5, frontZ - .5)
    if (String(p.screws) !== '5') for (const x of [-w * .44, w * .36]) block('top-latch', 7, 3, 3, x - 3.5, h - 5, frontZ - d / 2)
  }
  if (['snes', 'n64', 'gamegear', 'master', 'gameboy'].includes(f)) {
    for (let side = -1; side <= 1; side += 2) for (let i = 0; i < (f === 'gameboy' ? 6 : 4); i++) block(`grip-${side}-${i}`, w * .075, 1.2, .7, side < 0 ? -w / 2 + 2 : w / 2 - w * .075 - 2, h * .55 + i * 3, frontZ)
  }
  if (f === 'snes' && variant === 'sfc') block('rounded-top-band', w - 18, 5, .8, -w / 2 + 9, h - 9, frontZ)
  if (f === 'genesis' && variant === 'ea') block('yellow-release-tab', 8, 22, 5, w / 2 - 4, h * .6, frontZ - 3, 0xc6ad37)
  if (f === 'atari') block('connector-dust-shutter', w * .66, 5, d * .5, -w * .33, 1, -d * .75, 0x252629)
  if (f === 'famicom') for (const x of [-w / 2, w / 2 - 4]) block('side-grip', 4, h * .5, 2, x, h * .3, frontZ)
  const count = f === 'nes' ? Number(p.screws ?? 3) : profile.screws
  const locations = count === 1 ? [[0, h * .3]] : count === 2 ? [[-w * .34, h * .25], [w * .34, h * .25]] : [[-w * .39, h * .2], [w * .39, h * .2], [0, h * .77], ...(count === 5 ? [[-w * .39, h * .91], [w * .39, h * .91]] : [])]
  locations.forEach(([x, y], i) => {
    const screwZ = backZ - (opened ? 10 : .8)
    const screw = new THREE.CylinderGeometry(2, 2, 1.1, 16).rotateX(Math.PI / 2).translate(x, y, screwZ)
    add(`screw-${i + 1}`, screw, 0x777b7d)
    block(`screw-slot-${i + 1}`, 2.5, .55, .1, x - 1.25, y - .275, screwZ - .6, 0x242628)
    if (opened) add(`screw-boss-${i + 1}`, new THREE.CylinderGeometry(3.5, 3.5, d * .28, 16).rotateX(Math.PI / 2).translate(x, y, backZ + 1.5 + d * .14))
  })
  const boardW = w * .77, boardH = f === 'nes' ? h * (nwc ? .79 : .47) : h * .73
  block('circuit-board', boardW, boardH, 1.4, -boardW / 2, 3, -d / 2 - .7, 0x285d42)
  for (let i = 0; i < profile.pins; i++) {
    const pitch = boardW * .9 / profile.pins, x = -boardW * .45 + i * pitch
    for (const z of [-d / 2 - .76, -d / 2 + .71]) block(`contact-${i + 1}-${z < -d / 2 ? 'rear' : 'front'}`, pitch * .64, 7, .05, x, 3, z, 0xb9a553)
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
  for (const part of parts) if (p.finish === 'gold' && part.color === color && !part.mediaSurface) { part.metalness = .55; part.roughness = .38 }
  return parts
}
