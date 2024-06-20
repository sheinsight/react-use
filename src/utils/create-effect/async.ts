import { useGetterRef } from '../../use-getter-ref'
import { useLatest } from '../../use-latest'

import type { DependencyList } from 'react'
import type { ExtendedReactEffect } from '../basic'

export type AsyncEffectCallback = (isCancelled: () => boolean) => void

export function createAsyncEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  return (callback: AsyncEffectCallback, deps?: DependencyList, ...args: T[]): void => {
    const [isCancelledRef, isCancelled] = useGetterRef(false)
    const latest = useLatest({ callback })

    effect(
      () => {
        isCancelledRef.current = false
        latest.current.callback(isCancelled)

        return () => {
          isCancelledRef.current = true
        }
      },
      deps,
      ...args,
    )
  }
}
