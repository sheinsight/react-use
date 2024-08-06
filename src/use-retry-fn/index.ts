import { useRef } from 'react'
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
  count?: number
  /**
   * Retry interval.
   *
   * @defaultValue 3_000 ms
   */
  interval?: number | ((currentCount: number) => number)
  /**
   * Error callback.
   *
   * @defaultValue undefined
   */
  onError?: (error: unknown) => void
  /**
   * Error retry callback.
   *
   * @defaultValue undefined
   */
  onErrorRetry?: (error: unknown, state: UseRetryFnRetryState) => void
  /**
   * All retries failed callback.
   *
   * @defaultValue undefined
   */
  onRetryFailed?: (error: unknown, state: UseRetryFnRetryState) => void
}

export interface UseRetryFnRetryState {
  /**
   * Current retry count.
   */
  currentCount: number
  /**
   * Number of retries.
   */
  retryCount: number
  /**
   * Internal unique version to track the latest retry state in multiple concurrent calls conditions.
   */
  version: number
}

export function useRetryFn<T extends AnyFunc>(fn: T, options: UseRetryFnOptions = {}): T {
  const { count = 3, interval = 3000, onError, onErrorRetry, onRetryFailed } = options

  const version = useRef(0)

  const latest = useLatest({
    fn,
    count,
    interval,
    onError,
    onErrorRetry,
    onRetryFailed,
  })

  const runFnWithRetry = useCreation(() => {
    const retryFn = async (
      retryState: UseRetryFnRetryState,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>> | undefined> => {
      try {
        const res = await latest.current.fn(...args)

        if (retryState.version !== version.current) {
          return res
        }

        retryState.currentCount = 0

        return res
      } catch (error) {
        if (retryState.version !== version.current) {
          return
        }

        retryState.currentCount++

        const { onError, onErrorRetry, onRetryFailed, interval } = latest.current

        onError?.(error)

        if (retryState.currentCount >= retryState.retryCount) {
          onRetryFailed?.(error, { ...retryState })
          retryState.currentCount = 0
          return
        }

        onErrorRetry?.(error, { ...retryState })

        const intervalValue = isFunction(interval) ? interval(retryState.currentCount) : interval
        await new Promise((resolve) => setTimeout(resolve, intervalValue))

        return retryFn(retryState, ...args)
      }
    }

    return retryFn
  })

  const fnWithRetry = useStableFn(((...args: Parameters<T>) => {
    const retryState = {
      currentCount: 0,
      retryCount: latest.current.count,
      version: ++version.current,
    }

    return runFnWithRetry(retryState, ...args)
  }) as T)

  return fnWithRetry
}
