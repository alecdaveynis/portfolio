import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { DestinationId } from '../content/portfolio'
import type { LocationId } from '../world/layout'

export type Phase = 'idle' | 'driving' | 'arriving' | 'viewing'

type NavState = {
  phase: Phase
  location: LocationId
  from: LocationId
  to: LocationId
  panel: DestinationId | null
  trip: number
  direct: boolean
  freeStart: boolean
  reducedMotion: boolean
}

type Action =
  | { type: 'drive'; to: LocationId }
  | { type: 'open'; to: DestinationId }
  | { type: 'skip' }
  | { type: 'arrived'; trip: number }
  | { type: 'finishOpen'; trip: number }
  | { type: 'close' }
  | { type: 'setReduced'; value: boolean }

const NavigationContext = createContext<NavState | null>(null)

type Actions = {
  driveTo: (id: DestinationId) => void
  openDirect: (id: DestinationId) => void
  returnToHub: () => void
  skip: () => void
  closePanel: () => void
  arrived: (trip: number) => void
}

const ActionsContext = createContext<Actions | null>(null)

function createInitial(reducedMotion: boolean): NavState {
  return {
    phase: 'idle',
    location: 'hub',
    from: 'hub',
    to: 'hub',
    panel: null,
    trip: 0,
    direct: false,
    freeStart: false,
    reducedMotion,
  }
}

function isDestination(id: LocationId): id is DestinationId {
  return id !== 'hub'
}

function reducer(state: NavState, action: Action): NavState {
  switch (action.type) {
    case 'setReduced':
      return state.reducedMotion === action.value ? state : { ...state, reducedMotion: action.value }
    case 'drive': {
      if (state.phase === 'driving' && state.to === action.to) return state
      if (state.phase !== 'driving' && state.location === action.to) {
        if (action.to === 'hub') return { ...state, panel: null, phase: 'idle' }
        return { ...state, phase: 'viewing', panel: action.to }
      }
      if (state.reducedMotion) {
        const panel = action.to === 'hub' ? null : action.to
        return {
          ...state,
          phase: panel ? 'viewing' : 'idle',
          location: action.to,
          from: state.location,
          to: action.to,
          panel,
          trip: state.trip + 1,
          direct: true,
          freeStart: false,
        }
      }
      const freeStart = state.phase === 'driving'
      return {
        ...state,
        phase: 'driving',
        from: freeStart ? state.from : state.location,
        to: action.to,
        panel: null,
        trip: state.trip + 1,
        direct: false,
        freeStart,
      }
    }
    case 'open': {
      if (state.panel === action.to && state.phase === 'viewing') return state
      return {
        ...state,
        phase: 'viewing',
        location: action.to,
        from: state.location,
        to: action.to,
        panel: action.to,
        trip: state.trip + 1,
        direct: true,
        freeStart: false,
      }
    }
    case 'skip':
      if (state.phase !== 'driving') return state
      return { ...state, direct: true }
    case 'arrived': {
      if (action.trip !== state.trip || state.phase !== 'driving') return state
      if (state.to === 'hub') {
        return {
          ...state,
          phase: 'idle',
          location: 'hub',
          from: 'hub',
          panel: null,
          direct: false,
          freeStart: false,
        }
      }
      return { ...state, phase: 'arriving', location: state.to, freeStart: false }
    }
    case 'finishOpen': {
      if (action.trip !== state.trip || state.phase !== 'arriving') return state
      if (!isDestination(state.to)) return { ...state, phase: 'idle', panel: null }
      return { ...state, phase: 'viewing', panel: state.to, location: state.to }
    }
    case 'close':
      if (!state.panel) return state
      return { ...state, phase: 'idle', panel: null }
    default:
      return state
  }
}

export function litDestinations(state: NavState): DestinationId[] {
  if (state.phase === 'driving' || state.phase === 'arriving') {
    return [state.from, state.to].filter(isDestination)
  }
  return isDestination(state.location) ? [state.location] : []
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, false, () =>
    createInitial(window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => dispatch({ type: 'setReduced', value: media.matches })
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (state.phase !== 'arriving') return
    const trip = state.trip
    const delay = state.reducedMotion ? 0 : 280
    const timer = window.setTimeout(() => dispatch({ type: 'finishOpen', trip }), delay)
    return () => window.clearTimeout(timer)
  }, [state.phase, state.trip, state.reducedMotion])

  const actions = useMemo<Actions>(
    () => ({
      driveTo: (id) => dispatch({ type: 'drive', to: id }),
      openDirect: (id) => dispatch({ type: 'open', to: id }),
      returnToHub: () => dispatch({ type: 'drive', to: 'hub' }),
      skip: () => dispatch({ type: 'skip' }),
      closePanel: () => dispatch({ type: 'close' }),
      arrived: (trip) => dispatch({ type: 'arrived', trip }),
    }),
    [],
  )

  return (
    <ActionsContext.Provider value={actions}>
      <NavigationContext.Provider value={state}>{children}</NavigationContext.Provider>
    </ActionsContext.Provider>
  )
}

export function useNav() {
  const state = useContext(NavigationContext)
  if (!state) throw new Error('useNav must be used within NavigationProvider')
  return state
}

export function useNavActions() {
  const actions = useContext(ActionsContext)
  if (!actions) throw new Error('useNavActions must be used within NavigationProvider')
  return actions
}
