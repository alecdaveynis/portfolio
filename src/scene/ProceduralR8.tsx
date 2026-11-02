import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { coupeBodyGeometry, coupeRoofGeometry, sideBladeGeometry } from './geometry'
import { drive } from './driveState'

const WHEELS: [number, number, number][] = [
  [0.98, 0.33, 1.28],
  [-0.98, 0.33, 1.28],
  [1.05, 0.33, -1.42],
  [-1.05, 0.33, -1.42],
]

function WheelMesh() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.33, 0.33, 0.24, 28]} />
        <meshStandardMaterial color="#121212" roughness={0.86} metalness={0.05} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.252, 20]} />
        <meshStandardMaterial color="#2a2d31" roughness={0.38} metalness={0.82} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => (
        <group key={index} rotation={[(index * Math.PI * 2) / 5, 0, 0]}>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.03, 0.13, 0.04]} />
            <meshStandardMaterial color="#3a3e44" roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.26, 12]} />
        <meshStandardMaterial color="#111214" roughness={0.45} metalness={0.6} />
      </mesh>
    </group>
  )
}

/**
 * Temporary geometric stand-in for a matte black second-generation Audi R8 coupe.
 * Original low-poly mesh: sideblades, wide rear haunches, low nose, full-width tail lamp.
 * Replace it by setting CAR_MODEL_URL in carConfig.ts.
 */
export function ProceduralR8() {
  const body = useMemo(() => coupeBodyGeometry(), [])
  const roof = useMemo(() => coupeRoofGeometry(), [])
  const blade = useMemo(() => sideBladeGeometry(), [])
  const bladeLeft = useMemo(() => {
    const geometry = blade.clone()
    geometry.scale(-1, 1, 1)
    geometry.computeVertexNormals()
    return geometry
  }, [blade])
  const paint = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b0c0e',
        roughness: 0.78,
        metalness: 0.16,
      }),
    [],
  )
  const bladeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#070708',
        roughness: 0.46,
        metalness: 0.34,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0c1820',
        roughness: 0.06,
        metalness: 0.55,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const roofPaint = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#16191e',
        roughness: 0.42,
        metalness: 0.28,
      }),
    [],
  )
  const tail = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a0508',
        emissive: '#ff2d2d',
        emissiveIntensity: 0.7,
        roughness: 0.35,
      }),
    [],
  )
  const spinners = useRef<Array<THREE.Group | null>>([])
  const steerPivots = useRef<Array<THREE.Group | null>>([])

  useEffect(() => {
    return () => {
      body.dispose()
      roof.dispose()
      blade.dispose()
      bladeLeft.dispose()
      paint.dispose()
      bladeMat.dispose()
      glass.dispose()
      roofPaint.dispose()
      tail.dispose()
    }
  }, [body, roof, blade, bladeLeft, paint, bladeMat, glass, roofPaint, tail])

  useFrame((_, delta) => {
    tail.emissiveIntensity = drive.braking ? 2.15 : 0.62
    const spin = (drive.speed / 0.33) * delta
    spinners.current.forEach((spinner, index) => {
      if (spinner) spinner.rotation.x += spin
      const pivot = steerPivots.current[index]
      if (pivot && index < 2) pivot.rotation.y = drive.steer
    })
  })

  return (
    <group>
      <mesh geometry={body} material={paint} />
      <mesh geometry={roof} material={paint} />
      <mesh geometry={blade} material={bladeMat} />
      <mesh geometry={bladeLeft} material={bladeMat} />

      <mesh position={[0, 1.175, -0.22]} rotation={[-0.04, 0, 0]} material={roofPaint}>
        <boxGeometry args={[0.72, 0.028, 0.52]} />
      </mesh>
      <mesh position={[0, 0.93, 0.46]} rotation={[1.04, 0, 0]} material={glass}>
        <boxGeometry args={[0.82, 0.5, 0.02]} />
      </mesh>
      <mesh position={[0, 0.9, -0.9]} rotation={[-0.9, 0, 0]} material={glass}>
        <boxGeometry args={[0.66, 0.42, 0.02]} />
      </mesh>
      {[0.51, -0.51].map((x) => (
        <mesh key={x} position={[x, 0.98, -0.18]} material={glass}>
          <boxGeometry args={[0.018, 0.22, 0.62]} />
        </mesh>
      ))}

      <mesh position={[0, 0.48, 2.05]}>
        <boxGeometry args={[0.72, 0.22, 0.05]} />
        <meshStandardMaterial color="#070708" roughness={0.42} metalness={0.55} />
      </mesh>
      {[-0.07, -0.02, 0.03, 0.08].map((y) => (
        <mesh key={y} position={[0, 0.48 + y, 2.08]}>
          <boxGeometry args={[0.6, 0.012, 0.02]} />
          <meshStandardMaterial color="#1a1c20" roughness={0.35} metalness={0.7} />
        </mesh>
      ))}

      {[0.58, -0.58].map((x) => (
        <group key={x} position={[x, 0.55, 1.95]}>
          <mesh>
            <boxGeometry args={[0.32, 0.075, 0.05]} />
            <meshStandardMaterial color="#f3f6f4" emissive="#f4f7f5" emissiveIntensity={0.9} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.02, 0.02]}>
            <boxGeometry args={[0.24, 0.012, 0.012]} />
            <meshStandardMaterial color="#d9fbff" emissive="#8feaf2" emissiveIntensity={0.55} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.58, -2.16]} material={tail}>
        <boxGeometry args={[1.2, 0.045, 0.04]} />
      </mesh>

      <mesh position={[0.96, 0.46, -0.45]}>
        <boxGeometry args={[0.018, 0.012, 1.05]} />
        <meshStandardMaterial color="#08343c" emissive="#7fe7f1" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[-0.96, 0.46, -0.45]}>
        <boxGeometry args={[0.018, 0.012, 1.05]} />
        <meshStandardMaterial color="#08343c" emissive="#7fe7f1" emissiveIntensity={0.45} />
      </mesh>

      {[0.8, -0.8].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.32]}>
          <boxGeometry args={[0.16, 0.08, 0.1]} />
          <meshStandardMaterial color="#101114" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      <group>
        {WHEELS.map((position, index) => (
          <group
            key={position.join(':')}
            position={position}
            ref={(node) => {
              steerPivots.current[index] = node
            }}
          >
            <group
              ref={(node) => {
                spinners.current[index] = node
              }}
            >
              <WheelMesh />
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}
