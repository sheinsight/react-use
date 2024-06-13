import { useCounter } from '../use-counter'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'

import type { UseCounterReturnAction } from '../use-counter'
import type { UseIntervalFnInterval } from '../use-interval-fn'
import type { Pausable } from '../use-pausable'

export interface UseIntervalOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Execute the update immediately on calling
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Callback on every interval
   */
  callback?: (count: number) => void
}

export interface UseIntervalAction extends UseCounterReturnAction, Pausable {
  /**
   * Reset the count, optionally set a new count
   */
  reset: (count?: number) => void
}

export type UseIntervalWithControlsReturn = [
  /**
   * Current count
   */
  count: number,
  /**
   * Counter Actions
   */
  UseIntervalAction,
]

export type UseIntervalReturn<Controls extends boolean> = Controls extends true ? UseIntervalWithControlsReturn : number

export function useInterval(
  interval?: UseIntervalFnInterval,
  options?: UseIntervalOptions<false>,
): UseIntervalReturn<false>
export function useInterval(interval: UseIntervalFnInterval, options: UseIntervalOptions<true>): UseIntervalReturn<true>
export function useInterval(interval: UseIntervalFnInterval = 1000, options: UseIntervalOptions<boolean> = {}) {
  const { controls: exposeControls = false, immediate = true, callback } = options
  const [count, actions] = useCounter(0)
  const latest = useLatest({ actions, callback })

  const controls = useIntervalFn(
    () => {
      latest.current.actions.inc()
      latest.current.callback?.(count)
    },
    interval,
    { immediate },
  )

  return exposeControls ? [count, { ...actions, ...controls }] : count
}
