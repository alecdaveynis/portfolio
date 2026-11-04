import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useNav } from '../state/navigation'
import { carFocus } from './driveState'

const OFFSET = new THREE.Vector3(17.4, 8.6, 17.4)
const MOBILE_OFFSET = new THREE.Vector3(13.2, 12.4, 13.2)
const PAN_LIMIT = 18

/** True from the moment a press becomes a drag until the click that follows it. */
export const sceneDrag = { moved: false }

export function CameraController({ mobile }: { mobile: boolean }) {
  const { panel, phase } = useNav()
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const look = useRef(new THREE.Vector3(-0.35, 0.55, 0.85))
  const desiredLook = useRef(new THREE.Vector3())
  const desiredPos = useRef(new THREE.Vector3())
  const pan = useRef(new THREE.Vector3())
  const dragging = useRef(false)
  const sizeRef = useRef(size)
  sizeRef.current = size

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'none'
    el.style.cursor = 'grab'
    let active = false
    let travel = 0
    let lastX = 0
    let lastY = 0
    let gesture = 0
    const right = new THREE.Vector3()
    const forward = new THREE.Vector3()

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      active = true
      dragging.current = false
      sceneDrag.moved = false
      gesture += 1
      travel = 0
      lastX = event.clientX
      lastY = event.clientY
      try {
        el.setPointerCapture(event.pointerId)
      } catch {
        // Pointer capture needs a trusted event. Drag still tracks while the pointer stays on the canvas.
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!active || !(camera instanceof THREE.PerspectiveCamera)) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      travel += Math.hypot(dx, dy)
      if (travel < 5) return
      dragging.current = true
      sceneDrag.moved = true
      el.style.cursor = 'grabbing'

      const distance = Math.max(camera.position.distanceTo(look.current), 1)
      const worldPerPixel =
        (2 * Math.tan((camera.fov * Math.PI) / 360) * distance) / Math.max(sizeRef.current.height, 1)
      right.setFromMatrixColumn(camera.matrixWorld, 0)
      right.y = 0
      camera.getWorldDirection(forward)
      forward.y = 0
      if (right.lengthSq() < 1e-6 || forward.lengthSq() < 1e-6) return
      right.normalize()
      forward.normalize()
      pan.current.addScaledVector(right, -dx * worldPerPixel)
      pan.current.addScaledVector(forward, dy * worldPerPixel)
      if (pan.current.length() > PAN_LIMIT) pan.current.setLength(PAN_LIMIT)
    }

    const onUp = () => {
      active = false
      dragging.current = false
      el.style.cursor = 'grab'
      if (!sceneDrag.moved) return
      const finished = gesture
      window.setTimeout(() => {
        if (gesture === finished) sceneDrag.moved = false
      }, 0)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.style.cursor = ''
      el.style.touchAction = ''
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [camera, gl])

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

    if (phase !== 'idle' && !dragging.current) pan.current.multiplyScalar(Math.exp(-5 * delta))
    desiredLook.current.add(pan.current)

    const blend = dragging.current ? 1 : 1 - Math.exp(-2.7 * delta)
    look.current.lerp(desiredLook.current, blend)
    desiredPos.current.copy(look.current).add(offset)
    if (dragging.current || (!carFocus.moving && camera.position.distanceTo(desiredPos.current) < 0.01)) {
      camera.position.copy(desiredPos.current)
    } else {
      camera.position.lerp(desiredPos.current, blend)
    }
    camera.lookAt(look.current)
  })

  return null
}
