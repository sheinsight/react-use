import type { DependencyList } from 'react'
import type { ExtendedReactEffect } from '../basic'

export type AsyncEffectCallback = (isCancelled: () => boolean) => void

export function createAsyncEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  return (callback: AsyncEffectCallback, deps?: DependencyList, ...args: T[]): void => {
    effect(
      () => {
        let cancelled = false
        callback(() => cancelled)
        return () => {
          cancelled = true
        }
      },
      deps,
      ...args,
    )
  }
}
