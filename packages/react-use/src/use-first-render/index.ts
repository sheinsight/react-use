import { useRef } from 'react'

/**
 * A React Hook for determining whether the component is currently in its initial render.
 */
export function useFirstRender(): boolean {
  const firstRenderRef = useRef(true)

  if (firstRenderRef.current) {
    firstRenderRef.current = false
    return true
  }

  return false
}
