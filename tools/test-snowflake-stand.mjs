import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as THREE from 'three'
const load = name => new Function('THREE', readFileSync(new URL(`../objects/${name}.js`, import.meta.url), 'utf8').replace(/export /g, '') + '\nreturn {build,params};')(THREE)
const stand = load('snowflake'), flakes = stand
const defaults = o => Object.fromEntries(o.params.map(p => [p.id,p.default]))
let tested = 0
for(const settings of [{}, {diameter:60,thickness:1.6,stem:3,insertion:8,clearance:0,firstAngle:-45,secondAngle:35,layoutAngle:90}, {diameter:140,thickness:5,stem:1.6,insertion:8,clearance:0.8,firstAngle:90,secondAngle:-90,layoutAngle:-35}]) {
  const p={...defaults(stand),...settings}
  const insertion=Math.min(p.insertion,p.diameter*0.05)
  const slotLength=p.stem*2.2+0.24+p.clearance,slotWidth=p.thickness+p.clearance
  for(const presentation of ['stand','coupon']) {
    const g=stand.build({...p,presentation})[0].geometry
    const a=g.attributes.position.array,edges=new Map(),adjacency=new Map()
    let volume=0
    const key=v=>v.map(x=>Math.round(x*10000)).join(',')
    for(let i=0;i<a.length;i+=9){
      const v=[0,3,6].map(j=>Array.from(a.slice(i+j,i+j+3)))
      assert(v.flat().every(Number.isFinite))
      const [u,w,t]=v.map(x=>new THREE.Vector3(...x))
      assert(new THREE.Vector3().crossVectors(w.clone().sub(u),t.clone().sub(u)).length()>1e-7)
      volume+=u.dot(w.cross(t))/6
      for(let j=0;j<3;j++){
        const x=key(v[j]),y=key(v[(j+1)%3]),k=[x,y].sort().join('|')
        const e=edges.get(k)||[0,0];e[0]++;e[1]+=x<y?1:-1;edges.set(k,e)
        if(!adjacency.has(x))adjacency.set(x,new Set());adjacency.get(x).add(y)
      }
    }
    for(const [count,balance] of edges.values())assert(count===2&&balance===0,'closed oriented edges')
    const seen=new Set(),queue=[adjacency.keys().next().value]
    while(queue.length){const x=queue.pop();if(seen.has(x))continue;seen.add(x);for(const n of adjacency.get(x))if(!seen.has(n))queue.push(n)}
    assert.equal(seen.size,adjacency.size,'one connected solid')
    const length=presentation==='coupon'?24:p.diameter+p.gap+24
    const depth=presentation==='coupon'?18:p.baseDepth
    const count=presentation==='coupon'?1:2
    const expected=length*depth*(p.floor+insertion)-count*slotLength*slotWidth*insertion
    assert(Math.abs(volume-expected)<0.02,'solid volume equals block minus blind pockets')
    g.dispose()
  }
  for(let design=1;design<=60;design++) {
    const g=flakes.build({...defaults(flakes),...settings,design,presentation:'single'})[0].geometry
    const a=g.attributes.position.array
    const tip=Math.sqrt((p.diameter/2)**2-(p.stem/2)**2),cut=tip-insertion
    const check=v=>{assert(Math.abs(v[2])<=slotLength/2+1e-5,`stem fits slot length: ${design}`);assert(v[1]>=-1e-5&&v[1]<=slotWidth+1e-5)}
    for(let i=0;i<a.length;i+=9){
      const v=[0,3,6].map(j=>Array.from(a.slice(i+j,i+j+3)))
      for(let j=0;j<3;j++){
        const u=v[j],w=v[(j+1)%3]
        if(u[0]>=cut)check(u)
        if((u[0]<cut)!==(w[0]<cut)){
          const t=(cut-u[0])/(w[0]-u[0]);check(u.map((x,k)=>x+t*(w[k]-x)))
        }
      }
    }
    g.dispose();tested++
  }
}
console.log(`Passed: 6 watertight stand/coupon meshes with exact pocket volumes, and ${tested} snowflake insertion-envelope checks.`)

// Mounted geometry and its pocket must use the same orientation and floor height.
for (const firstAngle of [-180,-45,0,35,90,180]) {
  const p={...defaults(stand),presentation:'assembled',firstAngle,secondAngle:-firstAngle,layoutAngle:35,design:6,secondDesign:60}
  const parts=stand.build(p), pitch=p.diameter+p.gap
  assert.equal(parts.length,3)
  for(let i=0;i<2;i++){
    const g=parts[i+1].geometry.clone()
    g.rotateY(-p.layoutAngle*Math.PI/180)
    g.translate(i===0?pitch/2:-pitch/2,0,0)
    g.rotateY(-(i===0?p.firstAngle:p.secondAngle)*Math.PI/180)
    g.computeBoundingBox()
    assert(Math.abs(g.boundingBox.min.y-p.floor)<1e-4,'stem rests on slot floor')
    const a=g.attributes.position.array
    for(let j=0;j<a.length;j+=3)if(a[j+1]<=p.floor+Math.min(p.insertion,p.diameter*.05)+1e-5){
      assert(Math.abs(a[j])<=(p.stem*2.2+.24+p.clearance)/2+1e-4)
      assert(Math.abs(a[j+2])<=(p.thickness+p.clearance)/2+1e-4)
    }
    g.dispose()
  }
  parts.forEach(p=>p.geometry.dispose())
  const flat=stand.build({...p,presentation:'printSet'})
  for(const part of flat){part.geometry.computeBoundingBox();assert(Math.abs(part.geometry.boundingBox.min.y)<1e-5)}
  const boxes=flat.map(p=>p.geometry.boundingBox)
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert(!boxes[i].intersectsBox(boxes[j]),'print parts separated')
  flat.forEach(p=>p.geometry.dispose())
}
console.log('Mounted pair alignment and separate flat print layouts passed at six orientations.')
