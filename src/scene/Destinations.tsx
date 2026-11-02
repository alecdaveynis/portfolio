import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { DestinationId } from '../content/portfolio'
import { litDestinations, useNav, useNavActions } from '../state/navigation'
import { destinationSpecs, type DestinationSpec } from '../world/layout'

function useServerTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 128
    const context = canvas.getContext('2d')
    if (!context) return null
    context.fillStyle = '#141b24'
    context.fillRect(0, 0, 64, 128)
    for (let y = 6; y < 124; y += 8) {
      context.fillStyle = y % 16 === 6 ? 'rgba(168, 244, 250, 0.95)' : 'rgba(110, 196, 208, 0.28)'
      context.fillRect(6, y, 52, 2)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])
}

function Shell({
  position,
  args,
  rotation,
  color = '#171d26',
}: {
  position: [number, number, number]
  args: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.06} />
    </mesh>
  )
}

function ProjectsCluster({ active }: { active: boolean }) {
  const texture = useServerTexture()
  const intensity = active ? 0.85 : 0.32
  return (
    <group>
      <Shell position={[0, 0.12, 0]} args={[2.3, 0.24, 1.5]} />
      {[
        [-0.62, 0.95, 0.05, 1.55],
        [0.08, 1.22, -0.08, 2.05],
        [0.72, 0.82, 0.12, 1.28],
      ].map(([x, y, z, height]) => (
        <mesh key={`${x}-${height}`} position={[x, y, z]}>
          <boxGeometry args={[0.52, height, 0.52]} />
          <meshStandardMaterial
            color="#121820"
            map={texture}
            emissive="#146e7c"
            emissiveMap={texture}
            emissiveIntensity={intensity}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function ExperienceHall({ active }: { active: boolean }) {
  return (
    <group>
      <Shell position={[0, 0.48, 0]} args={[2.7, 0.96, 1.55]} />
      <Shell position={[0, 1.08, -0.08]} args={[2.82, 0.07, 1.75]} rotation={[0.16, 0, 0]} color="#1c242e" />
      <Shell position={[0.95, 1.38, -0.2]} args={[0.52, 0.62, 0.52]} />
      <mesh position={[0, 0.62, 0.8]}>
        <boxGeometry args={[1.7, 0.16, 0.04]} />
        <meshStandardMaterial
          color="#06262c"
          emissive="#7fe7f1"
          emissiveIntensity={active ? 1.15 : 0.4}
          roughness={0.4}
        />
      </mesh>
    </group>
  )
}

function SkillsBench({ active }: { active: boolean }) {
  return (
    <group>
      <Shell position={[0, 0.16, 0]} args={[1.7, 0.32, 1.05]} />
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.28, 18]} />
        <meshStandardMaterial color="#1a212b" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 8, 20]} />
        <meshStandardMaterial
          color="#08343c"
          emissive="#8feaf2"
          emissiveIntensity={active ? 1.1 : 0.4}
        />
      </mesh>
      <group position={[0, 0.66, 0]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.34, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.1, 0.68, 0.1]} />
          <meshStandardMaterial color="#222a34" roughness={0.62} metalness={0.18} />
        </mesh>
        <group position={[0, 0.64, 0.12]} rotation={[-1.05, 0, 0]}>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.08, 0.52, 0.08]} />
            <meshStandardMaterial color="#2a333e" roughness={0.55} metalness={0.22} />
          </mesh>
          <mesh position={[0.06, 0.52, 0]}>
            <boxGeometry args={[0.025, 0.14, 0.025]} />
            <meshStandardMaterial color="#d7f7fb" emissive="#8feaf2" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[-0.06, 0.52, 0]}>
            <boxGeometry args={[0.025, 0.14, 0.025]} />
            <meshStandardMaterial color="#d7f7fb" emissive="#8feaf2" emissiveIntensity={0.35} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function AboutTerminal({ active }: { active: boolean }) {
  return (
    <group>
      <Shell position={[0, 0.28, 0]} args={[0.72, 0.56, 0.56]} />
      <Shell position={[0, 0.7, 0.02]} args={[0.96, 0.08, 0.42]} />
      <mesh position={[0, 1.12, 0.04]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.92, 0.58, 0.05]} />
        <meshStandardMaterial color="#10161c" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.12, 0.07]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[0.78, 0.44]} />
        <meshStandardMaterial
          color="#071418"
          emissive="#1c7f8e"
          emissiveIntensity={active ? 0.85 : 0.28}
        />
      </mesh>
    </group>
  )
}

function ContactMast({ active }: { active: boolean }) {
  return (
    <group>
      <Shell position={[0, 0.22, 0]} args={[1.25, 0.44, 0.8]} />
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 1.2, 10]} />
        <meshStandardMaterial color="#232b36" roughness={0.45} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.72, 0.02]} rotation={[0.7, 0, 0]}>
        <sphereGeometry args={[0.38, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        <meshStandardMaterial color="#1a222c" roughness={0.48} metalness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.42, 0.36, 0.42]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#d8fbff"
          emissive="#8feaf2"
          emissiveIntensity={active ? 1.4 : 0.45}
        />
      </mesh>
    </group>
  )
}

const structures: Record<DestinationId, (active: boolean) => ReactNode> = {
  projects: (active) => <ProjectsCluster active={active} />,
  experience: (active) => <ExperienceHall active={active} />,
  skills: (active) => <SkillsBench active={active} />,
  about: (active) => <AboutTerminal active={active} />,
  contact: (active) => <ContactMast active={active} />,
}

const labelHeight: Record<DestinationId, number> = {
  projects: 2.7,
  experience: 2.15,
  skills: 2.15,
  about: 1.75,
  contact: 2.25,
}

function DestinationLabel({
  label,
  active,
  position,
  onClick,
}: {
  label: string
  active: boolean
  position: [number, number, number]
  onClick: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const onClickRef = useRef(onClick)
  const { camera, size, gl } = useThree()
  const point = useMemo(() => new THREE.Vector3(), [])
  onClickRef.current = onClick

  useEffect(() => {
    const parent = gl.domElement.parentElement
    if (!parent) return
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = label
    button.dataset.label = label
    button.className =
      'pointer-events-auto absolute top-0 left-0 z-20 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur-md'
    button.style.borderColor = 'rgba(143, 234, 242, 0.4)'
    button.style.background = 'rgba(8, 11, 16, 0.78)'
    button.style.color = '#e7fdff'
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
      onClickRef.current()
    }
    button.addEventListener('click', handleClick)
    parent.appendChild(button)
    buttonRef.current = button
    return () => {
      button.removeEventListener('click', handleClick)
      button.remove()
      buttonRef.current = null
    }
  }, [gl, label])

  useFrame(() => {
    const button = buttonRef.current
    const object = group.current
    if (!button || !object) return
    object.updateWorldMatrix(true, false)
    point.setFromMatrixPosition(object.matrixWorld).project(camera)
    const x = (point.x * 0.5 + 0.5) * size.width
    const y = (-point.y * 0.5 + 0.5) * size.height
    button.style.display = point.z > 1 ? 'none' : 'block'
    button.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    button.style.borderColor = active ? '#e7fdff' : 'rgba(143, 234, 242, 0.4)'
    button.style.background = active ? 'rgba(7, 16, 20, 0.88)' : 'rgba(8, 11, 16, 0.78)'
  })

  return <group ref={group} position={position} />
}

function Destination({ spec, active }: { spec: DestinationSpec; active: boolean }) {
  const { driveTo } = useNavActions()
  const [hovered, setHovered] = useState(false)
  const lit = active || hovered

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <group position={spec.anchor} rotation={[0, spec.facing, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.45, 40]} />
        <meshBasicMaterial color={lit ? '#142027' : '#10161c'} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.35, 1.42, 48]} />
        <meshBasicMaterial color={lit ? '#dffcff' : '#63d3e2'} transparent opacity={lit ? 0.9 : 0.38} />
      </mesh>
      {structures[spec.id](lit)}
      <mesh
        position={[0, 1.1, 0]}
        onClick={(event) => {
          event.stopPropagation()
          driveTo(spec.id)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
      >
        <cylinderGeometry args={[1.55, 1.55, 2.4, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <DestinationLabel
        label={spec.label}
        active={lit}
        position={[0, labelHeight[spec.id], 0.2]}
        onClick={() => driveTo(spec.id)}
      />
    </group>
  )
}

export function Destinations() {
  const nav = useNav()
  const lit = new Set(litDestinations(nav))
  return (
    <group>
      {destinationSpecs.map((spec) => (
        <Destination key={spec.id} spec={spec} active={lit.has(spec.id)} />
      ))}
    </group>
  )
}
