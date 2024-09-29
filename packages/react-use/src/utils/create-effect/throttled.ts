import { useEffect } from 'react'
import { useSafeState } from '../../use-safe-state'
import { useThrottledFn } from '../../use-throttled-fn'
import { createUpdateEffect } from './update'

import type { DependencyList, EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'
import type { ThrottleOptions } from '../throttle'

export function createThrottledEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  const useUpdateEffect = createUpdateEffect(useEffect)
  const updateEffect = createUpdateEffect(effect)

  return (callback: EffectCallback, deps?: DependencyList, options?: ThrottleOptions, ...args: T[]): void => {
    const [trigger, updateTrigger] = useSafeState({})
    const throttledFn = useThrottledFn(() => updateTrigger({}), options)

    effect(callback, [])

    updateEffect(() => void throttledFn(), deps, ...args)

    // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
    useUpdateEffect(callback, [trigger])
  }
}
