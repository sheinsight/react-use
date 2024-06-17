import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useStableFn } from '../use-stable-fn'

import type { Pausable } from '../use-pausable'

export interface UseRafLoopCallbackArgs {
  /**
   * The time elapsed since the last frame
   */
  delta: number
  /**
   * The timestamp of the current frame
   */
  timestamp: DOMHighResTimeStamp
}

export interface UseRafLoopOptions {
  /**
   * The maximum fps limit
   *
   * @default undefined
   */
  fpsLimit?: number
  /**
   * Whether to start the interval immediately on mounted
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Whether to execute the callback immediately before the interval starts
   *
   * @default false
   */
  immediateCallback?: boolean
}

export type UseRafLoopCallback = (args: UseRafLoopCallbackArgs) => void

export function useRafLoop(callback: UseRafLoopCallback, options: UseRafLoopOptions = {}): Pausable {
  const { immediate = true, immediateCallback = false, fpsLimit = undefined } = options
  const limit = fpsLimit ? 1000 / fpsLimit : null

  function clearRafIfActive() {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }

  const pausable = usePausable(false, clearRafIfActive, () => {
    const { clearRafIfActive, immediateCallback, callback } = latest.current
    clearRafIfActive()
    lastTsRef.current = 0
    immediateCallback && callback({ timestamp: 0, delta: 0 })
    rafIdRef.current = window.requestAnimationFrame(raf)
  })

  const rafIdRef = useRef<number | null>(null)
  const lastTsRef = useRef(0) // timestamp of the last frame
  const latest = useLatest({ callback, clearRafIfActive, immediateCallback, immediate, limit })

  const raf = useStableFn((timestamp: DOMHighResTimeStamp) => {
    if (!pausable.isActive()) return

    const { limit, callback } = latest.current
    if (!lastTsRef.current) lastTsRef.current = timestamp
    const delta = timestamp - lastTsRef.current

    if (limit && delta < limit) {
      rafIdRef.current = window.requestAnimationFrame(raf)
      return
    }

    lastTsRef.current = timestamp
    callback({ delta, timestamp })
    rafIdRef.current = window.requestAnimationFrame(raf)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect should re-run when limit changes
  useEffect(() => {
    immediate && pausable.resume()
    return pausable.pause
  }, [immediate, limit])

  return pausable
}
