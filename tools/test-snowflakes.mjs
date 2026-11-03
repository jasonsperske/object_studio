import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import * as THREE from 'three'
const source = readFileSync(new URL('../objects/snowflake.js', import.meta.url), 'utf8')
const object = new Function('THREE', source.replace(/export /g, '') + '\nreturn {build,params};')(THREE)
const defaults = Object.fromEntries(object.params.map(p => [p.id, p.default]))
for (const settings of [{}, {diameter:60,stem:3,thickness:1.6}, {diameter:140,stem:1.6,thickness:5,centerHole:false}]) {
  const hashes = new Set()
  for (let design = 1; design <= 60; design++) {
    const p = {...defaults,...settings,design}
    const [part] = object.build(p)
    const positions = part.geometry.attributes.position.array
    hashes.add(createHash('sha256').update(Buffer.from(positions.buffer)).digest('hex'))
    let maxRadius=0, volume=0
    const edges = new Map(), adjacency = new Map()
    const point = i => [positions[i],positions[i+1],positions[i+2]]
    const key = v => v.map(n => Math.round(n*10000)).join(',')
    for(let i=0;i<positions.length;i+=9){
      const a=point(i),b=point(i+3),c=point(i+6)
      for (const v of [a,b,c]) {
        assert(v.every(Number.isFinite))
        maxRadius=Math.max(maxRadius, Math.hypot(v[0],v[2]))
        assert(v[1]>=-1e-5 && v[1]<=p.thickness+1e-5)
      }
      const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),vc=new THREE.Vector3(...c)
      assert(new THREE.Vector3().crossVectors(vb.clone().sub(va),vc.clone().sub(va)).length()>1e-7,`degenerate ${design}`)
      volume+=va.dot(vb.cross(vc))/6
      for(const [v,w] of [[a,b],[b,c],[c,a]]){
        const ka=key(v),kb=key(w),e=[ka,kb].sort().join('|')
        const record=edges.get(e)||{count:0,balance:0}
        record.count++; record.balance+=ka<kb?1:-1;edges.set(e,record)
        if(!adjacency.has(ka))adjacency.set(ka,new Set())
        adjacency.get(ka).add(kb)
      }
    }
    for(const edge of edges.values())assert(edge.count===2&&edge.balance===0,`non-manifold ${design}`)
    const reached=new Set(),queue=[adjacency.keys().next().value]
    while(queue.length){const k=queue.pop();if(reached.has(k))continue;reached.add(k);queue.push(...[...adjacency.get(k)].filter(n=>!reached.has(n)))}
    assert.equal(reached.size,adjacency.size,`disconnected ${design}`)
    assert(Math.abs(maxRadius-p.diameter/2)<1e-4,`size ${design}`)
    assert(volume>0,`orientation ${design}`)
    const again=object.build(p)[0].geometry
    assert.deepEqual(again.attributes.position.array,positions)
    again.dispose();part.geometry.dispose()
  }
  assert.equal(hashes.size,60)
}
assert.equal(object.build({...defaults,presentation:'collection'}).length,60)
assert.equal(object.build({...defaults,presentation:'family'}).length,10)
console.log('180 meshes passed: closed oriented edges, connected surface, finite nondegenerate triangles, positive volume, constant diameter, deterministic and unique designs.')
