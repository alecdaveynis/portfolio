import { useState } from 'react'
import { StaticSite } from './components/StaticSite'
import { WorldScreen } from './components/WorldScreen'
import { NavigationProvider } from './state/navigation'

function useWebGLSupport() {
  const [ok] = useState(() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      return false
    }
  })
  return ok
}

export default function App() {
  const webgl = useWebGLSupport()
  const [mode, setMode] = useState<'world' | 'text'>(webgl ? 'world' : 'text')

  return (
    <NavigationProvider>
      {mode === 'world' ? (
        <WorldScreen onText={() => setMode('text')} onFail={() => setMode('text')} />
      ) : (
        <StaticSite onEnterWorld={webgl ? () => setMode('world') : undefined} />
      )}
    </NavigationProvider>
  )
}
