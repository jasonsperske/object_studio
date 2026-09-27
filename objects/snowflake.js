// Snowflake.
//
// A clean, printable interpretation of a stellar snow crystal. Each arm is a
// rectangular spine with paired side branches; overlapping solids keep the
// centre and branch roots joined when the model is exported.

export const meta = {
  order: 18,
  name: 'Snowflake',
  description:
    'A radial snow crystal with adjustable arms and evenly spaced side branches, made as a flat ornament or decorative cutout.',
}

export const params = [
  { id: 'diameter', label: 'Diameter', type: 'number', min: 30, max: 500, step: 5, default: 120, unit: 'mm', group: 'Crystal' },
  { id: 'thickness', label: 'Thickness', type: 'number', min: 1, max: 30, step: 0.5, default: 4, unit: 'mm', group: 'Crystal' },
  { id: 'arms', label: 'Number of arms', type: 'int', min: 4, max: 12, step: 1, default: 6, group: 'Crystal' },
  { id: 'armWidth', label: 'Arm width', type: 'number', min: 1, max: 30, step: 0.5, default: 5, unit: 'mm', group: 'Crystal' },
  { id: 'branches', label: 'Branches per arm', type: 'int', min: 0, max: 6, step: 1, default: 3, group: 'Branches' },
  { id: 'branchLength', label: 'Branch length', type: 'number', min: 2, max: 100, step: 1, default: 23, unit: 'mm', group: 'Branches', visibleWhen: (p) => num(p, 'branches') > 0 },
  { id: 'branchAngle', label: 'Branch angle', type: 'number', min: 15, max: 75, step: 1, default: 42, unit: '°', group: 'Branches', visibleWhen: (p) => num(p, 'branches') > 0 },
  { id: 'centerSize', label: 'Centre diameter', type: 'number', min: 2, max: 80, step: 1, default: 14, unit: 'mm', group: 'Centre' },
  { id: 'base', label: 'Standing base', type: 'boolean', default: false, group: 'Mounting' },
  { id: 'baseWidth', label: 'Base width', type: 'number', min: 20, max: 250, step: 5, default: 60, unit: 'mm', group: 'Mounting', visibleWhen: (p) => bool(p, 'base') },
  { id: 'baseDepth', label: 'Base depth', type: 'number', min: 10, max: 100, step: 2, default: 30, unit: 'mm', group: 'Mounting', visibleWhen: (p) => bool(p, 'base') },
  { id: 'baseHeight', label: 'Base height', type: 'number', min: 2, max: 30, step: 1, default: 8, unit: 'mm', group: 'Mounting', visibleWhen: (p) => bool(p, 'base') },
  { id: 'loop', label: 'Hanging loop', type: 'boolean', default: false, group: 'Mounting' },
  { id: 'loopDiameter', label: 'Loop diameter', type: 'number', min: 8, max: 60, step: 1, default: 18, unit: 'mm', group: 'Mounting', visibleWhen: (p) => bool(p, 'loop') },
  { id: 'loopWall', label: 'Loop wall', type: 'number', min: 1, max: 12, step: 0.5, default: 3, unit: 'mm', group: 'Mounting', visibleWhen: (p) => bool(p, 'loop') },
]

export const presets = [
  { name: 'Classic six-point', params: {} },
  { name: 'Fine crystal', params: { diameter: 180, thickness: 3, armWidth: 3, branches: 5, branchLength: 28, branchAngle: 38, centerSize: 10 } },
  { name: 'Bold ornament', params: { diameter: 100, thickness: 6, armWidth: 8, branches: 2, branchLength: 20, branchAngle: 48, centerSize: 20 } },
  { name: 'Eight-point', params: { arms: 8, diameter: 140, branches: 3, branchLength: 20, branchAngle: 35 } },
  { name: 'Christmas ornament', params: { diameter: 90, thickness: 3, armWidth: 4, loop: true, loopDiameter: 16, loopWall: 3 } },
  { name: 'Standing display', params: { diameter: 140, thickness: 5, armWidth: 7, base: true, baseWidth: 70, baseDepth: 36, baseHeight: 10 } },
]

const rad = (degrees) => (degrees * Math.PI) / 180

/** A rectangular prism drawn along +X, centred on the requested point. */
function bar(length, width, thickness, x, y, angle) {
  const geometry = new THREE.BoxGeometry(length, width, thickness)
  geometry.translate(length / 2, 0, 0)
  geometry.rotateZ(angle)
  geometry.translate(x, y, 0)
  return geometry
}

function hangingLoop(outerDiameter, wall, thickness, y) {
  const outerRadius = outerDiameter / 2
  const innerRadius = Math.max(outerRadius - wall, 1)
  const shape = new THREE.Shape()
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 32,
  })
  geometry.translate(0, y, -thickness / 2)
  return geometry
}

export function build(p) {
  const diameter = num(p, 'diameter')
  const radius = diameter / 2
  const thickness = num(p, 'thickness')
  const armWidth = Math.min(num(p, 'armWidth'), radius / 2)
  const arms = Math.max(4, Math.round(num(p, 'arms')))
  const branchCount = Math.max(0, Math.round(num(p, 'branches')))
  const branchAngle = rad(num(p, 'branchAngle'))
  const requestedBranchLength = num(p, 'branchLength')
  const centerRadius = Math.min(num(p, 'centerSize') / 2, radius * 0.45)
  const geometries = []

  for (let arm = 0; arm < arms; arm++) {
    // Start at twelve o'clock so a hanging loop always joins a full arm.
    const angle = Math.PI / 2 + (arm / arms) * Math.PI * 2
    geometries.push(bar(radius, armWidth, thickness, 0, 0, angle))

    for (let branch = 1; branch <= branchCount; branch++) {
      const distance = radius * (0.32 + (branch / (branchCount + 1)) * 0.5)
      // Keep every twig inside the requested overall diameter. Its outward
      // projection cannot be longer than the remaining length of the arm.
      const length = Math.min(
        requestedBranchLength,
        Math.max(armWidth, (radius - distance) / Math.cos(branchAngle)),
      )
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      geometries.push(bar(length, armWidth, thickness, x, y, angle + branchAngle))
      geometries.push(bar(length, armWidth, thickness, x, y, angle - branchAngle))
    }
  }

  const centre = new THREE.CylinderGeometry(centerRadius, centerRadius, thickness, Math.max(24, arms * 4))
  centre.rotateX(Math.PI / 2)
  geometries.push(centre)

  const snowflake = merge(geometries)
  snowflake.translate(0, radius, 0)
  const parts = [{ name: 'snowflake', geometry: snowflake, color: 0xc8edff, roughness: 0.72 }]

  if (bool(p, 'base')) {
    const baseWidth = Math.max(num(p, 'baseWidth'), armWidth * 3)
    const baseDepth = Math.max(num(p, 'baseDepth'), thickness * 2)
    const baseHeight = num(p, 'baseHeight')
    const geometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth)
    geometry.translate(0, baseHeight / 2, 0)
    parts.push({ name: 'standing base', geometry, color: 0x9ddbf5, roughness: 0.78 })
  }

  if (bool(p, 'loop')) {
    const outerDiameter = num(p, 'loopDiameter')
    const wall = Math.min(num(p, 'loopWall'), outerDiameter / 2 - 1)
    // Sink the ring into the top arm by half its wall so the exported pieces
    // overlap as a printable joint rather than merely touching at one edge.
    const y = diameter + outerDiameter / 2 - wall / 2
    parts.push({
      name: 'hanging loop',
      geometry: hangingLoop(outerDiameter, wall, thickness, y),
      color: 0xc8edff,
      roughness: 0.72,
    })
  }

  return parts
}

export function metrics(p) {
  const arms = Math.max(4, Math.round(num(p, 'arms')))
  const branches = Math.max(0, Math.round(num(p, 'branches')))
  const diameter = num(p, 'diameter')
  const width = bool(p, 'base') ? Math.max(diameter, num(p, 'baseWidth')) : diameter
  const height = diameter + (bool(p, 'loop') ? num(p, 'loopDiameter') - num(p, 'loopWall') / 2 : 0)
  const depth = bool(p, 'base') ? Math.max(num(p, 'thickness'), num(p, 'baseDepth')) : num(p, 'thickness')
  return [
    { label: 'Overall size', value: `${formatLength(width)} × ${formatLength(height)} × ${formatLength(depth)}` },
    { label: 'Symmetry', value: `${arms}-fold` },
    { label: 'Branch pairs', value: String(arms * branches) },
  ]
}
