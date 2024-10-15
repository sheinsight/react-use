import { debounce } from './debounce'

import type { AnyFunc } from './basic'

export type ThrottleOptions = {
  /**
   * time frame for throttle
   *
   * @defaultValue 0
   */
  wait?: number
  /**
   * whether to invoke the function at the start of each period
   *
   * @defaultValue true
   */
  leading?: boolean
  /**
   * whether to invoke the function at the end of each period
   *
   * @defaultValue true
   */
  trailing?: boolean
}

export type ThrottledFn<T extends AnyFunc> = {
  /**
   * The throttled function.
   */
  (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined
  /**
   * Cancels the throttled function.
   *
   * @deprecated Use `throttled.cancel()` instead.
   */
  clear: () => void
  /**
   * Cancels the throttled function.
   */
  cancel: () => void
  /**
   * Invokes the debounced function immediately.
   */
  flush: () => ReturnType<T> | undefined
}

/**
 * Creates a throttled function that only invokes the provided function at most once per every `wait` milliseconds.
 *
 * @from lodash/throttle
 */
export function throttle<T extends AnyFunc>(fn: T, options: ThrottleOptions = {}) {
  const { wait = 0, leading = true, trailing = true } = options

  return debounce(fn, {
    wait,
    leading,
    trailing,
    maxWait: wait,
  })
}
