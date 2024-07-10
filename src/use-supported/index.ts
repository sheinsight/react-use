import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'

import type { DependencyList } from 'react'

/**
 * A React Hook that helps to check if browser supports a feature in both client and Server-side Rendering (SSR).
 */
export function useSupported(callback: () => unknown, deps: DependencyList = []): boolean {
  const [isSupported, setIsSupported] = useSafeState<boolean>(false)

  const latest = useLatest({ callback })

  useIsomorphicLayoutEffect(() => {
    setIsSupported(Boolean(latest.current.callback()))
  }, deps)

  return isSupported
}
