import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export type UseAsyncLockReturns<T extends AnyFunc, R extends AnyFunc> = (
  ...args: Parameters<T>
) => R extends undefined
  ? Promise<Awaited<ReturnType<T>> | undefined>
  : Promise<Awaited<ReturnType<T>> | Awaited<ReturnType<R>>>

/**
 * A React Hook to create a function that can be used to ensure that **only one is running at a time**, and provides an additional invalid operation callback function.
 *
 * @param {AnyFunc} asyncFn - `AnyFunc`, the async function to run, see {@link AnyFunc}
 * @param {AnyFunc} [onMeetLock] - `AnyFunc`, the callback function to run when the lock is met, see {@link AnyFunc}
 * @returns {UseAsyncLockReturns} `UseAsyncLockReturns`, see {@link UseAsyncLockReturns}
 */
export function useAsyncLock<T extends AnyFunc, R extends AnyFunc>(
  asyncFn: T,
  onMeetLock?: R,
): UseAsyncLockReturns<T, R> {
  const [isLockedRef, isLocked] = useGetterRef(false)
  const latest = useLatest({ asyncFn, onMeetLock })

  const lockedAsync = useStableFn(async (...args: Parameters<T>) => {
    const { asyncFn, onMeetLock } = latest.current

    if (isLocked()) {
      return onMeetLock?.()
    }

    isLockedRef.current = true

    try {
      return await asyncFn(...args)
    } finally {
      isLockedRef.current = false
    }
  })

  return lockedAsync as UseAsyncLockReturns<T, R>
}
