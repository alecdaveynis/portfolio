import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useNav, useNavActions } from '../state/navigation'
import {
  pathFromPosition,
  predefinedPath,
  smootherstep,
  smootherstepDeriv,
  tangentAt,
  tripDuration,
} from '../world/layout'
import { CAR_MODEL_FIT, CAR_MODEL_URL } from './carConfig'
import { carFocus, drive } from './driveState'
import { ProceduralR8 } from './ProceduralR8'

function ExternalCar() {
  const gltf = useGLTF(CAR_MODEL_URL ?? '')
  return (
    <group
      scale={CAR_MODEL_FIT.scale}
      rotation={[0, CAR_MODEL_FIT.rotationY, 0]}
      position={[0, CAR_MODEL_FIT.positionY, 0]}
    >
      <primitive object={gltf.scene} />
    </group>
  )
}

export function AudiR8() {
  const group = useRef<THREE.Group>(null)
  const nav = useNav()
  const { arrived } = useNavActions()
  const tripRef = useRef(nav.trip)
  const progress = useRef(1)
  const reported = useRef(true)
  const pathRef = useRef<THREE.Curve<THREE.Vector3> | null>(null)
  const duration = useRef(1.8)
  const length = useRef(0)
  const yaw = useRef(0.95)

  useFrame((_, delta) => {
    const car = group.current
    if (!car) return

    if (tripRef.current !== nav.trip) {
      tripRef.current = nav.trip
      reported.current = false
      pathRef.current = nav.freeStart
        ? pathFromPosition(car.position.clone(), nav.to)
        : predefinedPath(nav.from, nav.to)
      progress.current = pathRef.current ? 0 : 1
      length.current = pathRef.current?.getLength() ?? 0
      duration.current = pathRef.current ? tripDuration(pathRef.current) : 1.5
    }

    const path = pathRef.current
    const place = (t: number) => {
      if (!path) return
      const point = path.getPoint(t)
      car.position.set(point.x, 0, point.z)
      const tangent = tangentAt(path, t)
      yaw.current = Math.atan2(tangent.x, tangent.z)
      car.rotation.y = yaw.current
    }
    const finish = () => {
      if (reported.current) return
      reported.current = true
      if (nav.phase === 'driving') arrived(nav.trip)
    }

    if (path && nav.direct && progress.current < 1) {
      progress.current = 1
      place(1)
      drive.speed = 0
      drive.steer = 0
      drive.braking = false
      finish()
    } else if (path && progress.current < 1 && nav.phase === 'driving') {
      progress.current = Math.min(1, progress.current + delta / duration.current)
      const linear = progress.current
      const eased = smootherstep(linear)
      const point = path.getPoint(eased)
      car.position.set(point.x, 0, point.z)
      const tangent = tangentAt(path, eased)
      const targetYaw = Math.atan2(tangent.x, tangent.z)
      const deltaYaw = Math.atan2(Math.sin(targetYaw - yaw.current), Math.cos(targetYaw - yaw.current))
      const applied = THREE.MathUtils.clamp(deltaYaw, -3.5 * delta, 3.5 * delta)
      yaw.current += applied
      car.rotation.y = yaw.current
      drive.speed = (length.current / duration.current) * smootherstepDeriv(linear)
      const steerTarget = THREE.MathUtils.clamp((-applied / Math.max(delta, 1e-4)) * 0.11, -0.36, 0.36)
      drive.steer = THREE.MathUtils.damp(drive.steer, steerTarget, 8, delta)
      drive.braking = linear > 0.64
      if (progress.current >= 1) finish()
    } else {
      if (car.rotation.y === 0 && yaw.current !== 0) car.rotation.y = yaw.current
      drive.speed = THREE.MathUtils.damp(drive.speed, 0, 5, delta)
      drive.steer = THREE.MathUtils.damp(drive.steer, 0, 6, delta)
      drive.braking = false
    }

    carFocus.position.copy(car.position)
    carFocus.moving = nav.phase === 'driving' && progress.current < 1
  })

  return (
    <group ref={group} rotation={[0, 0.95, 0]}>
      {CAR_MODEL_URL ? <ExternalCar /> : <ProceduralR8 />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.38} depthWrite={false} />
      </mesh>
    </group>
  )
}
