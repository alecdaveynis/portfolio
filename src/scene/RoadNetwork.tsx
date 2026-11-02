import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { DestinationId } from '../content/portfolio'
import { litDestinations, useNav } from '../state/navigation'
import { destinationSpecs, offsetPolyline, ribbonGeometry, roadPolyline } from '../world/layout'

const ROAD_Y = 0.04
const EDGE_ON = new THREE.Color('#f4feff')
const EDGE_OFF = new THREE.Color('#7eeaf4')

function Road({ id, active }: { id: DestinationId; active: boolean }) {
  const edges = useMemo(() => {
    const center = roadPolyline(id)
    return [0.16, -0.16].map((offset) => ribbonGeometry(offsetPolyline(center, offset), 0.028, ROAD_Y))
  }, [id])
  const materials = useRef<THREE.MeshBasicMaterial[]>([])

  useEffect(() => {
    return () => {
      edges.forEach((geometry) => geometry.dispose())
    }
  }, [edges])

  useFrame((_, delta) => {
    const edgeOpacity = active ? 1 : 0.72
    materials.current.forEach((material) => {
      if (!material) return
      material.opacity = THREE.MathUtils.damp(material.opacity, edgeOpacity, 6, delta)
      material.color.lerp(active ? EDGE_ON : EDGE_OFF, 1 - Math.exp(-6 * delta))
    })
  })

  return (
    <group>
      {edges.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial
            ref={(material) => {
              if (material) materials.current[index] = material
            }}
            color="#7eeaf4"
            transparent
            opacity={0.72}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

export function RoadNetwork() {
  const nav = useNav()
  const lit = new Set(litDestinations(nav))

  return (
    <group>
      {destinationSpecs.map((spec) => (
        <Road key={spec.id} id={spec.id} active={lit.has(spec.id)} />
      ))}
    </group>
  )
}
