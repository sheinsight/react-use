import { useEffect } from 'react'
import { useSafeState } from '../../use-safe-state'
import { useThrottledFn } from '../../use-throttled-fn'
import { createUpdateEffect } from './update'

import type { DependencyList, EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'
import type { ThrottleOptions } from '../throttle'

export type UseThrottledEffect<T = unknown> = (
  callback: EffectCallback,
  deps?: DependencyList,
  options?: ThrottleOptions,
  ...args: T[]
) => void

export function createThrottledEffect<T = unknown>(effect: ExtendedReactEffect<T>): UseThrottledEffect<T> {
  const useUpdateEffect = createUpdateEffect(useEffect)

  return (callback: EffectCallback, deps?: DependencyList, options?: ThrottleOptions, ...args: T[]): void => {
    const [trigger, updateTrigger] = useSafeState({})
    const throttledUpdateTrigger = useThrottledFn(() => updateTrigger({}), options)

    effect(() => void throttledUpdateTrigger(), deps, ...args)

    // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
    useUpdateEffect(callback, [trigger])
  }
}
