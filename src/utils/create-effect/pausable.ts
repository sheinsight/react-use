import { useEffect } from 'react'
import { useCreation } from '../../use-creation'
import { useGetterRef } from '../../use-getter-ref'
import { useRender } from '../../use-render'
import { useSafeState } from '../../use-safe-state'
import { useStableFn } from '../../use-stable-fn'
import { createUpdateEffect } from './update'

import type { DependencyList, EffectCallback } from 'react'
import type { Pausable } from '../../use-pausable'
import type { ExtendedReactEffect } from '../basic'

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
