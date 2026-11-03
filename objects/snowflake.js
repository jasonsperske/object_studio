export const meta = {
  name: 'Snowflake collection',
  description: '60 sixfold snowflakes with a matching two-slot stand. Preview an upright pair, rotate each snowflake and its slot together, or export flat parts for printing.',
  order: 0,
}

export const params = [
  { id: 'design', label: 'Design number', type: 'int', min: 1, max: 60, step: 1, default: 1, group: 'Collection', help: 'Six families of ten designs. Every number is a stable recipe.' },
  { id: 'presentation', label: 'Show', type: 'select', default: 'single', group: 'Collection', options: [{ value: 'single', label: 'Selected snowflake' }, { value: 'family', label: 'Family · 10 designs' }, { value: 'collection', label: 'All 60 designs' }, { value: 'assembled', label: 'Pair on stand' }, { value: 'printSet', label: 'Pair + stand · print layout' }, { value: 'stand', label: 'Stand only' }, { value: 'coupon', label: 'Slot fit test' }] },
  { id: 'diameter', label: 'Tip diameter', type: 'number', min: 60, max: 140, step: 1, default: 80, unit: 'mm', group: 'Print dimensions' },
  { id: 'thickness', label: 'Thickness', type: 'number', min: 1.6, max: 5, step: 0.2, default: 2.4, unit: 'mm', group: 'Print dimensions' },
  { id: 'stem', label: 'Stem width', type: 'number', min: 1.6, max: 3, step: 0.2, default: 2, unit: 'mm', group: 'Print dimensions', help: 'Controls the main stems, not the narrowest branch details. Print flat; no raised decoration or separate intersecting pieces.' },
  { id: 'centerHole', label: 'Open hexagonal center', type: 'boolean', default: true, group: 'Print dimensions' },
  { id: 'secondDesign', label: 'Second snowflake', type: 'int', min: 1, max: 60, step: 1, default: 11, group: 'Stand & assembly' },
  { id: 'clearance', label: 'Total slot clearance', type: 'number', min: 0, max: 0.8, step: 0.05, default: 0.25, unit: 'mm', group: 'Stand & assembly', help: 'Added to total dimensions, not per side. Slots follow Thickness and Stem width automatically.' },
  { id: 'insertion', label: 'Requested insertion', type: 'number', min: 2, max: 8, step: 0.5, default: 4, unit: 'mm', group: 'Stand & assembly', help: 'Limited to 10% of radius so branches stay above the stand.' },
  { id: 'gap', label: 'Gap between snowflakes', type: 'number', min: 4, max: 30, step: 1, default: 8, unit: 'mm', group: 'Stand & assembly' },
  { id: 'baseDepth', label: 'Base depth', type: 'number', min: 24, max: 60, step: 1, default: 32, unit: 'mm', group: 'Stand & assembly' },
  { id: 'floor', label: 'Floor beneath slots', type: 'number', min: 2, max: 6, step: 0.5, default: 3, unit: 'mm', group: 'Stand & assembly' },
  { id: 'firstAngle', label: 'First snowflake angle', type: 'number', min: -180, max: 180, step: 5, default: 0, unit: '°', group: 'Orientation', help: 'Turn around the upright stem. Its slot rotates with it; 0° faces forward and 90° faces sideways.' },
  { id: 'secondAngle', label: 'Second snowflake angle', type: 'number', min: -180, max: 180, step: 5, default: 0, unit: '°', group: 'Orientation' },
  { id: 'layoutAngle', label: 'Stand orientation', type: 'number', min: -180, max: 180, step: 5, default: 0, unit: '°', group: 'Orientation', help: 'Rotate the whole assembly: 0° side by side, 90° front to back. Individual angles are relative to the stand.' },

]
for (const spec of params) {
  if (['Stand & assembly', 'Orientation'].includes(spec.group)) {
    spec.visibleWhen = p => ['assembled', 'printSet', 'stand', 'coupon'].includes(p.presentation)
  }
}
const families = ['Fern', 'Crystal', 'Paddle', 'Arrow', 'Crown', 'Fir']
const bounded = (p, key, lo, hi, fallback) => Math.max(lo, Math.min(hi, Number.isFinite(Number(p[key] ?? fallback)) ? Number(p[key] ?? fallback) : fallback))
function recipe(p, design) {
  return { family: Math.floor((design - 1) / 10), variant: (design - 1) % 10,
    radius: bounded(p, 'diameter', 60, 140, 80) / 2,
    height: bounded(p, 'thickness', 1.6, 5, 2.4), width: bounded(p, 'stem', 1.6, 3, 2) }
}
function makeFlake(p, design) {
  const { family, variant, radius: R, height, width } = recipe(p, design)
  const w = width / 2
  const hub = R * (variant < 5 ? 0.19 : 0.25)
  const count = 2 + variant % 5
  const start = hub + width
  const end = R * 0.87
  const cell = (end - start) / count
  // Each branch occupies its own axial interval. The whole arm stays strictly
  // inside its 60-degree sector, so the six copies form one simple perimeter.
  const side = [[hub * Math.cos(Math.PI / 6), hub * 0.5], [hub, w]]
  for (let j = 0; j < count; j++) {
    const x = start + j * cell
    const span = cell * 0.82
    const t = (j + 0.5) / count
    const profiles = [0.78, 0.92, 0.62, 0.95, 0.58 + 0.5 * t, 1.1 - 0.65 * t]
    const reach = Math.min((x * 0.51 - w), R * 0.27 * profiles[family])
    const y = w + Math.max(width, reach)
    side.push([x, w])
    if (family === 0 || family === 5) {
      side.push([x + span * 0.62, y], [x + span, y], [x + span * 0.38, w])
    } else if (family === 1) {
      side.push([x + span * 0.18, y * 0.78], [x + span * 0.5, y], [x + span * 0.82, y * 0.78], [x + span, w])
    } else if (family === 2) {
      side.push([x, y - width * 0.4], [x + span * 0.2, y], [x + span * 0.8, y], [x + span, y - width * 0.4], [x + span, w])
    } else if (family === 3) {
      side.push([x + span * 0.25, y * 0.65], [x, y], [x + span, y * 0.72], [x + span, w])
    } else {
      side.push([x, y], [x + span * 0.35, y], [x + span * 0.35, y * 0.6], [x + span * 0.65, y * 0.6], [x + span * 0.65, y], [x + span, y], [x + span, w])
    }
  }
  const tipX = Math.sqrt(R * R - w * w)
  if (variant >= 5) side.push([R * 0.89, w], [R * 0.94, w * 2.2])
  side.push([tipX, w])
  // A slight curve along the stem avoids collinear cap vertices in triangulation.
  const curved = side.map(([x, y], i) => [x, y + (i === 0 ? 0 : 0.12 * Math.sin(Math.PI * x / tipX))])
  const arm = [...curved.map(([x, y]) => [x, -y]), ...curved.slice().reverse()]
  const outline = []
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3
    // Adjacent arms share the hub corner; omit the duplicated final vertex.
    for (const [x, y] of arm.slice(0, -1)) outline.push(new THREE.Vector2(x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)))
  }
  const shape = new THREE.Shape(outline)
  if (p.centerHole !== false) {
    const hole = new THREE.Path()
    const r = hub * 0.46
    for (let i = 0; i < 6; i++) {
      const a = -i * Math.PI / 3
      if (i === 0) hole.moveTo(r * Math.cos(a), r * Math.sin(a))
      else hole.lineTo(r * Math.cos(a), r * Math.sin(a))
    }
    hole.closePath()
    shape.holes.push(hole)
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, steps: 1, curveSegments: 1 })
  geometry.rotateX(-Math.PI / 2)
  return { name: `Snowflake ${String(design).padStart(2, '0')} · ${families[family]}`, geometry, color: 0xc3e6ee, roughness: 0.65 }
}
function standDimensions(p) {
  const r = recipe(p, 1)
  const clearance = bounded(p, 'clearance', 0, 0.8, 0.25)
  const floor = bounded(p, 'floor', 2, 6, 3)
  const insertion = Math.min(bounded(p, 'insertion', 2, 8, 4), r.radius * 0.1)
  const pitch = r.radius * 2 + bounded(p, 'gap', 4, 30, 8)
  const coupon = p.presentation === 'coupon'
  return { floor, insertion, height: floor + insertion, pitch,
    length: coupon ? 24 : pitch + 24, depth: coupon ? 18 : bounded(p, 'baseDepth', 24, 60, 32),
    slotLength: r.width * 2.2 + 0.24 + clearance, slotWidth: r.height + clearance,
    centers: coupon ? [0] : [-pitch / 2, pitch / 2],
    angles: [bounded(p, 'firstAngle', -180, 180, 0), bounded(p, 'secondAngle', -180, 180, 0)].map(x => x * Math.PI / 180),
    rotation: bounded(p, 'layoutAngle', -180, 180, 0) * Math.PI / 180 }
}
function makeStand(p) {
  const d = standDimensions(p)
  const rectangle = (w,h) => [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]]
  const contour = rectangle(d.length,d.depth)
  const holes = d.centers.map((center,i) => rectangle(d.slotLength,d.slotWidth).reverse().map(([x,z]) => [center+x*Math.cos(d.angles[i])+z*Math.sin(d.angles[i]), -x*Math.sin(d.angles[i])+z*Math.cos(d.angles[i])]))
  const vertices = []
  const triangle = (a,b,c) => vertices.push(...a,...b,...c)
  const cap = (outer, inner, y, upward) => {
    const points = [...outer,...inner.flat()]
    const faces = THREE.ShapeUtils.triangulateShape(outer.map(v=>new THREE.Vector2(...v)),inner.map(h=>h.map(v=>new THREE.Vector2(...v))))
    for(const indices of faces) {
      const face = indices.map(i=>[points[i][0],y,points[i][1]])
      // Earcut can bridge aligned pockets with collinear overlapping edges.
      // Split those edges at every contour vertex to avoid mesh T-junctions.
      const perimeter=[]
      for(let i=0;i<3;i++) {
        const a=face[i],b=face[(i+1)%3],dx=b[0]-a[0],dz=b[2]-a[2],length2=dx*dx+dz*dz
        const cuts=points.map(v=>({v,t:((v[0]-a[0])*dx+(v[1]-a[2])*dz)/length2}))
          .filter(({v,t})=>t>1e-8&&t<1-1e-8&&Math.abs((v[0]-a[0])*dz-(v[1]-a[2])*dx)<1e-7)
          .sort((a,b)=>a.t-b.t)
        perimeter.push(a,...cuts.map(({v})=>[v[0],y,v[1]]))
      }
      const emit=(a,b,c)=>{
        const normalY=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])
        if((normalY>0)===upward)triangle(a,b,c);else triangle(a,c,b)
      }
      if(perimeter.length===3)emit(...face)
      else {
        const center=[face.reduce((n,v)=>n+v[0],0)/3,y,face.reduce((n,v)=>n+v[2],0)/3]
        for(let i=0;i<perimeter.length;i++)emit(center,perimeter[i],perimeter[(i+1)%perimeter.length])
      }
    }
  }
  const walls = (loop,bottom,top) => {
    for(let i=0;i<loop.length;i++) {
      const a=loop[i],b=loop[(i+1)%loop.length]
      const A=[a[0],bottom,a[1]], B=[b[0],bottom,b[1]], C=[b[0],top,b[1]], D=[a[0],top,a[1]]
      triangle(A,D,C);triangle(A,C,B)
    }
  }
  cap(contour,holes,d.height,true)
  cap(contour,[],0,false)
  walls(contour,0,d.height)
  for(const hole of holes){walls(hole,d.floor,d.height);cap(hole,[],d.floor,true)}
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))
  geometry.computeVertexNormals()
  geometry.rotateY(d.rotation)
  return { name: p.presentation === 'coupon' ? 'Slot fit test' : 'Two-snowflake stand', geometry, color: 0x344958, roughness: 0.8 }
}
function buildMountedPair(p, design) {
  const d=standDimensions(p), mode=p.presentation
  const base=makeStand(p)
  if(mode==='stand'||mode==='coupon')return [base]
  const designs=[design,Math.round(bounded(p,'secondDesign',1,60,11))]
  const parts=designs.map((id,i)=>{
    const part=makeFlake(p,id)
    if(mode==='assembled') {
      const r=recipe(p,id), tip=Math.sqrt(r.radius*r.radius-r.width*r.width/4)
      // Local +X stem points down. Center the thickness across its slot.
      const matrix=new THREE.Matrix4().set(0,0,-1,0, -1,0,0,0, 0,1,0,-r.height/2, 0,0,0,1)
      part.geometry.applyMatrix4(matrix)
      part.geometry.rotateY(d.angles[i])
      part.geometry.translate(d.centers[i],d.floor+tip,0)
      part.geometry.rotateY(d.rotation)
    } else {
      part.geometry.translate(d.centers[i],0,0)
    }
    return part
  })
  if(mode==='printSet') {
    base.geometry.computeBoundingBox()
    const extent=base.geometry.boundingBox
    base.geometry.translate(0,0,recipe(p,design).radius+10-extent.min.z)
  }
  return [base,...parts]
}
export function build(p) {
  const design = Math.round(bounded(p, 'design', 1, 60, 1))
  const mode = p.presentation || 'single'
  if (['assembled','printSet','stand','coupon'].includes(mode)) return buildMountedPair(p, design)
  const count = mode === 'collection' ? 60 : mode === 'family' ? 10 : 1
  const first = mode === 'collection' ? 1 : mode === 'family' ? Math.floor((design - 1) / 10) * 10 + 1 : design
  const columns = count === 60 ? 10 : count === 10 ? 5 : 1
  const rows = Math.ceil(count / columns)
  const pitch = bounded(p, 'diameter', 60, 140, 80) + 10
  return Array.from({ length: count }, (_, i) => {
    const part = makeFlake(p, first + i)
    part.geometry.translate((i % columns - (columns - 1) / 2) * pitch, 0, (Math.floor(i / columns) - (rows - 1) / 2) * pitch)
    return part
  })
}
export function metrics(p) {
  const n = Math.round(bounded(p, 'design', 1, 60, 1))
  const r = recipe(p, n)
  const d = standDimensions(p)
  const mounted = ['assembled','printSet','stand','coupon'].includes(p.presentation)
  return [
    ...(mounted ? [
      { label: 'Stand size', value: `${d.length} × ${d.depth} × ${d.height} mm` },
      { label: 'Slot opening', value: `${d.slotLength.toFixed(2)} × ${d.slotWidth.toFixed(2)} mm`, note: 'Automatically follows snowflake stem width and thickness, plus clearance.' },
      { label: 'Insertion', value: `${d.insertion} mm` },
      { label: 'Export mode', value: p.presentation === 'assembled' ? 'Assembly preview' : 'Flat print layout', note: 'Use Pair + stand · print layout for separate printable parts, Stand only for the base, or Slot fit test to tune clearance.' },
    ] : []),
    { label: 'Design', value: `${String(n).padStart(2, '0')} / 60 · ${families[r.family]}` },
    { label: 'Tip diameter', value: `${2 * r.radius} mm` },
    { label: 'Thickness', value: `${r.height} mm` },
    { label: 'Print orientation', value: p.presentation === 'assembled' ? 'Upright assembly preview' : 'Flat on bed', note: 'Use the flat print layout to export a pair and stand. Top view (5) shows flat silhouettes; family and collection layouts may exceed your bed.' },
    { label: 'Branch detail', value: 'Check slicer preview', level: 'warn', note: 'Branch tips and notches are finer than the stem width. Verify extrusion paths with your nozzle and material before printing all 60.' },
  ]
}
export const presets = [{ name: 'Pair on matching stand', params: { presentation: 'assembled' } }, { name: 'Angled pair', params: { presentation: 'assembled', firstAngle: -30, secondAngle: 30 } }, { name: 'Pair and stand for printing', params: { presentation: 'printSet' } }, { name: 'Matching slot fit test', params: { presentation: 'coupon' } }].concat(families.map((family, i) => ({ name: `${family} · ${i * 10 + 1}–${i * 10 + 10}`, params: { design: i * 10 + 1, presentation: 'family' } })))
