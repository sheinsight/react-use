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

export type UseRafLoopCallback = (args: UseRafLoopCallbackArgs) => void

export interface UseRafLoopOptions {
  /**
   * The maximum fps limit
   *
   * @defaultValue undefined
   */
  fpsLimit?: number
  /**
   * Whether to start the interval immediately on mounted
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * Whether to execute the callback immediately before the interval starts
   *
   * @defaultValue false
   */
  immediateCallback?: boolean
}

/**
 * A React Hook that helps to run a function on every frame using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).
 */
export function useRafLoop(callback: UseRafLoopCallback, options: UseRafLoopOptions = {}): Pausable {
  const { immediate = true, immediateCallback = false, fpsLimit = undefined } = options
  const limit = fpsLimit ? 1000 / fpsLimit : null

  const rafIdRef = useRef<number | null>(null)
  const lastTsRef = useRef(0) // timestamp of the last frame

  function clearRafIfActive() {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }

  const latest = useLatest({ callback, clearRafIfActive, immediateCallback, immediate, limit })

  const pausable = usePausable(false, clearRafIfActive, () => {
    latest.current.clearRafIfActive()
    lastTsRef.current = 0
    const { immediateCallback, callback } = latest.current
    immediateCallback && callback({ timestamp: 0, delta: 0 })
    rafIdRef.current = window.requestAnimationFrame(raf)
  })

  const raf = useStableFn((timestamp: DOMHighResTimeStamp) => {
    if (!pausable.isActive()) return

    const { limit } = latest.current
    if (!lastTsRef.current) lastTsRef.current = timestamp
    const delta = timestamp - lastTsRef.current

    if (limit && delta < limit) {
      rafIdRef.current = window.requestAnimationFrame(raf)
      return
    }

    lastTsRef.current = timestamp
    latest.current.callback({ delta, timestamp })
    rafIdRef.current = window.requestAnimationFrame(raf)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect should re-run when limit changes
  useEffect(() => {
    immediate && pausable.resume()
    return pausable.pause
  }, [immediate, limit])

  return pausable
}
