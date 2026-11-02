import { useMemo } from 'react'
import * as THREE from 'three'
import { AudiR8 } from './AudiR8'
import { CameraController } from './CameraController'
import { Destinations } from './Destinations'
import { RoadNetwork } from './RoadNetwork'
import { HUB_RADIUS } from '../world/layout'

function useGridTexture() {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) return null
    context.fillStyle = '#080b10'
    context.fillRect(0, 0, size, size)
    context.strokeStyle = 'rgba(186, 204, 216, 0.06)'
    context.lineWidth = 1
    for (let i = 0; i <= size; i += 32) {
      context.beginPath()
      context.moveTo(i + 0.5, 0)
      context.lineTo(i + 0.5, size)
      context.stroke()
      context.beginPath()
      context.moveTo(0, i + 0.5)
      context.lineTo(size, i + 0.5)
      context.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(16, 16)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])
}

export function PortfolioWorld({ mobile }: { mobile: boolean }) {
  const grid = useGridTexture()

  return (
    <>
      <color attach="background" args={['#080B10']} />
      <fog attach="fog" args={['#080B10', 36, 78]} />
      <hemisphereLight args={['#d7e4f2', '#10151c', 0.72]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[10, 14, 16]} intensity={5.4} color="#f7f8fb" />
      <directionalLight position={[-10, 7, -6]} intensity={0.85} color="#b7e4ee" />

      {grid && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[140, 140]} />
          <meshBasicMaterial map={grid} />
        </mesh>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[HUB_RADIUS, 72]} />
        <meshBasicMaterial color="#121820" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <ringGeometry args={[HUB_RADIUS - 0.045, HUB_RADIUS + 0.01, 80]} />
        <meshBasicMaterial color="#8feaf2" transparent opacity={0.55} />
      </mesh>

      <RoadNetwork />
      <Destinations />
      <AudiR8 />
      <CameraController mobile={mobile} />
    </>
  )
}
