import { useLatest } from '../../use-latest'

import type { DependencyList } from 'react'
import type { ExtendedReactEffect } from '../basic'

/**
 * A callback function for async effect
 *
 * @param {() => boolean} isCancelled - `() => boolean`, a function to check if the effect is cancelled
 * @returns {void} `void`
 */
export type AsyncEffectCallback = (isCancelled: () => boolean) => void

export type UseAsyncEffect<T = unknown> = (callback: AsyncEffectCallback, deps?: DependencyList, ...args: T[]) => void

export function createAsyncEffect<T = unknown>(effect: ExtendedReactEffect<T>): UseAsyncEffect<T> {
  return (callback: AsyncEffectCallback, deps?: DependencyList, ...args: T[]): void => {
    const latest = useLatest({ callback })

    effect(
      () => {
        let cancelled = false
        const isCancelled = () => cancelled
        latest.current.callback(isCancelled)
        return () => {
          cancelled = true
        }
      },
      deps,
      ...args,
    )
  }
}
