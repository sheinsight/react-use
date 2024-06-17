import { useRef } from 'react'
import { useLatest } from '../../use-latest'
import { createEffectOnce } from './once'

import type { DependencyList } from 'react'
import type { ExtendedReactEffect } from '../basic'

export function createUpdateEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  const effectOnce = createEffectOnce<T>(effect)

  return (callback: () => void, deps?: DependencyList, ...args: T[]): void => {
    const isActualUpdate = useRef(false)
    const latestCallback = useLatest(callback)

    effectOnce(
      () => {
        return () => {
          isActualUpdate.current = false
        }
      },
      ...args,
    )

    effect(
      () => {
        if (!isActualUpdate.current) {
          isActualUpdate.current = true
        } else {
          return latestCallback.current()
        }
      },
      deps,
      ...args,
    )
  }
}
