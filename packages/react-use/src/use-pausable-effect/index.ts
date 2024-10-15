import { useEffect } from 'react'
import { useCreation } from '../use-creation'
import { useFirstRender } from '../use-first-render'
import { useGetterRef } from '../use-getter-ref'
import { useRender } from '../use-render'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { DependencyList, EffectCallback } from 'react'
import type { Pausable } from '../use-pausable'

export function usePausableEffect(
  callback: EffectCallback,
  deps: DependencyList = [],
): Pausable<[boolean?], [boolean?]> {
  const render = useRender()

  const isFirstRender = useFirstRender()
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: for trigger
  useEffect(() => {
    if (isActiveRef.current && !isFirstRender) {
      updateTrigger({})
    }
  }, deps)

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when trigger changes
  useEffect(callback, [trigger])

  return useCreation(() => ({ isActive, pause, resume }))
}
