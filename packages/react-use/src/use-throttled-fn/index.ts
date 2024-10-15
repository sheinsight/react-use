import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { throttle } from '../utils/throttle'

import type { AnyFunc } from '../utils/basic'
import type { ThrottleOptions, ThrottledFn } from '../utils/throttle'

export interface UseThrottledFnOptions extends ThrottleOptions {}

/**
 * A React Hook that helps to create a debounced function.
 */
export function useThrottledFn<T extends AnyFunc, P extends Parameters<T>>(
  fn: T,
  options: UseThrottledFnOptions = {},
): ThrottledFn<T> {
  const latest = useLatest({ fn })

  return useCreation(() => {
    const fnWrapper = ((...args: P) => latest.current.fn(...args)) as T
    return throttle(fnWrapper, options)
  }, [options])
}
