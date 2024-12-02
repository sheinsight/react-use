import { useRef } from 'react'
import { useLatest } from '../../use-latest'
import { createEffectOnce } from './once'

import type { DependencyList } from 'react'
import type { ExtendedReactEffect } from '../basic'

export type UseUpdateEffect<T = unknown> = (callback: () => void, deps?: DependencyList, ...args: T[]) => void

export function createUpdateEffect<T = unknown>(effect: ExtendedReactEffect<T>): UseUpdateEffect<T> {
  const effectOnce = createEffectOnce<T>(effect)

  return (callback: () => void, deps?: DependencyList, ...args: T[]): void => {
    const isActualUpdate = useRef(false)
    const latest = useLatest({ callback })

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
          return latest.current.callback()
        }
      },
      deps,
      ...args,
    )
  }
}
