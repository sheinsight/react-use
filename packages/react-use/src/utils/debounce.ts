import type { AnyFunc } from './basic'

export type DebounceOptions = {
  /**
   * Time to wait before invoking the function
   *
   * @defaultValue 0
   */
  wait?: number
  /**
   * immediately invoke before the timeout
   *
   * @defaultValue false
   */
  leading?: boolean
  /**
   * invoke the function after the timeout
   *
   * @defaultValue true
   */
  trailing?: boolean
}

export function debounce<T extends AnyFunc>(fn: T, options: DebounceOptions = {}) {
  const { wait = 0, leading = false, trailing = true } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let leadingInvoked = false

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const invokeLeading = leading && !leadingInvoked

    const invoke = () => {
      timeoutId = null
      if (trailing && !leadingInvoked) fn.apply(this, args)
      leadingInvoked = false
    }

    timeoutId && clearTimeout(timeoutId)

    if (invokeLeading) {
      leadingInvoked = true
      fn.apply(this, args)
    }

    timeoutId = setTimeout(invoke, wait)

    // Ensure invocation if both leading and trailing are false
    // if (!leading && !trailing) {
    //   fn.apply(this, args)
    //   leadingInvoked = false
    // }
  }

  debounced.clear = () => {
    timeoutId && clearTimeout(timeoutId)
    timeoutId = null
    leadingInvoked = false
  }

  return debounced as T & { clear(): void }
}
