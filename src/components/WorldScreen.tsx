import { Component, useEffect, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { PortfolioWorld } from '../scene/PortfolioWorld'
import { useNav, useNavActions } from '../state/navigation'
import { ContentPanel } from './ContentPanel'
import { IntroOverlay } from './IntroOverlay'
import { NavigationController } from './NavigationController'
import { TopNav } from './TopNav'

class SceneBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFail()
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

export function WorldScreen({ onText, onFail }: { onText: () => void; onFail: () => void }) {
  const mobile = useMediaQuery('(max-width: 760px)')
  const { phase, location, panel } = useNav()
  const { closePanel, skip } = useNavActions()
  const showHint = phase === 'idle' && location === 'hub' && !panel

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <div className="relative h-dvh overflow-hidden bg-[#080B10]">
      <p className="sr-only">
        Interactive isometric portfolio. The car is a temporary low-poly stand-in for a matte black
        second-generation Audi R8. Use the menu to open a section directly, or select a destination in the
        scene to drive there.
      </p>
      <SceneBoundary onFail={onFail}>
        <Canvas
          className="absolute inset-0 z-0"
          dpr={mobile ? [1, 1.15] : [1, 1.5]}
          camera={{ position: [17.05, 9.15, 18.25], fov: mobile ? 50 : 36, near: 0.1, far: 180 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#080B10')
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.05
          }}
        >
          <PortfolioWorld mobile={mobile} />
        </Canvas>
      </SceneBoundary>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(8,11,16,0.72)_100%)]" />
      <NavigationController />
      <TopNav onText={onText} />
      <IntroOverlay />
      {panel ? (
        <div className="absolute inset-0 z-30 bg-black/25" onClick={closePanel} aria-hidden="true" />
      ) : null}
      <ContentPanel />
      {phase === 'driving' ? (
        <button
          type="button"
          onClick={skip}
          className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#080b10]/80 px-4 py-2 text-xs tracking-[0.14em] text-white/80 uppercase backdrop-blur-md"
        >
          Skip
        </button>
      ) : null}
      {showHint ? (
        <p className="pointer-events-none absolute top-28 left-1/2 z-20 w-[min(calc(100%-2rem),24rem)] -translate-x-1/2 rounded-2xl border border-[#9ee7f0]/50 bg-[#071016]/88 px-4 py-2.5 text-center text-sm leading-snug text-[#e7fdff] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md md:top-[4.25rem]">
          Drag to look around.
          <span className="mt-0.5 block font-medium">Click a destination to drive.</span>
        </p>
      ) : null}
    </div>
  )
}
