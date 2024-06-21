import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { useUpdateEffect } from '../use-update-effect'

import type { ReactSetState } from '../use-safe-state'

export interface UseClonedStateOptions {
  /**
   * Clone function
   *
   * @defaultValue defaultCloneFn
   */
  clone?: <T>(source: T) => T
  /**
   * Whether to manually trigger the clone function
   *
   * @defaultValue false
   */
  manual?: boolean
  /**
   * Whether to deep compare the source object
   *
   * @defaultValue true
   */
  deep?: boolean
}

export type UseClonedStateReturns<T> = [
  /**
   * Cloned state
   */
  cloned: T,
  /**
   * Set cloned state
   */
  setCloned: ReactSetState<T>,
  /**
   * Sync cloned state with source state
   */
  sync: () => void,
]

export type CloneFn<F, T = F> = (x: F) => T

export function defaultCloneFn<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

/**
 * A React Hook that returns a cloned state with the same properties and values as the original state.
 */
export function useClonedState<T>(source: T, options: UseClonedStateOptions = {}): UseClonedStateReturns<T> {
  const { deep = true, manual = false, clone = defaultCloneFn } = options

  const [cloned, setCloned] = useSafeState(defaultCloneFn(source))
  const latestState = useLatest({ manual, source, clone })

  const syncCloned = useStableFn(() => {
    const { clone, source } = latestState.current
    setCloned(clone(source))
  })

  useUpdateEffect(() => void (!latestState.current.manual && syncCloned()), deep ? [] : [source])
  useUpdateDeepCompareEffect(() => void (!latestState.current.manual && syncCloned()), deep ? [source] : [])

  return [cloned, setCloned, syncCloned] as const
}
