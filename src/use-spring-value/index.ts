import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useRafLoop } from '../use-raf-loop'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { Pausable } from '../use-pausable'
import type { UseRafLoopCallbackArgs } from '../use-raf-loop'

export interface UseSpringValueConfig {
  /**
   * The stiffness of the spring.
   */
  stiffness?: number
  /**
   * The damping of the spring.
   */
  damping?: number
  /**
   * The mass of the spring.
   */
  mass?: number
  /**
   * The precision of the spring.
   */
  immediate?: boolean
  /**
   * The precision of the spring.
   */
  precision?: number
}

export interface UseSpringValueReturns extends Pausable {
  /**
   * The current value of the spring.
   */
  value: number
  /**
   * Restart the spring.
   */
  restart(): void
}

export function useSpringValue(start: number, end: number, config: UseSpringValueConfig = {}): UseSpringValueReturns {
  const { stiffness = 220, damping = 50, mass = 1, precision = 0.01, immediate = true } = config

  const [value, setValue] = useSafeState(start)
  const velocityRef = useRef(0)
  const latest = useLatest({ value, start, precision, stiffness, damping, mass, end })

  const animate = useStableFn(({ delta }: UseRafLoopCallbackArgs) => {
    const { stiffness, damping, value, precision, mass, end } = latest.current

    const displacement = end - value
    const springForce = displacement * stiffness
    const dampingForce = -damping * velocityRef.current
    const acceleration = (springForce + dampingForce) / mass

    velocityRef.current += acceleration * (delta / 1000)
    latest.current.value += velocityRef.current * (delta / 1000)

    setValue(latest.current.value)

    const shouldStop = Math.abs(displacement) < precision && Math.abs(velocityRef.current) < precision

    if (shouldStop) {
      setValue(end)
      controls.pause()
    }
  })

  const controls = useRafLoop(animate, { immediate })

  const restart = useStableFn(() => {
    controls.pause()
    velocityRef.current = 0
    setValue(latest.current.start)
    controls.resume()
  })

  return { value, restart, ...controls }
}
