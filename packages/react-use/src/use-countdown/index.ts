import { normalizeDate } from '../use-date-format'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'
import { noNullish, now } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'

import type { DateLike } from '../use-date-format'
import type { UseIntervalFnInterval } from '../use-interval-fn'
import type { Pausable } from '../use-pausable'
import type { Gettable } from '../utils/basic'

export interface UseCountdownDateItem {
  d: number
  h: number
  m: number
  s: number
  ms: number
}

export interface UseCountdownOptions<Controls extends boolean = false> {
  /**
   * whether to start the countdown immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * whether to expose the controls
   *
   * @defaultValue false
   */
  controls?: Controls
  /**
   * the interval to update the countdown
   *
   * @defaultValue 'requestAnimationFrame'
   */
  interval?: UseIntervalFnInterval
  /**
   * a callback function to be called when the countdown is updated
   */
  onUpdate?: (ms: number, seconds: number) => void
  /**
   * a callback function to be called when the countdown is stopped
   */
  onStop?(): void
}

export type UseCountdownReturns<Controls extends boolean> = Controls extends true
  ? { ms: number; isStop: boolean } & Pausable
  : number

function calRemainingTime(date: Gettable<DateLike | null | undefined>) {
  const dateValue = unwrapGettable(date)

  if (noNullish(dateValue)) {
    return Math.max(0, normalizeDate(dateValue).getTime() - now())
  }

  return 0
}

/**
 * A React Hook that provides a countdown timer.
 */
export function useCountdown(date: Gettable<DateLike | null | undefined>): UseCountdownReturns<false>
export function useCountdown(
  date: Gettable<DateLike | null | undefined>,
  options: UseCountdownOptions<false>,
): UseCountdownReturns<false>
export function useCountdown(
  date: Gettable<DateLike | null | undefined>,
  options: UseCountdownOptions<true>,
): UseCountdownReturns<true>
export function useCountdown(
  date: Gettable<DateLike | null | undefined>,
  options: UseCountdownOptions<boolean> = {},
): UseCountdownReturns<boolean> {
  const {
    immediate = true,
    controls: exposeControls = false,
    interval = 'requestAnimationFrame',
    onStop,
    onUpdate,
  } = options

  const [ms, setMs] = useSafeState(() => calRemainingTime(date))

  const update = useStableFn(() => {
    const { date, onUpdate, onStop } = latest.current
    const ms = calRemainingTime(date)

    onUpdate?.(ms, Math.ceil(ms / 1000))

    if (ms === 0) {
      onStop?.()
      controls.pause()
    }

    setMs(ms)
  })

  const controls = useIntervalFn(update, interval, { immediate })
  const latest = useLatest({ ms, date, onStop, onUpdate })

  useUpdateEffect(() => {
    const ms = calRemainingTime(date)
    setMs(ms)
    ms > 0 ? controls.resume() : controls.pause()
  }, [date])

  return exposeControls ? { ms, isStop: ms === 0, ...controls } : ms
}
