import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils'

export function useAsyncLock<T extends AnyFunc>(asyncFn: T, onMeetLock?: () => void): T {
  const isLockedRef = useRef(false)
  const latest = useLatest({ asyncFn, onMeetLock })

  const lockedAsync = useStableFn(async (...args: Parameters<T>) => {
    const { asyncFn, onMeetLock } = latest.current

    if (isLockedRef.current) {
      onMeetLock?.()
      return
    }

    isLockedRef.current = true

    try {
      return await asyncFn(...args)
    } finally {
      isLockedRef.current = false
    }
  })

  return lockedAsync as T
}
