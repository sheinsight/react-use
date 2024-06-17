import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useRafLoop } from '../use-raf-loop'
import { isString } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'

import type { Pausable } from '../use-pausable'
import type { UseRafLoopOptions } from '../use-raf-loop'
import type { AnyFunc, Gettable, SetIntervalReturn } from '../utils/basic'

export interface UseIntervalFnOptions extends Omit<UseRafLoopOptions, 'fpsLimit'> {}

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
