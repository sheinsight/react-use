import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useRafLoop } from '../use-raf-loop'
import { isString, unwrapGettable } from '../utils'

import type { Pausable } from '../use-pausable'
import type { AnyFunc, Gettable, SetIntervalReturn } from '../utils'

export interface UseIntervalFnOptions {
  /**
   * Whether to start the interval immediately on mounted
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Whether to execute the callback immediately before the interval starts
   *
   * @default false
   */
  immediateCallback?: boolean
}

export type UseIntervalFnInterval = Gettable<number> | 'requestAnimationFrame'

export function useIntervalFn(
  callback: AnyFunc,
  interval: UseIntervalFnInterval = 1000,
  options: UseIntervalFnOptions = {},
): Pausable {
  const { immediate = true, immediateCallback = false } = options

  const timer = useRef<SetIntervalReturn | null>(null)
  const latest = useLatest({ callback })

  const isRaf = interval === 'requestAnimationFrame'
  const intervalValue = unwrapGettable(interval)

  function clearTime() {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }

  const intervalPausable = usePausable(false, clearTime, () => {
    clearTime()

    if (isString(intervalValue) || intervalValue <= 0) return

    immediateCallback && callback()
    timer.current = window.setInterval(() => latest.current.callback(), intervalValue)
  })

  useEffect(() => {
    if (isRaf) return
    immediate && intervalPausable.resume()
    return intervalPausable.pause
  }, [immediate, isRaf])

  const rafControl = useRafLoop(callback, {
    immediate: isRaf ? immediate : false,
    immediateCallback: isRaf ? immediateCallback : false,
  })

  return isRaf ? rafControl : intervalPausable
}
