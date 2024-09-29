import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useVersionedAction } from '../use-versioned-action'
import { isFunction, wait } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

export interface UseRetryFnOptions<E = unknown> {
  /**
   * Number of retries.
   *
   * @defaultValue 3
   */
  count?: number
  /**
   * Retry interval. ms
   *
   * @defaultValue defaultRetryInterval
   */
  interval?: number | ((currentCount: number) => number)
  /**
   * Error callback.
   *
   * @defaultValue undefined
   */
  onError?: (error: E | undefined) => void
  /**
   * Error retry callback.
   *
   * @defaultValue undefined
   */
  onErrorRetry?: (error: E | undefined, state: UseRetryFnRetryState) => void
  /**
   * All retries failed callback.
   *
   * @defaultValue undefined
   */
  onRetryFailed?: (error: E | undefined, state: UseRetryFnRetryState) => void
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
  version: object
}

export function defaultRetryInterval(currentCount: number) {
  const nextInterval = 1000 * 2 ** (currentCount - 1)
  return nextInterval >= 30_000 ? 30_000 : nextInterval
}

/**
 * A hook to retry the function when it fails.
 *
 * @since 1.4.0
 */
export function useRetryFn<T extends AnyFunc, E = any>(
  fn: T,
  options: UseRetryFnOptions<E> = {},
): T & { cancel: () => void } {
  const { count = 3, interval = defaultRetryInterval, onError, onErrorRetry, onRetryFailed } = options

  const [incVersion, runVersionedAction] = useVersionedAction()

  const latest = useLatest({
    fn,
    count,
    interval,
    onError,
    onErrorRetry,
    onRetryFailed,
  })

  const runFnWithRetry = useCreation(
    () =>
      async (retryState: UseRetryFnRetryState, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
        try {
          const result = await latest.current.fn(...args)

          runVersionedAction(retryState.version, () => {
            retryState.currentCount = 0
          })

          return result
        } catch (error) {
          return runVersionedAction(retryState.version, async () => {
            retryState.currentCount++

            const { onError, onErrorRetry, onRetryFailed, interval } = latest.current

            onError?.(error as E | undefined)

            if (retryState.currentCount > retryState.retryCount) {
              onRetryFailed?.(error as E | undefined, { ...retryState })
              retryState.currentCount = 0
              return
            }

            const nextInterval = isFunction(interval) ? interval(retryState.currentCount) : interval

            await wait(nextInterval)

            onErrorRetry?.(error as E | undefined, { ...retryState })

            return runFnWithRetry({ ...retryState }, ...args)
          })
        }
      },
  )

  const fnWithRetry = (...args: Parameters<T>) => {
    const retryState = {
      currentCount: 0,
      retryCount: latest.current.count,
      version: incVersion(),
    }

    return runFnWithRetry(retryState, ...args)
  }

  const stableFnWithRetry = useStableFn(fnWithRetry as T & { cancel: () => void })

  stableFnWithRetry.cancel = useStableFn(() => void incVersion())

  return stableFnWithRetry
}
