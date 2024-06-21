import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useRender } from '../use-render'
import { unwrapGettable } from '../utils/unwrap'

import type { Pausable } from '../use-pausable'
import type { AnyFunc, Gettable, SetTimeoutReturn } from '../utils/basic'

export interface UseTimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * Render the component immediately when the timer ends
   *
   * When you need `isActive` ref to be updated immediately after the timer ends, set this to `true`
   *
   * @defaultValue false
   */
  updateOnEnd?: boolean
}

/**
 * A React Hook that helps to create a timeout function.
 */
export function useTimeoutFn<Callback extends AnyFunc = AnyFunc>(
  callback: Callback,
  interval: Gettable<number>,
  options: UseTimeoutFnOptions = {},
): Pausable<[], Parameters<Callback>> {
  const { immediate = true, updateOnEnd = false } = options
  const render = useRender()
  const timerRef = useRef<SetTimeoutReturn | null>(null)

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const pausable = usePausable(immediate, clearTimer, (ref, ...args: Parameters<Callback> | []) => {
    const { interval, clearTimer } = latest.current

    clearTimer()

    timerRef.current = window.setTimeout(() => {
      ref.current = false
      timerRef.current = null
      latest.current.callback(...args)
      latest.current.updateOnEnd && render()
    }, interval)
  })

  const intervalValue = unwrapGettable(interval)
  const latest = useLatest({ clearTimer, callback, updateOnEnd, interval: intervalValue })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect should re-run when intervalValue changes
  useEffect(() => {
    immediate && pausable.resume()
    return pausable.pause
  }, [immediate, pausable, intervalValue])

  return pausable
}
