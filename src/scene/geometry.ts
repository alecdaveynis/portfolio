import * as THREE from 'three'

function mirrorShape(points: [number, number][]) {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i += 1) shape.lineTo(points[i][0], points[i][1])
  for (let i = points.length - 2; i >= 0; i -= 1) shape.lineTo(-points[i][0], points[i][1])
  shape.closePath()
  return shape
}

function flipWinding(geometry: THREE.BufferGeometry) {
  const index = geometry.getIndex()
  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      const first = index.getX(i)
      index.setX(i, index.getX(i + 2))
      index.setX(i + 2, first)
    }
    index.needsUpdate = true
    return
  }
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i += 3) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    position.setXYZ(i, position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2))
    position.setXYZ(i + 2, x, y, z)
  }
}

function extrudePlan(shape: THREE.Shape, depth: number, y: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.045,
    bevelSegments: 2,
    curveSegments: 1,
  })
  geometry.rotateX(-Math.PI / 2)
  geometry.scale(1, 1, -1)
  geometry.translate(0, y, 0)
  // The Z mirror reverses triangle order. Recompute after flipping it back,
  // otherwise the shell faces inward and the roof and deck disappear.
  flipWinding(geometry)
  geometry.computeVertexNormals()
  return geometry
}

const BODY_PLAN: [number, number][] = [
  [0.08, 2.18],
  [0.55, 2.08],
  [0.82, 1.72],
  [0.9, 1.15],
  [0.84, 0.4],
  [0.76, -0.15],
  [0.96, -0.7],
  [1.02, -1.35],
  [0.9, -1.85],
  [0.62, -2.12],
  [0.16, -2.2],
]

export function coupeBodyGeometry() {
  return extrudePlan(mirrorShape(BODY_PLAN), 0.42, 0.3)
}

/** Closed fastback greenhouse. Shape X is car Z (nose positive), shape Y is up. */
export function coupeRoofGeometry() {
  const shape = new THREE.Shape()
  const profile: [number, number][] = [
    [0.84, 0.64],
    [0.72, 0.78],
    [0.2, 1.08],
    [-0.06, 1.16],
    [-0.5, 1.15],
    [-0.72, 1.02],
    [-1.1, 0.74],
    [-1.12, 0.62],
    [0.84, 0.62],
  ]
  shape.moveTo(profile[0][0], profile[0][1])
  for (let i = 1; i < profile.length; i += 1) shape.lineTo(profile[i][0], profile[i][1])
  shape.closePath()

  const width = 1.04
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 2,
  })
  geometry.rotateY(Math.PI / 2)
  geometry.translate(-width / 2, 0, 0)
  geometry.scale(1, 1, -1)
  flipWinding(geometry)
  geometry.computeVertexNormals()
  return geometry
}

export function sideBladeGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(0.22, 0.5)
  shape.bezierCurveTo(-0.05, 0.52, -0.45, 0.58, -0.85, 0.72)
  shape.lineTo(-1.28, 0.9)
  shape.lineTo(-1.4, 0.5)
  shape.lineTo(-0.15, 0.4)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 8,
  })
  geometry.rotateY(Math.PI / 2)
  geometry.scale(1, 1, -1)
  geometry.translate(1.02, 0, 0)
  flipWinding(geometry)
  geometry.computeVertexNormals()
  return geometry
}
