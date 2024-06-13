import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'

import type { UseIntervalFnInterval, UseIntervalFnOptions } from '../use-interval-fn'
import type { Pausable } from '../use-pausable'

export interface UseNowOptions<Controls extends boolean> extends UseIntervalFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: UseIntervalFnInterval
  /**
   * Callback on each update
   */
  callback?: (now: Date) => void
}

export type UseNowReturn<Controls extends boolean> = Controls extends true ? { now: Date } & Pausable : Date

export function useNow(options?: UseNowOptions<false>): UseNowReturn<false>
export function useNow(options: UseNowOptions<true>): UseNowReturn<true>
export function useNow(options: UseNowOptions<boolean> = {}): UseNowReturn<boolean> {
  const {
    controls: exposeControls = false,
    callback,
    interval = 'requestAnimationFrame',
    ...useIntervalFnOptions
  } = options

  const latestCallback = useLatest(callback)
  const [now, setNow] = useSafeState(() => new Date())

  const controls = useIntervalFn(
    () => {
      const now = new Date()
      setNow(now)
      latestCallback.current?.(now)
    },
    interval,
    useIntervalFnOptions,
  )

  return exposeControls ? { now, ...controls } : now
}
