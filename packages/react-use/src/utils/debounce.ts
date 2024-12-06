import type { AnyFunc } from './basic'

export type DebounceOptions = {
  /**
   * The wait time in milliseconds before the debounced function can be invoked again.
   *
   * @defaultValue 0 milliseconds
   */
  wait?: number
  /**
   * Determines whether the function should be invoked immediately at the leading edge of the timeout.
   *
   * @defaultValue false
   */
  leading?: boolean
  /**
   * Determines whether the function should be invoked after the wait time as passed at the trailing edge.
   *
   * @defaultValue true
   */
  trailing?: boolean
  /**
   * The maximum time in milliseconds the function can be delayed before it's invoked.
   *
   * @defaultValue 0 (no maximum delay)
   *
   * @since 1.10.0
   */
  maxWait?: number
}

export type DebouncedFn<T extends AnyFunc> = {
  /**
   * The debounced function.
   */
  (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined
  /**
   * Cancels the debounced function.
   *
   * @deprecated Use `debounced.cancel()` instead.
   */
  clear: () => void
  /**
   * Cancels the debounced function.
   */
  cancel: () => void
  /**
   * Invokes the debounced function immediately.
   */
  flush: () => ReturnType<T> | undefined
}

/**
 * Creates a debounced function that delays invoking the provided function until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @from lodash/debounce
 */
export function debounce<T extends AnyFunc>(fn: T, options: DebounceOptions = {}): DebouncedFn<T> {
  const { wait = 0, maxWait = 0, leading = false, trailing = true } = options

  let lastArgs: Parameters<T> | undefined
  let lastThis: ThisParameterType<T> | undefined
  let result: ReturnType<T> | undefined
  let timerId: ReturnType<typeof setTimeout> | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0

  const maxing = maxWait > 0

  function invokeFunc(time: number) {
    const args = lastArgs
    const thisArg = lastThis
    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = fn.apply(thisArg, args as any)
    return result
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time
    timerId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }

  /* v8 ignore next 6 */
  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: number) {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  /* v8 ignore next 3 */
  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    // eslint-disable-next-line no-this-alias
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      /* v8 ignore next 5 */
      if (maxing) {
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush

  debounced.clear = cancel

  return debounced
}
