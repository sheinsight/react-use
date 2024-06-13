import type { AnyFunc } from '.'

export type ThrottleOptions = {
  /**
   * time frame for throttle
   *
   * @default 0
   */
  wait?: number
  /**
   * whether to invoke the function at the start of each period
   *
   * @default true
   */
  leading?: boolean
  /**
   * whether to invoke the function at the end of each period
   *
   * @default true
   */
  trailing?: boolean
}

export function throttle<T extends AnyFunc>(fn: T, options: ThrottleOptions = {}) {
  const { wait = 0, leading = true, trailing = true } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastInvokeTime: number | null = null

  const throttled = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    lastArgs = args

    const invoke = () => {
      if (lastArgs) fn.apply(this, lastArgs)
      lastArgs = null
      lastInvokeTime = Date.now()
    }

    const now = Date.now()
    const leadingCall = leading && !lastInvokeTime
    const remaining = wait - (now - (lastInvokeTime || 0))

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      invoke()
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastInvokeTime = leading ? Date.now() : null
        timeoutId = null
        invoke()
      }, remaining)
    } else if (leadingCall) {
      invoke()
    }
  }

  throttled.clear = () => {
    timeoutId && clearTimeout(timeoutId)
    timeoutId = null
    lastArgs = null
    lastInvokeTime = null
  }

  return throttled as T & { clear(): void }
}
