import * as THREE from 'three'
import type { DestinationId } from '../content/portfolio'

export type LocationId = DestinationId | 'hub'

export type DestinationSpec = {
  id: DestinationId
  label: string
  park: THREE.Vector3
  anchor: THREE.Vector3
  bend: number
  facing: number
}

const PARK = 7.15
const ANCHOR = 10.15

function destination(
  id: DestinationId,
  label: string,
  x: number,
  z: number,
  bend: number,
): DestinationSpec {
  const dir = new THREE.Vector2(x, z).normalize()
  const park = new THREE.Vector3(dir.x * PARK, 0, dir.y * PARK)
  const anchor = new THREE.Vector3(dir.x * ANCHOR, 0, dir.y * ANCHOR)
  return {
    id,
    label,
    park,
    anchor,
    bend,
    facing: Math.atan2(-dir.x, -dir.y),
  }
}

export const destinationSpecs: DestinationSpec[] = [
  destination('projects', 'Projects', 0.95, 0.42, 0.35),
  destination('experience', 'Experience', 0.08, -1, -0.28),
  destination('skills', 'Skills', -0.78, -0.62, 0.32),
  destination('about', 'About', -1, 0.22, -0.22),
  destination('contact', 'Contact', 0.62, -0.78, 0.26),
]

const specById = Object.fromEntries(destinationSpecs.map((spec) => [spec.id, spec])) as Record<
  DestinationId,
  DestinationSpec
>

export function specFor(id: DestinationId) {
  return specById[id]
}

function buildCurve(park: THREE.Vector3, bend: number) {
  const start = new THREE.Vector3(0, 0, 0)
  const end = park.clone()
  const mid = start.clone().lerp(end, 0.5)
  const dir = end.clone().sub(start)
  const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(bend)
  mid.add(side)
  mid.y = 0
  return new THREE.CatmullRomCurve3([start, mid, end], false, 'catmullrom', 0.45)
}

export const roadCurves: Record<DestinationId, THREE.CatmullRomCurve3> = {
  projects: buildCurve(specFor('projects').park, specFor('projects').bend),
  experience: buildCurve(specFor('experience').park, specFor('experience').bend),
  skills: buildCurve(specFor('skills').park, specFor('skills').bend),
  about: buildCurve(specFor('about').park, specFor('about').bend),
  contact: buildCurve(specFor('contact').park, specFor('contact').bend),
}

export const HUB = new THREE.Vector3(0, 0, 0)
export const HUB_RADIUS = 2.42

export function smootherstep(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export function smootherstepDeriv(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return 30 * x * x * (x - 1) * (x - 1)
}

export function tripDuration(curve: THREE.Curve<THREE.Vector3>) {
  return THREE.MathUtils.clamp(curve.getLength() / 6.3, 1.5, 2.5)
}

export function tangentAt(curve: THREE.Curve<THREE.Vector3>, t: number) {
  const tan = curve.getTangent(THREE.MathUtils.clamp(t, 0.02, 0.98))
  if (tan.lengthSq() < 1e-6) return new THREE.Vector3(0, 0, 1)
  return tan.normalize()
}

function resample(curve: THREE.Curve<THREE.Vector3>, count: number, reverse = false) {
  const points = curve.getPoints(count)
  return reverse ? points.reverse() : points
}

export function predefinedPath(from: LocationId, to: LocationId) {
  if (from === to) return null
  if (from === 'hub' && to !== 'hub') return roadCurves[to]
  if (to === 'hub' && from !== 'hub') {
    return new THREE.CatmullRomCurve3(resample(roadCurves[from], 40, true))
  }
  if (from !== 'hub' && to !== 'hub') {
    const back = resample(roadCurves[from], 28, true)
    const forward = resample(roadCurves[to], 28, false)
    forward.shift()
    return new THREE.CatmullRomCurve3([...back, ...forward])
  }
  return null
}

export function pathFromPosition(position: THREE.Vector3, to: LocationId) {
  const end = to === 'hub' ? HUB.clone() : specFor(to).park.clone()
  if (position.distanceTo(end) < 0.2) {
    return new THREE.LineCurve3(position.clone(), end.clone())
  }
  if (to !== 'hub') {
    const via = roadCurves[to].getPoint(0.62)
    if (position.distanceTo(via) > 0.8) {
      return new THREE.CatmullRomCurve3([position.clone(), via, end])
    }
  }
  const mid = position.clone().lerp(end, 0.5)
  mid.y = 0
  return new THREE.CatmullRomCurve3([position.clone(), mid, end])
}

export function roadPolyline(id: DestinationId) {
  const curve = roadCurves[id]
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 56; i += 1) {
    const point = curve.getPoint(i / 56)
    if (points.length === 0 && point.length() < HUB_RADIUS - 0.05) continue
    points.push(point)
  }
  return points
}

export function ribbonGeometry(points: THREE.Vector3[], width: number, y: number) {
  const positions: number[] = []
  const indices: number[] = []
  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[Math.max(i - 1, 0)]
    const next = points[Math.min(i + 1, points.length - 1)]
    const tangent = next.clone().sub(prev)
    tangent.y = 0
    if (tangent.lengthSq() < 1e-8) tangent.set(0, 0, 1)
    tangent.normalize()
    const side = new THREE.Vector3().crossVectors(up, tangent).normalize().multiplyScalar(width / 2)
    const p = points[i]
    positions.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z)
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = i * 2
    indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function offsetPolyline(points: THREE.Vector3[], distance: number) {
  const up = new THREE.Vector3(0, 1, 0)
  return points.map((point, index) => {
    const prev = points[Math.max(index - 1, 0)]
    const next = points[Math.min(index + 1, points.length - 1)]
    const tangent = next.clone().sub(prev)
    tangent.y = 0
    if (tangent.lengthSq() < 1e-8) tangent.set(0, 0, 1)
    tangent.normalize()
    const side = new THREE.Vector3().crossVectors(up, tangent).normalize()
    return point.clone().addScaledVector(side, distance)
  })
}
