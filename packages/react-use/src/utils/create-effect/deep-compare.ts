import { useRef } from 'react'
import { isDefined } from '../basic'
import { deepEqual } from '../equal'

import type { DependencyList, EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'

export type UseDeepCompareEffect<T> = (callback: EffectCallback, deps?: DependencyList, ...args: T[]) => void

export function createDeepCompareEffect<T = unknown>(effect: ExtendedReactEffect<T>): UseDeepCompareEffect<T> {
  return (callback: EffectCallback, deps?: DependencyList, ...args: T[]): void => {
    const updateTriggerRef = useRef({})
    const previousDepsRef = useRef(deps)

    if (!isDefined(deps) || !deepEqual(previousDepsRef.current, deps)) {
      previousDepsRef.current = deps
      updateTriggerRef.current = {}
    }

    effect(callback, [updateTriggerRef.current], ...args)
  }
}
