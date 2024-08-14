import { useEffect } from 'react'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'

import type { DependencyList } from 'react'

/**
 * A React Hook that helps to check if browser supports a feature in both client and Server-side Rendering (SSR).
 *
 * TODO: in 2.0 use Ref to track & mark dependencies to reduce render, only update when deps actually used and changed.
 */
export function useSupported(callback: () => unknown, deps: DependencyList = []): boolean {
  const [isSupported, setIsSupported] = useSafeState<boolean>(false)

  const latest = useLatest({ callback })

  useEffect(() => {
    setIsSupported(Boolean(latest.current.callback()))
  }, deps)

  return isSupported
}
