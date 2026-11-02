import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useNav } from '../state/navigation'
import { carFocus } from './driveState'

const OFFSET = new THREE.Vector3(17.4, 8.6, 17.4)
const MOBILE_OFFSET = new THREE.Vector3(13.2, 12.4, 13.2)

export function CameraController({ mobile }: { mobile: boolean }) {
  const { panel, phase } = useNav()
  const camera = useThree((state) => state.camera)
  const look = useRef(new THREE.Vector3(-0.35, 0.55, 0.85))
  const desiredLook = useRef(new THREE.Vector3())
  const desiredPos = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return
    camera.fov = mobile ? 50 : 36
    camera.updateProjectionMatrix()
  }, [camera, mobile])

  useFrame((_, delta) => {
    const offset = mobile ? MOBILE_OFFSET : OFFSET
    const atHub = carFocus.position.lengthSq() < 0.4 && !panel && phase !== 'driving'
    if (atHub) desiredLook.current.set(-0.35, 0.55, 0.85)
    else {
      desiredLook.current.set(
        carFocus.position.x + (panel && !mobile ? 2.15 : 0),
        0.6,
        carFocus.position.z,
      )
    }

    const blend = 1 - Math.exp(-2.7 * delta)
    look.current.lerp(desiredLook.current, blend)
    desiredPos.current.copy(look.current).add(offset)
    if (!carFocus.moving && camera.position.distanceTo(desiredPos.current) < 0.01) {
      camera.position.copy(desiredPos.current)
    } else {
      camera.position.lerp(desiredPos.current, blend)
    }
    camera.lookAt(look.current)
  })

  return null
}
