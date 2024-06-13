import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { isClient } from '../utils'

import type { AnyFunc } from '../utils'

export function useRafFn<T extends AnyFunc>(callback: T, autoClean = true): (...args: Parameters<T>) => void {
  const latest = useLatest({ callback, autoClean })
  const rafIdRef = useRef<number | null>(null)

  useUnmount(() => {
    if (isClient && rafIdRef.current && latest.current.autoClean) {
      window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  })

  const rafFn = useStableFn((...args: Parameters<T>) => {
    if (isClient && 'requestAnimationFrame' in window) {
      rafIdRef.current && window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = window.requestAnimationFrame(() => latest.current.callback(...args))
    } else {
      // fallback to pure callback
      return latest.current.callback(...args)
    }
  }) as (...args: Parameters<T>) => void

  return rafFn
}
