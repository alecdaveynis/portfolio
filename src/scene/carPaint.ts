import { useSyncExternalStore } from 'react'

export type CarColor = {
  id: string
  label: string
  body: string
}

export const carColors: CarColor[] = [
  { id: 'black', label: 'Black', body: '#0b0c0e' },
  { id: 'white', label: 'White', body: '#f2f3f5' },
  { id: 'silver', label: 'Silver', body: '#c5ccd4' },
  { id: 'red', label: 'Red', body: '#c4232a' },
  { id: 'blue', label: 'Blue', body: '#1d4e9c' },
  { id: 'green', label: 'Green', body: '#1f7a45' },
  { id: 'yellow', label: 'Yellow', body: '#e2b313' },
  { id: 'orange', label: 'Orange', body: '#e06a1a' },
  { id: 'purple', label: 'Purple', body: '#6a3d9a' },
]

let current = carColors[0]
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCarColor() {
  return current
}

export function setCarColor(id: string) {
  const next = carColors.find((color) => color.id === id)
  if (!next || next === current) return
  current = next
  listeners.forEach((listener) => listener())
}

export function useCarColor() {
  return useSyncExternalStore(subscribe, getCarColor, getCarColor)
}
