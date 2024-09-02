import { useRef } from 'react'
import { useRafLoop } from '../use-raf-loop'
import { useSafeState } from '../use-safe-state'
import { isDefined } from '../utils/basic'

import type { Pausable } from '../use-pausable'

export interface UseFpsOptions {
  /**
   * Calculate the FPS on every x frames.
   *
   * @defaultValue 10
   */
  every?: number
}

export interface UseFpsReturns extends Pausable {
  /**
   * Current FPS
   */
  fps: number
}

/**
 * A React Hook that returns the current frames per second (FPS) of the browser.
 */
export function useFps(options: UseFpsOptions = {}): UseFpsReturns {
  const { every = 10 } = options

  const last = useRef<DOMHighResTimeStamp>()
  const ticks = useRef(0)
  const [fps, setFps] = useSafeState(0)

  const controls = useRafLoop(
    () => {
      if (!isDefined(last.current)) {
        last.current = performance.now()
      }

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
