import { useRef } from 'react'
import { useRafLoop } from '../use-raf-loop'
import { useSafeState } from '../use-safe-state'

import type { Pausable } from '../use-pausable'

export interface UseFpsOptions {
  /**
   * Calculate the FPS on every x frames.
   *
   * @default 10
   */
  every?: number
}

export interface UseFpsReturn extends Pausable {
  /**
   * Current FPS
   */
  fps: number
}

export function useFps(options: UseFpsOptions = {}): UseFpsReturn {
  const { every = 10 } = options

  const last = useRef(performance.now())
  const ticks = useRef(0)
  const [fps, setFps] = useSafeState(0)

  const controls = useRafLoop(
    () => {
      ticks.current += 1
      if (ticks.current >= every) {
        const now = performance.now()
        const diff = now - last.current
        setFps(Math.round(1000 / (diff / ticks.current)))
        last.current = now
        ticks.current = 0
      }
    },
    { immediateCallback: true },
  )

  return { fps, ...controls }
}
