import { useEffect } from 'react'
import type { DestinationId } from '../content/portfolio'
import { useNav, useNavActions } from '../state/navigation'

const keys: Record<string, DestinationId> = {
  '1': 'projects',
  '2': 'experience',
  '3': 'skills',
  '4': 'about',
  '5': 'contact',
}

export function NavigationController() {
  const { phase, panel } = useNav()
  const { openDirect, skip, closePanel, returnToHub } = useNavActions()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      }
      if (event.key === 'Escape') {
        if (phase === 'driving') skip()
        else if (panel) closePanel()
        return
      }
      if (keys[event.key]) {
        event.preventDefault()
        openDirect(keys[event.key])
        return
      }
      if (event.key === '0') {
        event.preventDefault()
        returnToHub()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, panel, openDirect, skip, closePanel, returnToHub])

  return (
    <p className="sr-only">
      Press 1 through 5 to open Projects, Experience, Skills, About, and Contact. Press 0 to return to the
      start. Press Escape to close a panel or skip a drive.
    </p>
  )
}
