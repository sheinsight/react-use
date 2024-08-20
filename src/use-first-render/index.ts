import { useRef } from 'react'

export function useFirstRender() {
  const firstRenderRef = useRef(true)

  if (firstRenderRef.current) {
    firstRenderRef.current = false
    return true
  }

  return false
}
