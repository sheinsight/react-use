import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { useUpdateEffect } from '../use-update-effect'

import type { ReactSetState } from '../use-safe-state'

export type UseClonedStateOptions = {
  /**
   * Clone function
   *
   * @defaultValue defaultCloneFn (Implemented simply using JSON.parse(JSON.stringify(source)))
   */
  clone?: <T>(source: T) => T
  /**
   * Whether to manually trigger the synchronize (syncSource) function when the input state changes, defaulting to manual.
   *
   * @defaultValue true
   */
  manual?: boolean
  /**
   * Whether to perform a deep comparison of the input state and trigger the synchronize (syncSource) function only if the deep comparison result is false.
   *
   * deep comparison is enabled by default
   *
   * @defaultValue true
   */
  deep?: boolean
}

export type UseClonedStateReturns<T> = readonly [
  /**
   * Cloned state
   */
  cloned: T,
  /**
   * Set cloned state
   */
  setCloned: ReactSetState<T>,
  /**
   * Synchronize cloned state with source state
   */
  syncSource: () => void,
]

export type CloneFn<F, T = F> = (x: F) => T

export function defaultCloneFn<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * A React Hook for creating a cloned state that supports modification, synchronous operation, and isolation from each other.
 *
 * With support for custom `clone` functions, `JSON.parse(JSON.stringify(source))` by default.
 */
export function useClonedState<T>(source: T, options: UseClonedStateOptions = {}): UseClonedStateReturns<T> {
  const { deep = true, manual = false, clone = defaultCloneFn } = options

  const [cloned, setCloned] = useSafeState(() => clone(source))
  const latest = useLatest({ manual, deep, source, clone })

  const syncSource = useStableFn(() => {
    const { clone, source } = latest.current
    setCloned(clone(source))
  })

  // for shallow compare
  useUpdateEffect(
    () => {
      !latest.current.manual && syncSource()
    },
    deep ? [] : [source],
  )

  // for deep compare
  useUpdateDeepCompareEffect(
    () => {
      !latest.current.manual && syncSource()
    },
    deep ? [source] : [],
  )

  return [cloned, setCloned, syncSource] as const
}
