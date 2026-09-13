import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import * as THREE from 'three'
import { compileObject } from '../src/lib/compile'
import { defaultParams } from '../src/types'
import { applySurfaceTextures, fileMediaKind, listMediaSurfaces } from '../src/lib/media'
import { reduceDetail, normalizeLod, disposeLodParts } from '../src/lib/lod'

const load = (id: string) => compileObject(id, readFileSync(new URL(`../objects/${id}.js`, import.meta.url), 'utf8'))
const ids = readdirSync(new URL('../objects/', import.meta.url)).filter(n => n.endsWith('-cartridge.js')).map(n => n.slice(0, -3))
for (const id of ids) test(`${id}: all presentations and shell variants produce finite, grounded geometry and blank UV slots`, () => {
  const def = load(id), defaults = defaultParams(def)
  const variants = def.params.find(p => p.id === 'variant')
  for (const variant of variants?.type === 'select' ? variants.options.map(o => o.value) : ['standard']) for (const presentation of ['cart', 'boxed', 'open']) {
    const parts = def.build({ ...defaults, variant, presentation })
    const slots = listMediaSurfaces(parts)
    assert.ok(slots.length >= 2)
    assert.equal(new Set(slots.map(s => s.id)).size, slots.length)
    assert.ok(slots.every(s => s.accept === 'image'))
    assert.equal(slots.some(s => s.id === 'box-front'), presentation === 'boxed')
    for (const p of parts) {
      assert.ok(!p.map, `${p.name} should be blank`)
      const pos = p.geometry.getAttribute('position')
      assert.ok(pos.count > 0, p.name)
      assert.ok(Array.from(pos.array).every(Number.isFinite), p.name)
      p.geometry.computeBoundingBox()
      assert.ok(p.geometry.boundingBox!.min.y >= -0.001, `${id}/${p.name} below floor`)
      if (p.mediaSurface) {
        const uv = p.geometry.getAttribute('uv')
        assert.ok(uv && Array.from(uv.array).every(v => v >= 0 && v <= 1), p.name)
      }
    }
    const bounds = (name: string) => { const p = parts.find(p => p.name === name)!; return p.geometry.boundingBox! }
    if (presentation === 'open') {
      assert.ok(bounds('front-shell').min.z > bounds('circuit-board').max.z)
      assert.ok(bounds('rear-shell').max.z < bounds('circuit-board').min.z)
    }
    disposeLodParts(parts)
  }
})

test('NES revisions change screws and latches; NWC has a real front-shell opening', () => {
  const def = load('nes-cartridge'), p = defaultParams(def)
  const three = def.build({ ...p, screws: '3' }), five = def.build({ ...p, screws: '5' })
  assert.equal(three.filter(p => /^screw-\d+$/.test(p.name)).length, 3)
  assert.equal(five.filter(p => /^screw-\d+$/.test(p.name)).length, 5)
  assert.ok(three.some(p => p.name === 'top-latch'))
  assert.ok(!five.some(p => p.name === 'top-latch'))
  const nwc = def.build({ ...p, variant: 'nwc1990' })
  const mesh = new THREE.Mesh(nwc.find(p => p.name === 'front-shell')!.geometry)
  const ray = new THREE.Raycaster(new THREE.Vector3(120 * .22 + 8, 133 * .32 + 12, 100), new THREE.Vector3(0, 0, -1))
  assert.equal(ray.intersectObject(mesh).length, 0)
  assert.equal(nwc.filter(p => /^dip-switch-\d+$/.test(p.name)).length, 4)
  disposeLodParts([...three, ...five, ...nwc])
})

test('runtime textures are independent, video is rejected for labels, inputs remain unchanged', () => {
  const def = load('nes-cartridge'), params = { ...defaultParams(def), presentation: 'boxed' }
  const before = JSON.stringify(params), parts = def.build(params)
  const a = new THREE.Texture(), b = new THREE.Texture()
  const applied = applySurfaceTextures(parts, { 'cart-front': { texture: a, kind: 'image' }, 'box-front': { texture: b, kind: 'image' } })
  assert.equal(applied.find(p => p.name === 'cart-front')?.map, a)
  assert.equal(applied.find(p => p.name === 'box-front')?.map, b)
  assert.ok(!applied.find(p => p.name === 'box-back')?.map)
  assert.ok(parts.every(p => !p.map))
  assert.equal(JSON.stringify(params), before)
  assert.throws(() => applySurfaceTextures(parts, { 'cart-front': { texture: a, kind: 'video' } }), /images only/)
  assert.equal(fileMediaKind({ name: 'MOVIE.MP4', type: '' }), 'video')
  assert.equal(fileMediaKind({ name: 'picture.png', type: 'text/plain' }), null)
  assert.equal(fileMediaKind({ name: 'animation.gif', type: '' }), 'image')
  disposeLodParts(parts); a.dispose(); b.dispose()
})

for (const id of ['notebook', 'at-desktop', 'all-in-one', 'integrated-micro', 'gaming-tower', 'multimedia-pc', 'crt-television', 'flat-panel-television']) test(`${id}: screen advertises media and preserves its UVs through transforms`, () => {
  const def = load(id), parts = def.build(defaultParams(def)), screen = parts.find(p => p.mediaSurface?.id === 'screen')!
  assert.ok(screen, id)
  assert.equal(screen.mediaSurface?.accept, 'image-video')
  const uv = screen.geometry.getAttribute('uv')
  assert.ok(uv && Array.from(uv.array).every(Number.isFinite))
  const us = Array.from({ length: uv.count }, (_, i) => uv.getX(i)), vs = Array.from({ length: uv.count }, (_, i) => uv.getY(i))
  assert.ok(Math.max(...us) - Math.min(...us) > .9)
  assert.ok(Math.max(...vs) - Math.min(...vs) > .9)
  disposeLodParts(parts)
})

test('LOD preserves editable surfaces and caller-owned textures', async () => {
  const def = load('nes-cartridge'), source = def.build(defaultParams(def))
  const reduced = await reduceDetail(source, normalizeLod({ detail: 20 }), new AbortController().signal)
  for (const part of source.filter(p => p.mediaSurface)) {
    const out = reduced.parts.find(p => p.name === part.name)!
    assert.equal(out.geometry, part.geometry)
    assert.deepEqual(out.mediaSurface, part.mediaSurface)
  }
  disposeLodParts(reduced.parts, source); disposeLodParts(source)
})


test('NES reference front has left grip, recessed upper-right label, notch and connector shoulders', () => {
  const def = load('nes-cartridge'), parts = def.build(defaultParams(def))
  const find = (name: string) => parts.find(p => p.name === name)!
  const bounds = (name: string) => { const g = find(name).geometry; g.computeBoundingBox(); return g.boundingBox! }
  const ribs = parts.filter(p => p.name.startsWith('grip-rib-'))
  assert.equal(ribs.length, 40)
  for (const rib of ribs) {
    const b = bounds(rib.name)
    assert.ok(b.max.x < -15, 'grip belongs on the left')
    assert.ok(b.max.z <= 0, 'grip lands sit below the face')
  }
  const label = bounds('cart-front')
  assert.ok(label.getCenter(new THREE.Vector3()).x > 0, 'label belongs on the right')
  assert.ok(Math.abs(label.min.y - 41.8) < .01 && label.max.y >= 132.8)
  assert.ok(label.max.z < bounds('front-shell').max.z, 'label is recessed, not raised')
  assert.ok(bounds('insertion-arrow').max.z < bounds('front-shell').max.z)
  const shell = new THREE.Mesh(find('front-shell').geometry)
  const hits = (x: number, y: number) => new THREE.Raycaster(new THREE.Vector3(x, y, 10), new THREE.Vector3(0, 0, -1)).intersectObject(shell)
  assert.equal(hits(-30, 130).length, 0, 'thumb pocket removed from front face')
  const rear = new THREE.Mesh(find('rear-shell').geometry)
  assert.ok(new THREE.Raycaster(new THREE.Vector3(-30, 130, 10), new THREE.Vector3(0, 0, -1)).intersectObject(rear).length > 0, 'rear shell backs the pocket; no through-notch')
  assert.ok(Math.abs(label.max.x - label.min.x - 57.2) < .01, 'reference label width')
  assert.equal(hits(-53, 132.5).length, 0, 'left outer top notch')
  assert.equal(hits(53, 132.5).length, 0, 'right outer top notch')
  assert.equal(hits(-55, 10).length, 0, 'reference shoulder inset is about 6 mm')
  assert.equal(hits(-58, 10).length, 0, 'narrow insertion tongue')
  assert.ok(hits(-58, 30).length > 0, 'wide shoulder above tongue')
  assert.equal(hits(15, 80).length, 0, 'front panel really cuts out the label recess')
  disposeLodParts(parts)
})


test('NES rear screw positions follow the supplied three/five-screw diagram', () => {
  const def = load('nes-cartridge'), defaults = defaultParams(def)
  const layouts: THREE.Vector3[][] = []
  for (const screws of ['3', '5']) {
    const parts = def.build({ ...defaults, screws, presentation: 'open' })
    const center = (name: string) => {
      const geometry = parts.find(p => p.name === name)!.geometry
      geometry.computeBoundingBox()
      return geometry.boundingBox!.getCenter(new THREE.Vector3())
    }
    const positions = Array.from({ length: Number(screws) }, (_, i) => center(`screw-${i + 1}`))
    layouts.push(positions)
    for (const lower of positions.slice(0, 2)) {
      assert.ok(Math.abs(lower.x) >= 52 && Math.abs(lower.x) <= 56, 'lower screws are near the outside edges')
      assert.ok(lower.y >= 32 && lower.y <= 37, 'lower screws sit just above the shoulders')
    }
    assert.equal(positions[2].x, 0)
    assert.ok(positions[2].y >= 76 && positions[2].y <= 79, 'center screw is just above the caution label')
    for (const upper of positions.slice(3)) {
      assert.ok(Math.abs(upper.x) >= 49 && Math.abs(upper.x) <= 54)
      assert.ok(upper.y >= 122 && upper.y <= 128, 'five-screw additions sit near the top corners')
    }
    positions.forEach((position, i) => {
      const boss = center(`screw-boss-${i + 1}`)
      assert.ok(Math.abs(boss.x - position.x) < 1e-5 && Math.abs(boss.y - position.y) < 1e-5, 'boss aligns with screw axis')
    })
    const label = parts.find(p => p.name === 'cart-back')!.geometry
    label.computeBoundingBox()
    assert.ok(label.boundingBox!.max.y < positions[2].y - 2, 'label does not cover the center screw')
    assert.ok(label.boundingBox!.min.y > positions[0].y + 2, 'label clears the lower screw row')
    disposeLodParts(parts)
  }
  assert.deepEqual(layouts[0], layouts[1].slice(0, 3), 'both revisions share the same three lower/center fasteners')
})

test('NES gold grain is deterministic, label-independent and disposed once after LOD reuse', async () => {
  const def = load('nes-cartridge'), defaults = defaultParams(def)
  const gold = def.build({ ...defaults, finish: 'gold' }), other = def.build({ ...defaults, finish: 'gold' })
  const grey = def.build({ ...defaults, finish: 'grey' })
  const shell = gold.find(p => p.name === 'front-shell')!
  assert.ok(shell.metalness! > .9 && shell.roughness! < .25)
  const grain = shell.normalMap as THREE.DataTexture
  assert.ok(grain?.isDataTexture)
  assert.deepEqual(grain.image.data, (other.find(p => p.name === 'front-shell')!.normalMap as THREE.DataTexture).image.data)
  assert.ok(gold.filter(p => p.mediaSurface).every(p => !p.normalMap))
  assert.ok(grey.every(p => !p.normalMap))
  let disposed = 0
  grain.addEventListener('dispose', () => disposed++)
  const lod = await reduceDetail(gold, normalizeLod({ detail: 20 }), new AbortController().signal)
  assert.equal(lod.parts.find(p => p.name === 'front-shell')!.normalMap, grain)
  disposeLodParts(lod.parts, gold)
  assert.equal(disposed, 0)
  disposeLodParts(gold)
  assert.equal(disposed, 1)
  disposeLodParts(other); disposeLodParts(grey)
})

test('Famicom reference has rectangular shoulders, a broad recessed label and horizontal top ribs', () => {
  const def = load('famicom-cartridge'), parts = def.build(defaultParams(def))
  const bounds = (name: string) => { const g = parts.find(p => p.name === name)!.geometry; g.computeBoundingBox(); return g.boundingBox! }
  const label = bounds('cart-front')
  assert.ok(label.max.x - label.min.x > 90 && label.max.y - label.min.y > 46)
  assert.ok(label.max.z < bounds('front-shell').max.z)
  const ribs = parts.filter(p => p.name.startsWith('top-grip-rib-'))
  assert.equal(ribs.length, 4)
  for (const rib of ribs) {
    const b = bounds(rib.name)
    assert.ok(b.min.y > label.max.y && b.max.x - b.min.x > 100)
  }
  assert.ok(!parts.some(p => p.name === 'side-grip' || p.mediaSurface?.id === 'cart-top'))
  const mesh = new THREE.Mesh(parts.find(p => p.name === 'front-shell')!.geometry)
  const ray = (x: number, y: number) => new THREE.Raycaster(new THREE.Vector3(x, y, 20), new THREE.Vector3(0, 0, -1)).intersectObject(mesh)
  assert.equal(ray(52, 2).length, 0, 'lower connector step')
  assert.ok(ray(52, 8).length > 0, 'full-width side above connector')
  assert.ok(ray(51, 68).length > 0, 'small top corner radius')
  disposeLodParts(parts)
})

test('Master System has an upper title band, continuous rails, rear screw wells and open connector mouth', () => {
  const def = load('master-system-cartridge'), parts = def.build(defaultParams(def))
  const part = (name: string) => parts.find(p => p.name === name)!
  const bounds = (name: string) => { const g = part(name).geometry; g.computeBoundingBox(); return g.boundingBox! }
  const label = bounds('cart-front')
  assert.ok(label.min.y >= 50 && label.max.y - label.min.y <= 19.1)
  assert.ok(label.max.x - label.min.x >= 99)
  const top = bounds('cart-top')
  assert.ok(Math.abs(label.max.y - top.min.y) < 1e-4, 'front and top meet vertically')
  assert.ok(Math.abs(label.max.z - top.max.z) < 1e-4, 'front and top meet in depth')
  assert.equal(label.min.x, top.min.x)
  assert.equal(label.max.x, top.max.x)
  assert.notEqual(part('cart-front').mediaSurface?.id, part('cart-top').mediaSurface?.id)
  assert.equal(parts.filter(p => p.name.startsWith('front-grip-rail-')).length, 3)
  for (let i = 1; i <= 3; i++) {
    const rail = bounds(`front-grip-rail-${i}`)
    assert.ok(rail.max.y < label.min.y && rail.max.x - rail.min.x >= 108)
  }
  const back = new THREE.Mesh(part('rear-shell').geometry)
  for (let i = 1; i <= 2; i++) {
    const screw = bounds(`screw-${i}`), center = screw.getCenter(new THREE.Vector3())
    assert.ok(center.y >= 38 && center.y <= 41)
    assert.ok(Math.abs(center.x) >= 41)
    assert.ok(screw.min.z > bounds('rear-shell').min.z, 'head is inset')
    assert.ok(part(`screw-well-${i}`))
    const hit = new THREE.Raycaster(new THREE.Vector3(center.x, center.y, -50), new THREE.Vector3(0, 0, 1)).intersectObject(back)
    assert.equal(hit.length, 0, 'rear face is bored through at each screw')
  }
  const meshes = parts.map(p => new THREE.Mesh(p.geometry, new THREE.MeshBasicMaterial({side: THREE.DoubleSide})))
  const hits = new THREE.Raycaster(new THREE.Vector3(0, -10, -9), new THREE.Vector3(0, 1, 0)).intersectObjects(meshes)
  assert.ok(hits.length > 0 && hits[0].point.y >= 7.9, 'connector board sits inside an open mouth')
  for (const mesh of meshes) (mesh.material as THREE.Material).dispose()
  disposeLodParts(parts)
})
