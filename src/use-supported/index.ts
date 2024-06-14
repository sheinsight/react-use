import { useEffect } from 'react'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'

import type { DependencyList } from 'react'

/**
 * SSR friendly version of `useSupported` that returns a boolean indicating whether the current environment supports the given feature.
 */
export function useSupported(callback: () => unknown, deps: DependencyList = []): boolean {
  const [isSupported, setIsSupported] = useSafeState<boolean>(false)

  const latest = useLatest({ callback })

  useEffect(() => {
    setIsSupported(Boolean(latest.current.callback()))
  }, deps)

  return isSupported
}
