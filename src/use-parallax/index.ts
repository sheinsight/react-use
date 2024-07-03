import { useMemo } from 'react'
import { useLatest } from '../use-latest'
import { useMouseInElement } from '../use-mouse-in-element'
import { useStableFn } from '../use-stable-fn'

import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'

export interface UseParallaxOptions {
  /**
   * Adjust the tilt value from mouse sensor
   */
  mouseTiltAdjust?: (i: number) => number
  /**
   * Adjust the roll value from mouse sensor
   */
  mouseRollAdjust?: (i: number) => number
}

export interface UseParallaxReturns extends Pausable {
  /**
   * Roll value. Scaled to `-0.5 ~ 0.5`
   */
  roll: number
  /**
   * Tilt value. Scaled to `-0.5 ~ 0.5`
   */
  tilt: number
  /**
   * Container style presets
   */
  containerStyle: (perspective?: number) => React.CSSProperties
  /**
   * Element style presets
   */
  elementStyle: (rotateRatio?: number, duration?: number) => React.CSSProperties
}

/**
 * A React Hook that create a parallax effect.
 */
export function useParallax(target: ElementTarget, options: UseParallaxOptions = {}): UseParallaxReturns {
  const latest = useLatest({
    mouseTiltAdjust: (e) => e,
    mouseRollAdjust: (e) => e,
    ...options,
  } as Required<UseParallaxOptions>)

  const {
    isOutside,
    elementX: x,
    elementY: y,
    elementWidth: width,
    elementHeight: height,
    isActive,
    pause,
    resume,
  } = useMouseInElement(target, { handleOutside: false })

  const roll = useMemo(() => {
    const isInvalid = !height || isOutside
    const value = isInvalid ? 0 : -(y - height / 2) / height
    return latest.current.mouseRollAdjust(value)
  }, [isOutside, y, height])

  const tilt = useMemo(() => {
    const isInvalid = !width || isOutside
    const value = isInvalid ? 0 : (x - width / 2) / width
    return latest.current.mouseTiltAdjust(value)
  }, [isOutside, x, width])

  const latestReturn = useLatest({ roll, tilt })

  const containerStyle = useStableFn((perspective = 240): React.CSSProperties => {
    return {
      perspective: `${perspective}px`,
      overflow: 'hidden',
    }
  })

  const elementStyle = useStableFn((rotateRatio = 20, duration = 360): React.CSSProperties => {
    const { tilt, roll } = latestReturn.current

    return {
      willChange: 'transform',
      transform: `rotateX(${roll * rotateRatio}deg) rotateY(${tilt * rotateRatio}deg)`,
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'ease-out',
    }
  })

  return {
    roll,
    tilt,
    containerStyle,
    elementStyle,
    isActive,
    pause,
    resume,
  }
}
