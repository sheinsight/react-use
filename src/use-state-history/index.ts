import { useLatest } from '../use-latest'
import { useManualStateHistory } from '../use-manual-state-history'
import { usePausableUpdateDeepCompareEffect } from '../use-pausable-update-deep-compare-effect'
import { usePausableUpdateEffect } from '../use-pausable-update-effect'
import { useStableFn } from '../use-stable-fn'

import type { UseManualStateHistoryOptions, UseManualStateHistoryReturns } from '../use-manual-state-history'
import type { Pausable } from '../use-pausable'

export interface UseStateHistoryOptions<Raw, Serialized = Raw> extends UseManualStateHistoryOptions<Raw, Serialized> {
  deep?: boolean
}

export interface UseStateHistoryReturns<Raw, Serialized>
  extends UseManualStateHistoryReturns<Raw, Serialized>,
    Pausable<[commit?: boolean], [commit?: boolean]> {}

export function useStateHistory<Raw, Serialized = Raw>(
  source: Raw,
  options: UseStateHistoryOptions<Raw, Serialized> = {},
): UseStateHistoryReturns<Raw, Serialized> {
  const isDeep = options.deep || false

  const manualHistory = useManualStateHistory(source, { ...options, clone: options.clone || isDeep })

  const pausable = usePausableUpdateEffect(() => latest.current.manualHistory.commit(), isDeep ? [] : [source])

  const deepPausable = usePausableUpdateDeepCompareEffect(
    () => latest.current.manualHistory.commit(),
    isDeep ? [source] : [],
  )

  const latest = useLatest({ manualHistory, isDeep, deepPausable, pausable })

  const pause = useStableFn((update = false, commit = false) => {
    const { manualHistory, isDeep, deepPausable, pausable } = latest.current
    commit && manualHistory.commit()
    ;(isDeep ? deepPausable : pausable).pause(update)
  })

  const resume = useStableFn((update = false, commit = false) => {
    const { manualHistory, isDeep, deepPausable, pausable } = latest.current
    commit && manualHistory.commit()
    ;(isDeep ? deepPausable : pausable).resume(update)
  })

  const isActive = (isDeep ? deepPausable : pausable).isActive

  return {
    ...manualHistory,
    isActive,
    resume,
    pause,
  }
}
