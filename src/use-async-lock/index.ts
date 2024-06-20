import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export type UseAsyncLockReturn<T extends AnyFunc, R extends AnyFunc> = (
  ...args: Parameters<T>
) => R extends undefined
  ? Promise<Awaited<ReturnType<T>> | undefined>
  : Promise<Awaited<ReturnType<T>> | Awaited<ReturnType<R>>>

export function useAsyncLock<T extends AnyFunc, R extends AnyFunc>(asyncFn: T, onMeetLock?: R) {
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

  return lockedAsync as UseAsyncLockReturn<T, R>
}
