import { useEffect } from 'react'
import { useDebouncedFn } from '../../use-debounced-fn'
import { useSafeState } from '../../use-safe-state'
import { createUpdateEffect } from './update'

import type { DependencyList, EffectCallback } from 'react'
import type { ExtendedReactEffect } from '../basic'
import type { DebounceOptions } from '../debounce'

export function createDebouncedEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  const useUpdateEffect = createUpdateEffect(useEffect)

  return (callback: EffectCallback, deps?: DependencyList, options?: DebounceOptions, ...args: T[]): void => {
    const [trigger, updateTrigger] = useSafeState({})
    const debouncedFn = useDebouncedFn(() => updateTrigger({}), options)

    effect(() => void debouncedFn(), deps, ...args)

    // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
    useUpdateEffect(callback, [trigger])
  }
}
