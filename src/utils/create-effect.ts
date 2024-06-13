import { useEffect, useRef } from 'react'
import { useDebouncedFn } from '../use-debounced-fn'
import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useRender } from '../use-render'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { isDefined } from './basic'
import { deepEqual } from './equal'

import type { DependencyList, EffectCallback } from 'react'
import { useCreation } from '../use-creation'
import type { Pausable } from '../use-pausable'
import type { DebounceOptions, ThrottleOptions } from './index'

export type ExtendedReactEffect<T = unknown> = (effect: EffectCallback, deps?: DependencyList, ...args: T[]) => void

export function createEffectOnce<T = unknown>(effect: ExtendedReactEffect<T>) {
  return (callback: EffectCallback, ...args: T[]) => {
    effect(callback, [], ...args)
  }
}

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

export function createDeepCompareEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
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

export function createPausableEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  const useUpdateEffect = createUpdateEffect(useEffect)

  return (callback: EffectCallback, deps?: DependencyList, ...args: T[]): Pausable => {
    const render = useRender()

    const [isActiveRef, isActive] = useGetterRef(true)
    const [trigger, updateTrigger] = useSafeState({})

    const pause = useStableFn((update?: boolean, triggerEffect?: boolean) => {
      isActiveRef.current = false
      update && render()
      triggerEffect && updateTrigger({})
    })

    const resume = useStableFn((update?: boolean, triggerEffect?: boolean) => {
      isActiveRef.current = true
      update && render()
      triggerEffect && updateTrigger({})
    })

    effect(() => void (isActiveRef.current && updateTrigger({})), deps, ...args)

    // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
    useUpdateEffect(callback, [trigger])

    return useCreation(() => ({ isActive, pause, resume }))
  }
}

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

export function createThrottledEffect<T = unknown>(effect: ExtendedReactEffect<T>) {
  const useUpdateEffect = createUpdateEffect(useEffect)

  return (callback: EffectCallback, deps?: DependencyList, options?: ThrottleOptions, ...args: T[]): void => {
    const [trigger, updateTrigger] = useSafeState({})
    const throttledFn = useThrottledFn(() => updateTrigger({}), options)

    effect(() => void throttledFn(), deps, ...args)

    // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
    useUpdateEffect(callback, [trigger])
  }
}
