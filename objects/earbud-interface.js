// Photo-derived fit prototype. All lengths in mm. Port angle in degrees; bottom port geometry is estimated.
export const meta = {
  name: 'Earbud interface', order: 0,
  description: 'Photo-derived hollow adapter for a silicone ear tip. Open cylinder with one 2.00 mm bottom flange and three bottom ports. Port dimensions and bottom web thickness are estimated.',
}
const dimension = (id, label, value, min, max, help) => ({ id, label, type: 'number', default: value, min, max, step: 0.01, unit: id === 'portAngle' ? '°' : 'mm', group: 'Dimensions', help })
export const params = [
  dimension('length', 'Overall length', 7.77, 3, 20, 'IMG_0949 / IMG_0951: 7.77 mm.'),
  dimension('waistDiameter', 'Waist outside diameter', 4.52, 2, 10, 'IMG_0947: 4.52 mm; feature assignment provisional.'),
  dimension('baseDiameter', 'Base flange diameter', 6.01, 3, 12, 'IMG_0948: 6.01 mm.'),
  dimension('baseThickness', 'Base flange thickness', 2, 0.3, 4, 'IMG_0952: 2.00 mm bottom flange thickness, confirmed by user.'),
  dimension('boreDiameter', 'Cylinder inside diameter (derived)', 2.48, 0.5, 8, 'Derived from 4.52 mm cylinder OD minus twice the confirmed 1.02 mm wall thickness.'),
  dimension('webThickness', 'Bottom web thickness (estimated)', 0.60, 0.2, 1.5, 'Unmeasured thickness of the perforated floor inside the bottom flange.'),
  dimension('portRim', 'Port rim thickness (estimated)', 0.12, 0.05, 0.4, 'Material between port outer arcs and the cylinder bore.'),
  dimension('portAngle', 'Port opening angle (estimated)', 88, 40, 105, 'Three equal sector openings, 120 degrees apart. Degrees, not millimetres.'),
  dimension('portHub', 'Port inner radius (estimated)', 0.25, 0.1, 0.6, 'Inner tip radius of each opening; leaves a central three-way web.'),
  dimension('edgeChamfer', 'Edge chamfer (estimated)', 0.15, 0, 0.5, 'Small estimated lead-in on exposed flange and bore edges.'),
  dimension('outsideAllowance', 'Outside diameter adjustment', 0, -0.5, 0.5, 'Adds to cylinder and flange outside diameters; zero reproduces nominal measurements.'),
  dimension('boreAllowance', 'Hole diameter adjustment', 0, -0.5, 0.5, 'Adds to bore diameter independently; positive opens the hole.'),
]
export function build(p) {
  const L=p.length, h=p.baseThickness, web=p.webThickness
  const ro=(p.baseDiameter+p.outsideAllowance)/2, rw=(p.waistDiameter+p.outsideAllowance)/2
  const ri=(p.boreDiameter+p.boreAllowance)/2, rp=ri-p.portRim
  if (!(ro>=rw && rw>ri && ri>rp && rp>p.portHub && L>h && h>web))
    throw new Error('Require flange ≥ cylinder > bore > port radius > hub, and length > flange height > web thickness.')
  const c=Math.min(p.edgeChamfer,h/3,(rw-ri)/3), n=192
  const positions=[], indices=[], vertices=new Map()
  function vertex(x,y,z) {
    const key=[x,y,z].map(v=>v.toFixed(7)).join(',')
    if(vertices.has(key)) return vertices.get(key)
    const i=positions.length/3;positions.push(x,y,z);vertices.set(key,i);return i
  }
  function tri(a,b,c) { indices.push(a,b,c) }
  function ring(r,y) {return Array.from({length:n},(_,j)=>vertex(r*Math.cos(j*2*Math.PI/n),y,r*Math.sin(j*2*Math.PI/n)))}
  const profile=[[ro-c,0],[ro,c],[ro,h-c],[ro-c,h],[rw,h],[rw,L-c],[rw-c,L],[ri+c,L],[ri,L-c],[ri,web]]
  const rings=profile.filter((v,i)=>!i||v[0]!==profile[i-1][0]||v[1]!==profile[i-1][1]).map(([r,y])=>ring(r,y))
  for(let i=0;i<rings.length-1;i++)for(let j=0;j<n;j++) {
    const a=rings[i][j],b=rings[i][(j+1)%n],c=rings[i+1][j],d=rings[i+1][(j+1)%n]
    tri(a,c,b);tri(b,c,d)
  }
  const holes=[]
  for(let k=0;k<3;k++) {
    const center=(90+120*k)*Math.PI/180, half=p.portAngle*Math.PI/360
    const hole=[new THREE.Vector2(p.portHub*Math.cos(center),p.portHub*Math.sin(center))]
    for(let j=0;j<=48;j++) { const t=center-half+2*half*j/48;hole.push(new THREE.Vector2(rp*Math.cos(t),rp*Math.sin(t))) }
    holes.push(hole)
  }
  function cap(r,y,up) {
    const contour=Array.from({length:n},(_,j)=>new THREE.Vector2(r*Math.cos(j*2*Math.PI/n),r*Math.sin(j*2*Math.PI/n)))
    const flat=[...contour,...holes.flat()], ids=flat.map(v=>vertex(v.x,y,v.y))
    for(const [a,b,c] of THREE.ShapeUtils.triangulateShape(contour,holes)) {
      if(up)tri(ids[a],ids[c],ids[b]);else tri(ids[a],ids[b],ids[c])
    }
  }
  cap(ro-c,0,false);cap(ri,web,true)
  for(const hole of holes)for(let j=0;j<hole.length;j++) {
    const a=hole[j],b=hole[(j+1)%hole.length]
    const a0=vertex(a.x,0,a.y),b0=vertex(b.x,0,b.y),a1=vertex(a.x,web,a.y),b1=vertex(b.x,web,b.y)
    tri(a0,b0,a1);tri(b0,b1,a1)
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setIndex(indices)
  const shaded=geometry.toNonIndexed();shaded.computeVertexNormals();geometry.dispose()
  return [{name:'earbud-interface',geometry:shaded,color:0x626c78}]
}
export function metrics(p) {
  return [
    {label:'Model status',value:'Fit prototype',level:'warn',note:'Three sector ports and bottom web thickness are estimated from the photo.'},
    {label:'Envelope',value:`${p.baseDiameter+p.outsideAllowance} × ${p.length} mm`},
    {label:'Waist wall',value:`${((p.waistDiameter+p.outsideAllowance-p.boreDiameter-p.boreAllowance)/2).toFixed(2)} mm`},
    {label:'Cylinder bore',value:`${(p.boreDiameter+p.boreAllowance).toFixed(2)} mm`,note:'Nominal 2.48 mm derived from 4.52 − 2 × 1.02; assumes a concentric, uniform cylinder wall.'},
  ]
}
