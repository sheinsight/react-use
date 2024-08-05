import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { isFunction } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

export interface UseRetryFnOptions {
  /**
   * Number of retries.
   *
   * @defaultValue 3
   */
  retryCount?: number
  /**
   * Retry interval.
   *
   * @defaultValue 3_000 ms
   */
  retryInterval?: number | ((currentCount: number) => number)
  /**
   * Error callback.
   *
   * @defaultValue undefined
   */
  onError?: (error: unknown, state: { currentCount: number; retryCount: number }) => void
  /**
   * All retries failed callback.
   *
   * @defaultValue undefined
   */
  onRetryFailed?: (error: unknown) => void
}

export function useRetryFn<T extends AnyFunc>(fn: T, options: UseRetryFnOptions = {}): T {
  const { retryCount = 3, retryInterval = 3000, onError, onRetryFailed } = options

  const retryState = useCreation(() => ({
    currentCount: 0,
    retryCount,
  }))

  const latest = useLatest({
    fn,
    retryInterval,
    onError,
    onRetryFailed,
  })

  async function retryFn(...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> {
    try {
      const res = await latest.current.fn(...args)
      retryState.currentCount = 0
      return res
    } catch (error) {
      retryState.currentCount++

      const { onError, onRetryFailed, retryInterval } = latest.current
      onError?.(error, { ...retryState })

      if (retryState.currentCount >= retryState.retryCount) {
        onRetryFailed?.(error)
        retryState.currentCount = 0
        return
      }

      const intervalValue = isFunction(retryInterval) ? retryInterval(retryState.currentCount) : retryInterval
      await new Promise((resolve) => setTimeout(resolve, intervalValue))

      return retryFn(...args)
    }
  }

  return useStableFn(retryFn as T)
}
